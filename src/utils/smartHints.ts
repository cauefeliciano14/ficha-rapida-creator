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
          message: `Sua ${ATTR_LABELS[primary]} (${value}) está abaixo do recomendado (13+) para um ${className}. Você terá penalidades em ataques e habilidades-chave da classe.`,
        });
      } else if (value < 15) {
        hints.push({
          id: 'primary-medium',
          severity: 'tip',
          title: `${ATTR_LABELS[primary]} pode ser maior`,
          message: `${className} se beneficia muito de ${ATTR_LABELS[primary]} 15+. Considere distribuir mais pontos nesse atributo.`,
        });
      }
    }
  }

  // 2) Constituição baixa em qualquer classe (resistência geral)
  const con = getFinalAttribute(character, 'constituicao');
  if (con !== null && con < 12) {
    hints.push({
      id: 'con-low',
      severity: 'warning',
      title: 'Constituição muito baixa',
      message: `Constituição ${con} significa poucos pontos de vida e testes de resistência fracos contra magias de área. O ideal é manter pelo menos 12-14.`,
    });
  }

  // 3) Sinergia de antecedente
  if (selectedBackground?.id && !isSynergy(classId, selectedBackground.id)) {
    hints.push({
      id: 'bg-synergy',
      severity: 'info',
      title: 'Antecedente sem sinergia',
      message: `O antecedente "${selectedBackground.name}" não é o mais sinérgico com ${className}. Confira a etapa de Origem para ver opções recomendadas.`,
    });
  }

  // 4) Suporte a destreza para classes de leve/sem armadura
  const dex = getFinalAttribute(character, 'destreza');
  if (dex !== null && ['monge', 'ladino', 'guardiao', 'bardo', 'feiticeiro', 'mago', 'bruxo'].includes(classId) && dex < 13) {
    hints.push({
      id: 'dex-low',
      severity: 'tip',
      title: 'Destreza ajuda na CA',
      message: `Sem armadura pesada, ${className} depende da Destreza para Classe de Armadura. ${dex} é baixo — considere subir para 14+.`,
    });
  }

  // 5) Sugestão de Standard Array
  const suggestion = classAttributeSuggestions[classId];
  const base = (character.attributes as any)?.base;
  if (suggestion && base) {
    const primaryIdx = ATTR_KEYS.indexOf(primary);
    if (primaryIdx >= 0) {
      const suggestedPrimary = suggestion[primaryIdx];
      const baseValue = base[primary];
      if (typeof baseValue === 'number' && baseValue < suggestedPrimary - 2) {
        // Já coberto por #1 normalmente; mantém só dica leve
      }
    }
  }

  // 6) Identidade do papel (info contextual)
  const meta = CLASS_ROLE_META[classId];
  if (meta && hints.length === 0) {
    hints.push({
      id: 'role-info',
      severity: 'info',
      title: `${className}: ${meta.tagline}`,
      message: `Papel ideal: ${meta.roles.join(' / ')}. Estilo: ${meta.playstyle} (${meta.range}). Dificuldade: ${meta.difficulty}.`,
    });
  }

  return hints;
}

/* ============================================================
 * Hints específicos da etapa de Espécie
 * ============================================================ */
export function computeSpeciesHints(character: Character): SmartHint[] {
  const hints: SmartHint[] = [];
  const cls = character.characterClass;
  const sp = character.species;
  if (!cls || !sp) return hints;

  const classId = cls.id;
  const speciesId = sp.id;
  const synergy = SPECIES_CLASS_GREAT[speciesId];

  if (synergy && synergy.classes.includes(classId)) {
    hints.push({
      id: 'species-great-match',
      severity: 'tip',
      title: `${sp.name} é ótimo para ${cls.name}`,
      message: synergy.reason,
    });
  } else {
    // Tenta sugerir uma espécie melhor
    const better = Object.entries(SPECIES_CLASS_GREAT)
      .filter(([, v]) => v.classes.includes(classId))
      .map(([id]) => id);
    if (better.length > 0) {
      hints.push({
        id: 'species-suggestion',
        severity: 'info',
        title: `Outras espécies sinérgicas com ${cls.name}`,
        message: `Considere também: ${better.slice(0, 4).join(', ').replace(/-/g, ' ')}. Sua escolha atual ainda funciona — apenas perde alguns bônus mecânicos clássicos.`,
      });
    }
  }

  return hints;
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

  const hasArmor = inventory.some(i => {
    const cat = lower(i.itemBase?.category || i.itemBase?.type || '');
    return cat.includes('armadura') || cat.includes('armor');
  });
  const hasShield = inventory.some(i => lower(i.name).includes('escudo'));
  const hasWeapon = inventory.some(i => {
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
      title: 'Você não tem armadura equipada',
      message: `${cls.name} normalmente entra em combate com armadura. Sem CA decente, você cairá rápido em batalhas.`,
    });
  }

  if (!hasWeapon) {
    hints.push({
      id: 'no-weapon',
      severity: 'warning',
      title: 'Nenhuma arma no inventário',
      message: 'Mesmo conjuradores costumam carregar uma arma simples (adaga, cajado) para emergências.',
    });
  }

  if (['guerreiro', 'paladino', 'clerigo'].includes(cls.id) && !hasShield) {
    hints.push({
      id: 'no-shield',
      severity: 'tip',
      title: 'Considere um escudo',
      message: `+2 de CA é enorme para ${cls.name}. Vale o slot da mão se você usa arma de uma mão.`,
    });
  }

  if (isCaster && !hasFocus) {
    hints.push({
      id: 'no-focus',
      severity: 'tip',
      title: 'Foco arcano/divino ausente',
      message: 'Conjuradores precisam de um foco (cajado, símbolo, varinha) ou bolsa de componentes para conjurar magias com componente material.',
    });
  }

  return hints;
}
