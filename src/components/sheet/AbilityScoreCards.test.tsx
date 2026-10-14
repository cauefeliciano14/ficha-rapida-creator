import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { signedMod } from '../../utils/format';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AbilityScoreCards } from './AbilityScoreCards';

// @ts-expect-error jsdom test env flag for React act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Visual contract test (estático): garante que o CSS dos cards de
 * atributos NÃO volte a usar clip-path nem position absolute nos
 * elementos internos (label / scoreBadge / modifier).
 * Também valida formatação consistente do modificador.
 */
describe('AbilityScoreCards — visual contract', () => {
  const css = readFileSync(
    resolve(__dirname, './AbilityScoreCards.module.css'),
    'utf8'
  );

  it('a regra .box NÃO usa clip-path (retângulo limpo)', () => {
    const boxBlock = css.match(/\.box\s*\{[^}]*\}/)?.[0] ?? '';
    expect(boxBlock).not.toMatch(/clip-path\s*:/);
    expect(boxBlock).toMatch(/border-radius\s*:/);
  });

  it('label e scoreBadge não usam position: absolute', () => {
    const labelBlock = css.match(/\.label\s*\{[^}]*\}/)?.[0] ?? '';
    const badgeBlock = css.match(/\.scoreBadge\s*\{[^}]*\}/)?.[0] ?? '';
    expect(labelBlock).not.toMatch(/position\s*:\s*absolute/);
    expect(badgeBlock).not.toMatch(/position\s*:\s*absolute/);
  });

  it('modificador é formatado com sinal (+/-/+0)', () => {
    expect(signedMod(3)).toBe('+3');
    expect(signedMod(0)).toBe('+0');
    expect(signedMod(-1)).toBe('-1');
  });

  it('label da característica permanece legível em telas pequenas (>= 0.65rem)', () => {
    const mobileBlock = css.match(/@media\s*\(max-width:\s*479px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
    const labelSize = mobileBlock.match(/\.label\s*\{[^}]*font-size\s*:\s*([\d.]+)rem/)?.[1];
    if (labelSize) {
      expect(parseFloat(labelSize)).toBeGreaterThanOrEqual(0.65);
    }
  });

  it('gridHorizontal usa 6 colunas iguais (linha única no desktop)', () => {
    const block = css.match(/\.gridHorizontal\s*\{[^}]*\}/)?.[0] ?? '';
    expect(block).toMatch(/grid-template-columns\s*:\s*repeat\(6,\s*1fr\)/);
    expect(block).not.toMatch(/clip-path\s*:/);
    expect(block).not.toMatch(/position\s*:\s*absolute/);
  });
});

describe('AbilityScoreCards — ordering contract', () => {
  it('a lista de labels ordenada por localeCompare(pt-BR) começa com Carisma', () => {
    const names = ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'];
    const sorted = names.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'));
    expect(sorted).toEqual(['Carisma', 'Constituição', 'Destreza', 'Força', 'Inteligência', 'Sabedoria']);
  });

  it('renderiza os 6 cards na ordem alfabética pt-BR (DOM)', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const finalAttributes = { forca: 14, destreza: 12, constituicao: 13, inteligencia: 10, sabedoria: 11, carisma: 8 };
    const modifiers = { forca: 2, destreza: 1, constituicao: 1, inteligencia: 0, sabedoria: 0, carisma: -1 };

    act(() => {
      root.render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal />);
    });

    const labels = Array.from(container.querySelectorAll('[class*="label"]'))
      .map(el => el.textContent?.trim())
      .filter(Boolean);
    expect(labels.slice(0, 6)).toEqual(['Carisma', 'Constituição', 'Destreza', 'Força', 'Inteligência', 'Sabedoria']);

    act(() => root.unmount());
    container.remove();
  });

  it('cada label tem tooltip (title) explicando como o modificador é calculado', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const finalAttributes = { forca: 14, destreza: 12, constituicao: 13, inteligencia: 10, sabedoria: 11, carisma: 8 };
    const modifiers = { forca: 2, destreza: 1, constituicao: 1, inteligencia: 0, sabedoria: 0, carisma: -1 };

    act(() => {
      root.render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal />);
    });

    const labelsWithTitle = Array.from(container.querySelectorAll('[title]'))
      .filter(el => /Modificador\s*=\s*\(Total\s*-\s*10\)/i.test(el.getAttribute('title') ?? ''));
    expect(labelsWithTitle.length).toBeGreaterThanOrEqual(6);

    act(() => root.unmount());
    container.remove();
  });
});

describe('CharacterSheetPage statsBand — single-row contract', () => {
  const css = readFileSync(
    resolve(__dirname, './CharacterSheetPage.module.css'),
    'utf8'
  );

  it('.statsBand é flex row no desktop (linha única)', () => {
    const block = css.match(/\.statsBand\s*\{[^}]*\}/)?.[0] ?? '';
    expect(block).toMatch(/flex-direction\s*:\s*row/);
  });

  it('.statsBandAbilities distribui 6 colunas iguais', () => {
    const block = css.match(/\.statsBandAbilities\s*\{[^}]*\}/)?.[0] ?? '';
    expect(block).toMatch(/grid-template-columns\s*:\s*repeat\(6,\s*1fr\)/);
  });

  it('.statsBandRight não quebra linha por padrão (nowrap) no desktop', () => {
    const block = css.match(/\.statsBandRight\s*\{[^}]*\}/)?.[0] ?? '';
    expect(block).toMatch(/flex-wrap\s*:\s*nowrap/);
  });

  it('empilha até 1023px (mantém linha única acima)', () => {
    expect(css).toMatch(/@media\s*\(max-width:\s*1023px\)\s*\{[\s\S]*?\.statsBand\s*\{[^}]*flex-direction\s*:\s*column/);
  });

  it('blocos de PB, Caminhada, Inspiração e HP têm a mesma altura mínima (110px)', () => {
    const statBox = css.match(/\.statBox\s*\{[^}]*\}/)?.[0] ?? '';
    const heroicBox = css.match(/\.heroicBox\s*\{[^}]*\}/)?.[0] ?? '';
    const hpPanel = css.match(/\.hpPanel\s*\{[^}]*\}/)?.[0] ?? '';
    expect(statBox).toMatch(/min-height\s*:\s*110px/);
    expect(heroicBox).toMatch(/min-height\s*:\s*110px/);
    expect(hpPanel).toMatch(/min-height\s*:\s*110px/);
  });

  it('na quebra <=1023px todos os blocos preservam altura mínima de 110px e largura fluida', () => {
    const block = css.match(/@media\s*\(max-width:\s*1023px\)\s*\{[\s\S]*?\n\}\s*\}/)?.[0]
      ?? css.match(/@media\s*\(max-width:\s*1023px\)\s*\{[\s\S]*?^\}/m)?.[0]
      ?? '';
    expect(block).toMatch(/\.statsBandRight\s*>\s*\.statBox[\s\S]*?min-height\s*:\s*110px/);
    expect(block).toMatch(/\.statsBandRight\s*>\s*\.hpPanel[\s\S]*?min-height\s*:\s*110px/);
    expect(block).toMatch(/flex-wrap\s*:\s*wrap/);
  });

  it('em <=767px mantém espaçamento consistente e blocos com pelo menos 96px de altura', () => {
    const block = css.match(/@media\s*\(max-width:\s*767px\)\s*\{[\s\S]*?\n\}\s*\}/)?.[0]
      ?? css.match(/@media\s*\(max-width:\s*767px\)\s*\{[\s\S]*?^\}/m)?.[0]
      ?? '';
    expect(block).toMatch(/\.statsBandAbilities[\s\S]*?grid-template-columns\s*:\s*repeat\(3,\s*1fr\)/);
    expect(block).toMatch(/\.statsBandRight[\s\S]*?gap\s*:\s*6px/);
    expect(block).toMatch(/min-height\s*:\s*96px/);
  });

  it('toggle de modo de visualização tem estilo focável (focus-visible)', () => {
    expect(css).toMatch(/\.viewModeToggle[\s\S]*?\{[^}]*\}/);
    expect(css).toMatch(/\.viewModeToggle:hover,?\s*\.viewModeToggle:focus-visible/);
  });
});

describe('AbilityScoreCards — accessibility & ordering on stacked layout', () => {
  it('label de cada característica é focável por teclado (tabIndex=0) quando há onAbilityClick', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const finalAttributes = { forca: 14, destreza: 12, constituicao: 13, inteligencia: 10, sabedoria: 11, carisma: 8 };
    const modifiers = { forca: 2, destreza: 1, constituicao: 1, inteligencia: 0, sabedoria: 0, carisma: -1 };

    act(() => {
      root.render(
        <AbilityScoreCards
          finalAttributes={finalAttributes}
          modifiers={modifiers}
          horizontal
          onAbilityClick={() => {}}
        />
      );
    });

    const focusableLabels = Array.from(container.querySelectorAll('[class*="label"][tabindex="0"]'));
    expect(focusableLabels.length).toBeGreaterThanOrEqual(6);

    act(() => root.unmount());
    container.remove();
  });

  it('modificador tem aria-label padronizado com sinal +/-', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const finalAttributes = { forca: 14, destreza: 12, constituicao: 13, inteligencia: 10, sabedoria: 11, carisma: 8 };
    const modifiers = { forca: 2, destreza: 1, constituicao: 1, inteligencia: 0, sabedoria: 0, carisma: -1 };

    act(() => {
      root.render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal />);
    });

    const ariaMods = Array.from(container.querySelectorAll('[aria-label^="Modificador"]'));
    expect(ariaMods.length).toBe(6);
    expect(ariaMods.some(el => /\+2/.test(el.getAttribute('aria-label') ?? ''))).toBe(true);
    expect(ariaMods.some(el => /-1/.test(el.getAttribute('aria-label') ?? ''))).toBe(true);

    act(() => root.unmount());
    container.remove();
  });

  it('mantém ordem alfabética pt-BR também no layout empilhado (horizontal=false)', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const finalAttributes = { forca: 14, destreza: 12, constituicao: 13, inteligencia: 10, sabedoria: 11, carisma: 8 };
    const modifiers = { forca: 2, destreza: 1, constituicao: 1, inteligencia: 0, sabedoria: 0, carisma: -1 };

    act(() => {
      root.render(<AbilityScoreCards finalAttributes={finalAttributes} modifiers={modifiers} horizontal={false} />);
    });

    const labels = Array.from(container.querySelectorAll('[class*="label"]'))
      .map(el => el.textContent?.trim())
      .filter(Boolean);
    expect(labels.slice(0, 6)).toEqual(['Carisma', 'Constituição', 'Destreza', 'Força', 'Inteligência', 'Sabedoria']);

    act(() => root.unmount());
    container.remove();
  });
});

describe('useAbilityViewMode — persistência localStorage', () => {
  it('lê/escreve modo no localStorage entre instâncias do hook', async () => {
    const { useAbilityViewMode, ABILITY_VIEW_MODE_STORAGE_KEY } = await import('../../hooks/useAbilityViewMode');
    window.localStorage.removeItem(ABILITY_VIEW_MODE_STORAGE_KEY);

    function Probe({ onReady }: { onReady: (api: ReturnType<typeof useAbilityViewMode>) => void }) {
      const api = useAbilityViewMode();
      onReady(api);
      return <span data-testid="m">{api[0]}</span>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    let api: ReturnType<typeof useAbilityViewMode> | null = null;
    act(() => { root.render(<Probe onReady={a => { api = a; }} />); });
    expect(api![0]).toBe('horizontal');

    act(() => { api![2](); /* toggle -> stacked */ });
    expect(window.localStorage.getItem(ABILITY_VIEW_MODE_STORAGE_KEY)).toBe('stacked');

    act(() => root.unmount());
    container.remove();

    // Nova instância lê valor persistido
    const container2 = document.createElement('div');
    document.body.appendChild(container2);
    const root2 = createRoot(container2);
    let api2: ReturnType<typeof useAbilityViewMode> | null = null;
    act(() => { root2.render(<Probe onReady={a => { api2 = a; }} />); });
    expect(api2![0]).toBe('stacked');

    act(() => root2.unmount());
    container2.remove();
    window.localStorage.removeItem(ABILITY_VIEW_MODE_STORAGE_KEY);
  });
});