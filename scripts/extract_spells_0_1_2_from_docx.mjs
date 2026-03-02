import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/spells_extracted.json');

function decodeXml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function toId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function readParagraphsFromDocx(docxPath) {
  const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: 'utf8', maxBuffer: 300 * 1024 * 1024 });
  const paragraphs = [];

  for (const match of xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)) {
    const p = match[0];
    const textParts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => decodeXml(m[1]));
    if (!textParts.length) continue;
    const text = textParts.join('').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    paragraphs.push(text);
  }

  return paragraphs;
}

const META_RE = /^(?:(Truque) de ([^(]+)|([12])º Círculo, ([^(]+))\s*\(([^)]+)\)\s*$/i;

function parseSpells(paragraphs) {
  const chapterIdx = paragraphs.findIndex((line) => /^Cap[íi]tulo\s*7\s*[-–]\s*Magias/i.test(line));
  const lines = chapterIdx >= 0 ? paragraphs.slice(chapterIdx) : paragraphs;

  const spells = [];
  const seen = new Map();

  for (let i = 0; i < lines.length - 6; i += 1) {
    const name = lines[i];
    const metaLine = lines[i + 1];
    const meta = META_RE.exec(metaLine);
    if (!meta) continue;

    if (!/^Tempo de Conjuração:/i.test(lines[i + 2])) continue;
    if (!/^Alcance:/i.test(lines[i + 3])) continue;
    if (!/^Componentes?:/i.test(lines[i + 4])) continue;
    if (!/^Duração:/i.test(lines[i + 5])) continue;

    const isCantrip = Boolean(meta[1]);
    const level = isCantrip ? 0 : Number(meta[3]);
    if (![0, 1, 2].includes(level)) continue;

    const school = (isCantrip ? meta[2] : meta[4]).trim();
    const classes = (meta[5] || '').split(',').map((x) => x.trim()).filter(Boolean);
    const castingTime = lines[i + 2].replace(/^Tempo de Conjuração:\s*/i, '').trim();
    const range = lines[i + 3].replace(/^Alcance:\s*/i, '').trim();
    const components = lines[i + 4].replace(/^Componentes?:\s*/i, '').trim();
    const duration = lines[i + 5].replace(/^Duração:\s*/i, '').trim();

    let j = i + 6;
    const descLines = [];
    while (j < lines.length - 1) {
      const maybeName = lines[j];
      const maybeMeta = lines[j + 1];
      const looksLikeNextSpell = META_RE.test(maybeMeta) && !/:/.test(maybeName) && maybeName.length < 120;
      if (looksLikeNextSpell) break;
      descLines.push(lines[j]);
      j += 1;
    }

    const description = descLines.join('\n').trim();
    let id = toId(name);
    const count = (seen.get(id) || 0) + 1;
    seen.set(id, count);
    if (count > 1) id = `${id}-${count}`;

    spells.push({
      id,
      name,
      level,
      school,
      ritual: /\britual\b/i.test(castingTime),
      concentration: /concentra/i.test(duration),
      castingTime,
      range,
      components,
      duration,
      classes,
      description,
      source: { book: 'PHB 2024', page: 0 },
    });
  }

  return spells.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

if (!fs.existsSync(DOCX_PATH)) throw new Error('DOCX não encontrado em sources/player_handbook_2024.docx');
const paragraphs = readParagraphsFromDocx(DOCX_PATH);
const spells = parseSpells(paragraphs);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify({ source: 'sources/player_handbook_2024.docx', spells }, null, 2)}\n`);

console.log(`Extração concluída: ${OUT_PATH} (${spells.length} magias de nível 0-2)`);
