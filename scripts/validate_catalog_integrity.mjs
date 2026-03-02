import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const PATHS = {
  classesExtracted: path.resolve(ROOT, 'scripts/out/classes_extracted.json'),
  racesExtracted: path.resolve(ROOT, 'scripts/out/races_extracted.json'),
  backgroundsExtracted: path.resolve(ROOT, 'scripts/out/backgrounds_extracted.json'),
  classesTs: path.resolve(ROOT, 'src/data/classes.ts'),
  racesTs: path.resolve(ROOT, 'src/data/races.ts'),
  backgroundsTs: path.resolve(ROOT, 'src/data/backgrounds.ts'),
  featsTs: path.resolve(ROOT, 'src/data/feats.ts'),
  docsDir: path.resolve(ROOT, 'docs'),
};

const EXPECTED_COUNTS = { classes: 12, races: 10, backgrounds: 16 };

const REQUIRED_FIELDS = {
  classes: [
    'id', 'name', 'description', 'textBlocks', 'primaryAbility', 'hitDie', 'savingThrows',
    'proficiencies', 'skillChoices', 'equipmentChoices', 'spellcasting', 'featuresByLevel', 'subclasses', 'asiLevels',
  ],
  races: ['id', 'name', 'description', 'traits'],
  backgrounds: [
    'id', 'name', 'description', 'abilityOptions', 'originFeatId',
    'skillsGranted', 'toolsGranted', 'equipmentOptionA', 'equipmentOptionB',
  ],
};


const NULLABLE_FIELDS = {
  classes: new Set(['spellcasting']),
  races: new Set(),
  backgrounds: new Set(),
};
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseClassesTs() {
  const src = fs.readFileSync(PATHS.classesTs, 'utf8');
  const m = src.match(/export const classes: ClassData\[\] = ([\s\S]*);\s*$/);
  if (!m) throw new Error('Array classes não encontrado em classes.ts');

  const context = { classes: [] };
  vm.createContext(context);
  vm.runInContext(`classes=${m[1]};`, context);
  return context.classes;
}

function parseRacesTs() {
  const src = fs.readFileSync(PATHS.racesTs, 'utf8');
  const m = src.match(/export const races: RaceData\[\] = (\[[\s\S]*?\n\]);/);
  if (!m) throw new Error('Array races não encontrado em races.ts');

  const script = `const PHB2024={sourceId:'player_handbook_2024',page:0}; const EMPTY_PROF={skills:[],tools:[],weapons:[],armor:[]}; races=${m[1]};`;
  const context = { races: [] };
  vm.createContext(context);
  vm.runInContext(script, context);
  return context.races;
}

function parseBackgroundsTs() {
  const src = fs.readFileSync(PATHS.backgroundsTs, 'utf8');
  const objects = [];
  let from = 0;

  while (true) {
    const start = src.indexOf('makeBackground({', from);
    if (start === -1) break;

    const objStart = src.indexOf('{', start);
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
    const context = {
      obj: null,
      makeItems: (items) => items.map((entry) => (Array.isArray(entry) ? { itemId: entry[0], qty: entry[1] } : entry)),
    };

    vm.createContext(context);
    vm.runInContext(`obj=${objectLiteral};`, context);
    objects.push(context.obj);
    from = i + 1;
  }

  return objects;
}

function parseFeatNameToId() {
  const src = fs.readFileSync(PATHS.featsTs, 'utf8');
  const map = new Map();
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
  for (const m of src.matchAll(re)) map.set(m[2], m[1]);
  return map;
}

function normalizeFeatName(name) {
  return name
    .replace(/\s+/g, ' ')
    .replace(/\((Clérigo|Druida|Mago)\)/i, (_, g1) => `(${g1.charAt(0).toUpperCase()}${g1.slice(1).toLowerCase()})`)
    .trim();
}

function hasMissingRequiredField(entry, field, nullable = false) {
  const hasField = entry && Object.prototype.hasOwnProperty.call(entry, field);
  if (!hasField) return true;
  const value = entry[field];
  if (value === undefined) return true;
  if (value === null) return !nullable;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
}

function buildDomainReport(domain, title, rows, errors, meta = []) {
  const ok = errors.length === 0;
  const lines = [
    `# ${title}`,
    '',
    ...meta,
    `- Status final: **${ok ? '✅ PASS' : '❌ FAIL'}**`,
    '',
    '## Validações executadas',
    '- Contagem esperada por catálogo',
    '- Campos obrigatórios por schema',
    '- Consistência com extração da fonte oficial',
    '',
    '## Resultados',
    '',
    ...rows,
    '',
    '## Divergências',
    ...(errors.length ? errors.map((err) => `- ${err}`) : ['- Nenhuma divergência encontrada.']),
    '',
  ];

  const outFile = path.resolve(PATHS.docsDir, `${domain}_audit.md`);
  fs.mkdirSync(PATHS.docsDir, { recursive: true });
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
  return { ok, outFile, errors };
}

function validateClasses(extractedClasses, actualClasses) {
  const errors = [];
  if (actualClasses.length !== EXPECTED_COUNTS.classes) {
    errors.push(`classes.ts possui ${actualClasses.length} classes (esperado ${EXPECTED_COUNTS.classes}).`);
  }

  for (const entry of actualClasses) {
    for (const field of REQUIRED_FIELDS.classes) {
      if (hasMissingRequiredField(entry, field, NULLABLE_FIELDS.classes.has(field))) errors.push(`[${entry.id || entry.name || 'classe-sem-id'}] campo obrigatório ausente/vazio: ${field}`);
    }
  }

  for (const extracted of extractedClasses) {
    const actual = actualClasses.find((c) => c.id === extracted.id || c.name === extracted.name);
    if (!actual) {
      errors.push(`Classe ausente no catálogo: ${extracted.name} (${extracted.id})`);
      continue;
    }

    if (actual.description !== extracted.description) errors.push(`[${actual.id}] descrição divergente em relação ao extraído.`);
    if ((actual.textBlocks?.basicTraits ?? '') !== extracted.basicTraitsRaw) errors.push(`[${actual.id}] textBlocks.basicTraits divergente.`);
    if ((actual.textBlocks?.spellcasting ?? null) !== (extracted.spellcastingRaw ?? null)) errors.push(`[${actual.id}] textBlocks.spellcasting divergente.`);

    const extractedFeatures = JSON.stringify(extracted.featuresByLevelParsed);
    const actualFeatures = JSON.stringify(actual.featuresByLevel);
    if (actualFeatures !== extractedFeatures) errors.push(`[${actual.id}] featuresByLevel divergente da extração.`);
  }

  const rows = [
    '| Regra | Status |',
    '|---|---|',
    `| Contagem esperada (${EXPECTED_COUNTS.classes}) | ${actualClasses.length === EXPECTED_COUNTS.classes ? '✅' : '❌'} |`,
    `| Campos obrigatórios (${REQUIRED_FIELDS.classes.length}) | ${errors.some((e) => e.includes('campo obrigatório')) ? '❌' : '✅'} |`,
    `| Diffs com extração oficial | ${errors.some((e) => e.includes('divergente') || e.includes('ausente no catálogo')) ? '❌' : '✅'} |`,
  ];

  return buildDomainReport('classes', 'Auditoria de Classes', rows, errors, [
    '- Fonte oficial: `sources/player_handbook_2024.docx`',
    '- Total atual em `src/data/classes.ts`: ' + actualClasses.length,
  ]);
}

function normalizeExtractedRace(extractedRace) {
  const traits = [];
  if (extractedRace.traits.creatureType) traits.push({ name: 'Tipo de Criatura', description: extractedRace.traits.creatureType.replace('Tipo de Criatura: ', '') });
  if (extractedRace.traits.size) traits.push({ name: 'Tamanho', description: extractedRace.traits.size.replace('Tamanho: ', '') });
  if (extractedRace.traits.speed) traits.push({ name: 'Deslocamento', description: extractedRace.traits.speed.replace('Deslocamento: ', '') });
  for (const ability of extractedRace.abilities ?? []) traits.push({ name: ability.name, description: ability.description });
  return { ...extractedRace, traitsNormalized: traits };
}

function validateRaces(extractedRaces, actualRaces) {
  const errors = [];
  if (actualRaces.length !== EXPECTED_COUNTS.races) {
    errors.push(`races.ts possui ${actualRaces.length} raças (esperado ${EXPECTED_COUNTS.races}).`);
  }

  for (const entry of actualRaces) {
    for (const field of REQUIRED_FIELDS.races) {
      if (hasMissingRequiredField(entry, field, NULLABLE_FIELDS.races.has(field))) errors.push(`[${entry.id || entry.name || 'raca-sem-id'}] campo obrigatório ausente/vazio: ${field}`);
    }
  }

  for (const raw of extractedRaces) {
    const extracted = normalizeExtractedRace(raw);
    const actual = actualRaces.find((r) => r.id === extracted.id || r.name === extracted.name);
    if (!actual) {
      errors.push(`Raça ausente no catálogo: ${extracted.name} (${extracted.id})`);
      continue;
    }
    if (actual.description !== extracted.description) errors.push(`[${actual.id}] descrição divergente em relação ao extraído.`);
    if (actual.traits.length !== extracted.traitsNormalized.length) {
      errors.push(`[${actual.id}] quantidade de traços divergente (${actual.traits.length} vs ${extracted.traitsNormalized.length}).`);
    }
  }

  const rows = [
    '| Regra | Status |',
    '|---|---|',
    `| Contagem esperada (${EXPECTED_COUNTS.races}) | ${actualRaces.length === EXPECTED_COUNTS.races ? '✅' : '❌'} |`,
    `| Campos obrigatórios (${REQUIRED_FIELDS.races.length}) | ${errors.some((e) => e.includes('campo obrigatório')) ? '❌' : '✅'} |`,
    `| Diffs com extração oficial | ${errors.some((e) => e.includes('divergente') || e.includes('ausente no catálogo')) ? '❌' : '✅'} |`,
  ];

  return buildDomainReport('races', 'Auditoria de Raças', rows, errors, [
    '- Fonte oficial: `sources/player_handbook_2024.docx`',
    '- Total atual em `src/data/races.ts`: ' + actualRaces.length,
  ]);
}

function validateBackgrounds(extractedBackgrounds, actualBackgrounds) {
  const featByName = parseFeatNameToId();
  const errors = [];

  if (actualBackgrounds.length !== EXPECTED_COUNTS.backgrounds) {
    errors.push(`backgrounds.ts possui ${actualBackgrounds.length} origens (esperado ${EXPECTED_COUNTS.backgrounds}).`);
  }

  for (const entry of actualBackgrounds) {
    for (const field of REQUIRED_FIELDS.backgrounds) {
      if (hasMissingRequiredField(entry, field, NULLABLE_FIELDS.backgrounds.has(field))) errors.push(`[${entry.id || entry.name || 'origem-sem-id'}] campo obrigatório ausente/vazio: ${field}`);
    }
  }

  for (const extracted of extractedBackgrounds) {
    const actual = actualBackgrounds.find((b) => b.id === extracted.id || b.name === extracted.name);
    if (!actual) {
      errors.push(`Origem ausente no catálogo: ${extracted.name} (${extracted.id})`);
      continue;
    }

    if (actual.description !== extracted.description) errors.push(`[${actual.id}] descrição divergente em relação ao extraído.`);

    const expectedSkills = (extracted.skillsGranted ?? []).join('|');
    const actualSkills = (actual.skillsGranted ?? []).join('|');
    if (expectedSkills !== actualSkills) errors.push(`[${actual.id}] skillsGranted divergente.`);

    const expectedFeatId = featByName.get(normalizeFeatName(extracted.originFeat));
    if (!expectedFeatId || actual.originFeatId !== expectedFeatId) {
      errors.push(`[${actual.id}] originFeatId divergente (esperado ${expectedFeatId ?? 'não mapeado'}).`);
    }
  }

  const rows = [
    '| Regra | Status |',
    '|---|---|',
    `| Contagem esperada (${EXPECTED_COUNTS.backgrounds}) | ${actualBackgrounds.length === EXPECTED_COUNTS.backgrounds ? '✅' : '❌'} |`,
    `| Campos obrigatórios (${REQUIRED_FIELDS.backgrounds.length}) | ${errors.some((e) => e.includes('campo obrigatório')) ? '❌' : '✅'} |`,
    `| Diffs com extração oficial | ${errors.some((e) => e.includes('divergente') || e.includes('ausente no catálogo')) ? '❌' : '✅'} |`,
  ];

  return buildDomainReport('backgrounds', 'Auditoria de Origens', rows, errors, [
    '- Fonte oficial: `sources/player_handbook_2024.docx`',
    '- Total atual em `src/data/backgrounds.ts`: ' + actualBackgrounds.length,
  ]);
}

function printSummary(results) {
  const totalErrors = results.reduce((acc, r) => acc + r.errors.length, 0);
  const failedDomains = results.filter((r) => !r.ok).length;

  console.log('\n# validate_catalog_integrity\n');
  for (const result of results) {
    const domainName = path.basename(result.outFile).replace('_audit.md', '');
    console.log(`- ${result.ok ? '✅' : '❌'} ${domainName}: ${result.errors.length} divergência(s) -> ${path.relative(ROOT, result.outFile)}`);
  }
  console.log(`\nStatus final: ${failedDomains === 0 ? '✅ PASS' : '❌ FAIL'} (${totalErrors} divergência(s))`);

  if (failedDomains > 0) process.exit(1);
}

function main() {
  const extractedClasses = readJson(PATHS.classesExtracted).classes;
  const extractedRaces = readJson(PATHS.racesExtracted).races;
  const extractedBackgrounds = readJson(PATHS.backgroundsExtracted).backgrounds;

  const actualClasses = parseClassesTs();
  const actualRaces = parseRacesTs();
  const actualBackgrounds = parseBackgroundsTs();

  const results = [
    validateClasses(extractedClasses, actualClasses),
    validateRaces(extractedRaces, actualRaces),
    validateBackgrounds(extractedBackgrounds, actualBackgrounds),
  ];

  printSummary(results);
}

main();
