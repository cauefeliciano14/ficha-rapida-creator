import { memo } from 'react';
import { signedMod } from '../../utils/format';
import { CalculationTooltip } from '../ui/CalculationTooltip';
import type { AttributeBreakdownRow } from '../../rules/types/DerivedSheet';
import styles from './AbilityScoreCards.module.css';

const ABILITY_LABELS: Array<{ key: string; label: string; abbr: string }> = ([
  { key: 'forca', label: 'Força', abbr: 'FOR' },
  { key: 'destreza', label: 'Destreza', abbr: 'DES' },
  { key: 'constituicao', label: 'Constituição', abbr: 'CON' },
  { key: 'inteligencia', label: 'Inteligência', abbr: 'INT' },
  { key: 'sabedoria', label: 'Sabedoria', abbr: 'SAB' },
  { key: 'carisma', label: 'Carisma', abbr: 'CAR' },
] as const).slice().sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

const MOD_DESCRIPTIONS: Record<string, string> = {
  forca: 'Mede o poder físico e a força bruta.',
  destreza: 'Mede a agilidade, reflexos e equilíbrio.',
  constituicao: 'Mede a resistência, saúde e vitalidade.',
  inteligencia: 'Mede o raciocínio, memória e conhecimento.',
  sabedoria: 'Mede a percepção, intuição e sintonia.',
  carisma: 'Mede a personalidade, influência e persuasão.',
};

interface AbilityScoreCardsProps {
  finalAttributes: Record<string, number>;
  modifiers: Record<string, number>;
  attributeBreakdowns?: Record<string, AttributeBreakdownRow[]>;
  onAbilityClick?: (key: string, label: string, score: number, modifier: number) => void;
  horizontal?: boolean;
}

export const AbilityScoreCards = memo(function AbilityScoreCards({ finalAttributes, modifiers, attributeBreakdowns, onAbilityClick, horizontal }: AbilityScoreCardsProps) {
  return (
    <div className={horizontal ? styles.gridHorizontal : styles.grid}>
      {ABILITY_LABELS.map(({ key, label }) => {
        const score = finalAttributes[key] ?? 8;
        const mod = modifiers[key] ?? 0;
        const breakdown = attributeBreakdowns?.[key];
        const tooltipHint = `${MOD_DESCRIPTIONS[key] ?? ''} Modificador = (Total - 10) ÷ 2, arredondado para baixo.`;

        const card = (
          <div
            key={key}
            className={styles.box}
            onClick={() => onAbilityClick?.(key, label, score, mod)}
            role={onAbilityClick ? 'button' : undefined}
            tabIndex={onAbilityClick ? 0 : undefined}
            onKeyDown={onAbilityClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onAbilityClick(key, label, score, mod); } : undefined}
            aria-label={`${label}: total ${score}, modificador ${signedMod(mod)}`}
          >
            <div className={styles.label} title={tooltipHint}>{label}</div>
            <div className={`${styles.modifier} ${mod >= 0 ? styles.modPositive : styles.modNegative}`}>
              {signedMod(mod)}
            </div>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreLabel}>Total</span>
              <span className={styles.scoreValue}>{score}</span>
            </div>
          </div>
        );

        if (!breakdown || breakdown.length === 0) return <div key={key}>{card}</div>;

        return (
          <CalculationTooltip
            key={key}
            title={label}
            breakdown={breakdown}
            total={score}
            totalLabel="Pontuação Final"
          >
            {card}
          </CalculationTooltip>
        );
      })}
    </div>
  );
});
