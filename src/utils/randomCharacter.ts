import bgData from '../data/db.json';
import { CLASS_ROLE_META } from '../data/classRoles';
import { applyQuickBuild } from './quickBuild';
import speciesRaw from '../data/species.json';
import type { Character, Selection } from '../types/character';

interface RandomBuildResult {
  character: Character;
  selectedBackground: Selection | null;
  attrChoiceMode: '' | 'triple' | 'double';
  attrPlus1: string;
  attrPlus2: string;
  notes: string[];
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function loadSpecies(): Selection[] {
  const root = speciesRaw as { species?: Selection[] } | Selection[];
  if (Array.isArray(root)) return root;
  return root.species ?? [];
}

const RANDOM_NAMES = ['Aelar', 'Borin', 'Caelynn', 'Drogath', 'Eira', 'Faelar', 'Garruk', 'Hylda', 'Ilmaril', 'Jorath', 'Kaelen', 'Lyra', 'Mordak', 'Nyx', 'Orin', 'Perrin', 'Quill', 'Ravna', 'Sylas', 'Thalia', 'Ulric', 'Veyra', 'Wren', 'Xanth', 'Yara', 'Zeke'];

/**
 * Gera um personagem 100% aleatório válido (classe + espécie + antecedente
 * + atributos sugeridos + equipamento A). Reusa applyQuickBuild para
 * preencher os campos derivados após escolher classe e espécie.
 */
export function buildRandomCharacter(baseChar: Character): RandomBuildResult {
  const allClasses = bgData.classes;
  const cls = pick(allClasses);

  const allSpecies = loadSpecies();
  const sp = allSpecies.length > 0 ? pick(allSpecies) : null;

  const name = pick(RANDOM_NAMES);

  const charWithClass: Character = {
    ...baseChar,
    name,
    characterClass: cls,
    species: sp,
  };

  const result = applyQuickBuild({ character: charWithClass, selectedBackground: null });

  const meta = CLASS_ROLE_META[cls.id];
  const notes = [
    `🎲 Personagem gerado: ${name} — ${cls.name}${sp ? ` (${sp.name})` : ''}`,
    meta ? `Papel: ${meta.roles.join(' / ')} · ${meta.range}` : '',
    ...result.notes,
  ].filter(Boolean);

  return { ...result, notes };
}
