import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const SPELLS_TS_PATH = path.resolve('src/data/spells.ts');
const DOCX_EXTRACTED_PATH = path.resolve('src/data/spells.generated.json');
const AUDIT_PATH = path.resolve('docs/spells_audit.md');

function parseRawSpellsFromTs() {
  const source = fs.readFileSync(SPELLS_TS_PATH, 'utf8');
  const start = source.indexOf('const rawSpells');
  const end = source.indexOf('function normalizeSpell');
  if (start < 0 || end < 0) {
    throw new Error('Não foi possível localizar rawSpells em src/data/spells.ts');
  }

  const snippet = source
    .slice(start, end)
    .replace('const rawSpells: SpellData[] =', 'const rawSpells =')
    .concat('\nrawSpells;');

  return vm.runInNewContext(snippet, {});
}

function diffLine(a, b) {
  const as = (a ?? '').split('\n');
  const bs = (b ?? '').split('\n');
  for (let i = 0; i < Math.max(as.length, bs.length); i += 1) {
    if (as[i] !== bs[i]) return `linha ${i + 1}: esperado='${as[i] ?? ''}' atual='${bs[i] ?? ''}'`;
  }
  return 'sem diff';
}

const expected = JSON.parse(fs.readFileSync(DOCX_EXTRACTED_PATH, 'utf8'));
const actual = parseRawSpellsFromTs();

const errors = [];
const rows = [];

if (actual.length !== expected.length) {
  errors.push(`Quantidade de magias divergente: esperado ${expected.length}, atual ${actual.length}`);
}

const expectedById = new Map(expected.map((spell) => [spell.id, spell]));

for (const spell of actual) {
  const ex = expectedById.get(spell.id);
  if (!ex) {
    errors.push(`[${spell.id}] magia não encontrada no dataset extraído do DOCX.`);
    continue;
  }

  const status = {
    metadata: 'OK',
    description: 'OK',
    atHigherLevels: 'OK',
    cantripUpgrade: 'OK',
  };

  const metadataFields = ['name', 'level', 'school', 'ritual', 'concentration', 'castingTime', 'range', 'duration'];
  for (const field of metadataFields) {
    if ((spell[field] ?? null) !== (ex[field] ?? null)) {
      status.metadata = 'FAIL';
      errors.push(`[${spell.id}] campo '${field}' divergente: esperado='${ex[field] ?? ''}' atual='${spell[field] ?? ''}'`);
    }
  }

  const expectedClasses = JSON.stringify(ex.classes ?? []);
  const actualClasses = JSON.stringify(spell.classes ?? []);
  if (expectedClasses !== actualClasses) {
    status.metadata = 'FAIL';
    errors.push(`[${spell.id}] classes divergentes: esperado=${expectedClasses} atual=${actualClasses}`);
  }

  if ((spell.description ?? '') !== (ex.description ?? '')) {
    status.description = 'FAIL';
    errors.push(`[${spell.id}] descrição divergente: ${diffLine(ex.description ?? '', spell.description ?? '')}`);
  }

  if ((spell.atHigherLevels ?? null) !== (ex.atHigherLevels ?? null)) {
    status.atHigherLevels = 'FAIL';
    errors.push(`[${spell.id}] bloco 'atHigherLevels' divergente: ${diffLine(ex.atHigherLevels ?? '', spell.atHigherLevels ?? '')}`);
  }

  if ((spell.cantripUpgrade ?? null) !== (ex.cantripUpgrade ?? null)) {
    status.cantripUpgrade = 'FAIL';
    errors.push(`[${spell.id}] bloco 'cantripUpgrade' divergente: ${diffLine(ex.cantripUpgrade ?? '', spell.cantripUpgrade ?? '')}`);
  }

  rows.push({ id: spell.id, name: spell.name, status });
}

for (const ex of expected) {
  if (!actual.some((spell) => spell.id === ex.id)) {
    errors.push(`[${ex.id}] magia extraída do DOCX ausente em src/data/spells.ts`);
  }
}

let md = '# Auditoria de Magias\n\n';
md += '- Fonte: `sources/player_handbook_2024.docx` (via `src/data/spells.generated.json`)\n';
md += `- Total de magias em \`spells.ts\`: ${actual.length}\n\n`;
md += '| ID | Nome | Metadados | Descrição | atHigherLevels | cantripUpgrade |\n';
md += '|---|---|---|---|---|---|\n';
for (const row of rows) {
  md += `| ${row.id} | ${row.name} | ${row.status.metadata} | ${row.status.description} | ${row.status.atHigherLevels} | ${row.status.cantripUpgrade} |\n`;
}
if (errors.length) {
  md += '\n## Divergências\n';
  for (const err of errors) md += `- ${err}\n`;
}

fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
fs.writeFileSync(AUDIT_PATH, md);

if (errors.length) {
  console.error(`Validação de magias falhou com ${errors.length} divergência(s).`);
  for (const err of errors.slice(0, 30)) console.error(err);
  process.exit(1);
}

console.log('Validação de magias concluída com sucesso.');
