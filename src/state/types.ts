import type { AbilityKey } from "@/utils/calculations";

export type RaceChoicesState = Record<string, string>;

export type ClassFeatureChoiceValue = string | string[];
export type ClassFeatureChoicesState = Record<string, ClassFeatureChoiceValue>;

export interface ChoiceSelectionsState {
  classSkills: string[];
  languages: string[];
  tools: string[];
  instruments: string[];
  cantrips: string[];
  spells: string[];
  raceChoice: string | null;
  classFeats: string[];
  /** @deprecated legacy key */
  skills?: string[];
}

export interface SpellcastingState {
  cantrips: string[];
  prepared: string[];
  slots: number[];
  spellcastingAbility: AbilityKey | null;
  spellSaveDC: number;
  spellAttackBonus: number;
}

export interface LegacyRaceChoiceSelection {
  kind?: string;
  optionId?: string;
}

export interface LegacyRaceChoicesState extends RaceChoicesState {
  dragonbornHeritage?: string;
  elfLineage?: string;
  gnomeLineage?: string;
  giantAncestry?: string;
  infernalLegacy?: string;
  raceChoice?: LegacyRaceChoiceSelection;
}
