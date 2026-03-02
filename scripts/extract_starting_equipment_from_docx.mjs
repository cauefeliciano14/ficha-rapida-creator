import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DOCX_PATH = path.resolve('sources/player_handbook_2024.docx');
const OUT_PATH = path.resolve('scripts/out/starting_equipment_extracted.json');

function decodeXml(str) { return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'"); }
function readDocxParagraphs(docxPath){const xml=execSync(`unzip -p "${docxPath}" word/document.xml`,{encoding:'utf8',maxBuffer:250*1024*1024});const p=[];for(const m of xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)){const x=m[0];const t=[...x.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((r)=>decodeXml(r[1])).join('').replace(/\s+/g,' ').trim();if(!t)continue;p.push({text:t});}return p;}
function parseGold(raw){const mB=raw.match(/\(B\)\s*(\d+)\s*PO/i);const mA=raw.match(/,\s*(\d+)\s*PO\s*;\s*ou\s*(?:\(B\))?/i);return {optionAGold:mA?Number(mA[1]):null,optionBGold:mB?Number(mB[1]):null};}
function parseClassNames(){const src=fs.readFileSync(path.resolve('src/data/classes.ts'),'utf8');const m=src.match(/export const classes: ClassData\[\] = ([\s\S]*);\s*$/);if(!m) throw new Error('classes.ts inválido'); const c={classes:[]}; vm.createContext(c); vm.runInContext(`classes=${m[1]};`,c); return c.classes.map((x)=>x.name);}
function extractClassEquipment(lines){const names=parseClassNames();const start=lines.findIndex((l)=>/Capítulo\s*3.*Classes de Personagens?/.test(l));const end=lines.findIndex((l,i)=>i>start&&/Capítulo\s*4.*Origens dos Personagens/.test(l));if(start===-1||end===-1) throw new Error('Limites de capítulo (classes) não encontrados.');const section=lines.slice(start,end);return names.map((name)=>{const idx = section.findIndex((line) => line.includes(`Traços Básicos de ${name}`)); if (idx===-1)return {name,rawEquipment:null,optionAGold:null,optionBGold:null};const block=section.slice(idx,idx+120);const eqIdx=block.findIndex((x)=>x==='Equipamento Inicial'); const line = eqIdx>=0 ? block.slice(eqIdx, eqIdx+6).find((x)=>x.includes('Escolha A ou B:')) ?? null : block.find((x)=>x.includes('Escolha A ou B:')) ?? null;const g=line?parseGold(line):{optionAGold:null,optionBGold:null};return {name,rawEquipment:line,...g};});}
function extractBackgroundEquipment(lines){const start=lines.indexOf('Descrições dos Antecedentes');const end=lines.findIndex((l,i)=>i>start&&l==='Capítulo 5 - Talentos');if(start===-1||end===-1) throw new Error('Limites de capítulo (antecedentes) não encontrados.');const section=lines.slice(start,end);const result=[];let currentName=null;for(const line of section){if(/^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-Za-zÀ-ÿ ]{3,30}$/.test(line)&&!line.startsWith('Valores de')&&!line.startsWith('Profici')){currentName=line;continue;}if(!line.startsWith('Equipamento: Escolha A ou B:')||!currentName) continue;const raw=line.replace(/^Equipamento:\s*/,'');const g=parseGold(raw);result.push({name:currentName,rawEquipment:raw,...g});}return result.filter((e,i,a)=>a.findIndex((x)=>x.name===e.name)===i);}

if (!fs.existsSync(DOCX_PATH)) throw new Error('DOCX não encontrado em sources/player_handbook_2024.docx');
const lines = readDocxParagraphs(DOCX_PATH).map((x)=>x.text);
const classes = extractClassEquipment(lines);
const backgrounds = extractBackgroundEquipment(lines);
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify({ source: 'sources/player_handbook_2024.docx', classes, backgrounds }, null, 2)}\n`);
console.log(`Extração concluída: ${OUT_PATH} (${classes.length} classes, ${backgrounds.length} antecedentes)`);
