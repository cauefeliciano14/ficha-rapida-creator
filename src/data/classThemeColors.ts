/**
 * Cor temática por classe — usada nos banners dos cards de seleção
 * para dar identidade visual estilo "trading card".
 */
export interface ClassTheme {
  /** Cor sólida do banner/flâmula */
  banner: string;
  /** Cor do glow / borda interna do card quando hovered */
  glow: string;
  /** Cor do texto da tag de arquétipo (ex: "WEAPONS MASTER") */
  archetypeText: string;
  /** Background da tag de arquétipo */
  archetypeBg: string;
  /** Borda da tag de arquétipo */
  archetypeBorder: string;
  /** Rótulo curto exibido na tag principal */
  archetypeLabel: string;
}

export const CLASS_THEME: Record<string, ClassTheme> = {
  barbaro:    { banner: '#c2410c', glow: 'rgba(249,115,22,0.45)',  archetypeText: '#fb923c', archetypeBg: 'rgba(251,146,60,0.08)',  archetypeBorder: 'rgba(251,146,60,0.55)', archetypeLabel: 'GUERREIRO FURIOSO' },
  bardo:      { banner: '#a21caf', glow: 'rgba(217,70,239,0.45)',  archetypeText: '#e879f9', archetypeBg: 'rgba(232,121,249,0.08)', archetypeBorder: 'rgba(232,121,249,0.55)', archetypeLabel: 'INTÉRPRETE INSPIRADOR' },
  bruxo:      { banner: '#9333ea', glow: 'rgba(168,85,247,0.45)',  archetypeText: '#c084fc', archetypeBg: 'rgba(192,132,252,0.08)', archetypeBorder: 'rgba(192,132,252,0.55)', archetypeLabel: 'OCULTISTA SOBRENATURAL' },
  clerigo:    { banner: '#ca8a04', glow: 'rgba(234,179,8,0.45)',   archetypeText: '#facc15', archetypeBg: 'rgba(250,204,21,0.08)',  archetypeBorder: 'rgba(250,204,21,0.55)',  archetypeLabel: 'SACERDOTE DIVINO' },
  druida:     { banner: '#15803d', glow: 'rgba(34,197,94,0.45)',   archetypeText: '#4ade80', archetypeBg: 'rgba(74,222,128,0.08)',  archetypeBorder: 'rgba(74,222,128,0.55)',  archetypeLabel: 'SACERDOTE DA NATUREZA' },
  feiticeiro: { banner: '#b45309', glow: 'rgba(245,158,11,0.45)',  archetypeText: '#fbbf24', archetypeBg: 'rgba(251,191,36,0.08)',  archetypeBorder: 'rgba(251,191,36,0.55)',  archetypeLabel: 'MAGO INATO' },
  guardiao:   { banner: '#166534', glow: 'rgba(22,163,74,0.45)',   archetypeText: '#22c55e', archetypeBg: 'rgba(34,197,94,0.08)',   archetypeBorder: 'rgba(34,197,94,0.55)',   archetypeLabel: 'GUERREIRO PRIMAL' },
  guerreiro:  { banner: '#92400e', glow: 'rgba(180,83,9,0.45)',    archetypeText: '#d97706', archetypeBg: 'rgba(217,119,6,0.08)',   archetypeBorder: 'rgba(217,119,6,0.55)',   archetypeLabel: 'MESTRE DAS ARMAS' },
  ladino:     { banner: '#1d4ed8', glow: 'rgba(59,130,246,0.45)',  archetypeText: '#60a5fa', archetypeBg: 'rgba(96,165,250,0.08)',  archetypeBorder: 'rgba(96,165,250,0.55)',  archetypeLabel: 'ESPECIALISTA ÁGIL' },
  mago:       { banner: '#6d28d9', glow: 'rgba(139,92,246,0.45)',  archetypeText: '#a78bfa', archetypeBg: 'rgba(167,139,250,0.08)', archetypeBorder: 'rgba(167,139,250,0.55)', archetypeLabel: 'MAGO ERUDITO' },
  monge:      { banner: '#0f766e', glow: 'rgba(20,184,166,0.45)',  archetypeText: '#2dd4bf', archetypeBg: 'rgba(45,212,191,0.08)',  archetypeBorder: 'rgba(45,212,191,0.55)',  archetypeLabel: 'ARTISTA MARCIAL' },
  paladino:   { banner: '#475569', glow: 'rgba(148,163,184,0.45)', archetypeText: '#cbd5e1', archetypeBg: 'rgba(203,213,225,0.08)', archetypeBorder: 'rgba(203,213,225,0.55)', archetypeLabel: 'GUERREIRO DEVOTO' },
};

export function getClassTheme(classId: string): ClassTheme {
  return CLASS_THEME[classId] ?? {
    banner: '#475569',
    glow: 'rgba(148,163,184,0.4)',
    archetypeText: '#cbd5e1',
    archetypeBg: 'rgba(203,213,225,0.08)',
    archetypeBorder: 'rgba(203,213,225,0.5)',
    archetypeLabel: 'AVENTUREIRO',
  };
}