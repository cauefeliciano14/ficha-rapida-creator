import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execSync } from 'node:child_process';

const EXTRACTED_PATH = path.resolve('scripts/out/races_extracted.json');
const RACES_TS_PATH = path.resolve('src/data/races.ts');
const AUDIT_PATH = path.resolve('docs/races_audit.md');

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

function parseTsRaces() {
  const src = fs.readFileSync(RACES_TS_PATH, 'utf8');
  const m = src.match(/export const races: RaceData\[\] = (\[[\s\S]*?\n\]);/);
  if (!m) throw new Error('Array races não encontrado em races.ts');
  const script = `const PHB2024={sourceId:'player_handbook_2024',page:0}; const EMPTY_PROF={skills:[],tools:[],weapons:[],armor:[]}; races=${m[1]};`;
  const context = { races: [] };
  vm.createContext(context);
  vm.runInContext(script, context);
  return context.races;
}

function normalizeExtracted(extractedRace) {
  const traits = [];
  if (extractedRace.traits.creatureType) traits.push({ name: 'Tipo de Criatura', description: extractedRace.traits.creatureType.replace('Tipo de Criatura: ', '') });
  if (extractedRace.traits.size) traits.push({ name: 'Tamanho', description: extractedRace.traits.size.replace('Tamanho: ', '') });
  if (extractedRace.traits.speed) traits.push({ name: 'Deslocamento', description: extractedRace.traits.speed.replace('Deslocamento: ', '') });
  for (const ability of extractedRace.abilities) traits.push({ name: ability.name, description: ability.description });
  return { name: extractedRace.name, description: extractedRace.description, traits };
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).races;
const racesTs = parseTsRaces();
const errors = [];
const report = [];

if (racesTs.length !== 10) errors.push(`races.ts possui ${racesTs.length} raças (esperado 10).`);

for (const exRace of extracted) {
  const expected = normalizeExtracted(exRace);
  const actual = racesTs.find((r) => r.name === expected.name);
  if (!actual) {
    errors.push(`Raça ausente: ${expected.name}`);
    continue;
  }

  const checks = { description: 'OK', traits: 'OK' };
  if (actual.description !== expected.description) {
    checks.description = 'DIVERGENTE';
    errors.push(`Descrição divergente em ${expected.name}`);
  }

  if (actual.traits.length !== expected.traits.length) {
    checks.traits = 'DIVERGENTE';
    errors.push(`Quantidade de traços divergente em ${expected.name}: ${actual.traits.length} vs ${expected.traits.length}`);
  }

  const min = Math.min(actual.traits.length, expected.traits.length);
  for (let i = 0; i < min; i += 1) {
    if (actual.traits[i].name !== expected.traits[i].name || actual.traits[i].description !== expected.traits[i].description) {
      checks.traits = 'DIVERGENTE';
      errors.push(`Traço divergente em ${expected.name} [${i + 1}]`);
    }
  }

  report.push({ race: expected.name, abilities: exRace.abilities.length, checks });
}

let md = '# Auditoria de Raças\n\n';
md += `- Fonte: \`sources/player_handbook_2024.docx\`\n`;
md += `- Total de raças em \`races.ts\`: ${racesTs.length}\n\n`;
md += '| Raça | Habilidades (DOCX) | Descrição | Traços/Habilidades |\n';
md += '|---|---:|---|---|\n';
for (const row of report) {
  md += `| ${row.race} | ${row.abilities} | ${row.checks.description} | ${row.checks.traits} |\n`;
}
if (errors.length) {
  md += '\n## Divergências\n';
  for (const err of errors) md += `- ${err}\n`;
}
fs.writeFileSync(AUDIT_PATH, md);

if (errors.length) {
  console.error(`Validação falhou com ${errors.length} divergência(s).`);
  process.exit(1);
}

console.log('Validação concluída com sucesso.');
