import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { AbilityScoreCards } from './AbilityScoreCards';
import { getAbilityLabelTexts, MOD_FORMULA_HINT } from '../../utils/abilityLabels';

const finalAttributes = { forca: 14, destreza: 12, constituicao: 13, inteligencia: 10, sabedoria: 11, carisma: 8 };
const modifiers = { forca: 2, destreza: 1, constituicao: 1, inteligencia: 0, sabedoria: 0, carisma: -1 };

describe('AbilityScoreCards — labels acessíveis (jest-dom)', () => {
  it('cada card tem aria-label completo lido por leitores de tela', () => {
    render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal onAbilityClick={() => {}} />);

    const forca = screen.getByRole('button', { name: /Força\. Total 14\. Modificador \+2/ });
    expect(forca).toBeInTheDocument();
    expect(forca).toHaveAttribute('title', expect.stringContaining(MOD_FORMULA_HINT));
    expect(forca).toHaveAttribute('data-ability-key', 'forca');
  });

  it('aria-label do modificador inclui sinal +/- consistente', () => {
    render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal />);
    expect(screen.getByLabelText('Modificador +2')).toBeInTheDocument();
    expect(screen.getByLabelText('Modificador -1')).toBeInTheDocument();
    expect(screen.getByLabelText('Modificador +0')).toBeInTheDocument();
  });

  it('label do atributo é focável e tem aria-label de instrução por teclado', () => {
    render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal onAbilityClick={() => {}} />);
    const labels = screen.getAllByLabelText(/pressione Enter para ver detalhes/);
    expect(labels).toHaveLength(6);
    labels.forEach(l => expect(l).toHaveAttribute('tabindex', '0'));
  });

  it('title e aria-label do card derivam do MESMO helper (não divergem)', () => {
    render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal onAbilityClick={() => {}} />);
    const card = screen.getByRole('button', { name: /Destreza\. Total 12/ });
    const expected = getAbilityLabelTexts('destreza', 'Destreza', 12, 1);
    expect(card).toHaveAccessibleName(expected.cardAriaLabel);
    expect(card).toHaveAttribute('title', expected.tooltip);
    const mod = within(card).getByLabelText('Modificador +1');
    expect(mod).toHaveAttribute('title', expected.modifierTitle);
  });
});