/**
 * Tabela tipada de armaduras com valores de CA estruturados.
 * armor.json armazena CA como strings ("13 + modificador de Des (máx. 2)");
 * esta tabela é a fonte autoritativa para cálculos do engine.
 *
 * Valores conferidos com a tabela Armaduras do Livro do Jogador 2024 (cap. 6, p. 219).
 * Nomes canônicos = nomes do livro / armor.json. Os IDs antigos foram mantidos
 * sempre que o item do livro corresponde ao item antigo, para não quebrar
 * `equippedArmorId` de fichas já salvas no navegador.
 */

export type ArmorType = 'light' | 'medium' | 'heavy' | 'shield';

export interface ArmorEntry {
  id: string;
  name: string;
  type: ArmorType;
  baseAC: number;
  /** null = DEX completa, número = máximo bônus de DEX (0 para pesada) */
  maxDexBonus: number | null;
  /** Valor de Força exigido (null se não houver). Abaixo dele: deslocamento −3 m. */
  strengthRequirement: number | null;
  /** Desvantagem em testes de Destreza (Furtividade) */
  stealthDisadvantage: boolean;
}

export const ARMOR_TABLE: ArmorEntry[] = [
  // Armadura Leve
  { id: 'acolchoada',         name: 'Acolchoada',            type: 'light',  baseAC: 11, maxDexBonus: null, strengthRequirement: null, stealthDisadvantage: true  },
  { id: 'couro',              name: 'Couro',                 type: 'light',  baseAC: 11, maxDexBonus: null, strengthRequirement: null, stealthDisadvantage: false },
  { id: 'couro_batido',       name: 'Couro Batido',          type: 'light',  baseAC: 12, maxDexBonus: null, strengthRequirement: null, stealthDisadvantage: false },

  // Armadura Média
  { id: 'peles',              name: 'Gibão de Peles',        type: 'medium', baseAC: 12, maxDexBonus: 2,    strengthRequirement: null, stealthDisadvantage: false },
  { id: 'cota_malha_parcial', name: 'Cota de Malha Parcial', type: 'medium', baseAC: 13, maxDexBonus: 2,    strengthRequirement: null, stealthDisadvantage: false },
  { id: 'loriga_de_escamas',  name: 'Loriga de Escamas',     type: 'medium', baseAC: 14, maxDexBonus: 2,    strengthRequirement: null, stealthDisadvantage: true  },
  { id: 'peitoral',           name: 'Couraça Peitoral',      type: 'medium', baseAC: 14, maxDexBonus: 2,    strengthRequirement: null, stealthDisadvantage: false },
  { id: 'meia_armadura',      name: 'Placas Parcial',        type: 'medium', baseAC: 15, maxDexBonus: 2,    strengthRequirement: null, stealthDisadvantage: true  },

  // Armadura Pesada
  { id: 'argolas',            name: 'Cota de Anéis',         type: 'heavy',  baseAC: 14, maxDexBonus: 0,    strengthRequirement: null, stealthDisadvantage: true  },
  { id: 'cota_de_malha',      name: 'Cota de Malha',         type: 'heavy',  baseAC: 16, maxDexBonus: 0,    strengthRequirement: 13,   stealthDisadvantage: true  },
  { id: 'armadura_de_talas',  name: 'Armadura de Talas',     type: 'heavy',  baseAC: 17, maxDexBonus: 0,    strengthRequirement: 15,   stealthDisadvantage: true  },
  { id: 'armadura_de_placas', name: 'Placas',                type: 'heavy',  baseAC: 18, maxDexBonus: 0,    strengthRequirement: 15,   stealthDisadvantage: true  },

  // Escudo
  { id: 'escudo',             name: 'Escudo',                type: 'shield', baseAC: 2,  maxDexBonus: null, strengthRequirement: null, stealthDisadvantage: false },
];

/**
 * Nomes antigos do app (e variações do próprio livro) → ID canônico.
 * Fichas salvas guardam o nome do item no inventário; estes aliases fazem
 * esses nomes continuarem resolvendo. O mapeamento segue a CA/categoria antiga:
 *  - "Armadura de Peles" (média 12) → Gibão de Peles
 *  - "Peitoral" (média 14) → Couraça Peitoral
 *  - "Meia Armadura" (média 15, Desv.) → Placas Parcial
 *  - "Armadura de Argolas" (pesada 14) → Cota de Anéis
 *  - "Cota de Placas" (pesada 16, For 13) → Cota de Malha (é a armadura do livro com esses valores)
 *  - "Armadura de Placas" (pesada 18) → Placas
 */
export const ARMOR_NAME_ALIASES: Record<string, string> = {
  'Armadura Acolchoada': 'acolchoada',
  'Armadura de Couro': 'couro',
  'Armadura de Couro Batido': 'couro_batido',
  'Armadura de Peles': 'peles',
  'Peitoral': 'peitoral',
  'Meia Armadura': 'meia_armadura',
  'Armadura de Argolas': 'argolas',
  'Cota de Placas': 'cota_de_malha',
  'Armadura de Placas': 'armadura_de_placas',
  'Armadura de Tala': 'armadura_de_talas',
};

/** IDs antigos sem item correspondente com o mesmo ID. */
const ARMOR_ID_ALIASES: Record<string, string> = {
  cota_de_placas: 'cota_de_malha',
};

const ARMOR_BY_ID: Map<string, ArmorEntry> = new Map(ARMOR_TABLE.map(a => [a.id, a]));

// Também indexar por nome (case-insensitive) para compatibilidade com equipmentData.ts
const ARMOR_BY_NAME: Map<string, ArmorEntry> = new Map(
  ARMOR_TABLE.map(a => [a.name.toLowerCase(), a])
);
for (const [alias, id] of Object.entries(ARMOR_NAME_ALIASES)) {
  const entry = ARMOR_BY_ID.get(id);
  if (entry && !ARMOR_BY_NAME.has(alias.toLowerCase())) ARMOR_BY_NAME.set(alias.toLowerCase(), entry);
}

export function getArmorById(id: string): ArmorEntry | null {
  return ARMOR_BY_ID.get(id) ?? ARMOR_BY_ID.get(ARMOR_ID_ALIASES[id] ?? '') ?? null;
}

export function getArmorByName(name: string): ArmorEntry | null {
  return ARMOR_BY_NAME.get(name.trim().toLowerCase()) ?? null;
}

export function isShield(id: string): boolean {
  return getArmorById(id)?.type === 'shield';
}

/**
 * Força. Se a armadura tem valor de Força e o usuário tem valor menor,
 * o deslocamento cai 3 metros (Livro do Jogador 2024, cap. 6, "Armaduras").
 * Retorna a penalidade em metros (0 ou 3).
 */
export function getArmorSpeedPenalty(armor: ArmorEntry | null | undefined, strengthScore: number): number {
  if (!armor || armor.strengthRequirement === null) return 0;
  return strengthScore < armor.strengthRequirement ? 3 : 0;
}
