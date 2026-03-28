export interface CustomAction {
  id: string;
  name: string;
  type: 'action' | 'bonus' | 'reaction' | 'other' | 'limited';
  description: string;
}

export interface CurrencyPouch {
  po: number;
  pp: number;
  pe: number;
  pc: number;
}

export interface ClassResource {
  id: string;
  name: string;
  maxUses: number;
  usedCount: number;
  rechargeOn: 'short' | 'long';
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
  classResources: ClassResource[];
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
  classResources: [],
  currency: { po: 0, pp: 0, pe: 0, pc: 0 },
  notes: '',
  extras: '',
};
