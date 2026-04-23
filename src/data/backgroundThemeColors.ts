/**
 * Cor temática por Origem (antecedente) — mesmo padrão visual usado em
 * `speciesThemeColors` e `classThemeColors`, aplicado aos cards de seleção
 * de Origem no estilo "trading card" (landscape).
 *
 * As artes ficam em `public/imgs/portrait_backgrounds/<id>.png`. Quando a
 * imagem ainda não existe, o card cai num gradiente baseado na cor do banner.
 */
export interface BackgroundTheme {
  banner: string;
  glow: string;
  archetypeText: string;
  archetypeBg: string;
  archetypeBorder: string;
  archetypeLabel: string;
  /** Caminho da arte do card (em /public). Vazio = usa fallback de gradiente. */
  art: string;
}

const ART_BASE = '/imgs/portrait_backgrounds';

export const BACKGROUND_THEME: Record<string, BackgroundTheme> = {
  acolito:    { banner: '#ca8a04', glow: 'rgba(250,204,21,0.45)',  archetypeText: '#facc15', archetypeBg: 'rgba(250,204,21,0.08)',  archetypeBorder: 'rgba(250,204,21,0.55)',  archetypeLabel: 'DEVOTO DO SAGRADO',     art: `${ART_BASE}/acolito.png` },
  andarilho:  { banner: '#475569', glow: 'rgba(148,163,184,0.45)', archetypeText: '#cbd5e1', archetypeBg: 'rgba(203,213,225,0.08)', archetypeBorder: 'rgba(203,213,225,0.55)', archetypeLabel: 'CRIA DAS RUAS',         art: `${ART_BASE}/andarilho.png` },
  artesao:    { banner: '#b45309', glow: 'rgba(245,158,11,0.45)',  archetypeText: '#fbbf24', archetypeBg: 'rgba(251,191,36,0.08)',  archetypeBorder: 'rgba(251,191,36,0.55)',  archetypeLabel: 'MESTRE DO OFÍCIO',      art: `${ART_BASE}/artesao.png` },
  artista:    { banner: '#9333ea', glow: 'rgba(168,85,247,0.45)',  archetypeText: '#c084fc', archetypeBg: 'rgba(192,132,252,0.08)', archetypeBorder: 'rgba(192,132,252,0.55)', archetypeLabel: 'ESTRELA DO PALCO',      art: `${ART_BASE}/artista.png` },
  charlatao:  { banner: '#a16207', glow: 'rgba(202,138,4,0.45)',   archetypeText: '#eab308', archetypeBg: 'rgba(234,179,8,0.08)',   archetypeBorder: 'rgba(234,179,8,0.55)',   archetypeLabel: 'MESTRE DO ENGANO',      art: `${ART_BASE}/charlatao.png` },
  criminoso:  { banner: '#7f1d1d', glow: 'rgba(220,38,38,0.45)',   archetypeText: '#f87171', archetypeBg: 'rgba(248,113,113,0.08)', archetypeBorder: 'rgba(248,113,113,0.55)', archetypeLabel: 'SOMBRA DO BECO',        art: `${ART_BASE}/criminoso.png` },
  eremita:    { banner: '#15803d', glow: 'rgba(34,197,94,0.45)',   archetypeText: '#4ade80', archetypeBg: 'rgba(74,222,128,0.08)',  archetypeBorder: 'rgba(74,222,128,0.55)',  archetypeLabel: 'BUSCADOR DA VERDADE',   art: `${ART_BASE}/eremita.png` },
  escriba:    { banner: '#1d4ed8', glow: 'rgba(59,130,246,0.45)',  archetypeText: '#60a5fa', archetypeBg: 'rgba(96,165,250,0.08)',  archetypeBorder: 'rgba(96,165,250,0.55)',  archetypeLabel: 'GUARDIÃO DA TINTA',     art: `${ART_BASE}/escriba.png` },
  fazendeiro: { banner: '#65a30d', glow: 'rgba(132,204,22,0.45)',  archetypeText: '#a3e635', archetypeBg: 'rgba(163,230,53,0.08)',  archetypeBorder: 'rgba(163,230,53,0.55)',  archetypeLabel: 'FILHO DA TERRA',        art: `${ART_BASE}/fazendeiro.png` },
  guarda:     { banner: '#0f766e', glow: 'rgba(20,184,166,0.45)',  archetypeText: '#2dd4bf', archetypeBg: 'rgba(45,212,191,0.08)',  archetypeBorder: 'rgba(45,212,191,0.55)',  archetypeLabel: 'SENTINELA VIGILANTE',   art: `${ART_BASE}/guarda.png` },
  guia:       { banner: '#166534', glow: 'rgba(22,163,74,0.45)',   archetypeText: '#22c55e', archetypeBg: 'rgba(34,197,94,0.08)',   archetypeBorder: 'rgba(34,197,94,0.55)',   archetypeLabel: 'ANDARILHO DA NATUREZA', art: `${ART_BASE}/guia.png` },
  marinheiro: { banner: '#0369a1', glow: 'rgba(14,165,233,0.45)',  archetypeText: '#38bdf8', archetypeBg: 'rgba(56,189,248,0.08)',  archetypeBorder: 'rgba(56,189,248,0.55)',  archetypeLabel: 'LOBO DO MAR',           art: `${ART_BASE}/marinheiro.png` },
  mercador:   { banner: '#b45309', glow: 'rgba(245,158,11,0.45)',  archetypeText: '#f59e0b', archetypeBg: 'rgba(245,158,11,0.08)',  archetypeBorder: 'rgba(245,158,11,0.55)',  archetypeLabel: 'NEGOCIANTE DE ROTAS',   art: `${ART_BASE}/mercador.png` },
  nobre:      { banner: '#7e22ce', glow: 'rgba(168,85,247,0.45)',  archetypeText: '#d8b4fe', archetypeBg: 'rgba(216,180,254,0.08)', archetypeBorder: 'rgba(216,180,254,0.55)', archetypeLabel: 'HERDEIRO DA CORTE',     art: `${ART_BASE}/nobre.png` },
  sabio:      { banner: '#1e40af', glow: 'rgba(96,165,250,0.45)',  archetypeText: '#93c5fd', archetypeBg: 'rgba(147,197,253,0.08)', archetypeBorder: 'rgba(147,197,253,0.55)', archetypeLabel: 'ERUDITO DO MULTIVERSO', art: `${ART_BASE}/sabio.png` },
  soldado:    { banner: '#b91c1c', glow: 'rgba(239,68,68,0.45)',   archetypeText: '#fca5a5', archetypeBg: 'rgba(252,165,165,0.08)', archetypeBorder: 'rgba(252,165,165,0.55)', archetypeLabel: 'VETERANO DE GUERRA',    art: `${ART_BASE}/soldado.png` },
};

const FALLBACK: BackgroundTheme = {
  banner: '#475569',
  glow: 'rgba(148,163,184,0.4)',
  archetypeText: '#cbd5e1',
  archetypeBg: 'rgba(203,213,225,0.08)',
  archetypeBorder: 'rgba(203,213,225,0.5)',
  archetypeLabel: 'ANDARILHO DO MUNDO',
  art: '',
};

export function getBackgroundTheme(backgroundId: string): BackgroundTheme {
  return BACKGROUND_THEME[backgroundId] ?? FALLBACK;
}