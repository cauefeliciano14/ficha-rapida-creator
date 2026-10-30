export function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** Cada quadrado do grid de combate vale 1,5 m (Livro do Jogador 2024). */
export function metersToSquares(meters: number): number {
  return Math.floor(meters / 1.5 + 1e-9);
}

/**
 * Acrescenta a conversão em quadrados a toda distância em metros de um texto:
 * "9 metros" → "9 metros (6 qd)", "6/18 m" → "6/18 m (4/12 qd)".
 */
export function withSquares(text: string | null | undefined): string {
  if (!text) return text ?? '';
  return text.replace(/(\d+(?:,\d+)?)(?:\/(\d+(?:,\d+)?))?\s*(metros?|m)\b(?!\s*\()/g, (match, a: string, b: string | undefined) => {
    const toSq = (v: string) => metersToSquares(parseFloat(v.replace(',', '.')));
    const squares = b ? `${toSq(a)}/${toSq(b)}` : `${toSq(a)}`;
    return `${match} (${squares} qd)`;
  });
}

/** Só o número de metros de um texto como "10,5 metros". */
export function parseMeters(text: string | null | undefined): number | null {
  const m = text?.match(/(\d+(?:,\d+)?)\s*m/);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}
