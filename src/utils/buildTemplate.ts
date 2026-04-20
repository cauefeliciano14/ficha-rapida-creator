import type { BuildTemplate } from '../data/buildTemplates';
import type { Character, Selection } from '../types/character';
import classesSummary from '../data/classesSummary.json';
import speciesRaw from '../data/species.json';
import bgRaw from '../data/backgrounds.json';
import { ATTR_KEYS } from './attributeConstants';
import { calculateModifier, applyBackgroundBonus } from './attributeUtils';

interface ApplyResult {
  character: Character;
  selectedBackground: Selection | null;
  attrChoiceMode: '' | 'triple' | 'double';
  attrPlus1: string;
  attrPlus2: string;
}

function loadSpecies(): Selection[] {
  const root = speciesRaw as { species?: Selection[] } | Selection[];
  if (Array.isArray(root)) return root;
  return root.species ?? [];
}

function loadBackgrounds(): Selection[] {
  const arr = (bgRaw as unknown as { backgrounds?: Selection[] }).backgrounds;
  if (Array.isArray(arr)) return arr;
  return [];
}

/**
 * Aplica um template completo: classe, espécie, antecedente, atributos e equipamento.
 * Sobrescreve seleções anteriores para garantir build coesa.
 */
export function applyBuildTemplate(template: BuildTemplate, current: Character): ApplyResult {
  const classes = classesSummary as Selection[];
  const species = loadSpecies();
  const backgrounds = loadBackgrounds();

  const cls = classes.find((c) => c.id === template.classId) ?? null;
  const sp = species.find((s) => s.id === template.speciesId) ?? null;
  const bg = backgrounds.find((b) => b.id === template.backgroundId) ?? null;

  // Atributos base do template
  const base: Record<string, number> = {};
  ATTR_KEYS.forEach((k, i) => { base[k] = template.attributes[i]; });

  // Bônus de background +2/+1
  const backgroundBonus: Record<string, number> = {};
  ATTR_KEYS.forEach((k) => { backgroundBonus[k] = 0; });
  if (template.bgPlus2) backgroundBonus[template.bgPlus2] = 2;
  if (template.bgPlus1) backgroundBonus[template.bgPlus1] = 1;

  const final = applyBackgroundBonus(base, backgroundBonus);
  const modifiers: Record<string, number> = {};
  ATTR_KEYS.forEach((k) => { modifiers[k] = calculateModifier(final[k]); });

  const nextChar: Character = {
    ...current,
    characterClass: cls,
    species: sp,
    attributes: {
      ...current.attributes,
      method: 'standard',
      base,
      backgroundBonus,
      final,
      modifiers,
    },
    equipment: {
      ...current.equipment,
      classOption: current.equipment.classOption ?? 'A',
      backgroundOption: current.equipment.backgroundOption ?? 'A',
    },
  };

  return {
    character: nextChar,
    selectedBackground: bg,
    attrChoiceMode: 'double',
    attrPlus1: template.bgPlus1 ?? '',
    attrPlus2: template.bgPlus2 ?? '',
  };
}
