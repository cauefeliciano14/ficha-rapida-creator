import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/items_extracted.json');

function decodeXml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function readDocxLines(docxPath) {
  const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: 'utf8', maxBuffer: 250 * 1024 * 1024 });
  const lines = [];
  for (const match of xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)) {
    const p = match[0];
    const textParts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => decodeXml(m[1]));
    if (!textParts.length) continue;
    const text = textParts.join('').replace(/\s+/g, ' ').trim();
    if (text) lines.push(text);
  }
  return lines;
}

function normalizeName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function parseItemsFromData() {
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

function extractItems(lines, catalog) {
  const chapterStart = lines.findIndex((l) => l === 'Capítulo 6 - Equipamento');
  const chapterEnd = lines.findIndex((l, i) => i > chapterStart && l === 'Capítulo 7 - Magias');
  if (chapterStart === -1 || chapterEnd === -1) throw new Error('Não foi possível localizar o capítulo de equipamentos.');

  const chapter = lines.slice(chapterStart, chapterEnd);
  const byNorm = new Map();

  for (let i = 0; i < chapter.length; i += 1) {
    const line = chapter[i];
    if (!/\b(PO|PP|PC|PL)\b/.test(line)) continue;
    const weight = chapter[i - 1] ?? '';
    const name = chapter[i - 5] ?? '';
    const properties = chapter[i - 3] ?? '';
    if (!name || /^(Nome|Armadura|Moeda|Dano|Peso|Custo|Propriedades|Maestria|—)$/.test(name)) continue;
    byNorm.set(normalizeName(name), {
      name,
      costText: line,
      weightText: weight,
      properties,
      rawText: [name, properties, weight, line].join(' | '),
    });
  }

  return catalog.map((item) => {
    const fromDoc = byNorm.get(normalizeName(item.name));
    return {
      name: item.name,
      type: item.type,
      cost: item.cost.gp,
      weight: item.weight,
      properties: item.properties ?? null,
      rawText: fromDoc?.rawText ?? null,
      extractedName: fromDoc?.name ?? null,
      extractedCostText: fromDoc?.costText ?? null,
      extractedWeightText: fromDoc?.weightText ?? null,
      extractedProperties: fromDoc?.properties ?? null,
    };
  });
}

if (!fs.existsSync(DOCX_PATH)) throw new Error('DOCX não encontrado em sources/player_handbook_2024.docx');
const lines = readDocxLines(DOCX_PATH);
const catalog = parseItemsFromData();
const items = extractItems(lines, catalog);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify({ source: 'sources/player_handbook_2024.docx', items }, null, 2)}\n`);
console.log(`Extração concluída: ${OUT_PATH} (${items.length} itens)`);
