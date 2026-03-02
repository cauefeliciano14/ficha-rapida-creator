import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const EXTRACTED_PATH = path.resolve('scripts/out/backgrounds_extracted.json');
const BACKGROUNDS_TS_PATH = path.resolve('src/data/backgrounds.ts');
const FEATS_TS_PATH = path.resolve('src/data/feats.ts');
const AUDIT_PATH = path.resolve('docs/backgrounds_audit.md');

function readMakeBackgroundObjects() {
  const src = fs.readFileSync(BACKGROUNDS_TS_PATH, 'utf8');
  const objects = [];
  let from = 0;

  while (true) {
    const start = src.indexOf('makeBackground({', from);
    if (start === -1) break;

    const objStart = src.indexOf('{', start);
    if (objStart === -1) break;

    let depth = 0;
    let inString = false;
    let quote = '';
    let escaped = false;
    let i = objStart;

    for (; i < src.length; i += 1) {
      const ch = src[i];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === quote) {
          inString = false;
        }
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        quote = ch;
        continue;
      }
      if (ch === '{') depth += 1;
      if (ch === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }

    const objectLiteral = src.slice(objStart, i + 1);
    const script = `obj=${objectLiteral};`;
    const context = {
      obj: null,
      makeItems: (items) =>
        items.map((entry) => {
          if (Array.isArray(entry)) {
            const [itemId, qty] = entry;
            return { itemId, qty };
          }
          return entry;
        }),
    };

    vm.createContext(context);
    vm.runInContext(script, context);
    objects.push(context.obj);
    from = i + 1;
  }

  return objects;
}

function parseFeatNameToId() {
  const src = fs.readFileSync(FEATS_TS_PATH, 'utf8');
  const map = new Map();
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
  for (const m of src.matchAll(re)) {
    map.set(m[2], m[1]);
  }
  return map;
}

function normalizeFeatName(name) {
  return name
    .replace(/\s+/g, ' ')
    .replace(/\((Clérigo|Druida|Mago)\)/i, (_, g1) => `(${g1.charAt(0).toUpperCase()}${g1.slice(1).toLowerCase()})`)
    .trim();
}

function listToText(items) {
  return (items || []).map((i) => `${i.itemId} x${i.qty}`).join(', ');
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8')).backgrounds;
const actual = readMakeBackgroundObjects();
const featByName = parseFeatNameToId();

const errors = [];
const rows = [];

if (actual.length !== 16) errors.push(`backgrounds.ts possui ${actual.length} antecedentes (esperado 16).`);

for (const ex of extracted) {
  const ac = actual.find((b) => b.name === ex.name);
  if (!ac) {
    errors.push(`Antecedente ausente: ${ex.name}`);
    continue;
  }

  const status = { description: 'OK', skills: 'OK', feat: 'OK', tools: 'OK', equipment: 'OK' };

  if (ac.id !== ex.id) {
    errors.push(`[${ex.name}] id divergente: extraído='${ex.id}' atual='${ac.id}'`);
  }

  if (ac.description !== ex.description) {
    status.description = 'FAIL';
    errors.push(`[${ex.name}] descrição divergente.`);
  }

  const expectedSkills = ex.skillsGranted.join('|');
  const actualSkills = (ac.skillsGranted || []).join('|');
  if (expectedSkills !== actualSkills) {
    status.skills = 'FAIL';
    errors.push(`[${ex.name}] perícias divergentes: extraído='${expectedSkills}' atual='${actualSkills}'`);
  }

  const normalizedFeat = normalizeFeatName(ex.originFeat);
  const expectedFeatId = featByName.get(normalizedFeat);
  if (!expectedFeatId) {
    status.feat = 'FAIL';
    errors.push(`[${ex.name}] talento não mapeado no feats.ts: '${ex.originFeat}'`);
  } else if (ac.originFeatId !== expectedFeatId) {
    status.feat = 'FAIL';
    errors.push(`[${ex.name}] talento divergente: esperado='${expectedFeatId}' atual='${ac.originFeatId}'`);
  }

  const toolChoices = ex.grantChoices.tool?.requiredCount ? `choice:${ex.grantChoices.tool.options.join(',')}` : '';
  const expectedTools = ex.toolsGranted.length ? ex.toolsGranted.join('|') : toolChoices;
  const actualTools = (ac.toolsGranted || []).join('|');
  if (expectedTools && expectedTools !== actualTools && !(toolChoices && actualTools.startsWith('Escolha um tipo de'))) {
    status.tools = 'FAIL';
    errors.push(`[${ex.name}] ferramentas divergentes: extraído='${expectedTools}' atual='${actualTools}'`);
  }

  const extractedGoldA = ex.equipment.choiceGroups.find((g) => g.id === 'A')?.gold ?? null;
  const extractedGoldB = ex.equipment.choiceGroups.find((g) => g.id === 'B')?.gold ?? null;
  if ((ac.equipmentOptionA?.gold ?? null) !== extractedGoldA || (ac.equipmentOptionB?.gold ?? null) !== extractedGoldB) {
    status.equipment = 'FAIL';
    errors.push(`[${ex.name}] ouro de equipamento divergente: A ${extractedGoldA}/${ac.equipmentOptionA?.gold} B ${extractedGoldB}/${ac.equipmentOptionB?.gold}`);
  }

  rows.push({
    name: ex.name,
    status,
    equipmentA: listToText(ac.equipmentOptionA?.items ?? []),
  });
}

let md = '# Auditoria de Antecedentes\n\n';
md += '- Fonte: `sources/player_handbook_2024.docx`\n';
md += `- Total de antecedentes em \`backgrounds.ts\`: ${actual.length}\n\n`;
md += '| Antecedente | Descrição | Perícias | Talento | Ferramentas | Equipamento |\n';
md += '|---|---|---|---|---|---|\n';
for (const row of rows) {
  md += `| ${row.name} | ${row.status.description} | ${row.status.skills} | ${row.status.feat} | ${row.status.tools} | ${row.status.equipment} |\n`;
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

console.log('Validação de antecedentes concluída com sucesso.');
