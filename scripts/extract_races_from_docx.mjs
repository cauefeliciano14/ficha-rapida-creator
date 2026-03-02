import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/races_extracted.json');

const raceIdMap = {
  Aasimar: 'aasimar',
  'Anão': 'anao',
  Draconato: 'draconato',
  Elfo: 'elfo',
  Gnomo: 'gnomo',
  Golias: 'golias',
  Humano: 'humano',
  Orc: 'orc',
  Pequenino: 'pequenino',
  Tiferino: 'tiferino',
};

function decodeXml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function readParagraphsFromDocx(docxPath) {
  const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: 'utf8', maxBuffer: 200 * 1024 * 1024 });
  const paragraphs = [];
  const paragraphRegex = /<w:p[\s\S]*?<\/w:p>/g;

  for (const match of xml.matchAll(paragraphRegex)) {
    const p = match[0];
    const textParts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => decodeXml(m[1]));
    if (!textParts.length) continue;
    const text = textParts.join('').trim();
    if (!text) continue;
    paragraphs.push(text);
  }

  return paragraphs;
}

function parseRaceList(paragraph) {
  const listText = paragraph.split(':').slice(1).join(':').trim().replace(/\.$/, '');
  return listText
    .replace(' e ', ', ')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitTraitLine(line) {
  const idx = line.indexOf('. ');
  if (idx === -1) {
    return { name: line.trim(), description: '' };
  }
  return {
    name: line.slice(0, idx).trim(),
    description: line.slice(idx + 2).trim(),
  };
}

function parseRaceBlock(name, blockLines) {
  const traitsHeader = `Traços de ${name}`;
  const traitsStart = blockLines.indexOf(traitsHeader);
  if (traitsStart === -1) throw new Error(`Não encontrou '${traitsHeader}' para ${name}`);

  const descriptionLines = blockLines.slice(0, traitsStart);
  const traitLines = blockLines.slice(traitsStart + 1);

  const creatureType = traitLines.find((l) => l.startsWith('Tipo de Criatura:')) ?? '';
  const size = traitLines.find((l) => l.startsWith('Tamanho:')) ?? '';
  const speed = traitLines.find((l) => l.startsWith('Deslocamento:')) ?? '';

  const abilityLines = traitLines.filter(
    (l) => !l.startsWith('Tipo de Criatura:') && !l.startsWith('Tamanho:') && !l.startsWith('Deslocamento:'),
  );

  const abilities = [];
  for (const line of abilityLines) {
    if (line === 'Legados Ínferos' || line === 'Legado' || line === 'Nível 1' || line === 'Nível 3' || line === 'Nível 5') {
      continue;
    }
    abilities.push(splitTraitLine(line));
  }

  return {
    id: raceIdMap[name] ?? name.toLowerCase(),
    name,
    description: descriptionLines.join('\n\n'),
    traits: {
      creatureType,
      size,
      speed,
    },
    abilities,
    sourceLines: blockLines,
  };
}

function extractRaces(paragraphs) {
  const start = paragraphs.indexOf('Descrições das Espécies');
  if (start === -1) throw new Error('Seção "Descrições das Espécies" não encontrada.');

  const raceListLine = paragraphs[start + 1];
  const raceNames = parseRaceList(raceListLine);
  if (raceNames.length !== 10) throw new Error(`Esperado 10 raças, encontrado ${raceNames.length}.`);

  const raceBlocks = new Map();

  for (let i = 0; i < raceNames.length; i += 1) {
    const name = raceNames[i];
    const headingIndex = paragraphs.indexOf(name, start + 2);
    if (headingIndex === -1) throw new Error(`Título da raça não encontrado: ${name}`);
    const nextHeadingIndex =
      i + 1 < raceNames.length
        ? paragraphs.indexOf(raceNames[i + 1], headingIndex + 1)
        : paragraphs.indexOf('Capítulo 5 - Talentos');

    if (nextHeadingIndex === -1) throw new Error(`Fim do bloco não encontrado para ${name}`);
    const block = paragraphs.slice(headingIndex + 1, nextHeadingIndex);
    raceBlocks.set(name, parseRaceBlock(name, block));
  }

  return raceNames.map((name) => raceBlocks.get(name));
}

const paragraphs = readParagraphsFromDocx(DOCX_PATH);
const races = extractRaces(paragraphs);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify({ source: 'sources/player_handbook_2024.docx', races }, null, 2)}\n`);

console.log(`Extração concluída: ${OUT_PATH}`);
