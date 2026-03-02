import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/choice_requirements_extracted.json');

const PLACEHOLDER_RX = /\b([àa]\s+sua\s+escolha|pendente|escolha)\b/i;
const NUMBER_WORDS = new Map([
  ['um', 1], ['uma', 1], ['dois', 2], ['duas', 2], ['três', 3], ['tres', 3], ['quatro', 4], ['cinco', 5],
]);

function decodeXml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function slugify(s) {
  return normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function countChoicesFromText(text) {
  const match = text.match(/\b(um|uma|dois|duas|tr[eê]s|quatro|cinco)\b/i)?.[1]?.toLowerCase();
  return NUMBER_WORDS.get(match ?? 'um') ?? 1;
}

function readParagraphsFromDocx(docxPath) {
  const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: 'utf8', maxBuffer: 200 * 1024 * 1024 });
  const paragraphs = [];
  for (const match of xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)) {
    const p = match[0];
    const textParts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => decodeXml(m[1]));
    if (!textParts.length) continue;
    const text = textParts.join('').trim();
    if (text) paragraphs.push(text);
  }
  return paragraphs;
}

function parseIdNamePairs(tsPath) {
  const src = fs.readFileSync(tsPath, 'utf8');
  const pairs = [];
  const rx = /id:\s*"([^"]+)"[\s\S]{0,120}?name:\s*"([^"]+)"/g;
  for (const m of src.matchAll(rx)) {
    pairs.push({ id: m[1], name: m[2] });
  }
  return pairs;
}

function chapterIndex(paragraphs, startsWithText, fallback = 0, startAfter = 0) {
  const idx = paragraphs.findIndex((p, i) => i >= startAfter && normalize(p).startsWith(normalize(startsWithText)));
  return idx >= 0 ? idx : fallback;
}

function sourceBlocks(paragraphs, sources, fromIdx, toIdx) {
  const headings = sources
    .map((s) => ({ ...s, idx: paragraphs.findIndex((p, i) => i >= fromIdx && i < toIdx && normalize(p) === normalize(s.name)) }))
    .filter((s) => s.idx >= 0)
    .sort((a, b) => a.idx - b.idx);

  const blocks = [];
  for (let i = 0; i < headings.length; i += 1) {
    const current = headings[i];
    const end = i + 1 < headings.length ? headings[i + 1].idx : toIdx;
    blocks.push({ source: current.source, lines: paragraphs.slice(current.idx + 1, end) });
  }
  return blocks;
}

function extractOptions(line) {
  const afterColon = line.includes(':') ? line.split(':').slice(1).join(':') : '';
  const listText = afterColon || (line.includes('entre ') ? line.split(/entre /i)[1] : '');
  if (!listText) return undefined;
  const clean = listText.replace(/\.$/, '').replace(/\be\b/gi, ',');
  const parts = clean.split(',').map((p) => p.trim()).filter((p) => p.length > 1);
  return parts.length > 1 ? parts : undefined;
}

function classifyKind(line) {
  const n = normalize(line);
  if (/pericia/.test(n) && PLACEHOLDER_RX.test(n)) return 'skills';
  if (/idioma/.test(n) && PLACEHOLDER_RX.test(n)) return 'languages';
  if (/instrumento/.test(n) && PLACEHOLDER_RX.test(n)) return 'instruments';
  if (/(ferramenta|jogo)/.test(n) && /escolha|pendente/.test(n) && !/instrumento/.test(n)) return 'tools';
  if (/talento/.test(n) && PLACEHOLDER_RX.test(n)) return 'feats';
  if (/truque/.test(n) && /escolha|aprende|conhece/.test(n)) return 'cantrips';
  if (/magia/.test(n) && /escolha|aprende|conhece|prepara/.test(n)) return 'spells';
  if (/equipamento|itens?/.test(n) && /escolha|opcao|opção/.test(n)) return 'equipment';
  return null;
}

function extractRequirementsFromBlocks(blocks) {
  const records = [];
  for (const block of blocks) {
    for (const line of block.lines) {
      const kind = classifyKind(line);
      if (!kind) continue;
      const requiredCount = countChoicesFromText(line);
      records.push({
        source: block.source,
        kind,
        requiredCount,
        options: extractOptions(line),
        rawEvidence: line,
      });
    }
  }
  const merged = new Map();
  for (const row of records) {
    const key = `${row.source}::${row.kind}::${row.rawEvidence}`;
    if (!merged.has(key)) merged.set(key, row);
  }
  return [...merged.values()].sort((a, b) => a.source.localeCompare(b.source, 'pt-BR') || a.kind.localeCompare(b.kind, 'pt-BR'));
}

const paragraphs = readParagraphsFromDocx(DOCX_PATH);
const classDefs = JSON.parse(fs.readFileSync(path.resolve('scripts/out/classes_extracted.json'), 'utf8')).classes
  .map((v) => ({ id: v.id, name: v.name, source: `class:${v.id}` }));
const backgroundDefs = parseIdNamePairs(path.resolve('src/data/backgrounds.ts')).map((v) => ({ ...v, source: `background:${v.id}` }));
const raceDefs = JSON.parse(fs.readFileSync(path.resolve('scripts/out/races_extracted.json'), 'utf8')).races
  .map((v) => ({ id: v.id, name: v.name, source: `race:${v.id}` }));

const classesStart = chapterIndex(paragraphs, 'Capítulo 3 - Classes de Personagens');
const originsStart = chapterIndex(paragraphs, 'Capítulo 4', classesStart, classesStart + 1);
const featsStart = chapterIndex(paragraphs, 'Capítulo 5', originsStart + 1, originsStart + 1);

const classBlocks = sourceBlocks(paragraphs, classDefs, classesStart, originsStart);
const backgroundBlocks = sourceBlocks(paragraphs, backgroundDefs, originsStart, featsStart);
const raceBlocks = sourceBlocks(paragraphs, raceDefs, originsStart, featsStart);

const requirements = extractRequirementsFromBlocks([...classBlocks, ...backgroundBlocks, ...raceBlocks]);

const payload = {
  sourceDocx: path.relative(process.cwd(), DOCX_PATH),
  extractedAt: new Date().toISOString(),
  totalRequirements: requirements.length,
  requirements,
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Extração concluída: ${OUT_PATH} (${requirements.length} requisitos).`);
