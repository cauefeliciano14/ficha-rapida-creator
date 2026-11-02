import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepSidebar } from './StepSidebar';
import { countUniqueIssues } from '../../../utils/wizardProgress';
import { DEFAULT_CHARACTER, type Character, type Selection } from '../../../types/character';
import type { ValidationResult } from '../../../rules/engine/validation';

const state = vi.hoisted(() => ({
  currentStep: 0,
  character: null as Character | null,
  selectedBackground: null as Selection | null,
  validationResult: null as ValidationResult | null,
}));

vi.mock('../../../context/WizardContext', () => ({
  useWizard: () => ({ currentStep: state.currentStep, setCurrentStep: vi.fn() }),
}));

vi.mock('../../../context/CharacterContext', () => ({
  useCharacter: () => ({
    character: state.character,
    selectedBackground: state.selectedBackground,
    validationResult: state.validationResult,
  }),
}));

function makeValidation(byStep: Partial<Record<'class' | 'background' | 'species' | 'attributes' | 'equipment', string[]>>): ValidationResult {
  const full = { class: [], background: [], species: [], attributes: [], equipment: [], ...byStep };
  const errors = Object.values(full).flat();
  return { isValid: errors.length === 0, errors, warnings: [], byStep: full };
}

function badgeOf(label: string): HTMLElement | null {
  const button = screen.getByText(label).closest('button');
  if (!button) return null;
  return button.querySelector('span[class*="stepBadge"]');
}

describe('StepSidebar — selos de pendências por etapa', () => {
  beforeEach(() => {
    state.currentStep = 0;
    state.character = { ...DEFAULT_CHARACTER };
    state.selectedBackground = null;
    state.validationResult = makeValidation({});
  });

  it('conta pendências únicas por etapa (mesma lógica do painel de Pendências)', () => {
    expect(countUniqueIssues(['a', 'a', 'b'])).toBe(2);

    state.validationResult = makeValidation({
      class: ['Escolha uma classe.', 'Escolha uma classe.', 'Defina subclasse.'],
      equipment: ['Escolha o pacote de equipamento da classe.'],
    });
    render(<StepSidebar />);

    expect(badgeOf('Classe')?.textContent).toBe('2');
    expect(badgeOf('Equipamento')?.textContent).toBe('1');
  });

  it('mostra selo azul também nas etapas futuras com pendências', () => {
    state.validationResult = makeValidation({
      class: ['Escolha uma classe.'],
      background: ['Escolha um antecedente.'],
      species: ['Escolha uma espécie.'],
      attributes: ['Escolha um método.'],
      equipment: ['Escolha o pacote de equipamento da classe.'],
    });
    render(<StepSidebar />);

    for (const label of ['Classe', 'Antecedente', 'Raça', 'Atributos', 'Equipamento']) {
      expect(badgeOf(label)?.textContent).toBe('1');
    }
  });

  it('troca o selo por check verde assim que a etapa fica concluída', () => {
    state.character = {
      ...DEFAULT_CHARACTER,
      characterClass: { id: 'guerreiro' } as unknown as Selection,
      species: { id: 'humano' } as unknown as Selection,
      attributes: { ...DEFAULT_CHARACTER.attributes, method: 'standard' },
      equipment: { ...DEFAULT_CHARACTER.equipment, classOption: 'A' },
    };
    state.selectedBackground = { id: 'soldado' } as unknown as Selection;
    state.validationResult = makeValidation({});
    render(<StepSidebar />);

    for (const label of ['Classe', 'Antecedente', 'Raça', 'Atributos', 'Equipamento', 'Ficha']) {
      expect(badgeOf(label)?.textContent).toBe('✓');
    }
  });

  it('etapa com escolha feita mas pendências abertas mantém o selo azul com contagem', () => {
    state.character = {
      ...DEFAULT_CHARACTER,
      characterClass: { id: 'guerreiro' } as unknown as Selection,
    };
    state.validationResult = makeValidation({
      class: ['Defina subclasse para concluir a etapa de classe.'],
      species: ['Escolha uma espécie.'],
    });
    render(<StepSidebar />);

    expect(badgeOf('Classe')?.textContent).toBe('1');
    expect(badgeOf('Raça')?.textContent).toBe('1');
  });
});
