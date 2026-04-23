/**
 * Cor temática por espécie — mesmo padrão visual usado em ClassThemeColors,
 * aplicado aos cards de seleção de Espécie no estilo "trading card".
 */
export interface SpeciesTheme {
  banner: string;
  glow: string;
  archetypeText: string;
  archetypeBg: string;
  archetypeBorder: string;
  archetypeLabel: string;
  /** Caminho da arte do card (em /public). */
  art: string;
}

const ART_BASE = '/imgs/portrait_races';

export const SPECIES_THEME: Record<string, SpeciesTheme> = {
  aasimar:    { banner: '#ca8a04', glow: 'rgba(250,204,21,0.45)',  archetypeText: '#facc15', archetypeBg: 'rgba(250,204,21,0.08)',  archetypeBorder: 'rgba(250,204,21,0.55)',  archetypeLabel: 'TOCADO PELOS CÉUS', art: `${ART_BASE}/aasimar.png` },
  anao:       { banner: '#b45309', glow: 'rgba(245,158,11,0.45)',  archetypeText: '#fbbf24', archetypeBg: 'rgba(251,191,36,0.08)',  archetypeBorder: 'rgba(251,191,36,0.55)',  archetypeLabel: 'FILHO DA FORJA',     art: `${ART_BASE}/anoes.png` },
  draconato:  { banner: '#b91c1c', glow: 'rgba(239,68,68,0.45)',   archetypeText: '#f87171', archetypeBg: 'rgba(248,113,113,0.08)', archetypeBorder: 'rgba(248,113,113,0.55)', archetypeLabel: 'HERDEIRO DRACÔNICO', art: `${ART_BASE}/draconatos.png` },
  elfo:       { banner: '#15803d', glow: 'rgba(34,197,94,0.45)',   archetypeText: '#4ade80', archetypeBg: 'rgba(74,222,128,0.08)',  archetypeBorder: 'rgba(74,222,128,0.55)',  archetypeLabel: 'CRIATURA FEÉRICA',   art: `${ART_BASE}/elfos.png` },
  gnomo:      { banner: '#0f766e', glow: 'rgba(20,184,166,0.45)',  archetypeText: '#2dd4bf', archetypeBg: 'rgba(45,212,191,0.08)',  archetypeBorder: 'rgba(45,212,191,0.55)',  archetypeLabel: 'INVENTOR ARCANO',    art: `${ART_BASE}/gnomos.png` },
  golias:     { banner: '#475569', glow: 'rgba(148,163,184,0.45)', archetypeText: '#cbd5e1', archetypeBg: 'rgba(203,213,225,0.08)', archetypeBorder: 'rgba(203,213,225,0.55)', archetypeLabel: 'DESCENDENTE DE GIGANTES', art: `${ART_BASE}/golias.png` },
  humano:     { banner: '#1d4ed8', glow: 'rgba(59,130,246,0.45)',  archetypeText: '#60a5fa', archetypeBg: 'rgba(96,165,250,0.08)',  archetypeBorder: 'rgba(96,165,250,0.55)',  archetypeLabel: 'AVENTUREIRO VERSÁTIL', art: `${ART_BASE}/humanos.png` },
  orc:        { banner: '#166534', glow: 'rgba(22,163,74,0.45)',   archetypeText: '#22c55e', archetypeBg: 'rgba(34,197,94,0.08)',   archetypeBorder: 'rgba(34,197,94,0.55)',   archetypeLabel: 'ANDARILHO RESILIENTE', art: `${ART_BASE}/orcs.png` },
  pequenino:  { banner: '#a16207', glow: 'rgba(202,138,4,0.45)',   archetypeText: '#eab308', archetypeBg: 'rgba(234,179,8,0.08)',   archetypeBorder: 'rgba(234,179,8,0.55)',   archetypeLabel: 'CORAÇÃO VALENTE',    art: `${ART_BASE}/pequeninos.png` },
  tiferino:   { banner: '#9333ea', glow: 'rgba(168,85,247,0.45)',  archetypeText: '#c084fc', archetypeBg: 'rgba(192,132,252,0.08)', archetypeBorder: 'rgba(192,132,252,0.55)', archetypeLabel: 'LINHAGEM INFERNAL',  art: `${ART_BASE}/tiferinos.png` },
};

const FALLBACK: SpeciesTheme = {
  banner: '#475569',
  glow: 'rgba(148,163,184,0.4)',
  archetypeText: '#cbd5e1',
  archetypeBg: 'rgba(203,213,225,0.08)',
  archetypeBorder: 'rgba(203,213,225,0.5)',
  archetypeLabel: 'POVO DO MULTIVERSO',
  art: '',
};

export function getSpeciesTheme(speciesId: string): SpeciesTheme {
  return SPECIES_THEME[speciesId] ?? FALLBACK;
}
