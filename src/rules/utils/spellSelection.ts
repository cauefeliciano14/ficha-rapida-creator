import type { CharacterChoices } from '../types/CharacterChoices';
import { getFinalAttributes, calculateAllModifiers } from '../calculators/attributes';
import { getCantripsKnown, getPreparedSpellCount, getSpellcastingAbility, getSpellSlots, isCaster } from '../calculators/spells';
import allSpellsData from '../../data/spells/spells_all.json';

export interface SpellSelectionRequirement {
  isCaster: boolean;
  requiredCantrips: number;
  requiredPreparedSpells: number;
  mode: 'prepared-dynamic' | 'prepared-fixed' | 'known' | 'none';
}

interface SpellReference {
  name: string;
  level: string | number;
  classes?: string[];
}

const CLASS_NAME_BY_ID: Record<string, string> = {
  bardo: 'Bardo',
  bruxo: 'Bruxo',
  clerigo: 'Clérigo',
  druida: 'Druida',
  feiticeiro: 'Feiticeiro',
  guardiao: 'Guardião',
  mago: 'Mago',
  paladino: 'Paladino',
};

const CLASS_SPELLS_BY_ID = Object.entries(CLASS_NAME_BY_ID).reduce<Record<string, SpellReference[]>>((acc, [classId, className]) => {
  acc[classId] = (allSpellsData as SpellReference[]).filter((spell) => spell.classes?.includes(className));
  return acc;
}, {});

export function getSpellSelectionRequirement(choices: Pick<CharacterChoices, 'classId' | 'level' | 'baseAttributes' | 'backgroundBonusDistribution'>): SpellSelectionRequirement {
  const classId = choices.classId ?? '';
  const level = choices.level ?? 1;

  if (!classId || !isCaster(classId)) {
    return { isCaster: false, requiredCantrips: 0, requiredPreparedSpells: 0, mode: 'none' };
  }

  const ability = getSpellcastingAbility(classId);
  const finalAttributes = getFinalAttributes(choices.baseAttributes, choices.backgroundBonusDistribution);
  const modifiers = calculateAllModifiers(finalAttributes);
  const abilityModifier = ability ? (modifiers[ability] ?? 0) : 0;
  const requiredCantrips = getCantripsKnown(classId, level);
  const requiredPreparedSpells = getPreparedSpellCount(classId, level, abilityModifier);

  let mode: SpellSelectionRequirement['mode'] = 'prepared-fixed';
  if (['clerigo', 'druida', 'mago', 'paladino'].includes(classId)) {
    mode = 'prepared-dynamic';
  } else if (['bruxo', 'feiticeiro'].includes(classId)) {
    mode = 'known';
  }

  return { isCaster: true, requiredCantrips, requiredPreparedSpells, mode };
}

function spellCircle(spell: SpellReference): number {
  if (spell.level === 'Truque' || spell.level === 0) return 0;
  const match = String(spell.level).match(/\d+/);
  return match ? Number(match[0]) : -1;
}

/**
 * Maior círculo de magia que o personagem consegue conjurar (0 se não houver espaços).
 * Para o Bruxo é o círculo do espaço de Pacto.
 */
export function getMaxSpellCircle(classId: string, level: number): number {
  const slots = getSpellSlots(classId, level);
  if (!slots) return 0;
  const circles = Object.keys(slots).map(Number).filter((c) => (slots as Record<number, number>)[c] > 0);
  return circles.length > 0 ? Math.max(...circles) : 0;
}

/** Nomes de magias da classe de um círculo exato ('cantrip' = truques). */
export function getValidSpellNames(classId: string, level: 'cantrip' | number): Set<string> {
  const spells = CLASS_SPELLS_BY_ID[classId] ?? [];
  const target = level === 'cantrip' ? 0 : level;
  return new Set(spells.filter((spell) => spellCircle(spell) === target).map((spell) => spell.name));
}

/** Magias (não truques) da classe cujo círculo o personagem já consegue conjurar no nível dado. */
export function getValidPreparedSpellNames(classId: string, characterLevel: number): Set<string> {
  const max = getMaxSpellCircle(classId, characterLevel);
  const spells = CLASS_SPELLS_BY_ID[classId] ?? [];
  return new Set(spells.filter((spell) => { const c = spellCircle(spell); return c >= 1 && c <= max; }).map((spell) => spell.name));
}
