import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Spell = {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  description: string;
};

function fail(msg: string): never {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function main() {
  const canonPath = path.resolve("src/data/_canon/spells_0_1_2.json");
  if (!existsSync(canonPath)) fail("Arquivo canônico de magias não encontrado. Rode: node scripts/extract_player_handbook_2024.ts");

  const spells = JSON.parse(readFileSync(canonPath, "utf8")) as Spell[];
  const errors: string[] = [];

  const ids = new Set<string>();
  for (const s of spells) {
    const required: Array<keyof Spell> = ["id", "name", "level", "school", "castingTime", "range", "components", "duration", "description"];
    for (const f of required) {
      const v = (s as any)[f];
      if (v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0)) {
        errors.push(`${s.id || "(sem-id)"}: campo obrigatório vazio -> ${String(f)}`);
      }
    }

    if (ids.has(s.id)) errors.push(`${s.id}: ID duplicado`);
    ids.add(s.id);

    if (![0, 1, 2].includes(Number(s.level))) errors.push(`${s.id}: nível fora de 0/1/2 (${s.level})`);
    if ((s.description ?? "").trim().length < 20) errors.push(`${s.id}: descrição possivelmente truncada`);
  }

  const byLevel = new Map<number, string[]>();
  for (const s of spells) {
    const arr = byLevel.get(s.level) ?? [];
    arr.push(s.name);
    byLevel.set(s.level, arr);
  }
  for (const arr of byLevel.values()) arr.sort((a, b) => a.localeCompare(b, "pt-BR"));

  mkdirSync(path.resolve("docs"), { recursive: true });
  const audit = [
    "# Auditoria de Magias (0/1/2)",
    "",
    `Total: **${spells.length}**`,
    "",
    "## Contagem por nível",
    `- Truques (0): ${byLevel.get(0)?.length ?? 0}`,
    `- 1º Círculo (1): ${byLevel.get(1)?.length ?? 0}`,
    `- 2º Círculo (2): ${byLevel.get(2)?.length ?? 0}`,
    "",
    "## Nomes por nível",
    `### 0\n${(byLevel.get(0) ?? []).map((n) => `- ${n}`).join("\n")}`,
    `\n### 1\n${(byLevel.get(1) ?? []).map((n) => `- ${n}`).join("\n")}`,
    `\n### 2\n${(byLevel.get(2) ?? []).map((n) => `- ${n}`).join("\n")}`,
    "",
    "## Erros corrigidos",
    errors.length === 0 ? "- Nenhum erro detectado na validação." : errors.map((e) => `- ${e}`).join("\n"),
    "",
  ].join("\n");

  writeFileSync(path.resolve("docs/spells_audit.md"), audit);

  if (errors.length) {
    console.error(errors.join("\n"));
    fail(`Validação falhou com ${errors.length} erro(s).`);
  }

  console.log("✅ Validação canônica concluída sem erros.");
}

main();
