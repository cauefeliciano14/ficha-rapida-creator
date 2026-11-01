import { describe, expect, it } from 'vitest';
import { missingSpellPicks, missingSpellText } from './spellPending';

describe('Pendência de magias', () => {
  it('conta o que falta (ex.: depois de subir de nível)', () => {
    const m = missingSpellPicks({ cantripsKnown: 4, preparedSpellCount: 3, learnedCantrips: ['a', 'b', 'c'], preparedSpells: ['x'] });
    expect(m).toEqual({ cantrips: 1, prepared: 2, total: 3 });
    expect(missingSpellText(m)).toBe('1 truque e 2 magias');
  });
  it('nada pendente quando está completo', () => {
    expect(missingSpellPicks({ cantripsKnown: 2, preparedSpellCount: 1, learnedCantrips: ['a', 'b'], preparedSpells: ['x'] }).total).toBe(0);
  });
});
