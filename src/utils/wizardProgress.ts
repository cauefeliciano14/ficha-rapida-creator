import type { ValidationResult } from '../rules/engine/validation';
import type { Character, Selection } from '../types/character';

export interface StepProgress {
  key: 'class' | 'background' | 'species' | 'attributes' | 'equipment';
  label: string;
  index: number;
  completed: boolean;
  pending: number;
}

const STEP_DEFS: Array<{ key: StepProgress['key']; label: string; index: number }> = [
  { key: 'class', label: 'Classe', index: 0 },
  { key: 'background', label: 'Antecedente', index: 1 },
  { key: 'species', label: 'Raça', index: 2 },
  { key: 'attributes', label: 'Atributos', index: 3 },
  { key: 'equipment', label: 'Equipamento', index: 4 },
];

export interface WizardProgress {
  steps: StepProgress[];
  totalPending: number;
  completedSteps: number;
  totalSteps: number;
  percent: number;
}

export function computeWizardProgress(
  character: Character,
  selectedBackground: Selection | null,
  validationResult: ValidationResult,
): WizardProgress {
  const steps: StepProgress[] = STEP_DEFS.map(({ key, label, index }) => {
    const issues = validationResult.byStep[key] ?? [];
    const pending = issues.length;

    const completed = pending === 0 && stepHasSelection(character, selectedBackground, key);
    return { key, label, index, completed, pending };
  });

  const completedSteps = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const totalPending = steps.reduce((acc, s) => acc + s.pending, 0);
  const percent = Math.round((completedSteps / totalSteps) * 100);

  return { steps, totalPending, completedSteps, totalSteps, percent };
}

/** Mesma lógica do painel de Pendências: mensagens duplicadas contam uma vez. */
export function countUniqueIssues(issues: readonly string[] | undefined): number {
  return issues ? new Set(issues).size : 0;
}

/** A etapa tem a escolha principal feita (classe, origem, espécie, método, pacote). */
export function stepHasSelection(
  character: Character,
  selectedBackground: Selection | null,
  key: StepProgress['key'],
): boolean {
  if (key === 'class') return !!character.characterClass;
  if (key === 'background') return !!selectedBackground;
  if (key === 'species') return !!character.species;
  if (key === 'attributes') return !!character.attributes.method;
  return character.equipment.classOption !== null;
}
