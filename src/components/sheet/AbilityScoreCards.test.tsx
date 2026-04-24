import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { signedMod } from '../../utils/format';

/**
 * Visual contract test (estático): garante que o CSS dos cards de
 * atributos NÃO volte a usar clip-path nem position absolute nos
 * elementos internos (label / scoreBadge / modifier).
 * Também valida formatação consistente do modificador.
 */
describe('AbilityScoreCards — visual contract', () => {
  const css = readFileSync(
    resolve(__dirname, './AbilityScoreCards.module.css'),
    'utf8'
  );

  it('a regra .box NÃO usa clip-path (retângulo limpo)', () => {
    const boxBlock = css.match(/\.box\s*\{[^}]*\}/)?.[0] ?? '';
    expect(boxBlock).not.toMatch(/clip-path\s*:/);
    expect(boxBlock).toMatch(/border-radius\s*:/);
  });

  it('label e scoreBadge não usam position: absolute', () => {
    const labelBlock = css.match(/\.label\s*\{[^}]*\}/)?.[0] ?? '';
    const badgeBlock = css.match(/\.scoreBadge\s*\{[^}]*\}/)?.[0] ?? '';
    expect(labelBlock).not.toMatch(/position\s*:\s*absolute/);
    expect(badgeBlock).not.toMatch(/position\s*:\s*absolute/);
  });

  it('modificador é formatado com sinal (+/-/+0)', () => {
    expect(signedMod(3)).toBe('+3');
    expect(signedMod(0)).toBe('+0');
    expect(signedMod(-1)).toBe('-1');
  });

  it('label da característica permanece legível em telas pequenas (>= 0.65rem)', () => {
    const mobileBlock = css.match(/@media\s*\(max-width:\s*480px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
    const labelSize = mobileBlock.match(/\.label\s*\{[^}]*font-size\s*:\s*([\d.]+)rem/)?.[1];
    if (labelSize) {
      expect(parseFloat(labelSize)).toBeGreaterThanOrEqual(0.65);
    }
  });
});

describe('AbilityScoreCards — ordering contract', () => {
  it('a lista de labels ordenada por localeCompare(pt-BR) começa com Carisma', () => {
    const names = ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'];
    const sorted = names.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'));
    expect(sorted).toEqual(['Carisma', 'Constituição', 'Destreza', 'Força', 'Inteligência', 'Sabedoria']);
  });
});