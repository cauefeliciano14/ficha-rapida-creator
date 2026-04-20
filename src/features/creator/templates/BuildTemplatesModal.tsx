import { BUILD_TEMPLATES, type BuildTemplate } from '../../../data/buildTemplates';
import styles from './BuildTemplatesModal.module.css';

interface Props {
  onClose: () => void;
  onPick: (template: BuildTemplate) => void;
}

export function BuildTemplatesModal({ onClose, onPick }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>📋 Templates de Build</h2>
            <p className={styles.subtitle}>Personagens prontos em 1 clique. Você pode ajustar tudo depois.</p>
          </div>
          <button onClick={onClose} className={styles.close} aria-label="Fechar">×</button>
        </header>

        <div className={styles.grid}>
          {BUILD_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className={styles.card}
              onClick={() => { onPick(tpl); onClose(); }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.emoji}>{tpl.emoji}</span>
                <div className={styles.cardTitleBlock}>
                  <h3 className={styles.cardTitle}>{tpl.name}</h3>
                  <p className={styles.tagline}>{tpl.tagline}</p>
                </div>
              </div>

              <div className={styles.tags}>
                {tpl.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              <p className={styles.strategy}>{tpl.strategy}</p>

              <div className={styles.applyHint}>Clique para aplicar →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
