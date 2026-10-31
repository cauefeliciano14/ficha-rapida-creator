import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { InventorySection } from './InventorySection';

// @ts-expect-error jsdom test env flag for React act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let cleanup: (() => void) | null = null;
afterEach(() => cleanup?.());

function render(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => root.render(ui));
  cleanup = () => { act(() => root.unmount()); container.remove(); };
  return { container, rerender: (next: React.ReactElement) => act(() => root.render(next)) };
}

const inventory = [
  { id: 'a', name: 'Machadinha', quantity: 1 },
  { id: 'b', name: 'Machadinha', quantity: 1 },
  { id: 'c', name: 'Machadinha', quantity: 1 },
  { id: 'd', name: 'Machadinha', quantity: 1 },
  { id: 'g', name: 'Machado Grande', quantity: 1 },
] as never[];

describe('Equipamento: itens iguais empilhados', () => {
  it('4 Machadinhas viram uma linha ×4 e Equipar liga só uma', () => {
    const onToggleEquip = vi.fn();
    const { container } = render(
      <InventorySection inventory={inventory} onRemoveItem={() => {}} onChangeQuantity={() => {}} onToggleEquip={onToggleEquip} equippedWeaponNames={[]} />,
    );
    const minus = container.querySelectorAll('[aria-label="Diminuir Machadinha"]');
    expect(minus.length).toBe(1);
    expect(minus[0].nextElementSibling?.textContent).toBe('4');
    const equip = Array.from(container.querySelectorAll('button')).find(b => b.textContent === 'Equipar')!;
    act(() => equip.click());
    expect(onToggleEquip).toHaveBeenCalledWith('a');
  });

  it('não deixa equipar o Machado Grande com uma Machadinha na mão', () => {
    const onToggleEquip = vi.fn();
    const { container } = render(
      <InventorySection inventory={inventory} onRemoveItem={() => {}} onChangeQuantity={() => {}} onToggleEquip={onToggleEquip} equippedWeaponNames={['a']} />,
    );
    const equips = Array.from(container.querySelectorAll('button')).filter(b => b.textContent === 'Equipar');
    act(() => equips[equips.length - 1].click());
    expect(onToggleEquip).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')?.textContent).toMatch(/usa as duas mãos/);
  });
});
