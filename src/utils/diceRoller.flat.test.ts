import { describe, it, expect } from 'vitest';
import { rollDamage } from './diceRoller';

describe('rollDamage', () => {
  it('soma dano fixo sem dado (Ataque Desarmado)', () => {
    expect(rollDamage('1+1', 'Ataque Desarmado').total).toBe(2);
    expect(rollDamage('1', 'Ataque Desarmado').total).toBe(1);
  });

  it('rola dados com modificador', () => {
    const r = rollDamage('1d4+2', 'Adaga');
    expect(r.total).toBeGreaterThanOrEqual(3);
    expect(r.total).toBeLessThanOrEqual(6);
  });
});
