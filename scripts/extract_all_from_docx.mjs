import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_JSON = path.resolve('scripts/out/extraction_coverage_report.json');
const OUT_MD = path.resolve('docs/extraction_coverage.md');

function mustRead(filePath) {
  return fs.readFileSync(path.resolve(filePath), 'utf8');
}

function runStep(label, cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit' });
  if (res.status !== 0) {
    throw new Error(`Falha ao executar ${label}: ${cmd} ${args.join(' ')}`);
  }
}

function docxLines() {
  const xml = execSync(`unzip -p ${JSON.stringify(DOCX_PATH)} word/document.xml`, { encoding: 'utf8', maxBuffer: 300 * 1024 * 1024 });
  const text = xml
    .replace(/<w:tab\/?\s*>/g, '\t')
    .replace(/<w:br\/?\s*>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/\r/g, '');
  return text.split('\n').map((line) => line.trim()).filter(Boolean);
}

function toId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function findLastIndex(lines, includes) {
  let found = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes(includes)) found = i;
  }
  return found;
}

function parseBackgroundNames(lines) {
  const start = lines.indexOf('Descrições dos Antecedentes');
  if (start === -1) return [];
  const names = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith('Valores de Atributo:')) break;
    if (line.includes('são apresentados')) continue;
    if (/^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-Za-zÀ-ÿ' -]{2,40}$/.test(line)) {
      names.push(line);
    }
  }
  return [...new Set(names)].slice(0, 16);
}

function parseFeatNames(lines) {
  const start = findLastIndex(lines, 'Talentos de Origem');
  const end = findLastIndex(lines, 'Capítulo 6 - Equipamento');
  if (start === -1 || end === -1 || end <= start) return [];
  const names = [];
  for (let i = start; i < end - 1; i += 1) {
    if (/^Talento de /.test(lines[i + 1])) {
      const current = lines[i].replace(/\*+$/, '').trim();
      if (/^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(current) && current.length <= 60) names.push(current);
    }
  }
  return [...new Set(names)];
}

function parseSpellNames(lines) {
  const start = findLastIndex(lines, 'Capítulo 7 - Magias');
  if (start === -1) return [];
  const names = [];
  for (let i = start + 1; i < lines.length - 1; i += 1) {
    const line = lines[i];
    const next = lines[i + 1];
    if (/^Capítulo\s+\d+/.test(line)) break;
    if (/^Nível\s+[0-9]/.test(next) && /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(line) && line.length <= 70) {
      names.push(line);
    }
  }
  return [...new Set(names)];
}

function parseChoiceRequirements(lines) {
  const choiceLines = lines.filter((line) => /\bEscolha\b|\bà sua escolha\b|\bde sua escolha\b/i.test(line));
  return {
    count: choiceLines.length,
    samples: choiceLines.slice(0, 20),
  };
}

function countIdsInTs(filePath) {
  const txt = mustRead(filePath);
  return (txt.match(/\bid\s*:\s*"[^"]+"/g) ?? []).length;
}

function loadExpectedIds() {
  const txt = mustRead('src/data/catalogExpectations.ts');
  const arrays = {};
  for (const key of ['EXPECTED_CLASS_IDS', 'EXPECTED_BACKGROUND_IDS', 'EXPECTED_RACE_IDS']) {
    const m = txt.match(new RegExp(`${key}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`));
    arrays[key] = m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
  }
  return arrays;
}

function missingRequired(entries, requiredFields) {
  const out = [];
  for (const entry of entries) {
    const missing = requiredFields.filter((field) => {
      const value = entry[field];
      if (value == null) return true;
      if (typeof value === 'string') return value.trim() === '';
      if (Array.isArray(value)) return value.length === 0;
      return false;
    });
    if (missing.length) out.push({ id: entry.id ?? entry.name ?? '(sem-id)', missing });
  }
  return out;
}

function readJson(p) {
  return JSON.parse(mustRead(p));
}

function main() {
  if (!fs.existsSync(DOCX_PATH)) throw new Error('DOCX não encontrado.');
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });

  runStep('classes', 'node', ['scripts/extract_classes_from_docx.mjs']);
  runStep('raças', 'node', ['scripts/extract_races_from_docx.mjs']);

  const lines = docxLines();
  const expected = loadExpectedIds();

  const classesExtracted = readJson('scripts/out/classes_extracted.json').classes;
  const racesExtracted = readJson('scripts/out/races_extracted.json').races;
  const backgroundsExtracted = parseBackgroundNames(lines).map((name) => ({ id: toId(name), name }));
  const featsExtracted = parseFeatNames(lines).map((name) => ({ id: toId(name), name }));
  const spellsExtracted = parseSpellNames(lines).map((name) => ({ id: toId(name), name }));
  const choicesExtracted = parseChoiceRequirements(lines);

  const catalogCounts = {
    classes: countIdsInTs('src/data/classes.ts'),
    races: countIdsInTs('src/data/races.ts'),
    backgrounds: countIdsInTs('src/data/backgrounds.ts'),
    feats: countIdsInTs('src/data/feats.ts'),
    spells: readJson('src/data/spells.generated.json').length,
    items: countIdsInTs('src/data/items.ts'),
  };

  const report = {
    generatedAt: new Date().toISOString(),
    sourceDocx: path.relative(ROOT, DOCX_PATH),
    domains: ['classes', 'races', 'backgrounds', 'feats', 'spells', 'items/equipment', 'choice requirements'],
    coverage: {
      classes: { expected: expected.EXPECTED_CLASS_IDS.length, extracted: classesExtracted.length },
      races: { expected: expected.EXPECTED_RACE_IDS.length, extracted: racesExtracted.length },
      backgrounds: { expected: expected.EXPECTED_BACKGROUND_IDS.length, extracted: backgroundsExtracted.length },
      feats: { expected: catalogCounts.feats, extracted: featsExtracted.length },
      spells: { expected: catalogCounts.spells, extracted: spellsExtracted.length },
      'items/equipment': { expected: catalogCounts.items, extracted: null },
      'choice requirements': { expected: null, extracted: choicesExtracted.count },
    },
    missingRequiredFields: {
      classes: missingRequired(classesExtracted, ['id', 'name', 'description', 'basicTraitsParsed', 'featuresByLevelParsed']),
      races: missingRequired(racesExtracted, ['id', 'name', 'description', 'traits', 'abilities']),
      backgrounds: missingRequired(backgroundsExtracted, ['id', 'name']),
      feats: missingRequired(featsExtracted, ['id', 'name']),
      spells: missingRequired(spellsExtracted, ['id', 'name']),
      'items/equipment': [{ note: 'Extração de itens/equipamentos a partir do DOCX ainda não implementada neste pipeline.' }],
      'choice requirements': choicesExtracted.count === 0 ? [{ note: 'Nenhum requisito de escolha detectado.' }] : [],
    },
    divergences: {
      classes: {
        missingInExtraction: expected.EXPECTED_CLASS_IDS.filter((id) => !classesExtracted.some((c) => c.id === id)),
        extraInExtraction: classesExtracted.map((c) => c.id).filter((id) => !expected.EXPECTED_CLASS_IDS.includes(id)),
      },
      races: {
        missingInExtraction: expected.EXPECTED_RACE_IDS.filter((id) => !racesExtracted.some((r) => r.id === id)),
        extraInExtraction: racesExtracted.map((r) => r.id).filter((id) => !expected.EXPECTED_RACE_IDS.includes(id)),
      },
      backgrounds: {
        missingInExtraction: expected.EXPECTED_BACKGROUND_IDS.filter((id) => !backgroundsExtracted.some((b) => b.id === id)),
        extraInExtraction: backgroundsExtracted.map((b) => b.id).filter((id) => !expected.EXPECTED_BACKGROUND_IDS.includes(id)),
      },
      catalogs: catalogCounts,
      canonFiles: fs.readdirSync('src/data/_canon').filter((f) => f.endsWith('.json')),
    },
    samples: {
      backgrounds: backgroundsExtracted.map((x) => x.name),
      feats: featsExtracted.slice(0, 25).map((x) => x.name),
      spells: spellsExtracted.slice(0, 25).map((x) => x.name),
      choiceRequirements: choicesExtracted.samples,
    },
  };

  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);

  const md = [
    '# Extraction Coverage Report',
    '',
    `Fonte: \`${report.sourceDocx}\``,
    '',
    '## 1. Domínios extraídos',
    ...report.domains.map((d) => `- ${d}`),
    '',
    '## 2. Contagens esperadas vs extraídas',
    '| Domínio | Esperado | Extraído |',
    '|---|---:|---:|',
    ...Object.entries(report.coverage).map(([domain, values]) => `| ${domain} | ${values.expected ?? 'n/a'} | ${values.extracted ?? 'n/a'} |`),
    '',
    '## 3. Campos obrigatórios faltantes',
    ...Object.entries(report.missingRequiredFields).map(([domain, issues]) => `- **${domain}**: ${issues.length === 0 ? 'nenhum' : `${issues.length} registro(s) com pendências`}`),
    '',
    '## 4. Divergências com _canon e catálogos',
    `- classes faltantes: ${(report.divergences.classes.missingInExtraction || []).join(', ') || 'nenhuma'}`,
    `- classes extras: ${(report.divergences.classes.extraInExtraction || []).join(', ') || 'nenhuma'}`,
    `- raças faltantes: ${(report.divergences.races.missingInExtraction || []).join(', ') || 'nenhuma'}`,
    `- raças extras: ${(report.divergences.races.extraInExtraction || []).join(', ') || 'nenhuma'}`,
    `- backgrounds faltantes: ${(report.divergences.backgrounds.missingInExtraction || []).join(', ') || 'nenhuma'}`,
    `- backgrounds extras: ${(report.divergences.backgrounds.extraInExtraction || []).join(', ') || 'nenhuma'}`,
    `- arquivos canônicos encontrados: ${report.divergences.canonFiles.join(', ')}`,
    '',
    '> Veja o JSON completo em `scripts/out/extraction_coverage_report.json`.',
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md);
  console.log(`Relatórios gerados:\n- ${OUT_JSON}\n- ${OUT_MD}`);
}

main();
