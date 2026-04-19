import classAttributeSuggestions from '../data/classAttributeSuggestions';
import { CLASS_BG_SYNERGIES } from '../data/classSynergies';
import { ATTR_KEYS } from './attributeConstants';
import { calculateModifier, applyBackgroundBonus } from './attributeUtils';
import bgRaw from '../data/backgrounds.json';
import speciesRaw from '../data/species.json';
import type { Character, Selection } from '../types/character';

interface QuickBuildResult {
  character: Character;
  selectedBackground: Selection | null;
  attrChoiceMode: '' | 'triple' | 'double';
  attrPlus1: string;
  attrPlus2: string;
  notes: string[];
}

interface QuickBuildInput {
  character: Character;
  selectedBackground: Selection | null;
}

const HUMAN_FALLBACK_SPECIES_IDS = ['humano', 'human', 'aasimar', 'elfo'];

function loadBackgrounds(): Selection[] {
  const arr = (bgRaw as unknown as Selection[][])[0] ?? (bgRaw as unknown as Selection[]);
  return Array.isArray(arr) ? arr : [];
}

function loadSpecies(): Selection[] {
  const root = speciesRaw as { species?: Selection[] } | Selection[];
  if (Array.isArray(root)) return root;
  return root.species ?? [];
}

/**
 * Quick Build — preenche em 1 clique:
 * - Atributos (standard, valores recomendados por classe)
 * - Background sinérgico com bônus +2/+1
 * - Espécie padrão (humano/primeiro disponível) se nenhuma selecionada
 * - Equipamento Opção A (classe + background)
 * NÃO sobrescreve seleções já feitas pelo usuário (exceto atributos vazios).
 */
export function applyQuickBuild({ character, selectedBackground }: QuickBuildInput): QuickBuildResult {
  const notes: string[] = [];
  const classId = character.characterClass?.id;
  if (!classId) {
    return {
      character,
      selectedBackground,
      attrChoiceMode: '',
      attrPlus1: '',
      attrPlus2: '',
      notes: ['Selecione uma classe antes de usar o Quick Build.'],
    };
  }

  // 1) Atributos — distribuição sugerida por classe
  const suggestion = classAttributeSuggestions[classId];
  let nextChar = character;
  if (suggestion) {
    const base: Record<string, number> = {};
    ATTR_KEYS.forEach((k, i) => { base[k] = suggestion[i]; });
    const final = applyBackgroundBonus(base, character.attributes.backgroundBonus);
    const modifiers: Record<string, number> = {};
    ATTR_KEYS.forEach((k) => { modifiers[k] = calculateModifier(final[k]); });
    nextChar = {
      ...nextChar,
      attributes: {
        ...nextChar.attributes,
        method: 'standard',
        base,
        final,
        modifiers,
      },
    };
    notes.push('Atributos preenchidos (Standard Array sugerido).');
  }

  // 2) Background sinérgico
  let nextBg = selectedBackground;
  let attrChoiceMode: '' | 'triple' | 'double' = '';
  let attrPlus1 = '';
  let attrPlus2 = '';
  if (!nextBg) {
    const synergies = CLASS_BG_SYNERGIES[classId] ?? [];
    const allBgs = loadBackgrounds();
    const match = synergies.map((id) => allBgs.find((b) => b.id === id)).find(Boolean);
    if (match) {
      nextBg = match;
      notes.push(`Antecedente "${match.name}" selecionado por sinergia.`);
    }
  }

  // 3) Distribuição +2/+1 do background — usar atributos primários da classe
  if (nextBg && Array.isArray(nextBg.attributeValues) && nextBg.attributeValues.length >= 2 && suggestion) {
    const bgAttrs = nextBg.attributeValues as string[];
    // Ordena os atributos do bg pela prioridade da classe (maior valor base primeiro)
    const sorted = [...bgAttrs].sort((a, b) => {
      const ai = ATTR_KEYS.indexOf(a as typeof ATTR_KEYS[number]);
      const bi = ATTR_KEYS.indexOf(b as typeof ATTR_KEYS[number]);
      return (suggestion[bi] ?? 0) - (suggestion[ai] ?? 0);
    });
    attrChoiceMode = 'double';
    attrPlus2 = sorted[0];
    attrPlus1 = sorted[1];
    notes.push('Bônus de antecedente otimizado (+2/+1).');
  }

  // 4) Espécie padrão se nenhuma
  if (!nextChar.species) {
    const allSpecies = loadSpecies();
    const fallback =
      HUMAN_FALLBACK_SPECIES_IDS.map((id) => allSpecies.find((s) => s.id === id)).find(Boolean) ??
      allSpecies[0];
    if (fallback) {
      nextChar = { ...nextChar, species: fallback };
      notes.push(`Espécie padrão definida: ${fallback.name}.`);
    }
  }

  // 5) Equipamento Opção A
  if (!nextChar.equipment.classOption || !nextChar.equipment.backgroundOption) {
    nextChar = {
      ...nextChar,
      equipment: {
        ...nextChar.equipment,
        classOption: nextChar.equipment.classOption ?? 'A',
        backgroundOption: nextChar.equipment.backgroundOption ?? 'A',
      },
    };
    notes.push('Equipamento inicial: Opção A escolhida.');
  }

  return {
    character: nextChar,
    selectedBackground: nextBg,
    attrChoiceMode,
    attrPlus1,
    attrPlus2,
    notes,
  };
}
