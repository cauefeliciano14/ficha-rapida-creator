import { ATTR_ABBR } from './attributeConstants';

/** Monta o texto do resumo copiável: Classe, Espécie, Origem e Atributos. */
export function buildSummaryCopyText(
  className: string | undefined,
  speciesName: string | undefined,
  backgroundName: string | undefined,
  finalAttributes: Record<string, number>,
): string {
  const attrs = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma']
    .map(key => `${ATTR_ABBR[key]} ${finalAttributes[key] ?? 0}`)
    .join(' · ');
  return [
    `Classe: ${className || 'Não definida'}`,
    `Espécie: ${speciesName || 'Não definida'}`,
    `Origem: ${backgroundName || 'Não definida'}`,
    `Atributos: ${attrs}`,
  ].join('\n');
}
