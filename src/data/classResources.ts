/**
 * Default class resource counters for each class.
 * `max` can be a fixed number or a level-indexed array (index 0 = level 1).
 */

export interface ClassResourceTemplate {
  id: string;
  name: string;
  /** Fixed max OR array[20] where index = level-1 */
  maxByLevel: number[];
  resetOn: 'short' | 'long';
  description?: string;
  /** Emoji/glyph icon shown next to the resource name */
  icon?: string;
}

/** Lookup icon by counter id (used by sheet card to decorate restored counters) */
export function getResourceIcon(counterId: string): string | undefined {
  for (const list of Object.values(CLASS_RESOURCES)) {
    const t = list.find(r => r.id === counterId);
    if (t?.icon) return t.icon;
  }
  return undefined;
}

// Level arrays: index 0 = level 1, length 20
const BARBARO_RAGE = [2,2,3,3,3,4,4,4,4,4,4,5,5,5,5,5,6,6,6,6];
const BARBARO_RAGE_DMG = [2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4];
const MONGE_KI = [0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
const LADINO_SNEAK = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
const GUERREIRO_SURTO = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2];
const BARDO_INSPIRATION = [2,2,2,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5];
const FEITICEIRO_SORCERY = [2,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
const PALADINO_CD = [1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3];
const CLERIGO_CD = [1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3];
const DRUIDA_WILD = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];
const GUERREIRO_WIND = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

export const CLASS_RESOURCES: Record<string, ClassResourceTemplate[]> = {
  barbaro: [
    {
      id: 'barbaro-rage',
      name: 'Usos de Fúria',
      icon: '🔥',
      maxByLevel: BARBARO_RAGE,
      resetOn: 'long',
      description: 'Bônus de dano por fúria (Nív 1–8: +2, 9–16: +3, 17+: +4). Duração: 1 minuto. Vantagem em testes de Força. Resistência a contundente, perfurante e cortante. Termina se você ficar inconsciente ou não atacar/sofrer dano em um turno. Recupera em descanso longo.',
    },
  ],
  bardo: [
    {
      id: 'bardo-inspiration',
      name: 'Inspiração de Bardo',
      icon: '🎵',
      maxByLevel: BARDO_INSPIRATION,
      resetOn: 'short',
      description: 'Ação bônus para conceder a um aliado a até 18m um Dado de Inspiração (d6 nív 1, d8 nív 5, d10 nív 10, d12 nív 15). Pode ser somado a um teste, ataque ou resistência antes de saber o resultado. Recupera em descanso curto/longo.',
    },
  ],
  clerigo: [
    {
      id: 'clerigo-channel',
      name: 'Canalizar Divindade',
      icon: '⚡',
      maxByLevel: CLERIGO_CD,
      resetOn: 'short',
      description: 'Energia divina canalizada do seu deus. Usos: 1× (nív 2), 2× (nív 6), 3× (nív 18). Opções incluem Expulsar Mortos-Vivos e habilidades de domínio. CD = 8 + prof + Sab. Recupera em descanso curto/longo.',
    },
  ],
  druida: [
    {
      id: 'druida-wildshape',
      name: 'Transformação Selvagem',
      icon: '🐺',
      maxByLevel: DRUIDA_WILD,
      resetOn: 'short',
      description: 'Ação bônus para transformar-se em uma fera com VD ≤ ¼ (nív 2), 1 (nív 4) ou seu nível ÷ 3 (nív 8). Duração: metade do nível em horas. Mantém Inteligência, Sabedoria e Carisma. Recupera 2 usos em descanso curto/longo.',
    },
  ],
  feiticeiro: [
    {
      id: 'feiticeiro-sorcery',
      name: 'Pontos de Feitiçaria',
      icon: '✨',
      maxByLevel: FEITICEIRO_SORCERY,
      resetOn: 'long',
      description: 'Recurso para Metamagia (Magia Distante, Sutil, Empoderada, Gêmea, etc.) e conversão em espaços de magia: 2pts→1º, 3pts→2º, 5pts→3º, 6pts→4º, 7pts→5º. Recupera em descanso longo.',
    },
  ],
  guerreiro: [
    {
      id: 'guerreiro-secondwind',
      name: 'Segundo Fôlego',
      icon: '💨',
      maxByLevel: GUERREIRO_WIND,
      resetOn: 'short',
      description: 'Ação bônus para recuperar 1d10 + nível de guerreiro PV. Recupera em descanso curto/longo.',
    },
    {
      id: 'guerreiro-actionsurge',
      name: 'Surto de Ação',
      icon: '⚔️',
      maxByLevel: GUERREIRO_SURTO,
      resetOn: 'short',
      description: 'Em seu turno, ganhe uma ação adicional (não pode ser usado mais de 1× por turno). Usos: 1 (nív 2), 2 (nív 17). Recupera em descanso curto/longo.',
    },
  ],
  ladino: [
    {
      id: 'ladino-cunningaction',
      name: 'Ataque Furtivo (d6s)',
      icon: '🗡️',
      maxByLevel: LADINO_SNEAK,
      resetOn: 'short',
      description: 'Dano extra (d6) 1×/turno quando você tem vantagem ou aliado adjacente ao alvo, com arma de acabamento ou à distância. Não é um recurso limitado — referência da quantidade de d6 por nível. Progressão: +1d6 a cada 2 níveis.',
    },
  ],
  monge: [
    {
      id: 'monge-ki',
      name: 'Pontos de Ki',
      icon: '💧',
      maxByLevel: MONGE_KI,
      resetOn: 'short',
      description: 'Energia mística do monge. Usos básicos: Rajada de Golpes (1pt — 2 ataques desarmados como bônus), Esquiva Marcial (1pt) ou Disparada (1pt). CD de Ki = 8 + prof + Sab. Recupera em descanso curto/longo.',
    },
  ],
  paladino: [
    {
      id: 'paladino-channel',
      name: 'Canalizar Divindade',
      icon: '☀️',
      maxByLevel: PALADINO_CD,
      resetOn: 'short',
      description: 'Energia divina do juramento. Usos: 1× (nív 3), 2× (nív 7), 3× (nív 15). Opções dependem do juramento (ex: Devoção – Arma Sagrada; Antigos – Natureza Repreendedora). Recupera em descanso curto/longo.',
    },
  ],
};

/**
 * Returns default CustomCounter[] for the given class and level,
 * skipping any counter whose max at that level is 0.
 */
export function getDefaultClassCounters(
  classId: string,
  level: number,
): Array<{ id: string; name: string; current: number; max: number; resetOn: 'short' | 'long' | 'manual'; icon?: string }> {
  const templates = CLASS_RESOURCES[classId] ?? [];
  const lvlIdx = Math.max(0, Math.min(19, level - 1));
  return templates
    .map(t => ({ id: t.id, name: t.name, icon: t.icon, current: t.maxByLevel[lvlIdx], max: t.maxByLevel[lvlIdx], resetOn: t.resetOn }))
    .filter(c => c.max > 0);
}
