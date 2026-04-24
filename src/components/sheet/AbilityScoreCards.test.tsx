import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AbilityScoreCards } from './AbilityScoreCards';

const finalAttributes = {
  forca: 8, destreza: 12, constituicao: 14,
  inteligencia: 14, sabedoria: 16, carisma: 11,
};
const modifiers = {
  forca: -1, destreza: 1, constituicao: 2,
  inteligencia: 2, sabedoria: 3, carisma: 0,
};

describe('AbilityScoreCards — visual contract', () => {
  it('renderiza as 6 características em ordem alfabética pt-BR', () => {
    render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal />);
    const labels = screen.getAllByText(
      /^(Força|Destreza|Constituição|Inteligência|Sabedoria|Carisma)$/
    ).map(el => el.textContent);
    expect(labels).toEqual(['Carisma', 'Constituição', 'Destreza', 'Força', 'Inteligência', 'Sabedoria']);
  });

  it('mostra label, modificador com sinal e Total para cada característica', () => {
    render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal />);
    expect(screen.getByText('Força')).toBeInTheDocument();
    expect(screen.getByText('-1')).toBeInTheDocument(); // mod negativo
    expect(screen.getByText('+3')).toBeInTheDocument(); // mod positivo (Sabedoria)
    expect(screen.getByText('+0')).toBeInTheDocument(); // mod zero formatado com +
    expect(screen.getAllByText('Total').length).toBe(6);
    expect(screen.getByText('16')).toBeInTheDocument(); // total Sabedoria
  });

  it('não usa clip-path nem position absolute nas caixas (retângulos limpos)', () => {
    const { container } = render(
      <AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal />
    );
    const boxes = container.querySelectorAll('[class*="box"]');
    expect(boxes.length).toBeGreaterThan(0);
    boxes.forEach(box => {
      const style = getComputedStyle(box as HTMLElement);
      expect(style.clipPath === '' || style.clipPath === 'none').toBe(true);
      expect(['static', '', 'relative']).toContain(style.position);
    });
  });
});