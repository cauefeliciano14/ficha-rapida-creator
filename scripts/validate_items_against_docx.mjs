import fs from 'node:fs';
import path from 'node:path';

const EXTRACTED_PATH = path.resolve('scripts/out/items_extracted.json');

function normalizeName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function parseItemsFromTs() {
  const src = fs.readFileSync(path.resolve('src/data/items.ts'), 'utf8');
  const start = src.indexOf('export const items: Item[] = ');
  const end = src.indexOf('/** Lookup map for quick access */');
  if (start === -1 || end === -1) throw new Error('Array items não encontrado em src/data/items.ts');
  const expr = src
    .slice(start + 'export const items: Item[] = '.length, end)
    .trim()
    .replace(/;+\s*$/, '')
    .replace(/\s+as Item\[\]/g, '');
  // eslint-disable-next-line no-new-func
  return Function(`return (${expr});`)();
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).items;
const actual = parseItemsFromTs();
const errors = [];
const warnings = [];

const extractedByName = new Map();
for (const item of extracted) {
  const key = normalizeName(item.name);
  const list = extractedByName.get(key) ?? [];
  list.push(item);
  extractedByName.set(key, list);
}

for (const item of actual) {
  const matches = extractedByName.get(normalizeName(item.name)) ?? [];
  if (matches.length > 1) {
    warnings.push(`Item com nome ambíguo no DOCX (ignorado): ${item.name}`);
    continue;
  }
  const ex = matches[0];
  if (!ex) {
    warnings.push(`Item sem correspondência no DOCX: ${item.name}`);
    continue;
  }
  if (ex.type !== item.type) errors.push(`[${item.name}] tipo divergente: extraído=${ex.type} atual=${item.type}`);
  if (ex.cost !== item.cost.gp) errors.push(`[${item.name}] custo divergente: extraído=${ex.cost} atual=${item.cost.gp}`);
  if (ex.weight !== item.weight) errors.push(`[${item.name}] peso divergente: extraído=${ex.weight} atual=${item.weight}`);
}

if (warnings.length) {
  console.warn(`Avisos (${warnings.length}):`);
  for (const w of warnings.slice(0, 20)) console.warn(`- ${w}`);
}

if (errors.length) {
  console.error(`Validação de itens falhou com ${errors.length} divergência(s).`);
  for (const e of errors.slice(0, 30)) console.error(`- ${e}`);
  process.exit(1);
}

console.log('Validação de itens concluída com sucesso.');
