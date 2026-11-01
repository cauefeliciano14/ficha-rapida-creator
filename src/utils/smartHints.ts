import { getEquipKind } from '../rules/utils/equipment';
/**
 * Smart Hints — analisa o estado atual do personagem e gera
 * avisos contextuais não-bloqueantes, separados das validações
 * obrigatórias. Foco: ajudar a otimizar escolhas, não impedir.
 */
import type { Character } from '../types/character';
import { CLASS_ROLE_META } from '../data/classRoles';
import { isSynergy } from '../data/classSynergies';
import classAttributeSuggestions from '../data/classAttributeSuggestions';

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

/**
 * Sinergias notáveis Espécie × Classe (apenas as combinações mais clássicas,
 * não exaustivo). Usadas para gerar hints positivos/negativos contextuais.
 */
const SPECIES_CLASS_GREAT: Record<string, { classes: string[]; reason: string }> = {
  anao:        { classes: ['guerreiro', 'paladino', 'clerigo'], reason: 'PV extra, resistência a venenos e proficiência com armas marciais combinam com tanks e linha de frente.' },
  'anao-da-colina': { classes: ['clerigo', 'druida'], reason: '+1 PV por nível e Sabedoria fortalecem conjuradores divinos.' },
  'anao-da-montanha': { classes: ['guerreiro', 'paladino'], reason: '+2 Força e proficiência com armaduras pesadas reforçam tanks marciais.' },
  elfo:        { classes: ['mago', 'ladino', 'guardiao'], reason: 'Destreza, visão no escuro e Percepção dão furtividade e exploração superiores.' },
  'alto-elfo': { classes: ['mago', 'feiticeiro', 'bruxo'], reason: 'Truque arcano extra e Inteligência impulsionam conjuradores arcanos.' },
  'elfo-da-floresta': { classes: ['guardiao', 'druida'], reason: 'Deslocamento +35 e furtividade na natureza são ideais para batedores.' },
  halfling:    { classes: ['ladino', 'bardo'], reason: 'Sortudo e Bravo aumentam a sobrevivência de classes de Destreza/Carisma.' },
  humano:      { classes: ['bardo', 'clerigo', 'paladino', 'guerreiro'], reason: 'Versátil: talento extra e perícia adicional servem qualquer classe.' },
  golias:      { classes: ['barbaro', 'guerreiro'], reason: 'Tamanho gigante, +Força e Pedregulho Poderoso devastam em corpo a corpo.' },
  draconato:   { classes: ['paladino', 'feiticeiro'], reason: 'Sopro elemental e resistência sinergizam com Carisma e combate misto.' },
  tiefling:    { classes: ['bruxo', 'feiticeiro', 'bardo'], reason: 'Magia ancestral e resistência a fogo combinam com conjuradores carismáticos.' },
  aasimar:     { classes: ['paladino', 'clerigo'], reason: 'Mãos curativas e resistência radiante reforçam o tema sagrado.' },
  gnomo:       { classes: ['mago', 'bardo'], reason: 'Astúcia Gnômica protege contra magias mentais — perfeito para conjuradores.' },
  'meio-orc':  { classes: ['barbaro', 'guerreiro'], reason: 'Resistência Implacável e Ataques Selvagens potencializam dano marcial.' },
  'meio-elfo': { classes: ['bardo', 'paladino', 'feiticeiro'], reason: 'Bônus de Carisma e perícias extras combinam com classes sociais.' },
};

function getFinalAttribute(character: Character, attr: typeof ATTR_KEYS[number]): number | null {
  const final = (character.attributes as any)?.final;
  if (!final || typeof final[attr] !== 'number') return null;
  return final[attr];
}

export function computeSmartHints(
  character: Character,
  selectedBackground: any | null,
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
