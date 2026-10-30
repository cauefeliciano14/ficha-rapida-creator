import { describe, it, expect } from 'vitest';
import { withSquares, metersToSquares } from './format';

describe('distâncias em quadrados (1 qd = 1,5 m)', () => {
  it('converte metros', () => {
    expect(metersToSquares(9)).toBe(6);
    expect(metersToSquares(10.5)).toBe(7);
  });
  it('anota textos de deslocamento e alcance', () => {
    expect(withSquares('9 metros')).toBe('9 metros (6 qd)');
    expect(withSquares('C.C. ou 6/18 m')).toBe('C.C. ou 6/18 m (4/12 qd)');
    expect(withSquares('36 metros')).toBe('36 metros (24 qd)');
    expect(withSquares('Toque')).toBe('Toque');
    expect(withSquares('Corpo a Corpo')).toBe('Corpo a Corpo');
  });
  it('não anota duas vezes', () => {
    expect(withSquares(withSquares('9 metros'))).toBe('9 metros (6 qd)');
  });
});
