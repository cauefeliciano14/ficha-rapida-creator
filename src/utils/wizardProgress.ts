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
  { key: 'background', label: 'Origem', index: 1 },
  { key: 'species', label: 'Espécie', index: 2 },
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
    let hasSelection = true;
    if (key === 'class') hasSelection = !!character.characterClass;
    else if (key === 'background') hasSelection = !!selectedBackground;
    else if (key === 'species') hasSelection = !!character.species;
    else if (key === 'attributes') hasSelection = !!character.attributes.method;
    else if (key === 'equipment') hasSelection = character.equipment.classOption !== null;

    const completed = pending === 0 && hasSelection;
    return { key, label, index, completed, pending };
  });

  const completedSteps = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const totalPending = steps.reduce((acc, s) => acc + s.pending, 0);
  const percent = Math.round((completedSteps / totalSteps) * 100);

  return { steps, totalPending, completedSteps, totalSteps, percent };
}
