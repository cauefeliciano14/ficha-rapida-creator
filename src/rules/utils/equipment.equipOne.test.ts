import { describe, expect, it } from 'vitest';
import { isInventoryItemEquipped, toggleEquippedKey } from './equipment';

const items = [
  { id: 'a', name: 'Machadinha' },
  { id: 'b', name: 'Machadinha' },
  { id: 'c', name: 'Machado Grande' },
];

describe('Equipar vale para um item só', () => {
  it('equipar uma Machadinha não equipa as outras', () => {
    const keys = toggleEquippedKey([], items[0], false);
    expect(isInventoryItemEquipped(keys, items[0], 0, items)).toBe(true);
    expect(isInventoryItemEquipped(keys, items[1], 1, items)).toBe(false);
  });

  it('ficha antiga (guardava o nome) equipa só a primeira com aquele nome', () => {
    const legacy = ['Machadinha'];
    expect(isInventoryItemEquipped(legacy, items[0], 0, items)).toBe(true);
    expect(isInventoryItemEquipped(legacy, items[1], 1, items)).toBe(false);
  });

  it('desequipar remove o id e o nome antigo', () => {
    expect(toggleEquippedKey(['Machadinha', 'a'], items[0], true)).toEqual([]);
  });
});
