import { signedMod } from './format';

/**
 * Helper único para gerar textos de tooltip e aria-label dos atributos.
 * Garante que título (title), aria-label e descrições nunca divirjam.
 */

export const ABILITY_DESCRIPTIONS: Record<string, string> = {
  forca: 'Mede o poder físico e a força bruta.',
  destreza: 'Mede a agilidade, reflexos e equilíbrio.',
  constituicao: 'Mede a resistência, saúde e vitalidade.',
  inteligencia: 'Mede o raciocínio, memória e conhecimento.',
  sabedoria: 'Mede a percepção, intuição e sintonia.',
  carisma: 'Mede a personalidade, influência e persuasão.',
};

export const MOD_FORMULA_HINT =
  'Modificador = (Total - 10) ÷ 2, arredondado para baixo.';

export interface AbilityLabelTexts {
  /** Texto curto para `title` no card e no label. */
  tooltip: string;
  /** Aria-label completo do card (descreve total + modificador). */
  cardAriaLabel: string;
  /** Aria-label do label (foco por teclado). */
  labelAriaLabel: string;
  /** Aria-label e title do número do modificador. */
  modifierAriaLabel: string;
  modifierTitle: string;
}

export function getAbilityLabelTexts(
  key: string,
  label: string,
  score: number,
  modifier: number,
): AbilityLabelTexts {
  const description = ABILITY_DESCRIPTIONS[key] ?? '';
  const tooltip = `${description} ${MOD_FORMULA_HINT}`.trim();
  const signed = signedMod(modifier);
  return {
    tooltip,
    cardAriaLabel: `${label}. Total ${score}. Modificador ${signed}. ${tooltip}`,
    labelAriaLabel: `${label} — pressione Enter para ver detalhes do atributo.`,
    modifierAriaLabel: `Modificador ${signed}`,
    modifierTitle: `Modificador ${signed} — usado em testes, ataques e magias.`,
  };
}