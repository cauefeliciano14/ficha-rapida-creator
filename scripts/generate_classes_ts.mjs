import fs from 'node:fs';
import path from 'node:path';

const EXTRACTED_PATH = path.resolve('scripts/out/classes_extracted.json');
const CLASSES_TS_PATH = path.resolve('src/data/classes.ts');

function toId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseList(text) {
  return text
    .replace(/\sou\s/gi, ', ')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseChooseSkills(skillsText) {
  const m = skillsText.match(/Escolha\s+(\d+)\s*:\s*(.+)$/i);
  if (!m) return { choose: 0, from: skillsText ? [skillsText] : [] };
  const choose = Number(m[1]);
  const from = m[2].replace(/\.$/, '').replace(/\s+ou\s+/g, ', ').split(',').map((x) => x.trim()).filter(Boolean);
  return { choose, from };
}

function parseHitDie(hitText) {
  const m = hitText.match(/D(\d+)/i);
  return m ? Number(m[1]) : 8;
}

function buildClassData(entry) {
  const bt = entry.basicTraitsParsed;
  const skills = parseChooseSkills(bt.skills || '');
  const hasSpellcasting = Boolean(entry.spellcastingRaw);
  const spellType = /Pacto/i.test(entry.spellcastingRaw || '') ? 'pact' : (/Conhecid/i.test(entry.spellcastingRaw || '') ? 'known' : 'prepared');

  return {
    id: toId(entry.name),
    name: entry.name,
    description: entry.description,
    textBlocks: {
      basicTraits: entry.basicTraitsRaw,
      spellcasting: entry.spellcastingRaw,
    },
    primaryAbility: bt.primaryAbility ? [bt.primaryAbility] : [],
    hitDie: parseHitDie(bt.hitDie || ''),
    savingThrows: parseList(bt.savingThrows || ''),
    proficiencies: {
      armor: parseList(bt.armor || ''),
      weapons: parseList(bt.weapons || ''),
      tools: parseList(bt.tools || ''),
      languages: parseList(bt.languages || ''),
    },
    skillChoices: skills,
    equipmentChoices: [
      { id: 'A', label: 'Escolha A', items: bt.equipmentRaw ? [bt.equipmentRaw] : [], gold: 0 },
    ],
    spellcasting: hasSpellcasting
      ? {
        ability: bt.primaryAbility || 'Carisma',
        type: spellType,
        cantripsKnownAtLevel: {},
        spellsPreparedFormula: entry.spellcastingRaw,
        spellSlotsByLevel: {},
      }
      : null,
    featuresByLevel: entry.featuresByLevelParsed,
    subclasses: entry.subclasses.map((s) => ({
      id: toId(s.name),
      name: s.name,
      description: s.description,
      featuresByLevel: s.featuresByLevelParsed,
    })),
    subclassLevel: entry.featuresByLevelParsed.flatMap((x) => x.features).some((f) => /Subclasse/.test(f.name))
      ? entry.featuresByLevelParsed.find((x) => x.features.some((f) => /Subclasse/.test(f.name)))?.level
      : undefined,
    asiLevels: entry.featuresByLevelParsed
      .filter((x) => x.features.some((f) => /Aumento no Valor de Atributo/.test(f.name)))
      .map((x) => x.level),
  };
}

const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8'));
const classes = extracted.classes.map(buildClassData);

const ts = `export interface EquipmentChoice {
  id: string;
  label: string;
  items: string[];
  gold: number;
}

export interface SpellcastingData {
  ability: string;
  type: "prepared" | "known" | "pact";
  cantripsKnownAtLevel: Record<number, number>;
  spellsPreparedFormula: string;
  spellSlotsByLevel: Record<number, Record<number, number>>;
  spellsKnownAtLevel?: Record<number, number>;
}

export interface ClassFeature {
  name: string;
  description: string;
}

export interface FeaturesByLevel {
  level: number;
  features: ClassFeature[];
}

export interface SubclassData {
  id: string;
  name: string;
  description: string;
  featuresByLevel: FeaturesByLevel[];
}

export interface ClassData {
  id: string;
  name: string;
  description: string;
  textBlocks: {
    basicTraits: string;
    spellcasting: string | null;
  };
  primaryAbility: string[];
  hitDie: number;
  savingThrows: string[];
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    languages: string[];
  };
  skillChoices: { choose: number; from: string[] };
  equipmentChoices: EquipmentChoice[];
  spellcasting: SpellcastingData | null;
  featuresByLevel: FeaturesByLevel[];
  subclasses: SubclassData[];
  subclassLevel?: number;
  asiLevels: number[];
  attributeBonus?: string[];
}

export const classes: ClassData[] = ${JSON.stringify(classes, null, 2)};
`;

fs.writeFileSync(CLASSES_TS_PATH, `${ts}\n`);
console.log(`Arquivo atualizado: ${CLASSES_TS_PATH}`);
