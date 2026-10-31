import { memo } from 'react';
import type { DerivedSavingThrow } from '../../rules/types/DerivedSheet';
import { signedMod } from '../../utils/format';
import styles from './SavingThrowsCard.module.css';

interface SavingThrowsCardProps {
  derivedSavingThrows: DerivedSavingThrow[];
  onSaveClick?: (save: DerivedSavingThrow) => void;
  /** Clique no número: só rola (o clique na linha abre as informações). */
  onSaveRoll?: (save: DerivedSavingThrow) => void;
}

export const SavingThrowsCard = memo(function SavingThrowsCard({ derivedSavingThrows, onSaveClick, onSaveRoll }: SavingThrowsCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {derivedSavingThrows.map(st => (
          <div
            key={st.attribute}
            className={styles.row}
            onClick={() => onSaveClick?.(st)}
            role={onSaveClick ? 'button' : undefined}
            tabIndex={onSaveClick ? 0 : undefined}
            onKeyDown={onSaveClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onSaveClick(st); } : undefined}
          >
            <span className={`${styles.profDot} ${st.proficient ? styles.profDotFilled : ''}`} />
            <span className={`${styles.label} ${st.proficient ? styles.labelProficient : ''}`}>
              {st.label}
            </span>
            <span
              className={`${styles.value} ${st.proficient ? styles.valueProficient : ''} ${onSaveRoll ? styles.valueRoll : ''}`}
              onClick={onSaveRoll ? (e) => { e.stopPropagation(); onSaveRoll(st); } : undefined}
              role={onSaveRoll ? 'button' : undefined}
              aria-label={onSaveRoll ? `Rolar ${st.label}` : undefined}
            >
              {signedMod(st.modifier)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
