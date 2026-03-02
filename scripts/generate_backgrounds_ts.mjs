import fs from 'node:fs';
import path from 'node:path';

const EXTRACTED_PATH = path.resolve('scripts/out/backgrounds_extracted.json');
const BACKGROUNDS_TS_PATH = path.resolve('src/data/backgrounds.ts');

const abilityMap = {
  Força: 'str',
  Destreza: 'dex',
  Constituição: 'con',
  Inteligência: 'int',
  Sabedoria: 'wis',
  Carisma: 'cha',
};

function toId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mapFeatNameToId() {
  const source = fs.readFileSync(path.resolve('src/data/feats.ts'), 'utf8');
  const regex = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
  const map = new Map();
  for (const m of source.matchAll(regex)) {
    map.set(m[2].trim().toLowerCase(), m[1]);
  }
  return map;
}

function itemToTuple(item) {
  const text = item.item;
  const qty = item.qty ?? 1;
  if (/\(a mesma que acima\)/i.test(text)) {
    return `{ itemId: "${text.replace(/\s*\(a mesma que acima\)/i, '')}", qty: ${qty}, includesChosenTool: true }`;
  }
  return `["${text}", ${qty}]`;
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).backgrounds;
const featByName = mapFeatNameToId();

const entries = extracted.map((bg) => {
  const choiceA = bg.equipment.choiceGroups.find((x) => x.id === 'A') ?? { items: [], gold: 0 };
  const choiceB = bg.equipment.choiceGroups.find((x) => x.id === 'B') ?? { gold: 50 };
  const toolsGranted = bg.toolsGranted.length ? bg.toolsGranted : (bg.grantChoices?.tool ? [`Escolha um tipo de ${bg.grantChoices.tool.options.join(', ')}`] : []);
  const featId = featByName.get((bg.originFeat || '').toLowerCase()) ?? toId(bg.originFeat || 'talento-origem');
  const abilityOptions = (bg.abilityScores || []).map((value) => abilityMap[value]).filter(Boolean);

  return `  makeBackground({
    id: "${bg.id}",
    name: "${bg.name}",
    description: ${JSON.stringify(bg.description)},
    abilityOptions: ${JSON.stringify(abilityOptions)},
    skillsGranted: ${JSON.stringify(bg.skillsGranted || [])},
    toolsGranted: ${JSON.stringify(toolsGranted)},
    languages: [],
    originFeatId: "${featId}",
    equipmentOptionA: {
      items: makeItems([${choiceA.items.map(itemToTuple).join(', ')}]),
      gold: ${choiceA.gold ?? 0},
    },
    equipmentOptionB: { gold: ${choiceB.gold ?? 50} },
  })`;
});

const source = fs.readFileSync(BACKGROUNDS_TS_PATH, 'utf8');
const next = source.replace(/export const backgrounds: Background\[\] = \[[\s\S]*?\];/m, `export const backgrounds: Background[] = [\n${entries.join(',\n')}\n];`);
fs.writeFileSync(BACKGROUNDS_TS_PATH, next);

console.log(`Arquivo atualizado: ${BACKGROUNDS_TS_PATH}`);
