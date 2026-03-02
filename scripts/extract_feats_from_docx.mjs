import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/feats_extracted.json');

function decodeXml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function cleanText(text) {
  return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function toId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function readDocxParagraphs(docxPath) {
  const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: 'utf8', maxBuffer: 250 * 1024 * 1024 });
  const paragraphs = [];

  for (const match of xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)) {
    const p = match[0];
    const textParts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => decodeXml(m[1]));
    if (!textParts.length) continue;
    const text = cleanText(textParts.join(''));
    if (!text) continue;
    const styleMatch = p.match(/<w:pStyle w:val="([^"]+)"/);
    paragraphs.push({ text, style: styleMatch?.[1] ?? '' });
  }

  return paragraphs;
}

function inferCategory(sectionTitle) {
  if (/Origem/i.test(sectionTitle)) return 'origin';
  if (/Gerais/i.test(sectionTitle)) return 'general';
  if (/Estilo de Luta/i.test(sectionTitle)) return 'fighting_style';
  if (/Dádiva Épica/i.test(sectionTitle)) return 'epic_boon';
  return 'unknown';
}

function parsePrerequisites(prereqRaw) {
  if (!prereqRaw) return { raw: '', structured: {} };

  const text = prereqRaw.trim();
  const structured = {
    levelMin: null,
    classes: [],
    abilityMinimums: [],
    proficiencies: [],
    spellcasting: false,
    other: [],
  };

  for (const match of text.matchAll(/Nível\s+(\d+)\s+ou\s+superior/gi)) {
    const level = Number(match[1]);
    structured.levelMin = structured.levelMin == null ? level : Math.max(structured.levelMin, level);
  }

  for (const match of text.matchAll(/(Força|Destreza|Constituição|Inteligência|Sabedoria|Carisma)\s+(\d+)\s+ou\s+superior/gi)) {
    structured.abilityMinimums.push({ ability: match[1], min: Number(match[2]) });
  }

  if (/Conjuração|Magia de Pacto/i.test(text)) {
    structured.spellcasting = true;
  }

  const classNames = ['Bárbaro', 'Bardo', 'Bruxo', 'Clérigo', 'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino', 'Mago', 'Monge', 'Paladino', 'Patrulheiro'];
  for (const className of classNames) {
    if (new RegExp(`\\b${className}\\b`, 'i').test(text)) {
      structured.classes.push(className);
    }
  }

  const proficiencyTokens = ['Proficiência em Armas Marciais', 'Proficiência com Escudos', 'Proficiência com Armadura Leve', 'Proficiência com Armadura Média', 'Proficiência com Armadura Pesada'];
  for (const token of proficiencyTokens) {
    if (text.includes(token)) structured.proficiencies.push(token);
  }

  const consumed = [
    /Nível\s+\d+\s+ou\s+superior/gi,
    /(Força|Destreza|Constituição|Inteligência|Sabedoria|Carisma)\s+\d+\s+ou\s+superior/gi,
    /Característica\s+Conjuração/gi,
    /Magia\s+de\s+Pacto/gi,
    /Conjuração/gi,
    /Proficiência\s+em\s+Armas\s+Marciais/gi,
    /Proficiência\s+com\s+Escudos/gi,
    /Proficiência\s+com\s+Armadura\s+Leve/gi,
    /Proficiência\s+com\s+Armadura\s+Média/gi,
    /Proficiência\s+com\s+Armadura\s+Pesada/gi,
    ...classNames.map((n) => new RegExp(`\\b${n}\\b`, 'gi')),
  ];

  const residual = consumed.reduce((acc, rx) => acc.replace(rx, ''), text).replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim();
  if (residual && residual !== 'ou' && residual !== 'de') structured.other.push(residual);

  return { raw: text, structured };
}

function parseEffects(lines) {
  const effects = {
    abilityBonuses: [],
    flags: {},
    raw: [],
  };

  for (const line of lines) {
    if (/^Você adquire os seguintes benefícios\.?$/i.test(line)) continue;

    const abilityMatch = line.match(/Aumento no Valor de Atributo\.\s*Aumente seu valor de\s+(.+?)\s+em\s+(\d+)/i);
    if (abilityMatch) {
      const abilities = abilityMatch[1]
        .split(/,| ou /i)
        .map((item) => item.trim())
        .filter(Boolean);
      effects.abilityBonuses.push({ abilities, amount: Number(abilityMatch[2]), raw: line });
      continue;
    }

    if (/^Repetível\./i.test(line)) {
      effects.flags.repeatable = true;
      effects.raw.push(line);
      continue;
    }

    if (/Vantagem em testes de resistência de Constituição para manter concentração/i.test(line)) {
      effects.flags.concentrationAdvantage = true;
    }
    if (/\+\d+ de bônus em Iniciativa|bônus em Iniciativa/i.test(line)) {
      effects.flags.initiativeBonus = true;
    }
    if (/PV temporários|Pontos de Vida temporários/i.test(line)) {
      effects.flags.grantsTempHp = true;
    }

    effects.raw.push(line);
  }

  return effects;
}

function extractFeats(paragraphs) {
  const chapterStart = paragraphs.findIndex((p) => /Capítulo\s*5\s*-\s*Talentos/.test(p.text));
  const chapterEnd = paragraphs.findIndex((p, i) => i > chapterStart && /Capítulo\s*6\s*-/.test(p.text));
  if (chapterStart === -1 || chapterEnd === -1) {
    throw new Error('Não foi possível localizar os limites do capítulo de talentos no DOCX.');
  }

  const chapter = paragraphs.slice(chapterStart + 1, chapterEnd);
  const sections = chapter
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.style === 'Ttulo2' && /^Talentos de|^Talentos Gerais|^Talentos de Dádiva Épica/.test(p.text));

  const feats = [];

  for (let s = 0; s < sections.length; s += 1) {
    const sectionStart = sections[s].i;
    const sectionEnd = s + 1 < sections.length ? sections[s + 1].i : chapter.length;
    const sectionTitle = sections[s].p.text;
    const category = inferCategory(sectionTitle);
    const block = chapter.slice(sectionStart + 1, sectionEnd);

    const featIndices = block.map((p, i) => ({ p, i })).filter(({ p }) => p.style === 'Ttulo3').map(({ i }) => i);
    for (let i = 0; i < featIndices.length; i += 1) {
      const featStart = featIndices[i];
      const featEnd = i + 1 < featIndices.length ? featIndices[i + 1] : block.length;
      const featBlock = block.slice(featStart, featEnd);
      const name = featBlock[0]?.text?.trim();
      if (!name) continue;

      const infoLine = featBlock[1]?.text ?? '';
      const prereqMatch = infoLine.match(/Pré-requisito[s]?:\s*([^)]+)\)/i);
      const prereqRaw = prereqMatch ? prereqMatch[1].trim() : '';
      const bodyLines = featBlock.slice(2).map((p) => p.text).filter(Boolean);

      const description = bodyLines.join('\n\n').trim();
      feats.push({
        id: toId(name),
        name,
        category,
        categoryLabel: sectionTitle,
        header: infoLine,
        prerequisites: parsePrerequisites(prereqRaw),
        effects: parseEffects(bodyLines),
        description,
      });
    }
  }

  return feats;
}

if (!fs.existsSync(DOCX_PATH)) throw new Error('DOCX não encontrado em sources/player_handbook_2024.docx');

const paragraphs = readDocxParagraphs(DOCX_PATH);
const feats = extractFeats(paragraphs);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify({ source: 'sources/player_handbook_2024.docx', extractedAt: new Date().toISOString(), feats }, null, 2)}\n`);
console.log(`Extração concluída: ${OUT_PATH} (${feats.length} talentos)`);
