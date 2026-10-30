import type { ClassLevel } from '../../types/multiclass';
import type { SpellSlots } from '../types/DerivedSheet';

// ---------------------------------------------------------------------------
// Pré-requisitos de Multiclasse (PHB 2024)
// Para multiclassar, o personagem precisa de 13+ no(s) atributo(s) listados
// tanto da classe ATUAL quanto da classe NOVA.
// ---------------------------------------------------------------------------

export const MULTICLASS_PREREQUISITES: Record<string, string[]> = {
  barbaro:    ['forca'],
  bardo:      ['carisma'],
  bruxo:      ['carisma'],
  clerigo:    ['sabedoria'],
  druida:     ['sabedoria'],
  feiticeiro: ['carisma'],
  guardiao:   ['destreza', 'sabedoria'], // ambos >= 13
  guerreiro:  ['forca'],                 // ou destreza (usa o maior)
  ladino:     ['destreza'],
  mago:       ['inteligencia'],
  monge:      ['destreza', 'sabedoria'], // ambos >= 13
  paladino:   ['forca', 'carisma'],      // ambos >= 13
};

// Guerreiro aceita FOR ou DES >= 13
export function checkMulticlassPrerequisite(
  classId: string,
  _modifiers: Record<string, number>,
  attributes: Record<string, number>,
): boolean {
  const reqs = MULTICLASS_PREREQUISITES[classId];
  if (!reqs) return false;

  if (classId === 'guerreiro') {
    return (attributes['forca'] ?? 0) >= 13 || (attributes['destreza'] ?? 0) >= 13;
  }

  return reqs.every(attr => (attributes[attr] ?? 0) >= 13);
}

// ---------------------------------------------------------------------------
// Proficiências ganhas ao multiclassar (seção "Como um Personagem Multiclasse"
// de cada classe no capítulo 3 do Livro do Jogador 2024). Os nomes seguem as
// categorias de CLASS_PROFICIENCY_DATA. `skills`/`toolChoices` = quantas
// escolhas livres a classe concede (a perícia vem da lista da classe, exceto
// Bardo, que permite qualquer perícia).
// ---------------------------------------------------------------------------

export interface MulticlassProficiencyGrant {
  armor: string[];
  weapons: string[];
  tools: string[];
  skills: number;
  toolChoices: number;
}

export const MULTICLASS_PROFICIENCIES: Record<string, MulticlassProficiencyGrant> = {
  barbaro:    { armor: ['Escudo'],                                    weapons: ['Armas Marciais'], tools: [],                        skills: 0, toolChoices: 0 },
  bardo:      { armor: ['Armadura Leve'],                             weapons: [],                 tools: [],                        skills: 1, toolChoices: 1 },
  bruxo:      { armor: ['Armadura Leve'],                             weapons: [],                 tools: [],                        skills: 0, toolChoices: 0 },
  clerigo:    { armor: ['Armadura Leve', 'Armadura Média', 'Escudo'], weapons: [],                 tools: [],                        skills: 0, toolChoices: 0 },
  druida:     { armor: ['Armadura Leve', 'Escudo'],                   weapons: [],                 tools: [],                        skills: 0, toolChoices: 0 },
  feiticeiro: { armor: [],                                            weapons: [],                 tools: [],                        skills: 0, toolChoices: 0 },
  guardiao:   { armor: ['Armadura Leve', 'Armadura Média', 'Escudo'], weapons: ['Armas Marciais'], tools: [],                        skills: 1, toolChoices: 0 },
  guerreiro:  { armor: ['Armadura Leve', 'Armadura Média', 'Escudo'], weapons: ['Armas Marciais'], tools: [],                        skills: 0, toolChoices: 0 },
  ladino:     { armor: ['Armadura Leve'],                             weapons: [],                 tools: ['Ferramentas de Ladrão'], skills: 1, toolChoices: 0 },
  mago:       { armor: [],                                            weapons: [],                 tools: [],                        skills: 0, toolChoices: 0 },
  monge:      { armor: [],                                            weapons: [],                 tools: [],                        skills: 0, toolChoices: 0 },
  paladino:   { armor: ['Armadura Leve', 'Armadura Média', 'Escudo'], weapons: ['Armas Marciais'], tools: [],                        skills: 0, toolChoices: 0 },
};

// ---------------------------------------------------------------------------
// Tabela de Spell Slots Multiclasse (PHB 2024)
// Índice = casterLevel - 1 (0-19)
// ---------------------------------------------------------------------------

const MULTICLASS_SPELL_SLOT_TABLE: number[][] = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // caster level 1
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // 2
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // 3
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // 4
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // 5
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // 6
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // 7
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // 8
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // 9
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // 10
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // 11
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // 12
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // 13
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // 14
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // 15
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // 16
  [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17
  [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18
  [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19
  [4, 3, 3, 3, 3, 2, 2, 1, 1], // 20
];

// Progressão de conjuração por classe
const CASTING_PROGRESSION: Record<string, number> = {
  bardo: 1, clerigo: 1, druida: 1, feiticeiro: 1, mago: 1,  // full caster
  guardiao: 0.5, paladino: 0.5,                              // half caster
  // bruxo usa Pact Magic (separado), não entra na tabela multiclasse
};

// Subclasses que conjuram como "um terço" (Livro do Jogador 2024, cap. 2).
const THIRD_CASTER_SUBCLASSES: Record<string, string> = {
  guerreiro: 'Cavaleiro Místico',
  ladino: 'Trapaceiro Arcano',
};

/**
 * Calcula o nível efetivo de conjurador para multiclasse (Livro do Jogador 2024):
 * - todos os níveis de Bardo, Clérigo, Druida, Feiticeiro e Mago;
 * - metade dos níveis de Guardião e Paladino (arredonde para cima);
 * - um terço dos níveis de Guerreiro/Ladino (arredondado para baixo) com a
 *   subclasse Cavaleiro Místico / Trapaceiro Arcano.
 * Bruxo NÃO entra neste cálculo (usa Magia de Pacto separada).
 * `subclassByClass` mapeia classId → nome da subclasse escolhida.
 */
export function getMulticlassCasterLevel(
  classLevels: ClassLevel[],
  subclassByClass: Record<string, string | undefined> = {},
): number {
  let total = 0;
  for (const cl of classLevels) {
    const prog = CASTING_PROGRESSION[cl.classId] ?? 0;
    if (prog === 1) total += cl.level;
    else if (prog === 0.5) total += Math.ceil(cl.level / 2);
    else if (THIRD_CASTER_SUBCLASSES[cl.classId] && subclassByClass[cl.classId] === THIRD_CASTER_SUBCLASSES[cl.classId]) {
      total += Math.floor(cl.level / 3);
    }
  }
  return total;
}

/**
 * Retorna spell slots para multiclasse baseado no caster level combinado.
 */
export function getMulticlassSpellSlots(casterLevel: number): SpellSlots | null {
  if (casterLevel <= 0) return null;
  const idx = Math.max(0, Math.min(casterLevel - 1, 19));
  const row = MULTICLASS_SPELL_SLOT_TABLE[idx];
  const slots: SpellSlots = {};
  for (let i = 0; i < 9; i++) {
    if (row[i] > 0) (slots as any)[i + 1] = row[i];
  }
  return slots;
}
