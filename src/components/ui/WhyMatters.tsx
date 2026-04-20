import { useState } from 'react';
import { WHY_MATTERS } from '../../data/whyMattersData';
import styles from './WhyMatters.module.css';

interface Props {
  /** Chave do contexto: class | subclass | background | species | attributes | talent | equipment */
  contextKey: keyof typeof WHY_MATTERS;
  /** Variante visual: link compacto ou botão destacado */
  variant?: 'link' | 'button';
}

export function WhyMatters({ contextKey, variant = 'link' }: Props) {
  const [open, setOpen] = useState(false);
  const entry = WHY_MATTERS[contextKey];
  if (!entry) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={variant === 'button' ? styles.triggerButton : styles.triggerLink}
        aria-label={entry.title}
      >
        <span className={styles.icon}>💡</span>
        <span>Por que isso importa?</span>
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <header className={styles.header}>
              <h3 className={styles.title}>
                <span className={styles.headerIcon}>💡</span>
                {entry.title}
              </h3>
              <button onClick={() => setOpen(false)} className={styles.close} aria-label="Fechar">×</button>
            </header>
            <div className={styles.body}>
              <p className={styles.why}>{entry.why}</p>
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Impacto mecânico</h4>
                <ul className={styles.impactList}>
                  {entry.impact.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              {entry.tip && (
                <div className={styles.tip}>
                  <strong>💎 Dica:</strong> {entry.tip}
                </div>
              )}
            </div>
            <footer className={styles.footer}>
              <button onClick={() => setOpen(false)} className={styles.gotIt}>Entendi</button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
