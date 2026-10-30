import type { DerivedSheet } from '../rules/types/DerivedSheet';
import { ATTR_ABBR } from './attributeConstants';
import { signedMod } from './format';
import { getLanguageDisplayNames } from './languagePresentation';

/**
 * Ficha para impressão: uma página clara, independente do tema do app, que o
 * jogador salva como PDF pelo diálogo de impressão do navegador.
 */
export interface PrintableSheetData {
  characterName: string;
  className: string;
  subclassName?: string;
  speciesName: string;
  backgroundName?: string;
  alignment?: string | null;
  level: number;
  maxHp: number;
  derivedSheet: DerivedSheet;
  features: { level: number; name: string; description: string }[];
  traits: { title: string; description: string }[];
  inventory: { name: string; quantity?: number }[];
  currency?: { cp: number; sp: number; ep: number; gp: number; pp: number };
  cantrips: string[];
  preparedSpells: string[];
  backstory?: string;
}

const ATTR_ORDER = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];
const ATTR_NAMES: Record<string, string> = {
  forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição',
  inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma',
};

function esc(text: string | number | null | undefined): string {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function list(items: string[]): string {
  return items.length ? esc(items.join(', ')) : '—';
}

export function buildPrintableSheetHtml(d: PrintableSheetData): string {
  const s = d.derivedSheet;
  const dot = (on: boolean) => `<span class="dot${on ? ' on' : ''}"></span>`;

  const attrs = ATTR_ORDER.map(key => `
    <div class="attr">
      <div class="lbl">${esc(ATTR_NAMES[key])}</div>
      <div class="mod">${esc(signedMod(s.modifiers[key] ?? 0))}</div>
      <div class="score">${esc(s.finalAttributes[key] ?? 0)}</div>
    </div>`).join('');

  const saves = s.derivedSavingThrows.map(st =>
    `<li>${dot(st.proficient)}<span>${esc(st.label)}</span><b>${esc(signedMod(st.modifier))}</b></li>`).join('');

  const skills = s.skills.map(sk =>
    `<li>${dot(sk.proficient)}<span>${esc(sk.label)} <i>${esc(ATTR_ABBR[sk.attribute] ?? '')}</i>${sk.expertise ? ' (esp.)' : ''}</span><b>${esc(signedMod(sk.modifier))}</b></li>`).join('');

  const attacks = s.weaponAttacks.length
    ? s.weaponAttacks.map(a => `
      <tr><td>${esc(a.weaponName)}</td><td>${esc(signedMod(a.attackBonus))}</td>
      <td>${esc(a.damageDice)}${a.damageBonus ? esc(signedMod(a.damageBonus)) : ''} ${esc(a.damageType)}</td>
      <td>${esc(a.range)}</td><td>${esc(a.properties.join(', '))}</td></tr>`).join('')
    : '<tr><td colspan="5">—</td></tr>';

  const slots = Object.entries(s.spellSlots ?? {})
    .filter(([, n]) => (n ?? 0) > 0)
    .map(([circle, n]) => `${circle}º: ${n}`)
    .join(' · ');

  const spellBlock = s.isCaster ? `
    <section>
      <h2>Magia</h2>
      <div class="row">
        <div class="box"><div class="lbl">Atributo</div><div class="val sm">${esc(ATTR_NAMES[s.spellcastingAbility ?? ''] ?? '—')}</div></div>
        <div class="box"><div class="lbl">CD</div><div class="val">${esc(s.spellSaveDC ?? '—')}</div></div>
        <div class="box"><div class="lbl">Ataque</div><div class="val">${esc(signedMod(s.spellAttackBonus ?? 0))}</div></div>
        <div class="box wide"><div class="lbl">Espaços</div><div class="val sm">${esc(slots || '—')}</div></div>
      </div>
      <p><b>Truques:</b> ${list(d.cantrips)}</p>
      <p><b>Preparadas (${d.preparedSpells.length}/${s.preparedSpellCount ?? 0}):</b> ${list(d.preparedSpells)}</p>
    </section>` : '';

  const features = [...d.features]
    .sort((a, b) => a.level - b.level)
    .map(f => `<div class="feat"><b>${esc(f.name)}</b> <i>(nível ${esc(f.level)})</i><p>${esc(f.description)}</p></div>`)
    .join('');
  const traits = d.traits
    .map(t => `<div class="feat"><b>${esc(t.title)}</b><p>${esc(t.description)}</p></div>`)
    .join('');

  const coins = d.currency
    ? `PL ${d.currency.pp} · PO ${d.currency.gp} · PE ${d.currency.ep} · PP ${d.currency.sp} · PC ${d.currency.cp}`
    : '';

  const subtitle = [
    `${d.className}${d.subclassName ? ` (${d.subclassName})` : ''} nível ${d.level}`,
    d.speciesName,
    d.backgroundName,
    d.alignment,
  ].filter(Boolean).join(' · ');

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>${esc(d.characterName || 'Personagem')} — Ficha</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.4 Georgia, 'Times New Roman', serif; color: #1c1917; margin: 0; padding: 16px; background: #fff; }
  header { border-bottom: 2px solid #7f1d1d; padding-bottom: 6px; margin-bottom: 10px; }
  h1 { font-size: 20pt; margin: 0; letter-spacing: .02em; }
  .sub { color: #57534e; }
  h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: .08em; color: #7f1d1d; border-bottom: 1px solid #d6d3d1; margin: 12px 0 6px; padding-bottom: 2px; }
  .row { display: flex; gap: 6px; flex-wrap: wrap; }
  .box, .attr { border: 1px solid #a8a29e; border-radius: 6px; padding: 4px 8px; text-align: center; min-width: 64px; }
  .box.wide { flex: 1; text-align: left; }
  .lbl { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .06em; color: #57534e; }
  .val { font-size: 15pt; font-weight: bold; }
  .val.sm { font-size: 10.5pt; }
  .attrs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .mod { font-size: 16pt; font-weight: bold; }
  .score { font-size: 9pt; color: #57534e; }
  .cols { display: grid; grid-template-columns: 1fr 1.4fr; gap: 16px; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { display: flex; align-items: center; gap: 6px; padding: 1px 0; border-bottom: 1px dotted #e7e5e4; }
  li span { flex: 1; } li i { color: #78716c; font-size: 8pt; font-style: normal; }
  .dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #57534e; flex: none; }
  .dot.on { background: #1c1917; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 3px 4px; border-bottom: 1px solid #e7e5e4; font-size: 9.5pt; }
  th { font-size: 7.5pt; text-transform: uppercase; color: #57534e; }
  p { margin: 3px 0; }
  .feat { break-inside: avoid; margin-bottom: 6px; }
  .feat p { font-size: 9pt; color: #44403c; white-space: pre-line; }
  .story { white-space: pre-line; }
  .hint { font: 12px system-ui, sans-serif; background: #fef3c7; border: 1px solid #f59e0b; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; }
  @media print { .hint { display: none; } body { padding: 0; } }
</style></head>
<body>
  <div class="hint">Para salvar em PDF: na janela de impressão, escolha <b>Salvar como PDF</b> como destino.</div>
  <header>
    <h1>${esc(d.characterName || 'Personagem sem nome')}</h1>
    <div class="sub">${esc(subtitle)}</div>
  </header>

  <div class="row">
    <div class="box"><div class="lbl">PV máx.</div><div class="val">${esc(d.maxHp)}</div></div>
    <div class="box"><div class="lbl">CA</div><div class="val">${esc(s.armorClass)}</div></div>
    <div class="box"><div class="lbl">Iniciativa</div><div class="val">${esc(signedMod(s.initiative))}</div></div>
    <div class="box"><div class="lbl">Deslocamento</div><div class="val sm">${esc(s.speed)}</div></div>
    <div class="box"><div class="lbl">Proficiência</div><div class="val">${esc(signedMod(s.proficiencyBonus))}</div></div>
    <div class="box"><div class="lbl">Dado de vida</div><div class="val sm">${esc(s.hitDie)}</div></div>
    <div class="box"><div class="lbl">Percepção passiva</div><div class="val">${esc(s.passivePerception)}</div></div>
  </div>

  <section><h2>Atributos</h2><div class="attrs">${attrs}</div></section>

  <div class="cols">
    <div>
      <section><h2>Salvaguardas</h2><ul>${saves}</ul></section>
      <section><h2>Proficiências</h2>
        <p><b>Armas:</b> ${list(s.weaponProficiencies)}</p>
        <p><b>Armaduras:</b> ${list(s.armorProficiencies)}</p>
        <p><b>Ferramentas:</b> ${list(s.toolProficiencies)}</p>
        <p><b>Idiomas:</b> ${list(getLanguageDisplayNames(s.languages))}</p>
      </section>
    </div>
    <section><h2>Perícias</h2><ul>${skills}</ul></section>
  </div>

  <section><h2>Ataques</h2>
    <table><thead><tr><th>Arma</th><th>Acerto</th><th>Dano</th><th>Alcance</th><th>Propriedades</th></tr></thead>
    <tbody>${attacks}</tbody></table>
  </section>

  ${spellBlock}

  <section><h2>Equipamento</h2>
    <p>${d.inventory.length ? esc(d.inventory.map(i => ((i.quantity ?? 1) > 1 ? `${i.name} ×${i.quantity}` : i.name)).join(', ')) : '—'}</p>
    ${coins ? `<p><b>Moedas:</b> ${esc(coins)}</p>` : ''}
  </section>

  ${features ? `<section><h2>Características de classe</h2>${features}</section>` : ''}
  ${traits ? `<section><h2>Traços de espécie</h2>${traits}</section>` : ''}
  ${d.backstory ? `<section><h2>História</h2><p class="story">${esc(d.backstory)}</p></section>` : ''}
</body></html>`;
}

/**
 * Imprime a ficha por um iframe invisível, sem abrir aba nova (bloqueadores de
 * pop-up não interferem). O jogador escolhe "Salvar como PDF" no diálogo.
 */
export function openPrintableSheet(data: PrintableSheetData): boolean {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  document.body.appendChild(frame);
  const win = frame.contentWindow;
  if (!win) {
    frame.remove();
    return false;
  }
  win.document.open();
  win.document.write(buildPrintableSheetHtml(data));
  win.document.close();
  // O nome do PDF sugerido vem do título do documento principal.
  const previousTitle = document.title;
  document.title = win.document.title;
  const cleanup = () => {
    document.title = previousTitle;
    frame.remove();
  };
  win.addEventListener('afterprint', () => setTimeout(cleanup, 0), { once: true });
  setTimeout(() => {
    win.focus();
    win.print();
  }, 150);
  // Rede de segurança caso o navegador não dispare afterprint.
  setTimeout(() => { if (frame.isConnected) cleanup(); }, 120000);
  return true;
}
