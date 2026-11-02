import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileBottomNav } from './MobileNavBar';
import { DEFAULT_CHARACTER, type Character, type Selection } from '../../../types/character';
import type { ValidationResult } from '../../../rules/engine/validation';

const state = vi.hoisted(() => ({
  currentStep: 0,
  character: null as Character | null,
  selectedBackground: null as Selection | null,
  validationResult: null as ValidationResult | null,
}));

vi.mock('../../../context/WizardContext', () => ({
  useWizard: () => ({
    currentStep: state.currentStep,
    setCurrentStep: vi.fn(),
    goToStep: vi.fn(),
  }),
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

function navItem(label: string): HTMLElement {
  return screen.getByRole('button', { name: new RegExp(`^${label} - Etapa`) });
}

function badgeText(label: string): string | null {
  const badge = navItem(label).querySelector('span[class*="badge"]');
  return badge ? badge.textContent : null;
}

describe('MobileNavBar — selos de pendências por etapa', () => {
  beforeEach(() => {
    state.currentStep = 0;
    state.character = { ...DEFAULT_CHARACTER };
    state.selectedBackground = null;
    state.validationResult = makeValidation({});
  });

  it('mostra selo azul com contagem em todas as etapas com pendências', () => {
    state.validationResult = makeValidation({
      class: ['Escolha uma classe.', 'Escolha uma classe.'],
      background: ['Escolha um antecedente.'],
      species: ['Escolha uma espécie.'],
      attributes: ['Escolha um método para definir os atributos do personagem.'],
      equipment: ['Escolha o pacote de equipamento da classe.', 'Escolha o pacote de equipamento do antecedente.'],
    });
    render(<MobileBottomNav />);

    expect(badgeText('Classe')).toBe('1');
    expect(badgeText('Origem')).toBe('1');
    expect(badgeText('Raça')).toBe('1');
    expect(badgeText('Atributos')).toBe('1');
    expect(badgeText('Equip.')).toBe('2');
  });

  it('mostra check verde quando a etapa atual está concluída mesmo sem avançar', () => {
    state.character = {
      ...DEFAULT_CHARACTER,
      characterClass: { id: 'guerreiro' } as unknown as Selection,
    };
    state.validationResult = makeValidation({
      species: ['Escolha uma espécie.'],
    });
    render(<MobileBottomNav />);

    expect(badgeText('Classe')).toBe('✓');
    expect(badgeText('Raça')).toBe('1');
  });

  it('etapa concluída e já visitada mostra o check do ícone, sem selo duplicado', () => {
    state.currentStep = 2;
    state.character = {
      ...DEFAULT_CHARACTER,
      characterClass: { id: 'guerreiro' } as unknown as Selection,
    };
    state.validationResult = makeValidation({
      species: ['Escolha uma espécie.'],
    });
    render(<MobileBottomNav />);

    expect(badgeText('Classe')).toBeNull();
    expect(navItem('Classe').textContent).toContain('✓');
    expect(badgeText('Raça')).toBe('1');
  });
});
