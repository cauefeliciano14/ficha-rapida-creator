import { useState } from 'react';
import styles from './SmartHints.module.css';
import type { SmartHint } from '../../utils/smartHints';

interface SmartHintsProps {
  hints: SmartHint[];
}

const ICONS = {
  warning: '⚠️',
  tip: '💡',
  info: 'ℹ️',
} as const;

export function SmartHints({ hints }: SmartHintsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = hints.filter(h => !dismissed.has(h.id));
  if (visible.length === 0) return null;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {visible.map(h => (
        <div key={h.id} className={`${styles.hint} ${styles[h.severity]}`}>
          <span className={styles.icon} aria-hidden="true">{ICONS[h.severity]}</span>
          <div className={styles.body}>
            <strong className={styles.title}>{h.title}</strong>
            <span className={styles.message}>{h.message}</span>
          </div>
          <button
            type="button"
            className={styles.dismiss}
            onClick={() => setDismissed(prev => new Set(prev).add(h.id))}
            aria-label="Dispensar dica"
            title="Dispensar"
          >✕</button>
        </div>
      ))}
    </div>
  );
}
