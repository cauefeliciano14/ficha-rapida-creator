import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/classes_extracted.json');

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

function toId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isClassHeading(p) {
  if (!['Ttulo', 'Ttulo1'].includes(p.style)) return false;
  if (p.text.includes('Capítulo')) return false;
  if (p.text.startsWith('Subclasses de')) return false;
  return /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-Za-zÀ-ÿ ]{2,25}$/.test(p.text);
}

function parseBasicTraits(lines) {
  const labels = {
    'Atributo Primário': 'primaryAbility',
    'Dado de Ponto de Vida': 'hitDie',
    'Proficiência em Salvaguardas': 'savingThrows',
    'Proficiência em Perícias': 'skills',
    'Proficiências com Armas': 'weapons',
    'Treinamento com Armadura': 'armor',
    'Proficiência com Ferramentas': 'tools',
    'Idiomas': 'languages',
    'Equipamento Inicial': 'equipmentRaw',
  };
  const parsed = {
    primaryAbility: '',
    hitDie: '',
    savingThrows: '',
    skills: '',
    armor: '',
    weapons: '',
    tools: '',
    languages: '',
    equipmentRaw: '',
  };

  for (let i = 0; i < lines.length; i += 1) {
    const key = labels[lines[i]];
    if (!key) continue;
    parsed[key] = lines[i + 1] ?? '';
  }
  return parsed;
}

function parseFeatures(section, stopTitles) {
  const featuresByLevel = [];
  for (let i = 0; i < section.length; i += 1) {
    const row = section[i];
    if (stopTitles.some((s) => row.text === s)) break;
    const m = row.style === 'Ttulo3' ? row.text.match(/^Nível\s+(\d+)\s*:\s*(.+)$/) : null;
    if (!m) continue;
    const level = Number(m[1]);
    const name = m[2].trim();
    const descLines = [];
    for (let j = i + 1; j < section.length; j += 1) {
      const t = section[j].text;
      if (section[j].style === 'Ttulo3' && /^Nível\s+\d+\s*:/.test(t)) break;
      if (stopTitles.some((s) => t === s)) break;
      if (section[j].style.startsWith('Ttulo') && !/^Nível\s+\d+\s*:/.test(t)) break;
      descLines.push(t);
    }
    const description = descLines.join('\n\n').trim();
    let block = featuresByLevel.find((f) => f.level === level);
    if (!block) {
      block = { level, features: [] };
      featuresByLevel.push(block);
    }
    block.features.push({ name, description });
  }
  return featuresByLevel.sort((a, b) => a.level - b.level);
}

function extractClasses(paragraphs) {
  const start = paragraphs.findIndex((p) => /Capítulo\s*3.*Classes de Personagens/.test(p.text));
  const end = paragraphs.findIndex((p, i) => i > start && /Capítulo\s*4.*Origens dos Personagens/.test(p.text));
  if (start === -1 || end === -1) throw new Error('Limites de capítulo não encontrados.');

  const chapter = paragraphs.slice(start + 1, end);
  const classIndices = chapter
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => isClassHeading(p))
    .map(({ i }) => i);

  const classes = [];
  for (let c = 0; c < classIndices.length; c += 1) {
    const s = classIndices[c];
    const e = c + 1 < classIndices.length ? classIndices[c + 1] : chapter.length;
    const block = chapter.slice(s, e);
    const name = block[0].text;

    const tornIndex = block.findIndex((p) => p.text.startsWith('Tornando-se um') || p.text.startsWith('Tornando-se uma'));
    const featuresTitleIndex = block.findIndex((p) => /^Características de Classe de\s+/.test(p.text));
    const basicHeaderIndex = block.findIndex((p) => p.text === `Traços Básicos de ${name}`);

    const descriptionStart = basicHeaderIndex >= 0 ? basicHeaderIndex + 1 : 1;
    const descriptionEnd = tornIndex >= 0 ? tornIndex : (featuresTitleIndex >= 0 ? featuresTitleIndex : block.length);
    const descriptionLines = block.slice(descriptionStart, descriptionEnd).map((p) => p.text);

    const basicEndCandidates = [tornIndex, featuresTitleIndex].filter((i) => i >= 0);
    const basicEnd = basicEndCandidates.length ? Math.min(...basicEndCandidates) : descriptionEnd;
    const basicLines = basicHeaderIndex >= 0 ? block.slice(basicHeaderIndex + 1, basicEnd).map((p) => p.text) : [];

    const subclassTitle = `Subclasses de ${name}`;
    const subclassesStart = block.findIndex((p) => p.text === subclassTitle || p.text === `Subclasses de ${name}`);

    const featuresSectionStart = featuresTitleIndex >= 0 ? featuresTitleIndex + 1 : 0;
    const featuresSectionEnd = subclassesStart >= 0 ? subclassesStart : block.length;
    const mainFeatures = parseFeatures(block.slice(featuresSectionStart, featuresSectionEnd), [subclassTitle]);

    const spellFeatures = mainFeatures.filter((lvl) => lvl.features.some((f) => /Conjuração|Magia de Pacto/.test(f.name)));
    const spellcastingRaw = spellFeatures.length
      ? spellFeatures.map((lvl) => lvl.features.map((f) => `Nível ${lvl.level}: ${f.name}\n${f.description}`).join('\n\n')).join('\n\n')
      : null;

    const subclasses = [];
    if (subclassesStart >= 0) {
      const subBlock = block.slice(subclassesStart + 1);
      const subIndices = subBlock
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p.style === 'Ttulo2')
        .map(({ i }) => i);
      for (let i = 0; i < subIndices.length; i += 1) {
        const ss = subIndices[i];
        const se = i + 1 < subIndices.length ? subIndices[i + 1] : subBlock.length;
        const sb = subBlock.slice(ss, se);
        const subName = sb[0].text;
        const subFeatures = parseFeatures(sb.slice(1), []);
        const firstFeatureIdx = sb.findIndex((p) => p.style === 'Ttulo3' && /^Nível\s+\d+\s*:/.test(p.text));
        const subDescription = (firstFeatureIdx === -1 ? sb.slice(1) : sb.slice(1, firstFeatureIdx)).map((p) => p.text).join('\n\n').trim();
        subclasses.push({
          name: subName,
          description: subDescription,
          featuresByLevelParsed: subFeatures,
        });
      }
    }

    classes.push({
      name,
      description: descriptionLines.join('\n\n').trim(),
      basicTraitsRaw: basicLines.join('\n\n').trim(),
      basicTraitsParsed: parseBasicTraits(basicLines),
      spellcastingRaw,
      spellcastingParsed: null,
      featuresByLevelRaw: mainFeatures.map((f) => ({
        level: f.level,
        raw: f.features.map((x) => `${x.name}\n${x.description}`).join('\n\n'),
      })),
      featuresByLevelParsed: mainFeatures,
      subclasses,
      id: toId(name),
    });
  }

  if (classes.length !== 12) {
    throw new Error(`Esperado extrair 12 classes, encontrado ${classes.length}.`);
  }

  return classes;
}

if (!fs.existsSync(DOCX_PATH)) throw new Error('DOCX não encontrado em sources/player_handbook_2024.docx');
const paragraphs = readDocxParagraphs(DOCX_PATH);
const classes = extractClasses(paragraphs);
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify({ source: 'sources/player_handbook_2024.docx', classes }, null, 2)}\n`);
console.log(`Extração concluída: ${OUT_PATH}`);
