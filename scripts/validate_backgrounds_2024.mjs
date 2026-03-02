import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const EXTRACT_SCRIPT = path.resolve('scripts/extract_backgrounds_from_docx.mjs');
const EXTRACTED_PATH = path.resolve('scripts/out/backgrounds_extracted.json');
const CANON_PATH = path.resolve('src/data/_canon/backgrounds_16.json');
const AUDIT_PATH = path.resolve('docs/backgrounds_audit.md');

const REQUIRED_FIELDS = [
  'id',
  'name',
  'description',
  'abilityScores',
  'originFeat',
  'skillsGranted',
  'toolsGranted',
  'grantChoices',
  'equipment',
];

const PLACEHOLDER_RE = /(TODO|TBD|placeholder|lorem ipsum|\.\.\.|\[.*?\])/i;

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeList(items) {
  return (items ?? []).map((item) => normalizeText(item)).filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function choiceSignature(choice) {
  if (!choice || !choice.requiredCount) return 'none';
  const options = normalizeList(choice.options);
  return `${choice.requiredCount}:${options.join('|')}`;
}

function equipmentSignature(option) {
  const items = (option?.items ?? [])
    .map((entry) => `${normalizeText(entry.item)} x${entry.qty}`)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const gold = option?.gold ?? null;
  return `${gold}::${items.join('|')}`;
}

function statusIcon(ok) {
  return ok ? 'OK ✅' : 'FAIL ❌';
}

if (!fs.existsSync(DOCX_PATH)) {
  throw new Error('DOCX oficial não encontrado em sources/player_handbook_2024.docx');
}

execSync(`node "${EXTRACT_SCRIPT}"`, { stdio: 'inherit' });

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).backgrounds;
const canonical = JSON.parse(fs.readFileSync(CANON_PATH, 'utf8'));

const errors = [];
const rows = [];

if (canonical.length !== 16) {
  errors.push(`Contagem canônica inválida: ${canonical.length} (esperado 16).`);
}
if (extracted.length !== 16) {
  errors.push(`Contagem extraída inválida: ${extracted.length} (esperado 16).`);
}

for (const canon of canonical) {
  const extractedEntry = extracted.find((item) => item.id === canon.id || item.name === canon.name);

  const requiredOk = REQUIRED_FIELDS.every((field) => canon[field] !== undefined && canon[field] !== null);
  if (!requiredOk) {
    const missing = REQUIRED_FIELDS.filter((field) => canon[field] === undefined || canon[field] === null);
    errors.push(`[${canon.name || canon.id}] campos obrigatórios ausentes: ${missing.join(', ')}`);
  }

  const textFields = [canon.id, canon.name, canon.description, canon.originFeat, ...(canon.skillsGranted ?? []), ...(canon.toolsGranted ?? [])];
  const textualOk = textFields.every((field) => normalizeText(field).length > 2) && !textFields.some((field) => PLACEHOLDER_RE.test(String(field ?? '')));
  if (!textualOk) {
    errors.push(`[${canon.name || canon.id}] possível placeholder/truncamento textual detectado.`);
  }

  let abilityOk = false;
  let featOk = false;
  let skillsOk = false;
  let toolsOk = false;
  let languagesOk = false;
  let equipmentOk = false;

  if (!extractedEntry) {
    errors.push(`Origem ausente na extração oficial: ${canon.name} (${canon.id}).`);
  } else {
    abilityOk = JSON.stringify(normalizeList(canon.abilityScores)) === JSON.stringify(normalizeList(extractedEntry.abilityScores));
    featOk = normalizeText(canon.originFeat) === normalizeText(extractedEntry.originFeat);
    skillsOk = JSON.stringify(normalizeList(canon.skillsGranted)) === JSON.stringify(normalizeList(extractedEntry.skillsGranted));

    const canonTools = normalizeList(canon.toolsGranted);
    const extractedTools = normalizeList(extractedEntry.toolsGranted);
    const canonToolChoice = choiceSignature(canon.grantChoices?.tool);
    const extractedToolChoice = choiceSignature(extractedEntry.grantChoices?.tool);
    const canonInstrumentChoice = choiceSignature(canon.grantChoices?.instrument);
    const extractedInstrumentChoice = choiceSignature(extractedEntry.grantChoices?.instrument);
    toolsOk = JSON.stringify(canonTools) === JSON.stringify(extractedTools)
      && canonToolChoice === extractedToolChoice
      && canonInstrumentChoice === extractedInstrumentChoice;

    languagesOk = choiceSignature(canon.grantChoices?.language) === choiceSignature(extractedEntry.grantChoices?.language);

    equipmentOk = equipmentSignature(canon.equipment?.optionA) === equipmentSignature(extractedEntry.equipment?.choiceGroups?.find((g) => g.id === 'A'))
      && equipmentSignature(canon.equipment?.optionB) === equipmentSignature(extractedEntry.equipment?.choiceGroups?.find((g) => g.id === 'B'));

    if (!abilityOk) errors.push(`[${canon.name}] divergência em abilityScores.`);
    if (!featOk) errors.push(`[${canon.name}] divergência em originFeat.`);
    if (!skillsOk) errors.push(`[${canon.name}] divergência em skillsGranted.`);
    if (!toolsOk) errors.push(`[${canon.name}] divergência em ferramentas/escolhas de ferramenta.`);
    if (!languagesOk) errors.push(`[${canon.name}] divergência em escolhas de idioma.`);
    if (!equipmentOk) errors.push(`[${canon.name}] divergência em equipamento A/B.`);
  }

  rows.push({
    name: canon.name ?? canon.id,
    requiredOk,
    textualOk,
    abilityOk,
    featOk,
    skillsOk,
    toolsOk,
    languagesOk,
    equipmentOk,
  });
}

const summary = [
  `- Total canônico: **${canonical.length}**`,
  `- Total extraído do DOCX: **${extracted.length}**`,
  `- Erros encontrados: **${errors.length}**`,
];

const md = [
  '# Auditoria de Antecedentes (PHB 2024)',
  '',
  '- Fonte oficial: `sources/player_handbook_2024.docx`',
  `- Arquivo canônico: \
\`src/data/_canon/backgrounds_16.json\``,
  ...summary,
  '',
  '| Origem | Campos obrigatórios | Completude textual | Atributos | Talento | Perícias | Ferramentas | Idiomas | Equip. A/B |',
  '|---|---|---|---|---|---|---|---|---|',
  ...rows.map((row) => `| ${row.name} | ${statusIcon(row.requiredOk)} | ${statusIcon(row.textualOk)} | ${statusIcon(row.abilityOk)} | ${statusIcon(row.featOk)} | ${statusIcon(row.skillsOk)} | ${statusIcon(row.toolsOk)} | ${statusIcon(row.languagesOk)} | ${statusIcon(row.equipmentOk)} |`),
  '',
  '## Sumário de erros',
  ...(errors.length ? errors.map((error) => `- ${error}`) : ['- Nenhum erro detectado.']),
  '',
].join('\n');

fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
fs.writeFileSync(AUDIT_PATH, md, 'utf8');

if (errors.length > 0) {
  console.error(`Validação de antecedentes falhou com ${errors.length} erro(s).`);
  process.exit(1);
}

console.log('✅ Validação de antecedentes 2024 concluída sem divergências.');
