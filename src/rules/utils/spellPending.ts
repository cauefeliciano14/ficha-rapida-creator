/**
 * Quantas magias ainda faltam escolher (truques + preparadas). Muda quando o
 * personagem sobe de nível e ganha mais truques ou magias preparadas.
 */
export function missingSpellPicks(params: {
  cantripsKnown?: number;
  preparedSpellCount?: number;
  learnedCantrips: readonly string[];
  preparedSpells: readonly string[];
}): { cantrips: number; prepared: number; total: number } {
  const cantrips = Math.max(0, (params.cantripsKnown ?? 0) - params.learnedCantrips.length);
  const prepared = Math.max(0, (params.preparedSpellCount ?? 0) - params.preparedSpells.length);
  return { cantrips, prepared, total: cantrips + prepared };
}

export function missingSpellText(m: { cantrips: number; prepared: number }): string {
  const parts: string[] = [];
  if (m.cantrips) parts.push(`${m.cantrips} truque${m.cantrips > 1 ? 's' : ''}`);
  if (m.prepared) parts.push(`${m.prepared} magia${m.prepared > 1 ? 's' : ''}`);
  return parts.join(' e ');
}
