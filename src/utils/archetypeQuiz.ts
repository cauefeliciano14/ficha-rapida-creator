import { CLASS_ROLE_META, type ClassRole, type ClassRange, type ClassPlaystyle } from '../data/classRoles';

export interface QuizAnswers {
  range?: ClassRange;
  playstyle?: ClassPlaystyle;
  preferredRole?: ClassRole;
  social?: 'baixa' | 'media' | 'alta';
}

export interface QuizMatch {
  classId: string;
  score: number;     // 0-100
  reasons: string[];
}

export interface QuizQuestion {
  id: keyof QuizAnswers;
  question: string;
  options: Array<{ value: string; label: string; icon: string; description: string }>;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'range',
    question: 'Como você prefere lutar?',
    options: [
      { value: 'Corpo a corpo', label: 'Corpo a corpo',   icon: '⚔️', description: 'Engajar o inimigo de perto, dano direto.' },
      { value: 'À distância',   label: 'À distância',     icon: '🏹', description: 'Atacar por longas distâncias, mantendo segurança.' },
      { value: 'Misto',         label: 'Versátil',         icon: '🎯', description: 'Adaptar a estratégia conforme a situação.' },
    ],
  },
  {
    id: 'playstyle',
    question: 'Marcial ou mágico?',
    options: [
      { value: 'Marcial',  label: 'Marcial',  icon: '🛡️', description: 'Treinamento físico, armas e técnicas de combate.' },
      { value: 'Mágico',   label: 'Mágico',   icon: '🔮', description: 'Conjurar feitiços e manipular forças arcanas.' },
      { value: 'Híbrido',  label: 'Híbrido',  icon: '⚡', description: 'O melhor dos dois mundos.' },
    ],
  },
  {
    id: 'preferredRole',
    question: 'Qual é seu papel preferido no grupo?',
    options: [
      { value: 'Tank',      label: 'Tank',      icon: '🛡️', description: 'Receber golpes e proteger aliados.' },
      { value: 'DPS',       label: 'DPS',       icon: '⚔️', description: 'Causar muito dano rapidamente.' },
      { value: 'Suporte',   label: 'Suporte',   icon: '✨', description: 'Curar, fortalecer e capacitar o grupo.' },
      { value: 'Controle',  label: 'Controle',  icon: '🌀', description: 'Manipular o campo de batalha e debuffar.' },
    ],
  },
  {
    id: 'social',
    question: 'Como você se vê em interações sociais?',
    options: [
      { value: 'alta',  label: 'Líder carismático', icon: '👑', description: 'Negocia, persuade, é a face do grupo.' },
      { value: 'media', label: 'Intervém quando precisa', icon: '🗣️', description: 'Equilibrado entre ação e diálogo.' },
      { value: 'baixa', label: 'Solitário ou silencioso', icon: '🌑', description: 'Prefere agir a falar.' },
    ],
  },
];

export function scoreClasses(answers: QuizAnswers): QuizMatch[] {
  const matches: QuizMatch[] = [];

  for (const [classId, meta] of Object.entries(CLASS_ROLE_META)) {
    let score = 0;
    let max = 0;
    const reasons: string[] = [];

    if (answers.range) {
      max += 30;
      if (meta.range === answers.range) {
        score += 30;
        reasons.push(`Combate ${answers.range.toLowerCase()}`);
      } else if (meta.range === 'Misto' || answers.range === 'Misto') {
        score += 18;
      }
    }

    if (answers.playstyle) {
      max += 25;
      if (meta.playstyle === answers.playstyle) {
        score += 25;
        reasons.push(`Estilo ${answers.playstyle.toLowerCase()}`);
      } else if (meta.playstyle === 'Híbrido' || answers.playstyle === 'Híbrido') {
        score += 15;
      }
    }

    if (answers.preferredRole) {
      max += 30;
      if (meta.roles.includes(answers.preferredRole)) {
        score += 30;
        reasons.push(`Papel ${answers.preferredRole}`);
      }
    }

    if (answers.social) {
      max += 15;
      const socialBand = meta.social >= 4 ? 'alta' : meta.social >= 3 ? 'media' : 'baixa';
      if (socialBand === answers.social) {
        score += 15;
        reasons.push('Perfil social compatível');
      } else {
        score += 6;
      }
    }

    const normalized = max > 0 ? Math.round((score / max) * 100) : 0;
    matches.push({ classId, score: normalized, reasons });
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 3);
}
