import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const EXTRACTED_PATH = path.resolve('scripts/out/starting_equipment_extracted.json');
const CLASSES_TS_PATH = path.resolve('src/data/classes.ts');
const BACKGROUNDS_TS_PATH = path.resolve('src/data/backgrounds.ts');

function parseClasses() {
  const src = fs.readFileSync(CLASSES_TS_PATH, 'utf8');
  const m = src.match(/export const classes: ClassData\[\] = ([\s\S]*);\s*$/);
  if (!m) throw new Error('Array classes não encontrado em classes.ts');
  const context = { classes: [] };
  vm.createContext(context);
  vm.runInContext(`classes=${m[1]};`, context);
  return context.classes;
}

function parseBackgroundGoldByName() {
  const src = fs.readFileSync(BACKGROUNDS_TS_PATH, 'utf8');
  const blocks = [...src.matchAll(/makeBackground\(\{([\s\S]*?)\}\),/g)].map((m) => m[1]);
  return blocks.map((block) => {
    const name = block.match(/name:\s*"([^"]+)"/)?.[1] ?? null;
    const aGold = block.match(/equipmentOptionA:\s*\{[\s\S]*?gold:\s*(\d+)/)?.[1] ?? null;
    const bGold = block.match(/equipmentOptionB:\s*\{\s*gold:\s*(\d+)\s*\}/)?.[1] ?? null;
    return { name, optionAGold: aGold ? Number(aGold) : null, optionBGold: bGold ? Number(bGold) : null };
  }).filter((x) => x.name);
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8'));
const classes = parseClasses();
const backgrounds = parseBackgroundGoldByName();
const errors = [];

for (const ex of extracted.classes) {
  const actual = classes.find((c) => c.name === ex.name);
  if (!actual) {
    errors.push(`Classe ausente: ${ex.name}`);
    continue;
  }
  const text = actual.equipmentChoices?.[0]?.items?.[0] ?? '';
  const actualB = text.match(/\(B\)\s*(\d+)\s*PO/i);
  const actualBGold = actualB ? Number(actualB[1]) : null;
  if (actualBGold !== ex.optionBGold) {
    errors.push(`[Classe ${ex.name}] ouro da opção B divergente: extraído=${ex.optionBGold} atual=${actualBGold}`);
  }
}

for (const ex of extracted.backgrounds) {
  const actual = backgrounds.find((b) => b.name === ex.name);
  if (!actual) {
    errors.push(`Antecedente ausente: ${ex.name}`);
    continue;
  }
  if (actual.optionAGold !== ex.optionAGold) {
    errors.push(`[Antecedente ${ex.name}] ouro da opção A divergente: extraído=${ex.optionAGold} atual=${actual.optionAGold}`);
  }
  if (actual.optionBGold !== ex.optionBGold) {
    errors.push(`[Antecedente ${ex.name}] ouro da opção B divergente: extraído=${ex.optionBGold} atual=${actual.optionBGold}`);
  }
}

if (errors.length) {
  console.error(`Validação de equipamento inicial falhou com ${errors.length} divergência(s).`);
  for (const err of errors.slice(0, 40)) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Validação de equipamento inicial concluída com sucesso.');
