export interface CustomAction {
  id: string;
  name: string;
  type: 'action' | 'bonus' | 'reaction' | 'other' | 'limited';
  description: string;
}

export interface CurrencyPouch {
  po: number;  // peças de ouro
  pp: number;  // peças de prata
  pe: number;  // peças de electrum
  pc: number;  // peças de cobre
}

export interface CharacterPlayState {
  currentHp: number;
  maxHpOverride: number | null;
  tempHp: number;
  heroicInspiration: boolean;
  activeConditions: string[];
  activeDefenses: string[];
  deathSaves: { successes: number; failures: number };
  spentSpellSlots: Record<number, number>;
  equippedItemIds: string[];
  attunedItemIds: string[];
  customActions: CustomAction[];
  currency: CurrencyPouch;
  notes: string;
  extras: string;
}

export const DEFAULT_PLAY_STATE: CharacterPlayState = {
  currentHp: 0,
  maxHpOverride: null,
  tempHp: 0,
  heroicInspiration: false,
  activeConditions: [],
  activeDefenses: [],
  deathSaves: { successes: 0, failures: 0 },
  spentSpellSlots: {},
  equippedItemIds: [],
  attunedItemIds: [],
  customActions: [],
  currency: { po: 0, pp: 0, pe: 0, pc: 0 },
  notes: '',
  extras: '',
};
