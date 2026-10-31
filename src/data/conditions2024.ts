/**
 * Condições do D&D 2024 (Livro do Jogador 2024, Apêndice C — Glossário de Regras).
 * Resumos em palavras próprias; nomes conforme a tradução oficial do livro.
 * Obs.: no livro 2024 em português, "Grappled" = Imobilizado e "Restrained" = Contido.
 */
export interface ConditionInfo {
  name: string;
  /** Nomes antigos/alternativos aceitos (fichas salvas com nomes de 2014). */
  aliases?: string[];
  effects: string[];
}

export const CONDITIONS_2024: ConditionInfo[] = [
  {
    name: 'Amedrontado',
    effects: [
      'Desvantagem em testes de atributo e jogadas de ataque enquanto vê a fonte do medo.',
      'Não pode se aproximar da fonte do medo por vontade própria.',
    ],
  },
  {
    name: 'Atordoado',
    effects: [
      'Está Incapacitado.',
      'Falha automaticamente em salvaguardas de Força e Destreza.',
      'Ataques contra você têm Vantagem.',
    ],
  },
  {
    name: 'Caído',
    effects: [
      'Só pode rastejar, ou gastar metade do Deslocamento para se levantar (não levanta com Deslocamento 0).',
      'Desvantagem nas suas jogadas de ataque.',
      'Ataques contra você: Vantagem se o atacante estiver a até 1,5 m; senão, Desvantagem.',
    ],
  },
  {
    name: 'Cego',
    effects: [
      'Não enxerga; falha automaticamente em testes que dependam de visão.',
      'Ataques contra você têm Vantagem; os seus têm Desvantagem.',
    ],
  },
  {
    name: 'Contido',
    aliases: ['Restringido', 'Impedido'],
    effects: [
      'Deslocamento 0, sem poder aumentar.',
      'Ataques contra você têm Vantagem; os seus têm Desvantagem.',
      'Desvantagem em salvaguardas de Destreza.',
    ],
  },
  {
    name: 'Enfeitiçado',
    effects: [
      'Não pode atacar quem o enfeitiçou nem mirá-lo com habilidades ou efeitos mágicos que causem dano.',
      'Quem o enfeitiçou tem Vantagem em testes de interação social com você.',
    ],
  },
  {
    name: 'Envenenado',
    effects: ['Desvantagem em jogadas de ataque e testes de atributo.'],
  },
  {
    name: 'Exaustão',
    aliases: ['Exausto'],
    effects: [
      'Cumulativa em níveis (1 a 6); morre ao chegar no nível 6.',
      'Todo Teste de D20 sofre −2 × nível.',
      'Deslocamento reduzido em 1,5 m × nível.',
      'Cada Descanso Longo remove 1 nível.',
    ],
  },
  {
    name: 'Imobilizado',
    aliases: ['Agarrado'],
    effects: [
      'Deslocamento 0, sem poder aumentar.',
      'Desvantagem em ataques contra qualquer alvo que não seja quem o imobiliza.',
      'Quem imobiliza pode arrastá-lo, pagando 1 m extra por metro (salvo se você for 2+ tamanhos menor).',
      'Escapar: ação, teste de FOR (Atletismo) ou DES (Acrobacia) contra a CD de quem imobiliza.',
    ],
  },
  {
    name: 'Incapacitado',
    effects: [
      'Não pode usar ação, Ação Bônus nem Reação.',
      'Perde a Concentração e não pode falar.',
      'Desvantagem na Iniciativa se estiver assim ao rolá-la.',
    ],
  },
  {
    name: 'Inconsciente',
    effects: [
      'Está Caído e Incapacitado e larga o que segura (continua Caído ao acordar).',
      'Deslocamento 0; não percebe o ambiente.',
      'Ataques contra você têm Vantagem; acerto a até 1,5 m é Crítico.',
      'Falha automaticamente em salvaguardas de Força e Destreza.',
    ],
  },
  {
    name: 'Invisível',
    effects: [
      'Vantagem na Iniciativa se estiver assim ao rolá-la.',
      'Não é afetado por efeitos que exigem ver o alvo; seu equipamento também fica oculto.',
      'Ataques contra você têm Desvantagem; os seus têm Vantagem (exceto contra quem consegue vê-lo).',
    ],
  },
  {
    name: 'Paralisado',
    effects: [
      'Está Incapacitado; Deslocamento 0.',
      'Ataques contra você têm Vantagem; acerto a até 1,5 m é Crítico.',
      'Falha automaticamente em salvaguardas de Força e Destreza.',
    ],
  },
  {
    name: 'Petrificado',
    effects: [
      'Vira substância inanimada (peso ×10, não envelhece); está Incapacitado, Deslocamento 0.',
      'Ataques contra você têm Vantagem.',
      'Falha automaticamente em salvaguardas de Força e Destreza.',
      'Resistência a todo dano e Imunidade a Envenenado.',
    ],
  },
  {
    name: 'Surdo',
    effects: ['Não ouve; falha automaticamente em testes que dependam de audição.'],
  },
];

/** Busca a condição pelo nome ou por um alias (sem diferenciar maiúsculas). */
export function findCondition(name: string): ConditionInfo | undefined {
  const n = name.trim().toLowerCase();
  return CONDITIONS_2024.find(
    c => c.name.toLowerCase() === n || c.aliases?.some(a => a.toLowerCase() === n),
  );
}

/** Resumo da regra de Exaustão 2024 para um nível. */
export function exhaustionEffect(level: number): { d20Penalty: number; speedReductionM: number; dead: boolean } {
  const l = Math.max(0, Math.min(6, Math.floor(level)));
  return { d20Penalty: 2 * l, speedReductionM: 1.5 * l, dead: l >= 6 };
}
