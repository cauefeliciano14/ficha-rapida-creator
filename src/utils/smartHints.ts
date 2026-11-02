import { getEquipKind } from '../rules/utils/equipment';
/**
 * Smart Hints — analisa o estado atual do personagem e gera
 * avisos contextuais não-bloqueantes, separados das validações
 * obrigatórias. Foco: ajudar a otimizar escolhas, não impedir.
 */
import type { Character } from '../types/character';

export type HintSeverity = 'info' | 'warning' | 'tip';

export interface SmartHint {
  id: string;
  severity: HintSeverity;
  title: string;
  message: string;
}

const ATTR_KEYS = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] as const;
const ATTR_LABELS: Record<typeof ATTR_KEYS[number], string> = {
  forca: 'Força',
  destreza: 'Destreza',
  constituicao: 'Constituição',
  inteligencia: 'Inteligência',
  sabedoria: 'Sabedoria',
  carisma: 'Carisma',
};

/** Atributo principal por classe (índice no array de sugestão). */
const PRIMARY_ATTR_BY_CLASS: Record<string, typeof ATTR_KEYS[number]> = {
  barbaro: 'forca',
  bardo: 'carisma',
  bruxo: 'carisma',
  clerigo: 'sabedoria',
  druida: 'sabedoria',
  feiticeiro: 'carisma',
  guardiao: 'destreza',
  guerreiro: 'forca',
  ladino: 'destreza',
  mago: 'inteligencia',
  monge: 'destreza',
  paladino: 'forca',
};


function getFinalAttribute(character: Character, attr: typeof ATTR_KEYS[number]): number | null {
  const final = (character.attributes as any)?.final;
  if (!final || typeof final[attr] !== 'number') return null;
  return final[attr];
}

export function computeSmartHints(
  character: Character,
  _selectedBackground: unknown,
): SmartHint[] {
  const hints: SmartHint[] = [];
  const cls = character.characterClass;
  if (!cls) return hints;
  // Atributos ainda não distribuídos (todos iguais): avisar seria barulho.
  const values = ATTR_KEYS.map(k => getFinalAttribute(character, k));
  if (values.every(v => v === values[0])) return hints;

  const classId = cls.id;
  const className = cls.name;
  const primary = PRIMARY_ATTR_BY_CLASS[classId];

  // 1) Atributo primário baixo
  if (primary) {
    const value = getFinalAttribute(character, primary);
    if (value !== null) {
      if (value < 13) {
        hints.push({
          id: 'primary-low',
          severity: 'warning',
          title: `${ATTR_LABELS[primary]} baixa para ${className}`,
          message: `${ATTR_LABELS[primary]} ${value} é o atributo principal do ${className}. Abaixo de 13, ataques e habilidades da classe ficam fracos.`,
        });
      }
    }
  }

  // 2) Constituição baixa em qualquer classe (resistência geral)
  const con = getFinalAttribute(character, 'constituicao');
  if (con !== null && con < 10) {
    hints.push({
      id: 'con-low',
      severity: 'warning',
      title: 'Constituição muito baixa',
      message: `Constituição ${con} dá modificador negativo: você perde pontos de vida a cada nível.`,
    });
  }

  return hints;
}

/* ============================================================
 * Hints específicos da etapa de Espécie
 * ============================================================ */
export function computeSpeciesHints(_character: Character): SmartHint[] {
  // Sinergia de espécie é opinião, não erro: a etapa já mostra os traços.
  return [];
}

/* ============================================================
 * Hints específicos da etapa de Equipamento
 * ============================================================ */
export function computeEquipmentHints(character: Character): SmartHint[] {
  const hints: SmartHint[] = [];
  const cls = character.characterClass;
  if (!cls) return hints;

  const equipment: any = character.equipment ?? {};
  const inventory: any[] = equipment.inventory ?? equipment.items ?? [];
  const lower = (s: string) => (s || '').toLowerCase();

  const hasArmor = inventory.some(i => getEquipKind(i.name) === 'armor');
  const hasWeapon = inventory.some(i => {
    if (getEquipKind(i.name) === 'weapon') return true; // itens iniciais não têm itemBase
    const cat = lower(i.itemBase?.category || i.itemBase?.type || '');
    return cat.includes('arma') || cat.includes('weapon');
  });
  const isCaster = ['mago', 'feiticeiro', 'bruxo', 'clerigo', 'druida', 'bardo', 'paladino'].includes(cls.id);
  const hasFocus = inventory.some(i => {
    const n = lower(i.name);
    return n.includes('foco') || n.includes('cajado') || n.includes('varinha') || n.includes('orbe') || n.includes('componente') || n.includes('símbolo sagrado') || n.includes('simbolo sagrado');
  });

  if (!hasArmor && !['monge', 'feiticeiro', 'mago'].includes(cls.id)) {
    hints.push({
      id: 'no-armor',
      severity: 'warning',
      title: 'Sem armadura',
      message: `${cls.name} sabe usar armadura, mas você não tem nenhuma. Sua CA fica baixa.`,
    });
  }

  if (!hasWeapon) {
    hints.push({
      id: 'no-weapon',
      severity: 'warning',
      title: 'Nenhuma arma no inventário',
      message: 'Adicione ao menos uma arma simples, como uma Adaga.',
    });
  }

  if (isCaster && !hasFocus) {
    hints.push({
      id: 'no-focus',
      severity: 'tip',
      title: 'Sem foco de conjuração',
      message: 'Magias com componente Material precisam de um foco ou de uma Bolsa de Componentes.',
    });
  }

  return hints;
}
