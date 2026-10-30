import { describe, it, expect } from 'vitest';
import allSpells from '../../data/spells/spells_all.json';
import { classStartingSpells } from '../../data/spellsData';
import { getCantripsKnown, getPreparedSpellCount } from '../calculators/spells';
import { validateChoices } from '../engine/validation';
import type { CharacterChoices } from '../types/CharacterChoices';
import { getMaxSpellCircle, getValidPreparedSpellNames, getValidSpellNames } from '../utils/spellSelection';

const CLASS_LABEL: Record<string, string> = {
  bardo: 'Bardo', bruxo: 'Bruxo', clerigo: 'Clérigo', druida: 'Druida',
  feiticeiro: 'Feiticeiro', guardiao: 'Guardião', mago: 'Mago', paladino: 'Paladino',
};
const byName = new Map((allSpells as Array<{ name: string; level: string; classes: string[]; description: string; components: string }>).map((s) => [s.name, s]));

describe('dados de magias', () => {
  it('toda magia tem descrição e componentes não vazios', () => {
    for (const s of allSpells as Array<{ name: string; description: string; components: string }>) {
      expect(s.description.trim().length, `descrição de ${s.name}`).toBeGreaterThanOrEqual(40);
      expect(s.components.trim().length, `componentes de ${s.name}`).toBeGreaterThan(0);
    }
  });

  it('Animar Mortos existe para Clérigo e Mago', () => {
    expect(byName.get('Animar Mortos')?.classes).toEqual(['Clérigo', 'Mago']);
  });

  it('classStartingSpells só usa magias existentes, da classe e do círculo certo', () => {
    for (const [classId, info] of Object.entries(classStartingSpells)) {
      for (const name of info.cantrips) {
        const s = byName.get(name);
        expect(s, `${name} (${classId})`).toBeDefined();
        expect(s!.level).toBe('Truque');
        expect(s!.classes).toContain(CLASS_LABEL[classId]);
      }
      for (const name of info.level1) {
        const s = byName.get(name);
        expect(s, `${name} (${classId})`).toBeDefined();
        expect(s!.level).toBe('1º Círculo');
        expect(s!.classes).toContain(CLASS_LABEL[classId]);
      }
      if (info.isCaster) {
        expect(info.cantrips.length).toBeLessThanOrEqual(getCantripsKnown(classId, 1));
        expect(info.level1.length).toBeLessThanOrEqual(getPreparedSpellCount(classId, 1));
      }
    }
  });
});

function makeChoices(classId: string, level: number, prepared: string[]): CharacterChoices {
  return {
    classId, backgroundId: null, speciesId: null, attributeMethod: 'standard', level,
    baseAttributes: { forca: 10, destreza: 10, constituicao: 10, inteligencia: 10, sabedoria: 10, carisma: 10 },
    backgroundBonusDistribution: null,
    equipmentChoices: { classOption: 'B', backgroundOption: 'B' },
    inventory: [],
    spellSelections: { cantrips: [], prepared },
    talentSelections: {}, languageSelections: [], featureChoices: {},
    characterDetails: { name: '', portrait: null },
  } as unknown as CharacterChoices;
}

describe('seleção de magias por círculo disponível', () => {
  const circle2 = [...getValidSpellNames('mago', 2)][0];

  it('calcula o maior círculo (inclusive espaço de Pacto do Bruxo)', () => {
    expect(getMaxSpellCircle('mago', 1)).toBe(1);
    expect(getMaxSpellCircle('mago', 3)).toBe(2);
    expect(getMaxSpellCircle('bruxo', 5)).toBe(3);
    expect(getMaxSpellCircle('guerreiro', 5)).toBe(0);
  });

  it('Mago de nível 3 pode escolher magia de 2º círculo', () => {
    expect(getValidPreparedSpellNames('mago', 3).has(circle2)).toBe(true);
    const errors = validateChoices(makeChoices('mago', 3, [circle2])).errors;
    expect(errors.join(' ')).not.toContain('círculo para o qual');
  });

  it('Mago de nível 1 não pode escolher magia de 2º círculo', () => {
    expect(getValidPreparedSpellNames('mago', 1).has(circle2)).toBe(false);
    const errors = validateChoices(makeChoices('mago', 1, [circle2])).errors;
    expect(errors.join(' ')).toContain('círculo para o qual');
  });
});
