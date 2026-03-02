import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/backgrounds_extracted.json');

function decodeXml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function readParagraphsFromDocx(docxPath) {
  const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: 'utf8', maxBuffer: 250 * 1024 * 1024 });
  const paragraphs = [];

  for (const match of xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)) {
    const p = match[0];
    const textParts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => decodeXml(m[1]));
    if (!textParts.length) continue;
    const text = textParts.join('').trim();
    if (!text) continue;
    paragraphs.push(text);
  }

  return paragraphs;
}

function toId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseCsvList(text) {
  return text
    .replace(/\.$/, '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseGrantChoices(text) {
  const cleaned = text.replace(/\.$/, '').trim();
  const choiceMatch = cleaned.match(/^Escolha\s+(?:um|uma)\s+tipo\s+de\s+(.+?)(?:\s*\((?:veja|consulte).+\))?$/i);
  if (!choiceMatch) return null;

  const option = choiceMatch[1].trim();
  return {
    requiredCount: 1,
    options: [option],
  };
}

function parseEquipmentLine(line) {
  const aMatch = line.match(/\(A\)\s*([\s\S]*?)\s*;\s*ou\s*\(B\)/i);
  const bMatch = line.match(/\(B\)\s*([\s\S]*?)$/i);
  if (!aMatch || !bMatch) {
    return { raw: line, fixed: [], choiceGroups: [] };
  }

  const aText = aMatch[1].trim();
  const bText = bMatch[1].trim();

  const splitGold = (txt) => {
    const m = txt.match(/([\d]+)\s*PO\.?$/i);
    if (!m) return { itemsText: txt, gold: null };
    const gold = Number(m[1]);
    const itemsText = txt.slice(0, m.index).replace(/,\s*$/, '').trim();
    return { itemsText, gold };
  };

  const optionA = splitGold(aText);
  const optionB = splitGold(bText);

  const parseItems = (itemsText) =>
    itemsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const qtyMatch = item.match(/^(\d+)\s+(.+)$/);
        if (!qtyMatch) return { item, qty: 1 };
        return { item: qtyMatch[2].trim(), qty: Number(qtyMatch[1]) };
      });

  return {
    raw: line,
    fixed: optionA.itemsText ? parseItems(optionA.itemsText) : [],
    choiceGroups: [
      { id: 'A', items: optionA.itemsText ? parseItems(optionA.itemsText) : [], gold: optionA.gold },
      { id: 'B', items: [], gold: optionB.gold },
    ],
  };
}

function extractBackgrounds(paragraphs) {
  const sectionStart = paragraphs.indexOf('Descrições dos Antecedentes');
  if (sectionStart === -1) throw new Error('Seção "Descrições dos Antecedentes" não encontrada.');

  const sectionEnd = paragraphs.indexOf('Descrições das Espécies');
  if (sectionEnd === -1 || sectionEnd <= sectionStart) throw new Error('Fim da seção de antecedentes não encontrado.');

  const chapter = paragraphs.slice(sectionStart, sectionEnd);
  const listStart = chapter.indexOf('Dezesseis antecedentes são apresentados nesta seção em ordem alfabética:');
  if (listStart === -1) throw new Error('Lista de antecedentes não encontrada.');

  const backgroundNames = chapter.slice(listStart + 1, listStart + 17);
  if (backgroundNames.length !== 16) throw new Error(`Esperado 16 antecedentes, encontrado ${backgroundNames.length}.`);

  const blocks = [];
  for (let i = 0; i < backgroundNames.length; i += 1) {
    const name = backgroundNames[i];
    const start = chapter.indexOf(name, listStart + 17);
    if (start === -1) throw new Error(`Bloco não encontrado para antecedente: ${name}`);
    const nextName = backgroundNames[i + 1];
    const end = nextName ? chapter.indexOf(nextName, start + 1) : chapter.length;
    if (end === -1) throw new Error(`Fim do bloco não encontrado para antecedente: ${name}`);
    const block = chapter.slice(start + 1, end);

    const abilitiesLine = block.find((l) => l.startsWith('Valores de Atributo:')) ?? '';
    const featLine = block.find((l) => l.startsWith('Talento:')) ?? '';
    const skillsLine = block.find((l) => l.startsWith('Proficiência em Perícia:') || l.startsWith('Proficiências em Perícias:') || l.startsWith('Proficiência em Perícias:')) ?? '';
    const toolsLine = block.find((l) => l.startsWith('Proficiência com Ferramentas:')) ?? '';
    const equipmentLine = block.find((l) => l.startsWith('Equipamento:')) ?? '';

    const markerLines = [abilitiesLine, featLine, skillsLine, toolsLine, equipmentLine].filter(Boolean);
    const descriptionLines = block.filter((l) => !markerLines.includes(l));

    const toolsRaw = toolsLine.replace('Proficiência com Ferramentas:', '').trim();

    blocks.push({
      id: toId(name),
      name,
      description: descriptionLines.join('\n\n').trim(),
      abilityScores: parseCsvList(abilitiesLine.replace('Valores de Atributo:', '').trim()),
      originFeat: featLine.replace('Talento:', '').replace(/\(veja o capítulo 5\)/i, '').trim(),
      skillsGranted: parseCsvList(skillsLine.replace(/^Profici[êe]ncias? em Per[íi]cias?:/i, '').trim()),
      toolsGranted: toolsRaw && !toolsRaw.startsWith('Escolha ') ? parseCsvList(toolsRaw) : [],
      grantChoices: {
        language: null,
        tool: parseGrantChoices(toolsRaw),
        instrument: /Instrumento Musical/i.test(toolsRaw) ? parseGrantChoices(toolsRaw) : null,
      },
      equipment: parseEquipmentLine(equipmentLine.replace('Equipamento:', '').trim()),
      sourceLines: block,
    });
  }

  return blocks;
}

if (!fs.existsSync(DOCX_PATH)) throw new Error('DOCX não encontrado em sources/player_handbook_2024.docx');
const paragraphs = readParagraphsFromDocx(DOCX_PATH);
const backgrounds = extractBackgrounds(paragraphs);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify({ source: 'sources/player_handbook_2024.docx', backgrounds }, null, 2)}\n`);

console.log(`Extração concluída: ${OUT_PATH}`);
