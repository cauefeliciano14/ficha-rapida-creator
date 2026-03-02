import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Spell = {
  id: string;
  name: string;
  level: number;
  school: string;
  ritual: boolean;
  concentration: boolean;
  castingTime: string;
  range: string;
  components: string | string[];
  duration: string;
  classes: string[];
  description: string;
};

const DATASET_PATH = path.resolve("src/data/spells.generated.json");
const ALLOWED_LEVELS = new Set([0, 1, 2]);
const REQUIRED_FIELDS: Array<keyof Spell> = [
  "id", "name", "level", "school", "castingTime", "range", "components", "duration", "classes", "description",
];
const KNOWN_CLASSES = new Set(["Bardo", "Bruxo", "Clérigo", "Druida", "Feiticeiro", "Guardião", "Mago", "Paladino"]);

function fail(msg: string): never {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function toComponentsArray(components: string | string[]): string[] {
  if (Array.isArray(components)) return components.map((part) => part.trim()).filter(Boolean);
  return String(components ?? "").split(",").map((part) => part.trim()).filter(Boolean);
}

function main() {
  if (!existsSync(DATASET_PATH)) {
    fail("Dataset de magias não encontrado. Rode: python scripts/generate_spells_2024.py --docx sources/player_handbook_2024.docx");
  }

  const spells = JSON.parse(readFileSync(DATASET_PATH, "utf8")) as Spell[];
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const s of spells) {
    for (const field of REQUIRED_FIELDS) {
      const value = s[field];
      const missing = value === undefined || value === null || (typeof value === "string" && !value.trim()) || (Array.isArray(value) && value.length === 0);
      if (missing) errors.push(`${s.id || "(sem-id)"}: campo obrigatório vazio -> ${String(field)}`);
    }

    if (ids.has(s.id)) errors.push(`${s.id}: ID duplicado`);
    ids.add(s.id);

    if (!ALLOWED_LEVELS.has(Number(s.level))) errors.push(`${s.id}: nível fora de 0/1/2 (${s.level})`);

    const ritualExpected = s.castingTime.includes("Ritual");
    if (Boolean(s.ritual) !== ritualExpected) errors.push(`${s.id}: ritual inconsistente com castingTime`);

    const concentrationExpected = s.duration.includes("Concentração");
    if (Boolean(s.concentration) !== concentrationExpected) errors.push(`${s.id}: concentração inconsistente com duration`);

    const classes = Array.isArray(s.classes) ? s.classes : [];
    if (classes.length === 0) {
      errors.push(`${s.id}: sem classes`);
    } else {
      const unknownClasses = classes.filter((name) => !KNOWN_CLASSES.has(name));
      if (unknownClasses.length > 0) errors.push(`${s.id}: classes inválidas (${unknownClasses.join(", ")})`);
    }
  }

  const byLevel = new Map<number, Spell[]>();
  for (const s of spells) {
    const arr = byLevel.get(s.level) ?? [];
    arr.push(s);
    byLevel.set(s.level, arr);
  }

  const classCounts = new Map<string, number>();
  for (const s of spells) {
    for (const cls of s.classes ?? []) {
      classCounts.set(cls, (classCounts.get(cls) ?? 0) + 1);
    }
  }

  mkdirSync(path.resolve("docs"), { recursive: true });
  const report = [
    "# Auditoria de Magias (0/1/2)",
    "",
    `Fonte validada: \`${path.relative(process.cwd(), DATASET_PATH)}\``,
    "",
    `Total: **${spells.length}**`,
    "",
    "## Contagem por nível",
    `- Truques (0): ${byLevel.get(0)?.length ?? 0}`,
    `- 1º Círculo (1): ${byLevel.get(1)?.length ?? 0}`,
    `- 2º Círculo (2): ${byLevel.get(2)?.length ?? 0}`,
    "",
    "## Contagem por classe",
    ...[...classCounts.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR")).map(([name, count]) => `- ${name}: ${count}`),
    "",
    "## Erros de validação",
    ...(errors.length === 0 ? ["- Nenhum erro detectado na validação."] : errors.map((err) => `- ${err}`)),
    "",
    "## Exemplo de campos auditados",
    "- IDs únicos",
    "- Campos obrigatórios preenchidos",
    "- Nível restrito a 0/1/2",
    "- Coerência de ritual com castingTime",
    "- Coerência de concentração com duration",
    "- Classes válidas e listadas",
    "",
  ].join("\n");

  writeFileSync(path.resolve("docs/spells_audit.md"), report, "utf8");

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    fail(`Validação falhou com ${errors.length} erro(s).`);
  }

  console.log(`✅ Validação canônica concluída sem erros (${spells.length} magias).`);
}

main();
