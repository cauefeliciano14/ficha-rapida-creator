import fs from 'node:fs';
import path from 'node:path';

const EXTRACTED_PATH = path.resolve('scripts/out/races_extracted.json');
const RACES_TS_PATH = path.resolve('src/data/races.ts');

function parseSpeed(text) {
  const m = text.match(/(\d+)\s*metros/i);
  return m ? Number(m[1]) : 9;
}

function parseSize(text) {
  return text.replace(/^Tamanho:\s*/i, '').trim();
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).races;

const races = extracted.map((race) => {
  const speed = parseSpeed(race.traits.speed || '9 metros');
  const size = parseSize(race.traits.size || 'Médio');
  const baseTraits = [
    { name: 'Tipo de Criatura', description: (race.traits.creatureType || '').replace(/^Tipo de Criatura:\s*/i, '').trim() },
    { name: 'Tamanho', description: size },
    { name: 'Deslocamento', description: (race.traits.speed || '').replace(/^Deslocamento:\s*/i, '').trim() },
  ];

  return {
    id: race.id,
    name: race.name,
    description: race.description,
    speed,
    size,
    abilityBonuses: { mode: 'fixed', fixed: {} },
    languages: [],
    proficiencies: { skills: [], tools: [], weapons: [], armor: [] },
    traits: [...baseTraits, ...(race.abilities || [])],
    subraces: [],
    source: { sourceId: 'player_handbook_2024', page: 0 },
  };
});

const source = fs.readFileSync(RACES_TS_PATH, 'utf8');
const next = source.replace(/export const races: RaceData\[\] = \[[\s\S]*?\];/m, `export const races: RaceData[] = ${JSON.stringify(races, null, 2)};`);
fs.writeFileSync(RACES_TS_PATH, `${next}\n`);

console.log(`Arquivo atualizado: ${RACES_TS_PATH}`);
