import { describe, it, expect } from 'vitest';
import { CONDITIONS_2024, findCondition, exhaustionEffect } from './conditions2024';

describe('conditions2024', () => {
  it('tem as 15 condições do Livro do Jogador 2024', () => {
    expect(CONDITIONS_2024).toHaveLength(15);
    expect(new Set(CONDITIONS_2024.map(c => c.name)).size).toBe(15);
    for (const c of CONDITIONS_2024) expect(c.effects.length).toBeGreaterThan(0);
  });

  it('aceita nomes antigos como alias', () => {
    expect(findCondition('Agarrado')?.name).toBe('Imobilizado');
    expect(findCondition('Restringido')?.name).toBe('Contido');
    expect(findCondition('Exausto')?.name).toBe('Exaustão');
  });

  it('exaustão segue a regra 2024 (−2 por nível no d20, −1,5 m por nível, morte no 6)', () => {
    const ex = findCondition('Exaustão')!;
    expect(ex.effects.join(' ')).toMatch(/−2 × nível/);
    expect(ex.effects.join(' ')).toMatch(/1,5 m × nível/);
    expect(exhaustionEffect(3)).toEqual({ d20Penalty: 6, speedReductionM: 4.5, dead: false });
    expect(exhaustionEffect(6).dead).toBe(true);
  });
});
