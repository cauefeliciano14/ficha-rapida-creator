/**
 * Smart Hints — analisa o estado atual do personagem e gera
 * avisos contextuais não-bloqueantes, separados das validações
 * obrigatórias. Foco: ajudar a otimizar escolhas, não impedir.
 */
import type { Character } from '../types/character';
import { CLASS_ROLE_META } from '../data/classRoles';
import { isSynergy } from '../data/classSynergies';
import classAttributeSuggestions from '../data/classAttributeSuggestions';

export type HintSeverity = 'info' | 'warning' | 'tip';

export interface SmartHint {
  id: string;
  severity: HintSeverity;
  title: string;
  message: string;
}

const ATTR_KEYS = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] as const;
const ATTR_LABELS: Record<typeof ATTR_KEYS[number], string> = {
  forca: 'Força',
  destreza: 'Destreza',
  constituicao: 'Constituição',
  inteligencia: 'Inteligência',
  sabedoria: 'Sabedoria',
  carisma: 'Carisma',
};

/** Atributo principal por classe (índice no array de sugestão). */
const PRIMARY_ATTR_BY_CLASS: Record<string, typeof ATTR_KEYS[number]> = {
  barbaro: 'forca',
  bardo: 'carisma',
  bruxo: 'carisma',
  clerigo: 'sabedoria',
  druida: 'sabedoria',
  feiticeiro: 'carisma',
  guardiao: 'destreza',
  guerreiro: 'forca',
  ladino: 'destreza',
  mago: 'inteligencia',
  monge: 'destreza',
  paladino: 'forca',
};

function getFinalAttribute(character: Character, attr: typeof ATTR_KEYS[number]): number | null {
  const final = (character.attributes as any)?.final;
  if (!final || typeof final[attr] !== 'number') return null;
  return final[attr];
}

export function computeSmartHints(
  character: Character,
  selectedBackground: any | null,
): SmartHint[] {
  const hints: SmartHint[] = [];
  const cls = character.characterClass;
  if (!cls) return hints;

  const classId = cls.id;
  const className = cls.name;
  const primary = PRIMARY_ATTR_BY_CLASS[classId];

  // 1) Atributo primário baixo
  if (primary) {
    const value = getFinalAttribute(character, primary);
    if (value !== null) {
      if (value < 13) {
        hints.push({
          id: 'primary-low',
          severity: 'warning',
          title: `${ATTR_LABELS[primary]} baixa para ${className}`,
          message: `Sua ${ATTR_LABELS[primary]} (${value}) está abaixo do recomendado (13+) para um ${className}. Você terá penalidades em ataques e habilidades-chave da classe.`,
        });
      } else if (value < 15) {
        hints.push({
          id: 'primary-medium',
          severity: 'tip',
          title: `${ATTR_LABELS[primary]} pode ser maior`,
          message: `${className} se beneficia muito de ${ATTR_LABELS[primary]} 15+. Considere distribuir mais pontos nesse atributo.`,
        });
      }
    }
  }

  // 2) Constituição baixa em qualquer classe (resistência geral)
  const con = getFinalAttribute(character, 'constituicao');
  if (con !== null && con < 12) {
    hints.push({
      id: 'con-low',
      severity: 'warning',
      title: 'Constituição muito baixa',
      message: `Constituição ${con} significa poucos pontos de vida e testes de resistência fracos contra magias de área. O ideal é manter pelo menos 12-14.`,
    });
  }

  // 3) Sinergia de antecedente
  if (selectedBackground?.id && !isSynergy(classId, selectedBackground.id)) {
    hints.push({
      id: 'bg-synergy',
      severity: 'info',
      title: 'Antecedente sem sinergia',
      message: `O antecedente "${selectedBackground.name}" não é o mais sinérgico com ${className}. Confira a etapa de Origem para ver opções recomendadas.`,
    });
  }

  // 4) Suporte a destreza para classes de leve/sem armadura
  const dex = getFinalAttribute(character, 'destreza');
  if (dex !== null && ['monge', 'ladino', 'guardiao', 'bardo', 'feiticeiro', 'mago', 'bruxo'].includes(classId) && dex < 13) {
    hints.push({
      id: 'dex-low',
      severity: 'tip',
      title: 'Destreza ajuda na CA',
      message: `Sem armadura pesada, ${className} depende da Destreza para Classe de Armadura. ${dex} é baixo — considere subir para 14+.`,
    });
  }

  // 5) Sugestão de Standard Array
  const suggestion = classAttributeSuggestions[classId];
  const base = (character.attributes as any)?.base;
  if (suggestion && base) {
    const primaryIdx = ATTR_KEYS.indexOf(primary);
    if (primaryIdx >= 0) {
      const suggestedPrimary = suggestion[primaryIdx];
      const baseValue = base[primary];
      if (typeof baseValue === 'number' && baseValue < suggestedPrimary - 2) {
        // Já coberto por #1 normalmente; mantém só dica leve
      }
    }
  }

  // 6) Identidade do papel (info contextual)
  const meta = CLASS_ROLE_META[classId];
  if (meta && hints.length === 0) {
    hints.push({
      id: 'role-info',
      severity: 'info',
      title: `${className}: ${meta.tagline}`,
      message: `Papel ideal: ${meta.roles.join(' / ')}. Estilo: ${meta.playstyle} (${meta.range}). Dificuldade: ${meta.difficulty}.`,
    });
  }

  return hints;
}
