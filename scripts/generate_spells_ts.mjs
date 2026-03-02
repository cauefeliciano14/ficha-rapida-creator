import fs from 'node:fs';
import path from 'node:path';

const EXTRACTED_PATH = path.resolve('scripts/out/spells_extracted.json');
const SPELLS_TS_PATH = path.resolve('src/data/spells.ts');

function parseComponents(raw) {
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitDescriptionFields(description = '') {
  const cantripMatch = description.match(/\n(Aprimoramento de Truque\.[\s\S]*)$/i);
  const higherMatch = description.match(/\n(Usando um Espaço de Magia de Círculo Superior\.[\s\S]*)$/i);

  let body = description;
  let atHigherLevels;
  let cantripUpgrade;

  if (cantripMatch) {
    cantripUpgrade = cantripMatch[1].trim();
    body = body.slice(0, cantripMatch.index).trim();
  }

  if (higherMatch && (!cantripMatch || higherMatch.index < cantripMatch.index)) {
    atHigherLevels = higherMatch[1].trim();
    body = body.slice(0, higherMatch.index).trim();
  }

  return { description: body, atHigherLevels, cantripUpgrade };
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).spells;
const rawSpells = extracted.map((spell) => {
  const split = splitDescriptionFields(spell.description);
  return {
    id: spell.id,
    name: spell.name,
    level: spell.level,
    school: spell.school,
    ritual: Boolean(spell.ritual),
    concentration: Boolean(spell.concentration),
    castingTime: spell.castingTime,
    range: spell.range,
    components: parseComponents(spell.components),
    duration: spell.duration,
    classes: spell.classes,
    description: split.description,
    ...(split.atHigherLevels ? { atHigherLevels: split.atHigherLevels } : {}),
    ...(split.cantripUpgrade ? { cantripUpgrade: split.cantripUpgrade } : {}),
    source: { book: 'PHB 2024', page: 0 },
  };
});

const file = `export interface SpellData {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: string;
  ritual: boolean;
  concentration: boolean;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  classes: string[];
  classIds?: string[];
  description: string;
  atHigherLevels?: string;
  cantripUpgrade?: string;
  source: { book: string; page: number };
}

const rawSpells: SpellData[] = ${JSON.stringify(rawSpells, null, 2)};

function normalizeSpell(spell: SpellData): SpellData {
  const classes = [...new Set(spell.classes)].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const components = [...new Set(spell.components.map((part) => part.trim()).filter(Boolean))];
  return { ...spell, classes, components };
}

export const spells: SpellData[] = rawSpells.map(normalizeSpell).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

export function getSpellSchools(): string[] {
  return [...new Set(spells.map((s) => s.school))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
`;

fs.writeFileSync(SPELLS_TS_PATH, file);
console.log(`Arquivo atualizado: ${SPELLS_TS_PATH}`);
