import { useEffect } from 'react';
import type { CharacterPlayState } from '../../types/playState';
import styles from './LevelUnlockHistoryModal.module.css';

interface LevelUnlockHistoryModalProps {
  open: boolean;
  onClose: () => void;
  playState: CharacterPlayState;
  onClear: () => void;
}

const formatDate = (ts: number) => {
  try {
    return new Date(ts).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
};

export function LevelUnlockHistoryModal({ open, onClose, playState, onClear }: LevelUnlockHistoryModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const history = (playState.unlockHistory ?? []).slice().sort((a, b) => b.level - a.level);

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>📜 Crônica de Progressão</div>
            <h2 className={styles.title}>Histórico de Níveis</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
        </header>

        <div className={styles.body}>
          {history.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>✨</div>
              <p>Nenhum recurso desbloqueado ainda.</p>
              <p className={styles.emptyHint}>
                Suba de nível com uma classe que ganhe novos recursos (ex: Bárbaro Berserker no nível 3) para começar a cronicar suas conquistas.
              </p>
            </div>
          ) : (
            <ol className={styles.timeline}>
              {history.map((entry, idx) => (
                <li key={`${entry.level}-${entry.timestamp}-${idx}`} className={styles.entry}>
                  <div className={styles.timelineDot} aria-hidden>
                    <span className={styles.timelineLevel}>{entry.level}</span>
                  </div>
                  <div className={styles.entryContent}>
                    <div className={styles.entryHeader}>
                      <span className={styles.entryLevel}>Nível {entry.level}</span>
                      <span className={styles.entryDate}>{formatDate(entry.timestamp)}</span>
                    </div>
                    <ul className={styles.resources}>
                      {entry.resources.map(r => (
                        <li key={r.id} className={styles.resourceChip}>
                          {r.icon && <span aria-hidden className={styles.chipIcon}>{r.icon}</span>}
                          <span className={styles.chipName}>{r.name}</span>
                          <span className={styles.chipMax}>×{r.max}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {history.length > 0 && (
          <footer className={styles.footer}>
            <button
              className={styles.clearBtn}
              onClick={() => {
                if (confirm('Limpar todo o histórico de progressão?')) onClear();
              }}
            >
              Limpar histórico
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
