/**
 * Default class resource counters for each class.
 * `max` can be a fixed number or a level-indexed array (index 0 = level 1).
 */

export interface ClassResourceTemplate {
  id: string;
  name: string;
  /** Fixed max OR array[20] where index = level-1 */
  maxByLevel: number[];
  resetOn: 'short' | 'long' | 'manual';
  description?: string;
  /** Emoji/glyph icon shown next to the resource name */
  icon?: string;
  /**
   * Quando definido, o máximo é o modificador desse atributo (mínimo 1),
   * desde que maxByLevel[nível] > 0 (maxByLevel funciona como desbloqueio e
   * como valor de reserva quando os modificadores não são informados).
   */
  maxFromAbilityModifier?: string;
  /** A partir deste nível o recurso passa a recuperar em Descanso Curto (antes: Longo). */
  shortRestFromLevel?: number;
}

/** Lookup icon by counter id (used by sheet card to decorate restored counters) */
export function getResourceIcon(counterId: string): string | undefined {
  for (const list of Object.values(CLASS_RESOURCES)) {
    const t = list.find(r => r.id === counterId);
    if (t?.icon) return t.icon;
  }
  return undefined;
}

/** Máximo do recurso no nível, considerando modificador de atributo quando aplicável. */
export function resolveResourceMax(
  t: ClassResourceTemplate,
  level: number,
  abilityModifiers?: Record<string, number>,
): number {
  const lvlIdx = Math.max(0, Math.min(19, level - 1));
  const base = t.maxByLevel[lvlIdx];
  if (base <= 0 || !t.maxFromAbilityModifier || !abilityModifiers) return base;
  const mod = abilityModifiers[t.maxFromAbilityModifier];
  return typeof mod === 'number' ? Math.max(1, mod) : base;
}

/** Tipo de descanso que recupera o recurso no nível informado. */
export function resolveResourceReset(t: ClassResourceTemplate, level: number): ClassResourceTemplate['resetOn'] {
  if (t.shortRestFromLevel !== undefined) return level >= t.shortRestFromLevel ? 'short' : 'long';
  return t.resetOn;
}

// Level arrays: index 0 = level 1, length 20
// Valores conferidos nas tabelas de classe do Livro do Jogador 2024.
// Recursos que recuperam "1 uso em Descanso Curto e todos em Descanso Longo"
// ficam como 'long' (o contador não suporta recuperação parcial); a descrição avisa.
const BARBARO_RAGE = [2,2,3,3,3,4,4,4,4,4,4,5,5,5,5,5,6,6,6,6];
const MONGE_FOCO = [0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
const LADINO_SNEAK = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
// Surto de Ação: 1 uso a partir do nível 2, 2 usos a partir do nível 17.
const GUERREIRO_SURTO = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2];
// Indomável: 1 uso no nível 9, 2 no 13, 3 no 17.
const GUERREIRO_INDOMAVEL = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3];
// Coluna "Recuperar Fôlego": 2 (nív 1–3), 3 (nív 4–9), 4 (nív 10–20).
const GUERREIRO_FOLEGO = [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];
// Inspiração de Bardo: valor de reserva (mín. 1); o máximo real é o mod. de Carisma.
const BARDO_INSPIRATION: number[] = Array(20).fill(1);
// Pontos de Feitiçaria: a característica Fonte de Magia chega no nível 2.
const FEITICEIRO_SORCERY = [0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
// Canalizar Divindade do Paladino: 2 usos no nível 3, 3 usos a partir do 11.
const PALADINO_CD = [0,0,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3];
// Canalizar Divindade do Clérigo: 2 (nív 2–5), 3 (nív 6–17), 4 (nív 18–20).
const CLERIGO_CD = [0,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4];
// Forma Selvagem: 2 (nív 2–5), 3 (nív 6–16), 4 (nív 17–20).
const DRUIDA_WILD = [0,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4];
// Inimigo Favorito: conjurações gratuitas de Marca do Predador.
const GUARDIAO_INIMIGO = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6];
// Mãos Consagradas: reserva de cura = 5 × nível de Paladino.
const PALADINO_MAOS = Array.from({ length: 20 }, (_, i) => 5 * (i + 1));
const fromLevel = (n: number) => Array.from({ length: 20 }, (_, i) => (i + 1 >= n ? 1 : 0));

export const CLASS_RESOURCES: Record<string, ClassResourceTemplate[]> = {
  barbaro: [
    {
      id: 'barbaro-rage',
      name: 'Fúria',
      icon: '🔥',
      maxByLevel: BARBARO_RAGE,
      resetOn: 'long',
      description: 'Ação Bônus, sem armadura Pesada. Dano da Fúria em ataques com Força: +2 (nív 1–8), +3 (nív 9–15), +4 (nív 16–20). Resistência a dano Contundente, Cortante e Perfurante; Vantagem em testes e salvaguardas de Força; sem Concentração nem magias. Dura até o fim do seu próximo turno e pode ser estendida (até 10 minutos). Recupera 1 uso em Descanso Curto e todos em Descanso Longo.',
    },
  ],
  bardo: [
    {
      id: 'bardo-inspiration',
      name: 'Inspiração de Bardo',
      icon: '🎵',
      maxByLevel: BARDO_INSPIRATION,
      maxFromAbilityModifier: 'carisma',
      resetOn: 'long',
      shortRestFromLevel: 5,
      description: 'Ação Bônus: uma criatura a até 18 m recebe um dado de Inspiração (d6; d8 nív 5, d10 nív 10, d12 nív 15) para somar a um Teste de D20 que falhar. Usos = modificador de Carisma (mín. 1). Recupera em Descanso Longo; a partir do nível 5 (Fonte de Inspiração), também em Descanso Curto.',
    },
  ],
  bruxo: [
    {
      id: 'bruxo-astucia-magica',
      name: 'Astúcia Mágica',
      icon: '🌒',
      maxByLevel: fromLevel(2),
      resetOn: 'long',
      description: 'Rito de 1 minuto: recupere espaços de Magia de Pacto gastos até metade do seu máximo (arredondado para cima). Recupera em Descanso Longo.',
    },
  ],
  clerigo: [
    {
      id: 'clerigo-channel',
      name: 'Canalizar Divindade',
      icon: '⚡',
      maxByLevel: CLERIGO_CD,
      resetOn: 'long',
      description: 'Efeitos: Centelha Divina e Expulsar Mortos-Vivos, além dos da subclasse. Usos: 2 (nív 2), 3 (nív 6), 4 (nív 18). CD = CD de magia de Clérigo. Recupera 1 uso em Descanso Curto e todos em Descanso Longo.',
    },
  ],
  druida: [
    {
      id: 'druida-wildshape',
      name: 'Forma Selvagem',
      icon: '🐺',
      maxByLevel: DRUIDA_WILD,
      resetOn: 'long',
      description: 'Ação Bônus para assumir uma forma Animal conhecida (veja a tabela Formas de Feras). Dura horas iguais à metade do seu nível de Druida. Usos: 2 (nív 2), 3 (nív 6), 4 (nív 17). Recupera 1 uso em Descanso Curto e todos em Descanso Longo.',
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
  guardiao: [
    {
      id: 'guardiao-inimigo-favorito',
      name: 'Inimigo Favorito',
      icon: '🎯',
      maxByLevel: GUARDIAO_INIMIGO,
      resetOn: 'long',
      description: 'Conjurações de Marca do Predador sem gastar espaço de magia: 2 (nív 1), 3 (nív 5), 4 (nív 9), 5 (nív 13), 6 (nív 17). Recupera em Descanso Longo.',
    },
  ],
  guerreiro: [
    {
      id: 'guerreiro-secondwind',
      name: 'Recuperar Fôlego',
      icon: '💨',
      maxByLevel: GUERREIRO_FOLEGO,
      resetOn: 'long',
      description: 'Ação Bônus para recuperar 1d10 + nível de Guerreiro PV. Usos: 2 (nív 1), 3 (nív 4), 4 (nív 10). Recupera 1 uso em Descanso Curto e todos em Descanso Longo.',
    },
    {
      id: 'guerreiro-actionsurge',
      name: 'Surto de Ação',
      icon: '⚔️',
      maxByLevel: GUERREIRO_SURTO,
      resetOn: 'short',
      description: 'No seu turno, execute uma ação adicional (exceto Usar Magia). Usos: 1 (nív 2), 2 (nív 17), apenas uma vez por turno. Recupera em Descanso Curto ou Longo.',
    },
    {
      id: 'guerreiro-indomavel',
      name: 'Indomável',
      icon: '🛡️',
      maxByLevel: GUERREIRO_INDOMAVEL,
      resetOn: 'long',
      description: 'Ao falhar em uma salvaguarda, jogue-a novamente com bônus igual ao seu nível de Guerreiro. Usos: 1 (nív 9), 2 (nív 13), 3 (nív 17). Recupera em Descanso Longo.',
    },
  ],
  ladino: [
    {
      // id mantido por compatibilidade com contadores já salvos.
      id: 'ladino-cunningaction',
      name: 'Ataque Furtivo (d6s)',
      icon: '🗡️',
      maxByLevel: LADINO_SNEAK,
      resetOn: 'manual',
      description: 'Referência, não é um recurso gasto: 1×/turno, dano extra em d6 ao acertar com Vantagem usando arma com Acuidade ou à Distância (ou com um aliado a até 1,5 m do alvo e sem Desvantagem). Quantidade de d6 = metade do nível de Ladino (arredondado para cima).',
    },
  ],
  mago: [
    {
      id: 'mago-recuperacao-arcana',
      name: 'Recuperação Arcana',
      icon: '📖',
      maxByLevel: fromLevel(1),
      resetOn: 'long',
      description: 'Ao completar um Descanso Curto, recupere espaços de magia gastos com círculo combinado até metade do seu nível de Mago (arredondado para cima), nenhum de 6º círculo ou superior. Recupera em Descanso Longo.',
    },
  ],
  monge: [
    {
      id: 'monge-ki',
      name: 'Pontos de Foco',
      icon: '💧',
      maxByLevel: MONGE_FOCO,
      resetOn: 'short',
      description: 'Gaste 1 ponto como Ação Bônus para: Defesa Paciente (Desengajar e Esquivar), Passo do Vento (Desengajar e Correr, salto dobrado) ou Torrente de Golpes (dois Ataques Desarmados). CD = 8 + Sab + Bônus de Proficiência. Recupera em Descanso Curto ou Longo.',
    },
    {
      id: 'monge-metabolismo-incomum',
      name: 'Metabolismo Incomum',
      icon: '🍃',
      maxByLevel: fromLevel(2),
      resetOn: 'long',
      description: 'Ao jogar Iniciativa, restaure todos os Pontos de Foco gastos e recupere PV iguais ao nível de Monge + uma jogada do dado de Artes Marciais. Recupera em Descanso Longo.',
    },
  ],
  paladino: [
    {
      id: 'paladino-maos-consagradas',
      name: 'Mãos Consagradas',
      icon: '🤲',
      maxByLevel: PALADINO_MAOS,
      resetOn: 'long',
      description: 'Reserva de cura igual a 5 × nível de Paladino. Ação Bônus: toque uma criatura e restaure PV da reserva, ou gaste 5 pontos para remover a condição Envenenado. Recupera em Descanso Longo.',
    },
    {
      id: 'paladino-channel',
      name: 'Canalizar Divindade',
      icon: '☀️',
      maxByLevel: PALADINO_CD,
      resetOn: 'long',
      description: 'Efeito inicial: Sentido Divino, além dos efeitos do juramento. Usos: 2 (nív 3), 3 (nív 11). Recupera 1 uso em Descanso Curto e todos em Descanso Longo.',
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   Subclass-specific resources
   Keyed by normalized subclass name (lowercase, sem acento).
   `unlockLevel` define o nível mínimo em que o recurso aparece.
   ────────────────────────────────────────────────────────────── */
export interface SubclassResourceTemplate extends ClassResourceTemplate {
  unlockLevel: number;
}

const ones = (n: number) => Array.from({ length: 20 }, (_, i) => (i + 1 >= n ? 1 : 0));
const onesAt = (start: number, count = 1) =>
  Array.from({ length: 20 }, (_, i) => (i + 1 >= start ? count : 0));

export const SUBCLASS_RESOURCES: Record<string, SubclassResourceTemplate[]> = {
  /* ─── BÁRBARO ─── */
  'berserker': [{
    id: 'barbaro-frenesi', name: 'Frenesi', icon: '🩸', unlockLevel: 3,
    maxByLevel: ones(3), resetOn: 'long',
    description: 'Durante a Fúria, ganhe um ataque adicional como ação bônus por turno. Ao final, sofre 1 nível de exaustão.',
  }],
  'coracao selvagem': [{
    id: 'barbaro-aspecto-fera', name: 'Aspecto da Fera', icon: '🐻', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'long',
    description: 'Canalize o espírito de uma fera (Urso, Águia, Lobo, Tigre, Elefante) por benefícios temáticos durante a Fúria.',
  }],
  'guerreiro tribal': [{
    id: 'barbaro-conhecimento-espiritual', name: 'Conhecimento Espiritual', icon: '👻', unlockLevel: 3,
    maxByLevel: [0,0,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,4], resetOn: 'long',
    description: 'Conjure magias de divinação e proteção concedidas pelos espíritos ancestrais.',
  }],
  'magia selvagem': [{
    id: 'barbaro-magia-selvagem', name: 'Surto de Magia Selvagem', icon: '🌀', unlockLevel: 3,
    maxByLevel: [0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3], resetOn: 'long',
    description: 'Ao entrar em Fúria, role na tabela de Magia Selvagem para um efeito mágico aleatório.',
  }],

  /* ─── BARDO ─── */
  'valor': [{
    id: 'bardo-combate-inspirador', name: 'Combate Inspirador', icon: '🎺', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Ao usar Inspiração de Bardo, o aliado ganha PVs temporários iguais ao dado de inspiração + Carisma.',
  }],
  'sabedoria': [{
    id: 'bardo-palavras-cortantes', name: 'Palavras Cortantes', icon: '🗯️', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Reação: gaste 1 Inspiração de Bardo e subtraia o dado do ataque/teste/dano de uma criatura a até 18m.',
  }],
  'criacao': [{
    id: 'bardo-improvisar-objetos', name: 'Improvisar Objetos', icon: '🛠️', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'long',
    description: 'Crie objetos não-mágicos pequenos por meio de magia performática.',
  }],
  'eloquencia': [{
    id: 'bardo-discurso-imponente', name: 'Discurso Imponente', icon: '🎭', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Ao usar Inspiração de Bardo, o resultado mínimo do dado é tratado como um valor médio.',
  }],

  /* ─── CLÉRIGO ─── */
  'vida': [{
    id: 'clerigo-bencao-preservadora', name: 'Bênção Preservadora', icon: '💚', unlockLevel: 6,
    maxByLevel: onesAt(6), resetOn: 'short',
    description: 'Ao usar magia de cura de 1º+ nível em outra criatura, ela ganha PVs temporários iguais a 2 + nível da magia.',
  }],
  'luz': [{
    id: 'clerigo-chama-protetora', name: 'Chama Protetora', icon: '🕯️', unlockLevel: 1,
    maxByLevel: [3,3,3,3,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5], resetOn: 'long',
    description: 'Reação para impor desvantagem em ataque contra você ou aliado próximo (Sab × por dia).',
  }],
  'guerra': [{
    id: 'clerigo-sacerdote-guerreiro', name: 'Ataques de Sacerdote', icon: '⚔️', unlockLevel: 1,
    maxByLevel: [4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5], resetOn: 'long',
    description: 'Quando usa Atacar, pode fazer um ataque adicional como ação bônus (Sab × por dia).',
  }],
  'tempestade': [{
    id: 'clerigo-trovao-destruicao', name: 'Trovão Destrutivo', icon: '🌩️', unlockLevel: 1,
    maxByLevel: [3,3,3,3,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5], resetOn: 'long',
    description: 'Reação ao causar dano: empurra o alvo 3m e causa dano de trovão (Sab × por dia).',
  }],
  'enganacao': [{
    id: 'clerigo-bencao-trapaceiro', name: 'Bênção do Trapaceiro', icon: '🃏', unlockLevel: 1,
    maxByLevel: ones(1), resetOn: 'long',
    description: 'Toque que concede vantagem em testes de Furtividade, Trapaça ou Acrobacia por 1h.',
  }],
  'natureza': [{
    id: 'clerigo-bencao-natureza', name: 'Bênção da Natureza', icon: '🌿', unlockLevel: 1,
    maxByLevel: ones(1), resetOn: 'long',
    description: 'Aprenda truques e idiomas druídicos. Acolha aliados sob proteção dos espíritos.',
  }],

  /* ─── DRUIDA ─── */
  'lua': [{
    id: 'druida-combate-lunar', name: 'Combate Lunar', icon: '🌙', unlockLevel: 2,
    maxByLevel: onesAt(2), resetOn: 'short',
    description: 'Em forma de fera, gaste pontos de magia para recuperar PV (1d8 por nível convertido).',
  }],
  'terra': [{
    id: 'druida-recuperacao-natural', name: 'Recuperação Natural', icon: '🍃', unlockLevel: 2,
    maxByLevel: onesAt(2), resetOn: 'long',
    description: 'Em descanso curto, recupere espaços de magia até metade do nível de druida.',
  }],
  'estrelas': [{
    id: 'druida-forma-estelar', name: 'Forma Estelar', icon: '⭐', unlockLevel: 3,
    maxByLevel: [0,0,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,4], resetOn: 'short',
    description: 'Assuma uma constelação (Arqueiro, Vaca, Dragão) por 10 min para benefícios mágicos.',
  }],
  'feiticaria': [{
    id: 'druida-bestia-magica', name: 'Companheiro Mágico', icon: '🦊', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'long',
    description: 'Invoque uma fera primordial como ação para lutar ao seu lado.',
  }],

  /* ─── FEITICEIRO ─── */
  'linhagem draconica': [{
    id: 'feiticeiro-resiliencia-draconica', name: 'Resiliência Dracônica', icon: '🐉', unlockLevel: 1,
    maxByLevel: ones(1), resetOn: 'manual',
    description: 'PV máximos +1/nível. Pele resistente: CA = 13 + Des sem armadura.',
  }],
  'magia selvagem feit': [{
    id: 'feiticeiro-tides-of-chaos', name: 'Marés do Caos', icon: '🌊', unlockLevel: 1,
    maxByLevel: ones(1), resetOn: 'long',
    description: 'Vantagem em 1 ataque/teste/save. Pode disparar Surto de Magia Selvagem.',
  }],
  'mago da tempestade': [{
    id: 'feiticeiro-furia-tempestade', name: 'Fúria da Tempestade', icon: '⚡', unlockLevel: 1,
    maxByLevel: ones(1), resetOn: 'short',
    description: 'Ao conjurar magia de 1º+ nível, voe 3m sem provocar oportunidade.',
  }],
  'sombras': [{
    id: 'feiticeiro-olhar-sombras', name: 'Olhar das Sombras', icon: '👁️', unlockLevel: 1,
    maxByLevel: [3,3,3,3,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5], resetOn: 'short',
    description: 'Gaste 3 pontos de feitiçaria para enxergar no escuro até 36m por 1h.',
  }],

  /* ─── GUERREIRO ─── */
  'campeao': [{
    id: 'guerreiro-atleta-notavel', name: 'Atleta Notável', icon: '🏃', unlockLevel: 7,
    maxByLevel: onesAt(7), resetOn: 'manual',
    description: 'Vantagem passiva em testes de Força, Destreza e Constituição.',
  }],
  'mestre de batalha': [{
    id: 'guerreiro-superioridade', name: 'Dados de Superioridade', icon: '🎲', unlockLevel: 3,
    maxByLevel: [0,0,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,6], resetOn: 'short',
    description: 'd8 (d10 nív 10, d12 nív 18). Use para Manobras de Combate (Aparar, Investida etc.).',
  }],
  'cavaleiro arcano': [{
    id: 'guerreiro-investida-arma', name: 'Ataque Mágico Bônus', icon: '🪄', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Conjure uma magia que requer 1 ação como ação bônus em vez disso (1×/desc curto).',
  }],
  'mestre psionico': [{
    id: 'guerreiro-energia-psionica', name: 'Energia Psiônica', icon: '🧠', unlockLevel: 3,
    maxByLevel: [0,0,4,4,6,6,8,8,10,10,12,12,14,14,16,16,18,18,20,22], resetOn: 'long',
    description: 'd6 (d8 nív 5, d10 nív 11, d12 nív 17). Use para Talentos Psiônicos. Recupera 1 em desc curto.',
  }],

  /* ─── LADINO ─── */
  'ladrao': [{
    id: 'ladino-uso-de-ferramentas', name: 'Uso Rápido de Ferramentas', icon: '🔧', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'manual',
    description: 'Use ferramentas e objetos como ação bônus. Subir/descer escalada na metade do tempo.',
  }],
  'assassino': [{
    id: 'ladino-assassinato', name: 'Assassinato', icon: '💀', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'manual',
    description: 'Vantagem em ataques contra criaturas que ainda não agiram. Crítico em alvo surpreso.',
  }],
  'trapaceiro arcano': [{
    id: 'ladino-conjuracao-furtiva', name: 'Conjuração Furtiva', icon: '🎩', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'long',
    description: 'Conjure magias de Mago (Ilusão e Encantamento) sem ser detectado.',
  }],
  'alma da alma': [{
    id: 'ladino-alma-alma', name: 'Inspiração Psiônica', icon: '🔮', unlockLevel: 3,
    maxByLevel: [0,0,4,4,6,6,8,8,10,10,12,12,14,14,16,16,18,18,20,22], resetOn: 'long',
    description: 'Dados psiônicos (d6→d12) para reforçar testes e ataques. Recupera 1 em desc curto.',
  }],

  /* ─── MAGO ─── */
  'evocacao': [{
    id: 'mago-escultura-magias', name: 'Escultura de Magias', icon: '🎨', unlockLevel: 2,
    maxByLevel: onesAt(2), resetOn: 'manual',
    description: 'Em magias de área, escolhe 1 + nível da magia aliados que automaticamente passam no save.',
  }],
  'abjuracao': [{
    id: 'mago-protetor-arcano', name: 'Protetor Arcano', icon: '🛡️', unlockLevel: 2,
    maxByLevel: onesAt(2), resetOn: 'long',
    description: 'Escudo mágico com PVs = 2× nível mago + Int. Recarrega ao conjurar magia de Abjuração.',
  }],
  'adivinhacao': [{
    id: 'mago-presciencia', name: 'Presciência Portentosa', icon: '🔮', unlockLevel: 2,
    maxByLevel: [0,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3], resetOn: 'long',
    description: 'Role 2d20 ao acordar; substitua qualquer rolagem por um dos dados (uso por dado).',
  }],
  'ilusao': [{
    id: 'mago-ilusao-aprimorada', name: 'Ilusão Aprimorada', icon: '🎭', unlockLevel: 2,
    maxByLevel: onesAt(2), resetOn: 'manual',
    description: 'Modifique magias de ilusão como ação bônus, alterando forma/cor/som por 1 minuto.',
  }],

  /* ─── MONGE ─── */
  'caminho da mao aberta': [{
    id: 'monge-mao-aberta', name: 'Técnicas da Mão Aberta', icon: '✋', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'manual',
    description: 'Ao acertar Rajada de Golpes: derrubar, empurrar 4,5m ou negar reação ao alvo.',
  }],
  'caminho das sombras': [{
    id: 'monge-passo-sombras', name: 'Passo das Sombras', icon: '🌑', unlockLevel: 6,
    maxByLevel: onesAt(6), resetOn: 'short',
    description: 'Em penumbra/escuridão: bônus para teleportar 18m e ganha vantagem no próximo ataque.',
  }],
  'caminho dos quatro elementos': [{
    id: 'monge-quatro-elementos', name: 'Disciplinas Elementais', icon: '🔥', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Gaste pontos de Ki para conjurar magias elementais (Bola de Fogo, Muralha de Vento etc.).',
  }],
  'mercenario': [{
    id: 'monge-mercenario', name: 'Combate Coordenado', icon: '🤝', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Conceda vantagem a aliado adjacente como ação bônus, ou ataque furtivo coordenado.',
  }],

  /* ─── PALADINO ─── */
  'devocao': [{
    id: 'paladino-arma-sagrada', name: 'Arma Sagrada', icon: '🗡️', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Ação bônus: imbua a arma com energia sagrada — +Carisma no dano e emite luz por 1 min.',
  }],
  'antigos': [{
    id: 'paladino-natureza-repreendedora', name: 'Natureza Repreendedora', icon: '🌳', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Quando uma criatura a 3m falha em save contra sua magia, sofre 4d6 de dano radiante/necrótico.',
  }],
  'vinganca': [{
    id: 'paladino-juramento-inimizade', name: 'Juramento de Inimizade', icon: '🎯', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'short',
    description: 'Vantagem em ataques contra um inimigo escolhido por 1 minuto.',
  }],
  'gloria': [{
    id: 'paladino-poder-heroico', name: 'Poder Heroico', icon: '🏆', unlockLevel: 3,
    maxByLevel: [0,0,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,5,5], resetOn: 'short',
    description: 'Conceda dado de Inspiração Heroica (d6) a aliados como ação bônus.',
  }],

  /* ─── BRUXO ─── */
  'pacto da lamina': [{
    id: 'bruxo-arma-do-pacto', name: 'Arma do Pacto', icon: '⚔️', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'manual',
    description: 'Conjure uma arma mágica como ação. Use Carisma para ataque/dano. Pode trocá-la livremente.',
  }],
  'pacto do tomo': [{
    id: 'bruxo-tomo-sombrio', name: 'Tomo Sombrio', icon: '📖', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'manual',
    description: 'Aprenda 3 truques de qualquer lista de magias e mais com invocações.',
  }],
  'pacto da corrente': [{
    id: 'bruxo-familiar-pacto', name: 'Familiar do Pacto', icon: '🦇', unlockLevel: 3,
    maxByLevel: onesAt(3), resetOn: 'manual',
    description: 'Conjure um familiar especial (imp, pseudodragão, sprite, quasit) com habilidades únicas.',
  }],
  'arquifada': [{
    id: 'bruxo-presenca-feerica', name: 'Presença Feérica', icon: '🧚', unlockLevel: 1,
    maxByLevel: onesAt(1), resetOn: 'short',
    description: 'Encante ou amedronte criaturas em cubo de 3m (Sab para resistir).',
  }],
};

/** Normalize subclass name: lowercase + remove accents, trim. */
function normalizeSubclass(name?: string): string {
  if (!name) return '';
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/**
 * Returns default CustomCounter[] for the given class (+ optional subclass) and level.
 * `abilityModifiers` (ex.: { carisma: 3 }) alimenta recursos cujo máximo é um
 * modificador de atributo (Inspiração de Bardo); sem ele, usa o valor de reserva.
 */
export function getDefaultClassCounters(
  classId: string,
  level: number,
  subclassName?: string,
  abilityModifiers?: Record<string, number>,
): Array<{ id: string; name: string; current: number; max: number; resetOn: 'short' | 'long' | 'manual'; icon?: string }> {
  const templates = CLASS_RESOURCES[classId] ?? [];
  const lvlIdx = Math.max(0, Math.min(19, level - 1));
  const base = templates
    .map(t => {
      const max = resolveResourceMax(t, level, abilityModifiers);
      return { id: t.id, name: t.name, icon: t.icon, current: max, max, resetOn: resolveResourceReset(t, level) };
    })
    .filter(c => c.max > 0);

  const subKey = normalizeSubclass(subclassName);
  const subTemplates = subKey ? (SUBCLASS_RESOURCES[subKey] ?? []) : [];
  const sub = subTemplates
    .filter(t => level >= t.unlockLevel)
    .map(t => ({ id: t.id, name: t.name, icon: t.icon, current: t.maxByLevel[lvlIdx], max: t.maxByLevel[lvlIdx], resetOn: t.resetOn }))
    .filter(c => c.max > 0);

  return [...base, ...sub];
}

/** Lookup full template (class or subclass) by counter id — used for tooltips. */
export function getResourceTemplate(counterId: string): ClassResourceTemplate | undefined {
  for (const list of Object.values(CLASS_RESOURCES)) {
    const t = list.find(r => r.id === counterId);
    if (t) return t;
  }
  for (const list of Object.values(SUBCLASS_RESOURCES)) {
    const t = list.find(r => r.id === counterId);
    if (t) return t;
  }
  return undefined;
}
