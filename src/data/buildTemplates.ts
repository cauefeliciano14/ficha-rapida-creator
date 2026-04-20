/**
 * Templates de Build pré-configurados — preenchem classe, espécie, antecedente
 * e atributos em 1 clique. Cada template é uma "receita" testada para iniciantes.
 */
export interface BuildTemplate {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  classId: string;
  className: string;
  speciesId: string;
  backgroundId: string;
  /** Distribuição customizada [FOR, DES, CON, INT, SAB, CAR] — usa standard array */
  attributes: [number, number, number, number, number, number];
  /** Atributos do background a receber +2 e +1 */
  bgPlus2?: string;
  bgPlus1?: string;
  /** Tags exibidas como chips */
  tags: string[];
  /** Descrição estratégica da build */
  strategy: string;
}

export const BUILD_TEMPLATES: BuildTemplate[] = [
  {
    id: 'tank-anao-guardiao',
    name: 'Tank Anão Guardião',
    tagline: 'Muralha resistente que protege os aliados',
    emoji: '🛡️',
    classId: 'guerreiro',
    className: 'Guerreiro',
    speciesId: 'anao',
    backgroundId: 'soldado',
    attributes: [15, 10, 14, 8, 13, 12],
    bgPlus2: 'forca',
    bgPlus1: 'constituicao',
    tags: ['Tank', 'Iniciante', 'Combate Corpo a Corpo'],
    strategy: 'Alta CA, muitos PV e foco em Força. O Anão dá resistência a venenos e o Soldado garante atletismo + intimidação. Ideal para quem quer absorver dano na linha de frente.',
  },
  {
    id: 'bardo-diplomata',
    name: 'Bardo Diplomata',
    tagline: 'Voz da festa, mestre das interações sociais',
    emoji: '🎭',
    classId: 'bardo',
    className: 'Bardo',
    speciesId: 'humano',
    backgroundId: 'nobre',
    attributes: [8, 14, 13, 12, 10, 15],
    bgPlus2: 'carisma',
    bgPlus1: 'inteligencia',
    tags: ['Suporte', 'Social', 'Versátil'],
    strategy: 'Carisma máximo + Nobre dá uma ampla cobertura social (Persuasão, História). Use Inspiração de Bardo para turbinar aliados e magias como Hipnotizar para resolver conflitos sem combate.',
  },
  {
    id: 'mago-evocador',
    name: 'Mago Evocador',
    tagline: 'Artilharia mágica que controla o campo de batalha',
    emoji: '🔥',
    classId: 'mago',
    className: 'Mago',
    speciesId: 'alto-elfo',
    backgroundId: 'sabio',
    attributes: [8, 14, 13, 15, 12, 10],
    bgPlus2: 'inteligencia',
    bgPlus1: 'constituicao',
    tags: ['DPS', 'Controle', 'Conjurador'],
    strategy: 'Inteligência prioritária com truque extra do Alto-Elfo. O Sábio dá Arcanismo + História. Foque em magias de área (Bola de Fogo no nível 5) e mantenha distância segura.',
  },
  {
    id: 'ladino-furtivo',
    name: 'Ladino Furtivo',
    tagline: 'Sombra letal com ataques precisos',
    emoji: '🗡️',
    classId: 'ladino',
    className: 'Ladino',
    speciesId: 'elfo',
    backgroundId: 'criminoso',
    attributes: [8, 15, 13, 14, 12, 10],
    bgPlus2: 'destreza',
    bgPlus1: 'inteligencia',
    tags: ['DPS', 'Furtividade', 'Exploração'],
    strategy: 'Destreza + visão no escuro do Elfo + Furtividade do Criminoso = ataque furtivo confiável. Perfeito para batedor e abridor de fechaduras do grupo.',
  },
  {
    id: 'clerigo-curador',
    name: 'Clérigo Curador',
    tagline: 'Suporte divino que mantém o grupo vivo',
    emoji: '✨',
    classId: 'clerigo',
    className: 'Clérigo',
    speciesId: 'humano',
    backgroundId: 'acolito',
    attributes: [13, 8, 14, 10, 15, 12],
    bgPlus2: 'sabedoria',
    bgPlus1: 'constituicao',
    tags: ['Suporte', 'Cura', 'Iniciante'],
    strategy: 'Sabedoria alta para conjuração + Constituição para sobreviver. O Acólito reforça temas religiosos. Cura, buffs e ataques radiantes equilibrados.',
  },
  {
    id: 'paladino-defensor',
    name: 'Paladino Defensor',
    tagline: 'Cavaleiro sagrado que cura e ataca',
    emoji: '⚔️',
    classId: 'paladino',
    className: 'Paladino',
    speciesId: 'aasimar',
    backgroundId: 'nobre',
    attributes: [15, 10, 13, 8, 12, 14],
    bgPlus2: 'forca',
    bgPlus1: 'carisma',
    tags: ['Tank', 'Suporte', 'Híbrido'],
    strategy: 'Força para combate + Carisma para magias e Aura. O Aasimar dá Mãos Curativas e resistência radiante. Smite Divino devasta inimigos críticos.',
  },
  {
    id: 'barbaro-furioso',
    name: 'Bárbaro Furioso',
    tagline: 'Devastador implacável em fúria',
    emoji: '🪓',
    classId: 'barbaro',
    className: 'Bárbaro',
    speciesId: 'golias',
    backgroundId: 'soldado',
    attributes: [15, 13, 14, 8, 12, 10],
    bgPlus2: 'forca',
    bgPlus1: 'constituicao',
    tags: ['DPS', 'Tank', 'Iniciante'],
    strategy: 'Força + Constituição + traço gigante do Goliath = canhão de dano. Resistência durante a Fúria torna você quase invencível em combate corpo a corpo.',
  },
  {
    id: 'druida-guardiao-natureza',
    name: 'Druida da Natureza',
    tagline: 'Forma selvagem e magia primal',
    emoji: '🌿',
    classId: 'druida',
    className: 'Druida',
    speciesId: 'elfo',
    backgroundId: 'eremita',
    attributes: [8, 13, 14, 10, 15, 12],
    bgPlus2: 'sabedoria',
    bgPlus1: 'constituicao',
    tags: ['Suporte', 'Versátil', 'Conjurador'],
    strategy: 'Sabedoria para conjuração + Forma Selvagem para escapar/explorar. O Eremita reforça o tema isolacionista. Cura, controle e versatilidade em uma classe.',
  },
];

export function getTemplateById(id: string): BuildTemplate | undefined {
  return BUILD_TEMPLATES.find((t) => t.id === id);
}
