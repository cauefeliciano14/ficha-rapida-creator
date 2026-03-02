import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const DOCX_PATH = path.resolve("sources/player_handbook_2024.docx");
const TMP_DIR = path.resolve("scripts/_tmp");
const SPECIES = ["Aasimar", "Anão", "Draconato", "Elfo", "Gnomo", "Golias", "Humano", "Orc", "Pequenino", "Tiferino"] as const;

type Trait = { name: string; description: string };
type ExtractedRace = {
  name: string;
  description: string;
  tipoCriatura: string;
  tamanho: string;
  deslocamento: string;
  traits: Trait[];
  tableData: Record<string, unknown>;
};

function readDocumentXml() {
  return execSync(`unzip -p ${JSON.stringify(DOCX_PATH)} word/document.xml`, { encoding: "utf8", maxBuffer: 1024 * 1024 * 50 });
}

function xmlToPlainText(xml: string): string {
  return xml
    .replace(/<w:tab\/?\s*>/g, "\t")
    .replace(/<w:br\/?\s*>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "");
}

function xmlToLooseHtml(xml: string): string {
  return xml
    .replace(/<w:tbl\b[^>]*>/g, "<table>")
    .replace(/<\/w:tbl>/g, "</table>")
    .replace(/<w:tr\b[^>]*>/g, "<tr>")
    .replace(/<\/w:tr>/g, "</tr>")
    .replace(/<w:tc\b[^>]*>/g, "<td>")
    .replace(/<\/w:tc>/g, "</td>")
    .replace(/<w:p\b[^>]*>/g, "<p>")
    .replace(/<\/w:p>/g, "</p>")
    .replace(/<w:t\b[^>]*>/g, "")
    .replace(/<\/w:t>/g, "")
    .replace(/<w:tab\/?\s*>/g, "\t")
    .replace(/<w:br\/?\s*>/g, "<br />")
    .replace(/<[^>]+>/g, (tag) => (tag.startsWith("<p") || tag.startsWith("</p") || tag.startsWith("<table") || tag.startsWith("</table") || tag.startsWith("<tr") || tag.startsWith("</tr") || tag.startsWith("<td") || tag.startsWith("</td") || tag.startsWith("<br") ? tag : ""));
}

function extractRaces(lines: string[]): ExtractedRace[] {
  const start = lines.indexOf("Descrições das Espécies");
  const end = lines.indexOf("Capítulo 5 - Talentos");
  const inSection = lines.slice(start, end);

  const indexes = SPECIES.map((name) => ({ name, idx: inSection.indexOf(name) })).sort((a, b) => a.idx - b.idx);

  return indexes.map((entry, i) => {
    const next = indexes[i + 1]?.idx ?? inSection.length;
    const block = inSection.slice(entry.idx, next);
    const traitHeader = block.findIndex((l) => l === `Traços de ${entry.name}`);

    const description = block.slice(1, traitHeader).join("\n\n").trim();
    const traitLines = block.slice(traitHeader + 1);

    const tipoCriatura = traitLines.find((l) => l.startsWith("Tipo de Criatura:"))?.replace("Tipo de Criatura:", "").trim() ?? "";
    const tamanho = traitLines.find((l) => l.startsWith("Tamanho:"))?.replace("Tamanho:", "").trim() ?? "";
    const deslocamento = traitLines.find((l) => l.startsWith("Deslocamento:"))?.replace("Deslocamento:", "").trim() ?? "";

    const details = traitLines.filter((l) => !l.startsWith("Tipo de Criatura:") && !l.startsWith("Tamanho:") && !l.startsWith("Deslocamento:"));
    const traits: Trait[] = [];
    for (const line of details) {
      const m = line.match(/^([^.:]{3,80})\.\s+(.+)$/);
      if (m) {
        traits.push({ name: m[1].trim(), description: m[2].trim() });
      } else if (traits.length) {
        traits[traits.length - 1].description += `\n${line}`;
      }
    }

    return {
      name: entry.name,
      description,
      tipoCriatura,
      tamanho,
      deslocamento,
      traits,
      tableData: {},
    };
  });
}

function main() {
  mkdirSync(TMP_DIR, { recursive: true });
  const xml = readDocumentXml();
  const txt = xmlToPlainText(xml);
  const lines = txt.split("\n").map((l) => l.trim()).filter(Boolean);

  const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>PHB 2024</title></head><body>${xmlToLooseHtml(xml)}</body></html>`;
  const extracted = extractRaces(lines);

  writeFileSync(path.join(TMP_DIR, "player_handbook_2024.html"), html);
  writeFileSync(path.join(TMP_DIR, "player_handbook_2024.txt"), txt);
  writeFileSync(path.join(TMP_DIR, "races_2024_extracted.json"), JSON.stringify(extracted, null, 2) + "\n");

  console.log(`Extraído: ${extracted.length} espécies -> scripts/_tmp/races_2024_extracted.json`);
}

main();
