import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { classes } from '@/data/classes';
import { backgrounds } from '@/data/backgrounds';
import { races } from '@/data/races';
import { getChoicesRequirements } from '@/utils/choices';
import type { CharacterState } from '@/state/characterStore';
import type { AbilityKey } from '@/utils/calculations';

const BASE_SCORES: Record<AbilityKey, number> = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
const ZERO_BONUSES: Record<AbilityKey, number> = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
const ZERO_MODS: Record<AbilityKey, number> = { str: -1, dex: -1, con: -1, int: -1, wis: -1, cha: -1 };

function makeCharacter(overrides: Partial<CharacterState>): CharacterState {
  return {
    lastSavedAt: null,
    persistError: null,
    name: '', level: 1, race: 'humano', raceLineage: null, subrace: null, class: 'guerreiro', subclass: null, background: 'acolito', backgroundToolChoice: null,
    origin: { background: null, skillsGranted: [], toolGranted: null, originFeat: null, startingEquipment: null },
    abilityGeneration: { method: null, rolls: null, rollResults: null, pointBuyRemaining: 27, standardAssignments: { str: null, dex: null, con: null, int: null, wis: null, cha: null }, rollAssignments: { str: null, dex: null, con: null, int: null, wis: null, cha: null }, confirmed: false },
    abilityScores: { ...BASE_SCORES }, racialBonuses: { ...ZERO_BONUSES }, raceAbilityChoices: {}, raceChoices: {},
    backgroundBonuses: { ...ZERO_BONUSES }, backgroundAbilityChoices: {}, asiBonuses: { ...ZERO_BONUSES }, abilityMods: { ...ZERO_MODS },
    proficiencyBonus: 2, savingThrows: [], skills: [], classSkillChoices: [], classEquipmentChoice: null, backgroundEquipmentChoice: null,
    backgroundEquipmentItems: [], backgroundGold: 0, proficiencies: { armor: [], weapons: [], tools: [], languages: [] }, hitDie: 8, hitPoints: { max: 8, current: 8 }, armorClass: 10, speed: 9,
    features: [], spells: { cantrips: [], prepared: [], slots: [], spellcastingAbility: null, spellSaveDC: 0, spellAttackBonus: 0 }, selectedCantrips: [], selectedSpells: [],
    equipment: [], inventory: [], equipped: { armor: null, shield: null, weapons: [] }, gold: { gp: 0 }, attacks: [], appliedFeats: [], featAbilityBonuses: { ...ZERO_BONUSES },
    flags: {}, classFeatureChoices: {}, choiceSelections: { classSkills: [], languages: [], tools: [], instruments: [], cantrips: [], spells: [], raceChoice: null, classFeats: [] },
    expertiseSkills: [], skillMods: {}, saveMods: {} as CharacterState['saveMods'], warnings: [], leveling: { pending: false, fromLevel: 1, toLevel: 1, hpMethod: null, hpRolls: {}, choices: { subclassId: null, asiOrFeat: {} }, changesSummary: [] },
    ...overrides,
  };
}

type RequirementRow = { source: string; kind: string; requiredCount: number };

function expectedKindsFor(source: string) {
  const [scope, id] = source.split(':');
  const character =
    scope === 'class' ? makeCharacter({ class: id, race: 'humano', background: 'acolito' })
      : scope === 'background' ? makeCharacter({ class: 'guerreiro', race: 'humano', background: id })
        : scope === 'race' ? makeCharacter({ class: 'guerreiro', race: id, background: 'acolito' })
          : null;
  if (!character) return new Set<string>();

  const req = getChoicesRequirements(character);
  const add = (kind: string, active: boolean, set: Set<string>) => { if (active) set.add(kind); };
  const kinds = new Set<string>();

  add('skills', req.buckets.classSkills.requiredCount > 0 && req.buckets.classSkills.sources.some((s) => s.startsWith(source)), kinds);
  add('languages', req.buckets.languages.requiredCount > 0 && req.buckets.languages.sources.some((s) => s.startsWith(source)), kinds);
  add('tools', req.buckets.tools.requiredCount > 0 && req.buckets.tools.sources.some((s) => s.startsWith(source)), kinds);
  add('instruments', req.buckets.instruments.requiredCount > 0 && req.buckets.instruments.sources.some((s) => s.startsWith(source)), kinds);
  add('cantrips', req.buckets.cantrips.requiredCount > 0 && req.buckets.cantrips.sources.some((s) => s.startsWith(source)), kinds);
  add('spells', req.buckets.spells.requiredCount > 0 && req.buckets.spells.sources.some((s) => s.startsWith(source)), kinds);
  add('feats', req.buckets.classFeats.requiredCount > 0 && req.buckets.classFeats.sources.some((s) => s.startsWith(source)), kinds);
  return kinds;
}

describe('choice requirements extracted JSON', () => {
  it('has overlap with source kinds required by src/utils/choices.ts', () => {
    const rows = JSON.parse(fs.readFileSync(path.resolve('scripts/out/choice_requirements_extracted.json'), 'utf8')).requirements as RequirementRow[];
    const extractedKinds = new Map<string, Set<string>>();

    for (const row of rows) {
      const set = extractedKinds.get(row.source) ?? new Set<string>();
      set.add(row.kind);
      extractedKinds.set(row.source, set);
    }

    const allSources = [
      ...classes.map((c) => `class:${c.id}`),
      ...backgrounds.map((b) => `background:${b.id}`),
      ...races.map((r) => `race:${r.id}`),
    ];

    let requiredKinds = 0;
    let overlaps = 0;
    for (const source of allSources) {
      const expected = expectedKindsFor(source);
      const extracted = extractedKinds.get(source) ?? new Set<string>();
      for (const kind of expected) {
        requiredKinds += 1;
        if (extracted.has(kind)) overlaps += 1;
      }
    }

    expect(requiredKinds).toBeGreaterThan(0);
    expect(overlaps).toBeGreaterThan(10);
  });
});
