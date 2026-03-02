import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { races } from "../src/data/races.ts";

const extractedPath = path.resolve("scripts/_tmp/races_2024_extracted.json");
const raceTsPath = path.resolve("src/data/races.ts");
const auditPath = path.resolve("docs/races_audit.md");

const expected = ["Aasimar", "Anão", "Draconato", "Elfo", "Gnomo", "Golias", "Humano", "Orc", "Pequenino", "Tiferino"];
const placeholders = ["TODO", "Magia de linhagem (nível 3)", "Magia de linhagem (nível 5)"];

function fail(msg: string): never {
  throw new Error(msg);
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
  const names = races.map((r) => r.name);
  for (const n of expected) if (!names.includes(n)) fail(`Raça ausente em races.ts: ${n}`);

  for (const item of extracted) {
    const race = races.find((r) => r.name === item.name);
    if (!race) fail(`Raça extraída ausente em races.ts: ${item.name}`);
    for (const t of item.traits) {
      if (!race.traits.some((x) => x.name === t.name)) fail(`Traço faltando em ${item.name}: ${t.name}`);
    }
  }

  const audit = [
    "# Auditoria de Raças 2024",
    "",
    `Total de raças: ${races.length}`,
    "",
    "## Raças",
    ...races.map((r) => `- ${r.name}: ${r.traits.length} traços`),
    "",
    "## Tabelas/Escolhas capturadas",
    `- Draconato (dragonAncestry): ${races.find((r) => r.id === "draconato")?.raceChoice?.options.length ?? 0} opções`,
    `- Elfo (elfLineage): ${races.find((r) => r.id === "elfo")?.raceChoice?.options.length ?? 0} opções`,
    `- Gnomo (gnomeLineage): ${races.find((r) => r.id === "gnomo")?.raceChoice?.options.length ?? 0} opções`,
    `- Golias (giantAncestry): ${races.find((r) => r.id === "golias")?.raceChoice?.options.length ?? 0} opções`,
    `- Tiferino (infernalLegacy): ${races.find((r) => r.id === "tiferino")?.raceChoice?.options.length ?? 0} opções`,
    "",
    "Validação concluída com sucesso.",
  ].join("\n");

  writeFileSync(auditPath, audit + "\n");
  console.log("Validação concluída e docs/races_audit.md atualizado.");
}

main();
