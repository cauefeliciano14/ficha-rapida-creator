import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const EXTRACTED_PATH = path.resolve('scripts/out/classes_extracted.json');
const CLASSES_TS_PATH = path.resolve('src/data/classes.ts');
const AUDIT_PATH = path.resolve('docs/classes_audit.md');

function parseTsClasses() {
  const src = fs.readFileSync(CLASSES_TS_PATH, 'utf8');
  const m = src.match(/export const classes: ClassData\[\] = ([\s\S]*);\s*$/);
  if (!m) throw new Error('Array classes não encontrado em classes.ts');
  const script = `classes=${m[1]};`;
  const context = { classes: [] };
  vm.createContext(context);
  vm.runInContext(script, context);
  return context.classes;
}

function diffLine(a, b) {
  const as = (a || '').split('\n');
  const bs = (b || '').split('\n');
  for (let i = 0; i < Math.max(as.length, bs.length); i += 1) {
    if (as[i] !== bs[i]) return `linha ${i + 1}: esperado='${as[i] || ''}' atual='${bs[i] || ''}'`;
  }
  return 'sem diff';
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).classes;
const actual = parseTsClasses();
const errors = [];
const rows = [];

if (actual.length !== 12) errors.push(`classes.ts possui ${actual.length} classes (esperado 12).`);

for (const ex of extracted) {
  const ac = actual.find((c) => c.name === ex.name);
  if (!ac) {
    errors.push(`Classe ausente: ${ex.name}`);
    continue;
  }

  const status = { description: 'OK', basicTraits: 'OK', spellcasting: 'OK', features: 'OK' };

  if (ac.description !== ex.description) {
    status.description = 'FAIL';
    errors.push(`[${ex.name}] descrição divergente: ${diffLine(ex.description, ac.description)}`);
  }

  if ((ac.textBlocks?.basicTraits ?? '') !== ex.basicTraitsRaw) {
    status.basicTraits = 'FAIL';
    errors.push(`[${ex.name}] Traços Básicos divergente: ${diffLine(ex.basicTraitsRaw, ac.textBlocks?.basicTraits ?? '')}`);
  }

  const expectedSpell = ex.spellcastingRaw ?? null;
  const actualSpell = ac.textBlocks?.spellcasting ?? null;
  if (actualSpell !== expectedSpell) {
    status.spellcasting = 'FAIL';
    errors.push(`[${ex.name}] Conjuração divergente: ${diffLine(expectedSpell ?? '', actualSpell ?? '')}`);
  }

  const exFeatures = JSON.stringify(ex.featuresByLevelParsed);
  const acFeatures = JSON.stringify(ac.featuresByLevel);
  if (exFeatures !== acFeatures) {
    status.features = 'FAIL';
    errors.push(`[${ex.name}] Características por nível divergentes.`);
  }

  rows.push({
    name: ex.name,
    levels: ex.featuresByLevelParsed.length,
    perLevel: ex.featuresByLevelParsed.map((l) => `${l.level}:${l.features.length}`).join(', '),
    status,
  });
}

let md = '# Auditoria de Classes\n\n';
md += '- Fonte: `sources/player_handbook_2024.docx`\n';
md += `- Total de classes em \`classes.ts\`: ${actual.length}\n\n`;
md += '| Classe | Níveis com características | Contagem por nível | Descrição | Traços Básicos | Conjuração | Features |\n';
md += '|---|---:|---|---|---|---|---|\n';
for (const row of rows) {
  md += `| ${row.name} | ${row.levels} | ${row.perLevel} | ${row.status.description} | ${row.status.basicTraits} | ${row.status.spellcasting} | ${row.status.features} |\n`;
}
if (errors.length) {
  md += '\n## Divergências\n';
  for (const err of errors) md += `- ${err}\n`;
}

fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
fs.writeFileSync(AUDIT_PATH, md);

if (errors.length) {
  console.error(`Validação falhou com ${errors.length} divergência(s).`);
  for (const err of errors.slice(0, 20)) console.error(err);
  process.exit(1);
}

console.log('Validação de classes concluída com sucesso.');
