import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SpellsTab, type SpellRoll } from './SpellsTab';
import { DEFAULT_PLAY_STATE } from '../../../types/playState';
import type { DerivedSheet } from '../../../rules/types/DerivedSheet';

// @ts-expect-error jsdom test env flag for React act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let cleanup: (() => void) | null = null;
afterEach(() => cleanup?.());

function render(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => root.render(ui));
  cleanup = () => {
    act(() => root.unmount());
    container.remove();
  };
  return container;
}

const sheet = {
  isCaster: true,
  spellcastingAbility: 'inteligencia',
  spellAttackBonus: 5,
  spellSaveDC: 13,
  spellSlots: [2],
  cantripsKnown: 3,
  preparedSpellCount: 4,
  racialCantrips: [],
  bonusCantrips: [],
  bonusPreparedSpells: [],
  finalAttributes: { inteligencia: 16 },
} as unknown as DerivedSheet;

describe('SpellsTab — rolar como no D&D Beyond', () => {
  it('o acerto e o dano da magia são botões que rolam', () => {
    const onSpellRoll = vi.fn<(roll: SpellRoll) => void>();
    const container = render(
      <SpellsTab
        derivedSheet={sheet}
        playState={DEFAULT_PLAY_STATE}
        onUpdatePlayState={() => {}}
        learnedCantrips={['Raio de Fogo']}
        preparedSpells={[]}
        onSpellRoll={onSpellRoll}
      />,
    );

    const attack = container.querySelector<HTMLButtonElement>('button[title="Rolar ataque"]');
    expect(attack?.textContent).toBe('+5');
    act(() => attack!.click());
    expect(onSpellRoll).toHaveBeenLastCalledWith({ kind: 'attack', spell: 'Raio de Fogo', bonus: 5 });

    const damage = Array.from(container.querySelectorAll<HTMLButtonElement>('button'))
      .find(b => b.title.startsWith('Rolar dano'));
    expect(damage?.textContent).toMatch(/^1d10/);
    act(() => damage!.click());
    expect(onSpellRoll).toHaveBeenLastCalledWith(expect.objectContaining({ kind: 'damage', spell: 'Raio de Fogo', formula: '1d10' }));
  });
});
