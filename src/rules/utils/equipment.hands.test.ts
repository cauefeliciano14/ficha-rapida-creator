import { describe, expect, it } from 'vitest';
import { equipBlockReason, expandEquippableUnits, handsNeeded } from './equipment';

describe('Limites de equipar (duas mãos, um Escudo)', () => {
  it('arma de Duas Mãos ocupa as duas', () => {
    expect(handsNeeded('Machado Grande')).toBe(2);
    expect(handsNeeded('Machadinha')).toBe(1);
    expect(handsNeeded('Escudo')).toBe(1);
  });

  it('3 Machadinhas viram 3 linhas na ficha; flechas não', () => {
    const units = expandEquippableUnits([{ id: 'm', name: 'Machadinha', quantity: 3 }, { id: 'f', name: 'Flechas', quantity: 20 }]);
    expect(units.map(u => u.id)).toEqual(['m#0', 'm#1', 'm#2', 'f']);
  });

  it('não deixa a terceira arma nem arma de Duas Mãos com as mãos cheias', () => {
    const units = [
      { id: 'a', name: 'Machadinha' },
      { id: 'b', name: 'Machadinha' },
      { id: 'c', name: 'Machadinha' },
      { id: 'g', name: 'Machado Grande' },
    ];
    expect(equipBlockReason({ units, equippedKeys: ['a'], shieldEquipped: false, target: units[1] })).toBeNull();
    expect(equipBlockReason({ units, equippedKeys: ['a', 'b'], shieldEquipped: false, target: units[2] })).toMatch(/duas mãos/);
    expect(equipBlockReason({ units, equippedKeys: ['a'], shieldEquipped: false, target: units[3] })).toMatch(/usa as duas mãos/);
  });

  it('Escudo conta como uma mão e só existe um por vez', () => {
    const units = [{ id: 'g', name: 'Machado Grande' }, { id: 's', name: 'Escudo' }];
    expect(equipBlockReason({ units, equippedKeys: ['g'], shieldEquipped: false, target: units[1] })).toMatch(/Não dá/);
    expect(equipBlockReason({ units, equippedKeys: [], shieldEquipped: true, target: units[0] })).toMatch(/Não dá/);
    expect(equipBlockReason({ units, equippedKeys: [], shieldEquipped: true, target: units[1] })).toMatch(/um Escudo/);
  });
});
