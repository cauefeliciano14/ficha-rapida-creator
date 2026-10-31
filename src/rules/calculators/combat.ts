import { getWeaponByName } from '../data/weaponRules';
import { getArmorSpeedPenalty } from '../data/armorRules';
import { getClassHPData } from '../data/classRules';
import type { WeaponAttack } from '../types/DerivedSheet';
import { hasArmorTraining, hasWeaponProficiency, resolveEquippedArmor } from '../utils/equipment';

export function calculateMaxHP(
  classId: string,
  level: number,
  conModifier: number
): number {
  const data = getClassHPData(classId);
  if (!data) return 0;

  if (level <= 1) {
    return data.level1BaseHp + conModifier;
  }

  return (
    (data.level1BaseHp + conModifier) +
    (level - 1) * (data.fixedHpPerLevel + conModifier)
  );
}

export function calculateInitiative(dexModifier: number): number {
  return dexModifier;
}

export function calculateAC(params: {
  dexModifier: number;
  equippedArmorId?: string;
  hasShield?: boolean;
  classId?: string;
  conModifier?: number;
  wisModifier?: number;
  armorProficiencies?: string[];
}): number {
  const { dexModifier, equippedArmorId, hasShield, classId, conModifier, wisModifier, armorProficiencies = [] } = params;

  const equippedArmor = resolveEquippedArmor(equippedArmorId);
  const wearsArmor = Boolean(equippedArmor && equippedArmor.type !== 'shield');

  // Armadura sem treinamento continua dando CA: a penalidade é Desvantagem em
  // testes de D20 de For/Des e não poder conjurar (ver getArmorPenalties).
  let ac = equippedArmor && wearsArmor
    ? equippedArmor.baseAC + (equippedArmor.maxDexBonus === null ? dexModifier : Math.min(dexModifier, equippedArmor.maxDexBonus))
    : unarmoredAC(classId, dexModifier, conModifier, wisModifier, Boolean(hasShield));

  // Escudo: o benefício de CA só vale com treinamento.
  const canUseShield = hasShield && armorProficiencies.includes('Escudo');
  if (canUseShield) {
    ac += 2;
  }

  return ac;
}

/** Linhas que somam a CA, para o painel da ficha ("11 Armadura (Couro) · +1 Destreza · +2 Escudo"). */
export function calculateACBreakdown(params: Parameters<typeof calculateAC>[0]): { label: string; value: number }[] {
  const { dexModifier, equippedArmorId, hasShield, classId, conModifier, wisModifier, armorProficiencies = [] } = params;
  const equippedArmor = resolveEquippedArmor(equippedArmorId);
  const wearsArmor = Boolean(equippedArmor && equippedArmor.type !== 'shield');
  const rows: { label: string; value: number }[] = [];
  if (equippedArmor && wearsArmor) {
    rows.push({ label: `Armadura (${equippedArmor.name})`, value: equippedArmor.baseAC });
    const dex = equippedArmor.maxDexBonus === null ? dexModifier : Math.min(dexModifier, equippedArmor.maxDexBonus);
    if (equippedArmor.maxDexBonus !== 0) {
      rows.push({ label: equippedArmor.maxDexBonus === null ? 'Destreza' : `Destreza (máx. +${equippedArmor.maxDexBonus})`, value: dex });
    }
  } else {
    rows.push({ label: 'Sem armadura', value: 10 });
    rows.push({ label: 'Destreza', value: dexModifier });
    if (classId === 'barbaro' && conModifier !== undefined) rows.push({ label: 'Constituição (Defesa sem Armadura)', value: conModifier });
    else if (classId === 'monge' && wisModifier !== undefined && !hasShield) rows.push({ label: 'Sabedoria (Defesa sem Armadura)', value: wisModifier });
  }
  if (hasShield && armorProficiencies.includes('Escudo')) rows.push({ label: 'Escudo', value: 2 });
  return rows;
}

/** Só é chamada quando não há armadura vestida. */
function unarmoredAC(
  classId: string | undefined,
  dexModifier: number,
  conModifier: number | undefined,
  wisModifier: number | undefined,
  hasShield: boolean
): number {
  // Bárbaro: sem armadura; pode usar Escudo e manter o benefício.
  if (classId === 'barbaro' && conModifier !== undefined) {
    return 10 + dexModifier + conModifier;
  }
  // Monge: sem armadura E sem empunhar Escudo.
  if (classId === 'monge' && wisModifier !== undefined && !hasShield) {
    return 10 + dexModifier + wisModifier;
  }
  return 10 + dexModifier;
}

export interface ArmorPenalties {
  /** Metros a subtrair do deslocamento (Força abaixo do exigido pela armadura) */
  speedPenalty: number;
  /** Desvantagem em testes de Destreza (Furtividade) */
  stealthDisadvantage: boolean;
  /** Armadura sem treinamento: Desvantagem em testes de D20 de For/Des e não pode conjurar */
  untrainedArmor: boolean;
}

/**
 * Penalidades da armadura vestida (Livro do Jogador 2024, cap. 6, "Armaduras").
 * O escudo não entra aqui: sem treinamento ele só deixa de dar CA.
 */
export function getArmorPenalties(params: {
  equippedArmorId?: string | null;
  strengthScore: number;
  armorProficiencies?: string[];
}): ArmorPenalties {
  const armor = resolveEquippedArmor(params.equippedArmorId ?? undefined);
  if (!armor || armor.type === 'shield') {
    return { speedPenalty: 0, stealthDisadvantage: false, untrainedArmor: false };
  }
  return {
    speedPenalty: getArmorSpeedPenalty(armor, params.strengthScore),
    stealthDisadvantage: armor.stealthDisadvantage,
    untrainedArmor: !hasArmorTraining(armor, params.armorProficiencies ?? []),
  };
}

/** Aplica a penalidade de deslocamento a um texto como "9 metros" → "6 metros". */
export function applySpeedPenalty(speed: string, penalty: number): string {
  if (!penalty) return speed;
  return speed.replace(/(\d+(?:,\d+)?)\s*m/, (match, value: string) => {
    const reduced = Math.max(0, parseFloat(value.replace(',', '.')) - penalty);
    return match.replace(value, String(reduced).replace('.', ','));
  });
}

export function calculateMeleeAttackBonus(
  strModifier: number,
  proficiencyBonus: number,
  isFinesse = false,
  dexModifier = 0,
  isProficient = true
): number {
  const abilityMod = isFinesse
    ? Math.max(strModifier, dexModifier)
    : strModifier;
  return abilityMod + (isProficient ? proficiencyBonus : 0);
}

export function calculateRangedAttackBonus(
  dexModifier: number,
  proficiencyBonus: number,
  isProficient = true
): number {
  return dexModifier + (isProficient ? proficiencyBonus : 0);
}

export function buildWeaponAttack(
  weaponName: string,
  strModifier: number,
  dexModifier: number,
  proficiencyBonus: number,
  weaponProficiencies: string[] = []
): WeaponAttack | null {
  const weapon = getWeaponByName(weaponName);
  if (!weapon) return null;

  const isProficient = hasWeaponProficiency(weaponName, weaponProficiencies);
  let attackBonus: number;
  let damageBonus: number;

  // Acuidade vem antes de "à distância": o Dardo é à distância com Acuidade
  // e usa For ou Des, à escolha (assumimos o melhor).
  if (weapon.isFinesse) {
    const mod = Math.max(strModifier, dexModifier);
    attackBonus = mod + (isProficient ? proficiencyBonus : 0);
    damageBonus = mod;
  } else if (weapon.isRanged) {
    attackBonus = calculateRangedAttackBonus(dexModifier, proficiencyBonus, isProficient);
    damageBonus = dexModifier;
  } else {
    attackBonus = calculateMeleeAttackBonus(strModifier, proficiencyBonus, false, dexModifier, isProficient);
    damageBonus = strModifier;
  }

  return {
    weaponName: weapon.name,
    attackBonus,
    damageBonus,
    damageDice: weapon.damageDice,
    damageType: weapon.damageType,
    ...(weapon.versatileDice ? { versatileDice: weapon.versatileDice } : {}),
    isFinesse: weapon.isFinesse,
    range: weapon.range,
    // Não quebra na vírgula decimal dentro de parênteses ("Alcance 7,5/30")
    properties: weapon.properties
      .split(/,(?![^()]*\))/)
      .map(p => p.trim())
      .filter(Boolean),
    actionType: 'attack' as const,
  };
}
