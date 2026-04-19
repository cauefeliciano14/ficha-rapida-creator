/**
 * Metadados táticos das classes — papel no grupo, dificuldade,
 * estilo de combate. Usado no Quiz de Arquétipo, Hero Hover e
 * Random Character.
 */
export type ClassRole = 'Tank' | 'DPS' | 'Suporte' | 'Controle';
export type ClassRange = 'Corpo a corpo' | 'À distância' | 'Misto';
export type ClassPlaystyle = 'Marcial' | 'Mágico' | 'Híbrido';
export type ClassDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface ClassRoleMeta {
  roles: ClassRole[];
  range: ClassRange;
  playstyle: ClassPlaystyle;
  difficulty: ClassDifficulty;
  social: number;        // 1-5 — quão socialmente envolvido
  exploration: number;   // 1-5 — utilidade exploratória
  tagline: string;       // frase curta de identidade
}

export const CLASS_ROLE_META: Record<string, ClassRoleMeta> = {
  barbaro:    { roles: ['Tank', 'DPS'],         range: 'Corpo a corpo', playstyle: 'Marcial',  difficulty: 'Iniciante',     social: 2, exploration: 3, tagline: 'Fúria primal e dano massivo' },
  bardo:      { roles: ['Suporte', 'Controle'], range: 'Misto',         playstyle: 'Mágico',   difficulty: 'Intermediário', social: 5, exploration: 4, tagline: 'Inspiração mágica e versatilidade' },
  bruxo:      { roles: ['DPS', 'Controle'],     range: 'À distância',   playstyle: 'Mágico',   difficulty: 'Intermediário', social: 4, exploration: 3, tagline: 'Pacto sombrio e magia rápida' },
  clerigo:    { roles: ['Suporte', 'Tank'],     range: 'Corpo a corpo', playstyle: 'Híbrido',  difficulty: 'Iniciante',     social: 3, exploration: 4, tagline: 'Cura divina e proteção sagrada' },
  druida:     { roles: ['Suporte', 'Controle'], range: 'Misto',         playstyle: 'Mágico',   difficulty: 'Avançado',      social: 3, exploration: 5, tagline: 'Forma selvagem e magia da natureza' },
  feiticeiro: { roles: ['DPS', 'Controle'],     range: 'À distância',   playstyle: 'Mágico',   difficulty: 'Intermediário', social: 4, exploration: 2, tagline: 'Magia inata e metamagia' },
  guardiao:   { roles: ['Tank', 'Suporte'],     range: 'Misto',         playstyle: 'Híbrido',  difficulty: 'Intermediário', social: 3, exploration: 5, tagline: 'Guardião dos ermos e caçador' },
  guerreiro:  { roles: ['Tank', 'DPS'],         range: 'Misto',         playstyle: 'Marcial',  difficulty: 'Iniciante',     social: 2, exploration: 3, tagline: 'Domínio marcial e ataques extras' },
  ladino:     { roles: ['DPS', 'Controle'],     range: 'Misto',         playstyle: 'Marcial',  difficulty: 'Intermediário', social: 4, exploration: 5, tagline: 'Ataque furtivo e perícia ímpar' },
  mago:       { roles: ['DPS', 'Controle'],     range: 'À distância',   playstyle: 'Mágico',   difficulty: 'Avançado',      social: 3, exploration: 4, tagline: 'Tomo arcano e versatilidade infinita' },
  monge:      { roles: ['DPS', 'Tank'],         range: 'Corpo a corpo', playstyle: 'Marcial',  difficulty: 'Avançado',      social: 2, exploration: 4, tagline: 'Mobilidade extrema e golpes ki' },
  paladino:   { roles: ['Tank', 'Suporte'],     range: 'Corpo a corpo', playstyle: 'Híbrido',  difficulty: 'Iniciante',     social: 4, exploration: 3, tagline: 'Juramento sagrado e Smite divino' },
};

export const ROLE_COLORS: Record<ClassRole, string> = {
  Tank: '#3b82f6',
  DPS: '#ef4444',
  Suporte: '#10b981',
  Controle: '#a855f7',
};

export const ROLE_ICONS: Record<ClassRole, string> = {
  Tank: '🛡️',
  DPS: '⚔️',
  Suporte: '✨',
  Controle: '🌀',
};
