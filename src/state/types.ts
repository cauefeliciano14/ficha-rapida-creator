import type { AbilityKey } from "@/utils/calculations";

export interface AppliedFeatChoiceState {
  abilityIncreases?: Partial<Record<AbilityKey, number>>;
}

export interface AppliedFeatState {
  featId: string;
  levelTaken: number;
  source: "levelUp" | "background";
  choices?: AppliedFeatChoiceState;
}

export interface CharacterSpellsState {
  cantrips: string[];
  prepared: string[];
  slots: number[];
  spellcastingAbility: string | null;
  spellSaveDC: number;
  spellAttackBonus: number;
}

export type ClassFeatureChoicesState = Record<string, string | string[]>;

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

export interface SpellProgressionSnapshot {
  oldCantrips: number;
  newCantrips: number;
  oldSlots: Record<number, number>;
  newSlots: Record<number, number>;
  oldPrepared: number;
  newPrepared: number;
}
