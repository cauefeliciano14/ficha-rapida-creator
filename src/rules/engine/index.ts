import type { CharacterChoices } from '../types/CharacterChoices';
import type { DerivedSheet } from '../types/DerivedSheet';

import { getClassHPData } from '../data/classRules';
import { getBackgroundTalent } from '../data/backgroundRules';
import { getSpeciesLevelOneEffects, getSpeciesData } from '../data/speciesRules';
import { applyTalentEffects } from '../data/talentRules';

import {
  getFinalAttributes,
  calculateAllModifiers,
} from '../calculators/attributes';

import {
  getProficiencyBonus,
  getClassBaseProficiencies,
  getBackgroundProficiencies,
  getChosenSkillProficiencies,
  mergeProficiencies,
} from '../calculators/proficiency';

import {
  calculateMaxHP,
  calculateInitiative,
  calculateAC,
  buildWeaponAttack,
  getArmorPenalties,
  applySpeedPenalty,
} from '../calculators/combat';

import {
  isCaster,
  getSpellcastingAbility,
  getCantripsKnown,
  getSpellSlots,
  getPreparedSpellCount,
  calculateSpellSaveDC,
  calculateSpellAttackBonus,
} from '../calculators/spells';

import {
  deriveSkills,
  deriveSavingThrows,
  derivePassives,
  deriveUnarmedAttack,
} from '../calculators/sheet';

import { aggregateMagicItemEffects } from '../utils/magicItemEffects';
import { getMulticlassCasterLevel, getMulticlassSpellSlots, MULTICLASS_PROFICIENCIES } from '../data/multiclassRules';
import { getArmorById } from '../data/armorRules';

function addUnique(target: string[], values: string[] = []) {
  values.forEach((value) => {
    if (value && !target.includes(value)) target.push(value);
  });
}

function normalizeSpeciesChoices(choices: CharacterChoices): Record<string, string> {
  return {
    ...(choices.speciesChoices ?? {}),
    ...(choices.featureChoices ?? {}),
    skill: choices.speciesChoices?.skill ?? choices.featureChoices?.['humano-skill'] ?? choices.featureChoices?.['elfo-skill'],
    cantrip: choices.speciesChoices?.cantrip ?? choices.featureChoices?.['elfo-cantrip'],
    draconato: choices.speciesChoices?.draconato ?? choices.featureChoices?.draconato,
    elfo: choices.speciesChoices?.elfo ?? choices.speciesLineage ?? choices.featureChoices?.elfo,
    gnomo: choices.speciesChoices?.gnomo ?? choices.speciesLineage ?? choices.featureChoices?.gnomo,
    golias: choices.speciesChoices?.golias ?? choices.speciesLineage ?? choices.featureChoices?.golias,
    tiferino: choices.speciesChoices?.tiferino ?? choices.speciesLineage ?? choices.featureChoices?.tiferino,
  };
}

/** Classes e níveis mínimos que conferem Jack of All Trades */
const JACK_OF_ALL_TRADES_CLASSES: Record<string, number> = {
  bardo: 2,
};

/**
 * Especialização concedida por nível de classe (Livro do Jogador 2024):
 * Ladino 2 no nível 1 e +2 no 6; Bardo 2 no nível 2 e +2 no 9;
 * Guardião 1 no nível 2 (Explorador Hábil) e +2 no 9.
 */
const EXPERTISE_CLASSES: Record<string, Array<{ level: number; count: number }>> = {
  ladino:   [{ level: 1, count: 2 }, { level: 6, count: 2 }],
  bardo:    [{ level: 2, count: 2 }, { level: 9, count: 2 }],
  guardiao: [{ level: 2, count: 1 }, { level: 9, count: 2 }],
};

/** Movimento sem Armadura do Monge (metros), índice = nível de Monge - 1. */
const MONGE_UNARMORED_MOVEMENT = [0,3,3,3,3,4.5,4.5,4.5,4.5,6,6,6,6,7.5,7.5,7.5,7.5,9,9,9];

/** Dado de Artes Marciais do Monge: d6 (1–4), d8 (5–10), d10 (11–16), d12 (17–20). */
function getMartialArtsDie(monkLevel: number): string {
  if (monkLevel >= 17) return '1d12';
  if (monkLevel >= 11) return '1d10';
  if (monkLevel >= 5) return '1d8';
  return '1d6';
}

/** Soma metros a um deslocamento no formato "9 metros", preservando o restante do texto. */
function addSpeedBonus(speed: string, bonusMeters: number): string {
  if (!bonusMeters) return speed;
  return speed.replace(/(\d+(?:,\d+)?)(\s*metros)/, (_m, num: string, unit: string) => {
    const total = Number(num.replace(',', '.')) + bonusMeters;
    const text = Number.isInteger(total) ? String(total) : total.toFixed(1).replace('.', ',');
    return `${text}${unit}`;
  });
}

export function deriveSheet(choices: CharacterChoices, expertiseSkills: string[] = [], attunedItemIds: string[] = []): DerivedSheet {
  const classId = choices.classId ?? '';
  const backgroundId = choices.backgroundId ?? '';
  const speciesId = choices.speciesId ?? '';
  const level = choices.level ?? 1;

  const profBonus = getProficiencyBonus(level);
  const originTalent = backgroundId ? getBackgroundTalent(backgroundId) ?? undefined : undefined;
  const humanTalent = speciesId === 'humano' ? (choices.featureChoices['humano-talent'] ?? choices.speciesChoices?.talent) : undefined;
  const originTalentSelections = originTalent ? choices.talentSelections[originTalent] : undefined;
  const humanTalentSelections = humanTalent ? choices.talentSelections[humanTalent] : undefined;

  const appliedOriginTalent = applyTalentEffects(originTalent, originTalentSelections, 'background', level, profBonus);
  const appliedHumanTalent = applyTalentEffects(humanTalent, humanTalentSelections, 'species', level, profBonus);
  const appliedTalentEffects = [appliedOriginTalent, appliedHumanTalent].filter(Boolean);

  const rawFinalAttributes = getFinalAttributes(
    choices.baseAttributes,
    choices.backgroundBonusDistribution
  );

  const finalAttributes = { ...rawFinalAttributes } as Record<string, number>;
  for (const appliedTalent of appliedTalentEffects) {
    for (const [attribute, bonus] of Object.entries(appliedTalent?.attributeBonuses ?? {})) {
      finalAttributes[attribute] = (finalAttributes[attribute] ?? 0) + (bonus ?? 0);
    }
  }

  const modifiers = calculateAllModifiers(finalAttributes);

  // Computar breakdowns de atributos
  const attributeBreakdowns: Record<string, { label: string; value: number }[]> = {};
  for (const attr of Object.keys(choices.baseAttributes)) {
    const rows: { label: string; value: number }[] = [];
    rows.push({ label: 'Base', value: (choices.baseAttributes as Record<string, number>)[attr] ?? 0 });
    if (choices.backgroundBonusDistribution) {
      const bonus = (choices.backgroundBonusDistribution.distribution as Record<string, number | undefined>)[attr];
      if (bonus && bonus > 0) {
        rows.push({ label: 'Antecedente', value: bonus });
      }
    }
    for (const appliedTalent of appliedTalentEffects) {
      const talentBonus = (appliedTalent?.attributeBonuses as Record<string, number> | undefined)?.[attr];
      if (talentBonus && talentBonus > 0 && appliedTalent) {
        rows.push({ label: appliedTalent.name, value: talentBonus });
      }
    }
    attributeBreakdowns[attr] = rows;
  }

  const conMod = modifiers['constituicao'] ?? 0;
  const speciesChoices = normalizeSpeciesChoices(choices);
  const speciesEffects = speciesId ? getSpeciesLevelOneEffects(speciesId, speciesChoices, level) : undefined;

  const speciesHpBonus = (speciesEffects?.maxHpBonusPerLevel ?? 0) * level;
  const talentHpBonus = appliedTalentEffects.reduce((sum, effect) => sum + (effect?.maxHpBonus ?? 0), 0);

  const classLevels = choices.classLevels;
  const isMulticlass = classLevels && classLevels.length > 1;

  // Classe inicial: a que recebeu o nível 1 do personagem.
  const primaryClassId = isMulticlass
    ? (classLevels.some(cl => cl.classId === classId) ? classId : classLevels[0].classId)
    : classId;
  const levelInClass = (id: string): number => isMulticlass
    ? (classLevels.find(cl => cl.classId === id)?.level ?? 0)
    : (id === classId ? level : 0);

  let maxHP: number;
  if (isMulticlass) {
    // Multiclasse: o PV cheio do nível 1 só vale para a classe inicial (nível 1 do
    // personagem); todo nível de outra classe usa o valor fixo + CON.
    maxHP = classLevels.reduce((sum, cl) => {
      if (cl.classId === primaryClassId) return sum + calculateMaxHP(cl.classId, cl.level, conMod);
      const hpData = getClassHPData(cl.classId);
      return sum + (hpData ? cl.level * (hpData.fixedHpPerLevel + conMod) : 0);
    }, 0);
  } else {
    maxHP = classId ? calculateMaxHP(classId, level, conMod) : 0;
  }
  maxHP += speciesHpBonus + talentHpBonus;

  const hitDie = isMulticlass
    ? classLevels.map(cl => { const d = getClassHPData(cl.classId); return d ? `${cl.level}${d.hitDieLabel}` : ''; }).filter(Boolean).join(' + ')
    : (getClassHPData(classId)?.hitDieLabel ?? '—');

  const dexMod = modifiers['destreza'] ?? 0;
  const initiativeBase = calculateInitiative(dexMod);
  const initiativeBonusFromTalents = appliedTalentEffects.reduce((sum, effect) => sum + (effect?.initiativeBonus ?? 0), 0);
  const initiative = initiativeBase + initiativeBonusFromTalents;

  const classProfs = getClassBaseProficiencies(classId, choices.featureChoices ?? {});
  const bgProfs = getBackgroundProficiencies(backgroundId);
  const chosenSkills = getChosenSkillProficiencies(classId, choices.featureChoices);
  const merged = mergeProficiencies(classProfs, bgProfs);

  addUnique(merged.skills, chosenSkills);

  // Multiclasse: cada classe adicional concede só parte das proficiências iniciais.
  if (isMulticlass) {
    for (const cl of classLevels) {
      if (cl.classId === primaryClassId) continue;
      const grant = MULTICLASS_PROFICIENCIES[cl.classId];
      if (!grant) continue;
      addUnique(merged.armorCategories, grant.armor);
      addUnique(merged.weaponCategories, grant.weapons);
      addUnique(merged.tools, grant.tools);
    }
  }
  addUnique(merged.skills, speciesEffects?.skillProficiencies);

  for (const appliedTalent of appliedTalentEffects) {
    addUnique(merged.skills, appliedTalent?.skillProficiencies);
    addUnique(merged.tools, appliedTalent?.toolProficiencies);
    addUnique(merged.savingThrows, appliedTalent?.savingThrowProficiencies);
  }

  if (choices.backgroundChoices?.toolProficiency) {
    const chosenTool = choices.backgroundChoices.toolProficiency;
    const bgDefaultTool = bgProfs.tools[0];
    const idx = merged.tools.indexOf(bgDefaultTool);
    if (idx >= 0) {
      merged.tools[idx] = chosenTool;
    } else if (!merged.tools.includes(chosenTool)) {
      merged.tools.push(chosenTool);
    }
  }

  const wisMod = modifiers['sabedoria'] ?? 0;
  const fightingStyleChoice =
    choices.featureChoices?.['guerreiro-estilo-luta'] ??
    choices.featureChoices?.['guardiao-estilo-luta'] ??
    choices.featureChoices?.['paladino-estilo-luta'];
  const hasDefensivo = fightingStyleChoice === 'Defensivo';

  const magicEffects = aggregateMagicItemEffects(attunedItemIds);

  const baseAC = calculateAC({
    dexModifier: dexMod,
    equippedArmorId: choices.equippedArmorId,
    hasShield: choices.hasShield,
    classId,
    conModifier: conMod,
    wisModifier: wisMod,
    armorProficiencies: merged.armorCategories,
  });
  const isUnarmored = !choices.equippedArmorId;
  // Defensivo (Estilo de Luta): +1 só vestindo armadura Leve, Média ou Pesada.
  const armorClass = baseAC
    + (hasDefensivo && !isUnarmored ? 1 : 0)
    + magicEffects.acBonus
    + (isUnarmored ? magicEffects.acBonusUnarmored : 0);

  const speciesData = speciesId ? getSpeciesData(speciesId) : null;
  const creatureSize = speciesData?.vitalInfo?.size ?? 'Médio';
  const equippedArmor = choices.equippedArmorId ? getArmorById(choices.equippedArmorId) : null;
  let classSpeedBonus = 0;
  // Bárbaro nível 5 — Movimento Rápido: +3 m sem armadura Pesada.
  if (levelInClass('barbaro') >= 5 && equippedArmor?.type !== 'heavy') classSpeedBonus += 3;
  // Monge nível 2 — Movimento sem Armadura: sem armadura e sem Escudo.
  const monkLevel = levelInClass('monge');
  if (monkLevel >= 2 && !choices.equippedArmorId && !choices.hasShield) {
    classSpeedBonus += MONGE_UNARMORED_MOVEMENT[Math.min(monkLevel, 20) - 1];
  }
  // Armadura com Força abaixo do requisito: Deslocamento −3 m (Livro do Jogador 2024).
  const armorPenalties = getArmorPenalties({
    equippedArmorId: choices.equippedArmorId,
    strengthScore: finalAttributes['forca'] ?? 10,
    armorProficiencies: merged.armorCategories,
  });
  const speed = applySpeedPenalty(
    addSpeedBonus(speciesEffects?.speed ?? '9 metros\n\n', classSpeedBonus),
    armorPenalties.speedPenalty,
  );
  const specialSenses = [...(speciesEffects?.specialSenses ?? [])];
  const derivedDefenses = [...(speciesEffects?.derivedDefenses ?? [])];
  const racialCantrips = [...(speciesEffects?.racialCantrips ?? [])];
  const bonusCantrips: DerivedSheet['bonusCantrips'] = [];
  const bonusPreparedSpells: DerivedSheet['bonusPreparedSpells'] = [];
  const derivedTraits: DerivedSheet['derivedTraits'] = [];
  const activeTalents: DerivedSheet['activeTalents'] = [];

  for (const cantrip of racialCantrips) {
    bonusCantrips.push({ name: cantrip, source: 'species', origin: speciesId });
  }
  for (const spell of speciesEffects?.preparedSpells ?? []) {
    bonusPreparedSpells.push({ name: spell, source: 'species', origin: speciesId });
  }
  addUnique(derivedTraits, speciesEffects?.notes);
  if (armorPenalties.speedPenalty) derivedTraits.push(`Armadura sem a Força exigida: Deslocamento −${armorPenalties.speedPenalty} m.`);
  if (armorPenalties.stealthDisadvantage) derivedTraits.push('Armadura: Desvantagem em testes de Destreza (Furtividade).');
  if (armorPenalties.untrainedArmor) derivedTraits.push('Armadura sem treinamento: Desvantagem em testes de Força e Destreza e não pode conjurar magias.');

  for (const appliedTalent of appliedTalentEffects) {
    if (!appliedTalent) continue;
    activeTalents.push({
      name: appliedTalent.name,
      source: appliedTalent.source,
      notes: appliedTalent.notes ?? [],
    });
    addUnique(derivedDefenses, appliedTalent.derivedDefenses);
    addUnique(derivedTraits, appliedTalent.notes);
    for (const cantrip of appliedTalent.cantrips ?? []) {
      bonusCantrips.push({ name: cantrip, source: 'talent', origin: appliedTalent.name });
    }
    for (const spell of appliedTalent.preparedSpells ?? []) {
      bonusPreparedSpells.push({ name: spell, source: 'talent', origin: appliedTalent.name });
    }
  }

  const jackOfAllTradesMinLevel = JACK_OF_ALL_TRADES_CLASSES[classId] ?? Infinity;
  const jackOfAllTrades = level >= jackOfAllTradesMinLevel;

  const expertiseCount = Object.entries(EXPERTISE_CLASSES).reduce((sum, [id, tiers]) => {
    const lvl = levelInClass(id);
    return sum + tiers.filter(t => lvl >= t.level).reduce((acc, t) => acc + t.count, 0);
  }, 0);
  const classGrantsExpertise = expertiseCount > 0;
  const activeExpertiseSkills = classGrantsExpertise ? expertiseSkills : [];

  const skills = deriveSkills(modifiers, profBonus, merged.skills, activeExpertiseSkills, jackOfAllTrades);
  const derivedSavingThrows = deriveSavingThrows(modifiers, profBonus, merged.savingThrows).map(st => ({
    ...st,
    modifier: st.modifier + magicEffects.savingThrowBonus,
  }));
  const { passivePerception, passiveInvestigation, passiveInsight } = derivePassives(skills);

  const strMod = modifiers['forca'] ?? 0;
  const computedWeaponAttacks = [] as DerivedSheet['weaponAttacks'];
  const unarmedDamageDice = appliedTalentEffects.find((effect) => effect?.unarmedDamageDice)?.unarmedDamageDice;
  // Artes Marciais (Monge): desarmado, sem armadura e sem Escudo.
  const hasMartialArts = monkLevel >= 1 && !choices.equippedArmorId && !choices.hasShield;
  computedWeaponAttacks.push(deriveUnarmedAttack(strMod, profBonus, unarmedDamageDice, hasMartialArts
    ? { dexMod, martialArtsDie: getMartialArtsDie(monkLevel) }
    : {}));

  for (const weaponName of choices.inventoryWeapons ?? []) {
    const atk = buildWeaponAttack(weaponName, strMod, dexMod, profBonus, merged.weaponCategories);
    if (atk) computedWeaponAttacks.push(atk);
  }

  const subclassByClass: Record<string, string | undefined> = {};
  for (const cl of classLevels ?? []) subclassByClass[cl.classId] = choices.featureChoices?.[`${cl.classId}-subclasse`];

  const casterFlag = isMulticlass
    ? classLevels.some(cl => isCaster(cl.classId))
    : (classId ? isCaster(classId) : false);
  let spellcastingAbility: string | undefined;
  let spellSaveDC: number | undefined;
  let spellAttackBonus: number | undefined;
  let spellSlots: DerivedSheet['spellSlots'];
  let preparedSpellCount: number | undefined;
  let cantripsKnown: number | undefined;

  if (casterFlag && classId) {
    const abilityKey = getSpellcastingAbility(classId);
    spellcastingAbility = abilityKey ?? undefined;
    const abilityMod = abilityKey ? (modifiers[abilityKey] ?? 0) : 0;

    spellSaveDC = calculateSpellSaveDC(abilityMod, profBonus) + magicEffects.spellDCBonus;
    spellAttackBonus = calculateSpellAttackBonus(abilityMod, profBonus) + magicEffects.spellAttackBonus;

    // Multiclass spell slots: use combined caster level table
    if (isMulticlass) {
      const mcCasterLevel = getMulticlassCasterLevel(classLevels, subclassByClass);
      spellSlots = (mcCasterLevel > 0 ? getMulticlassSpellSlots(mcCasterLevel) : null) ?? undefined;
    } else {
      spellSlots = getSpellSlots(classId, level) ?? undefined;
    }

    preparedSpellCount = getPreparedSpellCount(classId, level, abilityMod);
    cantripsKnown = getCantripsKnown(classId, level);
  } else if (isMulticlass) {
    // Non-caster primary class but multiclass may include a caster class
    const casterClass = classLevels.find(cl => isCaster(cl.classId));
    if (casterClass) {
      const abilityKey = getSpellcastingAbility(casterClass.classId);
      spellcastingAbility = abilityKey ?? undefined;
      const abilityMod = abilityKey ? (modifiers[abilityKey] ?? 0) : 0;
      spellSaveDC = calculateSpellSaveDC(abilityMod, profBonus) + magicEffects.spellDCBonus;
      spellAttackBonus = calculateSpellAttackBonus(abilityMod, profBonus) + magicEffects.spellAttackBonus;
      const mcCasterLevel = getMulticlassCasterLevel(classLevels, subclassByClass);
      spellSlots = (mcCasterLevel > 0 ? getMulticlassSpellSlots(mcCasterLevel) : null) ?? undefined;
      preparedSpellCount = getPreparedSpellCount(casterClass.classId, casterClass.level, abilityMod);
      cantripsKnown = getCantripsKnown(casterClass.classId, casterClass.level);
    } else {
      // Check talents
      const talentWithSpells = appliedTalentEffects.find(t => t?.spellcastingAbility);
      if (talentWithSpells && talentWithSpells.spellcastingAbility) {
        spellcastingAbility = talentWithSpells.spellcastingAbility;
        const abilityMod = modifiers[spellcastingAbility] ?? 0;
        spellSaveDC = calculateSpellSaveDC(abilityMod, profBonus) + magicEffects.spellDCBonus;
        spellAttackBonus = calculateSpellAttackBonus(abilityMod, profBonus) + magicEffects.spellAttackBonus;
      }
    }
  } else {
    // Check if any talent provides spellcasting (like Iniciado em Magia)
    const talentWithSpells = appliedTalentEffects.find(t => t?.spellcastingAbility);
    if (talentWithSpells && talentWithSpells.spellcastingAbility) {
      spellcastingAbility = talentWithSpells.spellcastingAbility;
      const abilityMod = modifiers[spellcastingAbility] ?? 0;
      spellSaveDC = calculateSpellSaveDC(abilityMod, profBonus) + magicEffects.spellDCBonus;
      spellAttackBonus = calculateSpellAttackBonus(abilityMod, profBonus) + magicEffects.spellAttackBonus;
    }
  }

  const languages = choices.languageSelections ?? [];

  return {
    level,
    finalAttributes,
    modifiers,
    attributeBreakdowns,
    maxHP,
    hitDie,
    initiative,
    armorClass,
    proficiencyBonus: profBonus,
    speed,
    creatureSize,
    specialSenses,
    skillProficiencies: merged.skills,
    weaponProficiencies: merged.weaponCategories,
    armorProficiencies: merged.armorCategories,
    savingThrowProficiencies: merged.savingThrows,
    toolProficiencies: merged.tools,
    languages,
    skills,
    derivedSavingThrows,
    passivePerception,
    passiveInvestigation,
    passiveInsight,
    weaponAttacks: computedWeaponAttacks,
    isCaster: casterFlag,
    spellcastingAbility,
    spellSaveDC,
    spellAttackBonus,
    spellSlots,
    preparedSpellCount,
    cantripsKnown,
    racialCantrips,
    bonusCantrips,
    bonusPreparedSpells,
    derivedDefenses,
    derivedTraits,
    originTalent,
    activeTalents,
    classGrantsExpertise,
    expertiseCount,
    jackOfAllTrades,
    classLevels: classLevels ?? undefined,
  };
}

export type { CharacterChoices } from '../types/CharacterChoices';
export type { DerivedSheet } from '../types/DerivedSheet';
