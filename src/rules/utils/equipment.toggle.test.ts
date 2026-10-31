import { describe, expect, it } from 'vitest';
import { getArmorByName } from '../data/armorRules';
import { getEquipKind, toggleItemEquipped } from './equipment';

const base = () => ({
  inventory: [
    { id: 'a1', name: 'Cota de Malha' },
    { id: 'a2', name: 'Couro' },
    { id: 's1', name: 'Escudo' },
    { id: 'w1', name: 'Espada Longa' },
    { id: 'g1', name: 'Corda de Cânhamo' },
  ] as Array<{ id: string; name: string; equipped?: boolean }>,
  equippedArmorId: null as string | null,
  hasShieldEquipped: false,
});

describe('toggleItemEquipped', () => {
  it('classifies equippable items', () => {
    expect(getEquipKind('Escudo')).toBe('shield');
    expect(getEquipKind('Espada Longa')).toBe('weapon');
    expect(getEquipKind('Corda de Cânhamo')).toBeNull();
  });

  it('keeps only one body armor equipped and toggles it off', () => {
    let eq = toggleItemEquipped(base(), 'a1');
    expect(eq.equippedArmorId).toBe(getArmorByName('Cota de Malha')!.id);
    eq = toggleItemEquipped(eq, 'a2');
    expect(eq.equippedArmorId).toBe(getArmorByName('Couro')!.id);
    eq = toggleItemEquipped(eq, 'a2');
    expect(eq.equippedArmorId).toBeNull();
  });

  it('toggles shield and weapon flags; ignores mundane gear', () => {
    let eq = toggleItemEquipped(base(), 's1');
    expect(eq.hasShieldEquipped).toBe(true);
    eq = toggleItemEquipped(eq, 'w1');
    expect(eq.inventory.find((i) => i.id === 'w1')!.equipped).toBe(true);
    eq = toggleItemEquipped(eq, 'w1');
    expect(eq.inventory.find((i) => i.id === 'w1')!.equipped).toBe(false);
    expect(toggleItemEquipped(eq, 'g1')).toBe(eq);
  });
});
