import fs from 'node:fs';
import path from 'node:path';

const EXTRACTED_PATH = path.resolve('scripts/out/feats_extracted.json');
const FEATS_TS_PATH = path.resolve('src/data/feats.ts');

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseFeatsTs(content) {
  const objects = [...content.matchAll(/\{[\s\S]*?\n\s*\},/g)].map((m) => m[0]);
  const feats = [];
  for (const block of objects) {
    const id = block.match(/\bid:\s*"([^"]+)"/)?.[1];
    const name = block.match(/\bname:\s*"([^"]+)"/)?.[1];
    const type = block.match(/\btype:\s*"([^"]+)"/)?.[1];
    if (!id || !name || !type) continue;
    feats.push({ id, name, type });
  }
  return feats;
}

if (!fs.existsSync(EXTRACTED_PATH)) {
  throw new Error('Arquivo scripts/out/feats_extracted.json não encontrado. Rode npm run extract:feats antes da validação.');
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8'));
const featsTs = parseFeatsTs(fs.readFileSync(FEATS_TS_PATH, 'utf8'));

const extractedById = new Map(extracted.feats.map((f) => [f.id, f]));
const extractedByNameKey = new Map(extracted.feats.map((f) => [normalize(f.name), f]));

const missingInTs = [];
const categoryMismatches = [];

for (const feat of extracted.feats) {
  const byName = featsTs.find((f) => normalize(f.name) === normalize(feat.name));
  if (!byName) {
    missingInTs.push(feat.name);
    continue;
  }

  const expectedType = feat.category === 'origin'
    ? 'origin'
    : feat.category === 'general' || feat.category === 'fighting_style'
      ? 'general'
      : feat.category === 'epic_boon'
        ? 'epic'
        : null;

  if (expectedType && byName.type !== expectedType) {
    categoryMismatches.push({ name: feat.name, extractedCategory: feat.category, featsType: byName.type });
  }
}

const missingInExtracted = featsTs
  .filter((f) => !extractedByNameKey.has(normalize(f.name)))
  .map((f) => f.name);

const summary = {
  extractedCount: extracted.feats.length,
  featsTsCount: featsTs.length,
  missingInFeatsTs: missingInTs,
  missingInExtracted,
  categoryMismatches,
};

console.log(JSON.stringify(summary, null, 2));

if (missingInTs.length || missingInExtracted.length || categoryMismatches.length) {
  process.exitCode = 1;
} else {
  console.log('Validação concluída sem divergências.');
}
