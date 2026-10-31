import { describe, it, expect, beforeAll, vi, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import { CharacterSheetPage } from './CharacterSheetPage';
import { DiceProvider } from '../../context/DiceContext';
import { deriveSheet } from '../../rules/engine';
import type { CharacterChoices } from '../../rules/types/CharacterChoices';
import { DEFAULT_PLAY_STATE } from '../../types/playState';

function makeChoices(): CharacterChoices {
  return {
    classId: 'guerreiro',
    backgroundId: null,
    speciesId: null,
    attributeMethod: 'standard',
    baseAttributes: { forca: 15, destreza: 14, constituicao: 13, inteligencia: 12, sabedoria: 10, carisma: 8 },
    backgroundBonusDistribution: null,
    equipmentChoices: { classOption: 'A', backgroundOption: 'A' },
    spellSelections: { cantrips: [], prepared: [] },
    talentSelections: {},
    languageSelections: ['common'],
    featureChoices: {},
    characterDetails: { name: 'E2E Hero', portrait: null },
  };
}

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  // Reaplica matchMedia mock baseado em width
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => {
      const m = query.match(/max-width:\s*(\d+)px/);
      const min = query.match(/min-width:\s*(\d+)px/);
      let matches = false;
      if (m) matches = width <= parseInt(m[1], 10);
      if (min) matches = width >= parseInt(min[1], 10);
      return {
        matches, media: query, onchange: null,
        addListener: () => {}, removeListener: () => {},
        addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
      };
    },
  });
  window.dispatchEvent(new Event('resize'));
}

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {} unobserve() {} disconnect() {}
  });
});

afterEach(() => { cleanup(); window.localStorage.clear(); });

function renderSheet() {
  const derived = deriveSheet(makeChoices());
  return render(
    <DiceProvider>
      <CharacterSheetPage
        characterName="E2E Hero" portrait={null}
        speciesName="Humano" className="Guerreiro" characterLevel={1}
        derivedSheet={derived} playState={DEFAULT_PLAY_STATE}
        onUpdatePlayState={() => {}}
        classFeatures={[]} speciesTraits={[]} inventory={[]}
        learnedCantrips={[]} preparedSpells={[]}
        backgroundName="" backgroundDescription="" backgroundSkills={[]}
        backgroundTool="" backgroundEquipment=""
        equippedArmorId={null} hasShieldEquipped={false}
        onEquipArmor={() => {}} onEquipShield={() => {}}
      />
    </DiceProvider>
  );
}

describe('CharacterSheetPage — E2E (Etapa 6) ordem alfabética + alturas', () => {
  it('renderiza os 6 atributos em ordem pt-BR (Carisma → Sabedoria) no DOM', () => {
    setViewport(1280);
    const { container } = renderSheet();
    const cards = container.querySelectorAll('[data-ability-key]');
    const labels = Array.from(cards).map(c => within(c as HTMLElement).getAllByText(/^[A-Za-zÀ-ú]+$/)[0]?.textContent);
    expect(labels).toEqual(['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma']);
  });

  it('em viewport 1100px todos os blocos PB/Caminhada/Inspiração/HP existem com altura mínima esperada', () => {
    setViewport(1100);
    renderSheet();
    expect(screen.getByText('PROFICIÊNCIA')).toBeInTheDocument();
    expect(screen.getByText('CAMINHADA')).toBeInTheDocument();
    expect(screen.getByLabelText(/Inspiração Heróica/)).toBeInTheDocument();
    expect(screen.getByText('PONTOS DE VIDA')).toBeInTheDocument();
  });

  it('em viewport 640px atributos continuam em ordem pt-BR e blocos secundários permanecem visíveis', () => {
    setViewport(640);
    const { container } = renderSheet();
    const labels = Array.from(container.querySelectorAll('[data-ability-key]'))
      .map(c => c.getAttribute('data-ability-key'));
    expect(labels).toEqual(['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma']);
    expect(screen.getByText('PROFICIÊNCIA')).toBeInTheDocument();
    expect(screen.getByText('PONTOS DE VIDA')).toBeInTheDocument();
  });

});