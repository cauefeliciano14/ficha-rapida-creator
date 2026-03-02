import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DOCX_PATH = path.resolve("sources/player_handbook_2024.docx");
const CANON_DIR = path.resolve("src/data/_canon");
const SPELLS_JSON_PATH = path.resolve("src/data/spells.generated.json");

function extractDocxPlainText(docxPath: string): string {
  const xml = execSync(`unzip -p ${JSON.stringify(docxPath)} word/document.xml`, { encoding: "utf8", maxBuffer: 1024 * 1024 * 25 });
  return xml
    .replace(/<w:tab\/?\s*>/g, "\t")
    .replace(/<w:br\/?\s*>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r/g, "");
}

function parseKnownCatalogFromTs(sourcePath: string, exportName: string): Array<{ id: string; name: string }> {
  const src = readFileSync(sourcePath, "utf8");
  const blockMatch = src.match(new RegExp(`export const ${exportName}:[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\];`));
  if (!blockMatch) return [];
  const block = blockMatch[1];
  const out: Array<{ id: string; name: string }> = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) out.push({ id: m[1], name: m[2] });
  return out;
}

function main() {
  mkdirSync(CANON_DIR, { recursive: true });

  const text = extractDocxPlainText(DOCX_PATH);
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const allSpells = JSON.parse(readFileSync(SPELLS_JSON_PATH, "utf8"));
  const spells012 = allSpells.filter((s: any) => [0, 1, 2].includes(Number(s.level)))
    .sort((a: any, b: any) => a.level - b.level || a.name.localeCompare(b.name, "pt-BR"));

  const classes = parseKnownCatalogFromTs(path.resolve("src/data/classes.ts"), "classes");
  const backgrounds = parseKnownCatalogFromTs(path.resolve("src/data/backgrounds.ts"), "backgrounds");
  const races = parseKnownCatalogFromTs(path.resolve("src/data/races.ts"), "races");

  const languagesCommon = [...new Set(lines.filter((l) => l.length < 30 && /[A-Za-zÀ-ÿ]/.test(l) && /Comum|Anão|Élfico|Dracônico|Infernal|Celestial|Gigante/i.test(l)))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const instruments = [...new Set(lines.filter((l) => l.length < 60 && /(alaúde|flauta|tambor|lira|gaita|violino|harpa|chifre)/i.test(l)))].sort((a, b) => a.localeCompare(b, "pt-BR"));

  writeFileSync(path.join(CANON_DIR, "spells_0_1_2.json"), JSON.stringify(spells012, null, 2) + "\n");
  writeFileSync(path.join(CANON_DIR, "classes_10.json"), JSON.stringify(classes, null, 2) + "\n");
  writeFileSync(path.join(CANON_DIR, "backgrounds_16.json"), JSON.stringify(backgrounds, null, 2) + "\n");
  writeFileSync(path.join(CANON_DIR, "races_10.json"), JSON.stringify(races, null, 2) + "\n");
  writeFileSync(path.join(CANON_DIR, "languages_common.json"), JSON.stringify(languagesCommon, null, 2) + "\n");
  writeFileSync(path.join(CANON_DIR, "instruments.json"), JSON.stringify(instruments, null, 2) + "\n");

  console.log("Canon extracted to src/data/_canon");
}

main();
