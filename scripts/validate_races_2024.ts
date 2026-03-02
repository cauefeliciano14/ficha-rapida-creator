import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DRAGONBORN_HERITAGES, ELF_LINEAGES, races } from "../src/data/races.ts";

const extractedPath = path.resolve("scripts/_tmp/races_2024_extracted.json");
const canonicalPath = path.resolve("src/data/_canon/races_10.json");
const raceTsPath = path.resolve("src/data/races.ts");
const auditPath = path.resolve("docs/races_audit.md");

const expected = ["Aasimar", "Anão", "Draconato", "Elfo", "Gnomo", "Golias", "Humano", "Orc", "Pequenino", "Tiferino"];
const placeholders = ["TODO", "Magia de linhagem (nível 3)", "Magia de linhagem (nível 5)"];

type ChoiceKind = "dragonAncestry" | "elfLineage" | "gnomeLineage" | "giantAncestry" | "infernalLegacy";
type OptionAuditStatus = "ready" | "planned" | "missing";

const CHOICE_CANONICAL_IDS: Record<ChoiceKind, string[]> = {
  dragonAncestry: ["azul", "branco", "bronze", "cobre", "latao", "negro", "ouro", "prata", "verde", "vermelho"],
  elfLineage: ["altoElfo", "drow", "elfoSilvestre"],
  gnomeLineage: ["bosque", "rochas"],
  giantAncestry: ["tempestade", "pedra", "fogo", "gelo", "nuvem", "colina"],
  infernalLegacy: ["abissal", "ctonico", "infernal"],
};

const CHOICE_LABELS: Record<ChoiceKind, string> = {
  dragonAncestry: "Draconato (dragonAncestry)",
  elfLineage: "Elfo (elfLineage)",
  gnomeLineage: "Gnomo (gnomeLineage)",
  giantAncestry: "Golias (giantAncestry)",
  infernalLegacy: "Tiferino (infernalLegacy)",
};

function fail(msg: string): never {
  throw new Error(msg);
}

function buildImplementedOptionsMap() {
  const options = new Map<string, OptionAuditStatus>();

  for (const race of races) {
    for (const option of race.raceChoice?.options ?? []) {
      options.set(option.id, option.availability ?? "ready");
    }
  }

  for (const option of DRAGONBORN_HERITAGES) {
    options.set(option.id, "ready");
  }

  for (const option of ELF_LINEAGES) {
    options.set(option.id, "ready");
  }

  return options;
}

function optionStatusLabel(status: OptionAuditStatus): string {
  if (status === "ready") return "ready ✅";
  if (status === "planned") return "planned 🛠️";
  return "missing ❌";
}

function main() {
  if (races.length !== 10) fail(`Esperado 10 raças em races.ts, encontrado ${races.length}.`);

  const ids = new Set<string>();
  for (const r of races) {
    if (ids.has(r.id)) fail(`ID duplicado: ${r.id}`);
    ids.add(r.id);
    if (!r.name?.trim()) fail(`Raça sem name: ${r.id}`);
    if (!r.description?.trim()) fail(`Raça sem description: ${r.id}`);
    if (!r.size?.trim()) fail(`Raça sem size: ${r.id}`);
    if (!(r.speed > 0)) fail(`Raça sem speed válido: ${r.id}`);
  }

  const raceTs = readFileSync(raceTsPath, "utf8");
  for (const p of placeholders) {
    if (raceTs.includes(p)) fail(`Placeholder encontrado em races.ts: ${p}`);
  }

  const extracted: Array<{ name: string; traits: { name: string }[] }> = JSON.parse(readFileSync(extractedPath, "utf8"));
  const canonical = JSON.parse(readFileSync(canonicalPath, "utf8")) as Array<{ id: string; name: string }>;
  const names = races.map((r) => r.name);
  for (const n of expected) if (!names.includes(n)) fail(`Raça ausente em races.ts: ${n}`);

  const canonicalIds = new Set(canonical.map((item) => item.id));
  for (const [kind, ids] of Object.entries(CHOICE_CANONICAL_IDS) as Array<[ChoiceKind, string[]]>) {
    for (const id of ids) {
      if (!canonicalIds.has(id)) fail(`ID canônico ausente para ${kind}: ${id}`);
    }
  }

  for (const item of extracted) {
    const race = races.find((r) => r.name === item.name);
    if (!race) fail(`Raça extraída ausente em races.ts: ${item.name}`);
    for (const t of item.traits) {
      if (!race.traits.some((x) => x.name === t.name)) fail(`Traço faltando em ${item.name}: ${t.name}`);
    }
  }

  const implementedOptions = buildImplementedOptionsMap();
  const choiceAudit = (Object.entries(CHOICE_CANONICAL_IDS) as Array<[ChoiceKind, string[]]>).map(([kind, expectedIds]) => {
    const perOption = expectedIds.map((id) => {
      const status = implementedOptions.get(id) ?? "missing";
      return { id, status };
    });

    return {
      kind,
      ready: perOption.filter((item) => item.status === "ready").length,
      planned: perOption.filter((item) => item.status === "planned").length,
      missing: perOption.filter((item) => item.status === "missing").length,
      perOption,
    };
  });

  const audit = [
    "# Auditoria de Raças 2024",
    "",
    `Total de raças: ${races.length}`,
    "",
    "## Raças",
    ...races.map((r) => `- ${r.name}: ${r.traits.length} traços`),
    "",
    "## Legenda de status das opções",
    "- `ready`: opção implementada no catálogo (`raceChoice.options` ou estruturas equivalentes já publicadas).",
    "- `planned`: opção cadastrada no catálogo, mas marcada como planejada.",
    "- `missing`: opção esperada no catálogo canônico, mas ainda não cadastrada no app.",
    "",
    "## Tabelas/Escolhas capturadas",
    ...choiceAudit.flatMap((item) => {
      const label = CHOICE_LABELS[item.kind];
      return [
        `- ${label}: ready=${item.ready}, planned=${item.planned}, missing=${item.missing}`,
        ...item.perOption.map((option) => `  - ${option.id}: ${optionStatusLabel(option.status)}`),
      ];
    }),
    "",
    "Validação concluída com sucesso.",
  ].join("\n");

  writeFileSync(auditPath, audit + "\n");
  console.log("Validação concluída e docs/races_audit.md atualizado.");
}

main();
