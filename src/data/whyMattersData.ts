/**
 * Explicações contextuais "Por que isso importa?" — usadas em escolhas críticas
 * do criador para reduzir paralisia de decisão e ensinar regras-chave.
 */
export interface WhyMattersEntry {
  title: string;
  /** Por que essa escolha é importante (1-2 frases) */
  why: string;
  /** Impacto mecânico (lista de bullets curtos) */
  impact: string[];
  /** Dica para iniciantes (opcional) */
  tip?: string;
}

export const WHY_MATTERS: Record<string, WhyMattersEntry> = {
  class: {
    title: 'Por que a classe importa?',
    why: 'A classe define seu papel no grupo, suas habilidades principais, dado de vida, proficiências e como você cresce ao subir de nível.',
    impact: [
      'Determina seu Dado de Vida (d6 a d12) — afeta diretamente seus PVs',
      'Define salvaguardas de proficiência (2 atributos)',
      'Habilita conjuração de magias (ou não) e o atributo de conjuração',
      'Estabelece a progressão de subclasses, talentos e recursos especiais',
    ],
    tip: 'Iniciante? Guerreiro, Bárbaro e Clérigo são as classes mais simples de jogar.',
  },
  subclass: {
    title: 'Por que a subclasse importa?',
    why: 'A subclasse é uma especialização dentro da classe que muda drasticamente seu estilo de jogo, definida geralmente no nível 3.',
    impact: [
      'Adiciona habilidades únicas em níveis 3, 6, 10, 14',
      'Pode mudar atributo de conjuração ou lista de magias',
      'Define o "sabor" mecânico (ex: Bárbaro Berserker vs Coração Selvagem)',
      'Algumas subclasses concedem proficiências e recursos exclusivos',
    ],
    tip: 'A escolha é permanente — leia as habilidades de níveis altos antes de decidir.',
  },
  background: {
    title: 'Por que o antecedente importa?',
    why: 'O antecedente molda quem seu personagem foi antes da aventura e concede bônus mecânicos significativos no nível 1.',
    impact: [
      'Distribui +2/+1 (ou +1/+1/+1) em três atributos',
      'Concede 2 proficiências de perícia e 1 de ferramenta',
      'Dá um Talento de Origem gratuito (ex: Sortudo, Iniciado em Magia)',
      'Define equipamento inicial alternativo e ganchos de roleplay',
    ],
    tip: 'Escolha um antecedente cujos bônus de atributo combinem com sua classe.',
  },
  species: {
    title: 'Por que a espécie importa?',
    why: 'A espécie define características inatas como deslocamento, sentidos especiais e traços raciais únicos — escolhas permanentes.',
    impact: [
      'Define deslocamento base (geralmente 9m)',
      'Concede sentidos especiais (Visão no Escuro, Sentido Trêmulo)',
      'Adiciona traços ativos/passivos (resistências, magias inatas)',
      'Pode dar idiomas extras e tamanhos diferentes',
    ],
    tip: 'No PHB 2024 a espécie NÃO dá mais bônus de atributos — isso vem do antecedente.',
  },
  attributes: {
    title: 'Por que os atributos importam?',
    why: 'Os 6 atributos determinam tudo no jogo: dano, defesa, conjuração, perícias e salvaguardas. Boa distribuição é essencial.',
    impact: [
      'Cada +1 no modificador = +5% de chance em jogadas relacionadas',
      'CON afeta PVs (TODOS precisam de pelo menos 13)',
      'O atributo primário da classe define seu CD de magia e ataque',
      'DES baixa = baixa CA e iniciativa lenta (pense bem antes de descer)',
    ],
    tip: 'Use o Standard Array (15,14,13,12,10,8) ou Point Buy para resultados balanceados.',
  },
  talent: {
    title: 'Por que o talento importa?',
    why: 'Talentos são habilidades poderosas que personalizam profundamente seu personagem — alguns são tão fortes que definem builds inteiras.',
    impact: [
      'Talento de Origem (1) é gratuito via antecedente',
      'Talentos Gerais substituem Aumento de Atributo no nível 4, 8, 12...',
      'Podem conceder magias, novas ações ou aprimorar combate',
      'Alguns têm pré-requisitos (atributo mínimo, nível, etc.)',
    ],
    tip: 'Sortudo, Iniciado em Magia e Resistente são considerados os mais fortes para iniciantes.',
  },
  equipment: {
    title: 'Por que o equipamento importa?',
    why: 'O equipamento inicial determina sua eficácia em combate no nível 1 — armas, armaduras e itens utilitários.',
    impact: [
      'Armadura define sua Classe de Armadura (CA)',
      'Armas determinam dano base e propriedades (alcance, versatilidade)',
      'A Opção A geralmente dá itens prontos; B dá ouro para customizar',
      'Itens de aventureiro evitam frustração em explorações',
    ],
    tip: 'Iniciante? Sempre pegue a Opção A — vem com tudo necessário para começar.',
  },
};
