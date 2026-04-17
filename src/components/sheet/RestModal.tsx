import { useEffect } from 'react';
import styles from './RestModal.module.css';

export interface RestRestoredResource {
  id: string;
  name: string;
  icon?: string;
  restored: number;
}

interface RestModalProps {
  type: 'short' | 'long';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Resources that will be (or were) restored on confirm — used for preview */
  restoredResources?: RestRestoredResource[];
}

export function RestModal({ type, isOpen, onClose, onConfirm, restoredResources = [] }: RestModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLong = type === 'long';
  const resourcesToShow = restoredResources.filter(r => r.restored > 0);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>
          {isLong ? 'Descanso Longo' : 'Descanso Curto'}
        </h2>
        <div className={styles.body}>
          {isLong ? (
            <>
              <p>Ao realizar um Descanso Longo, você recupera:</p>
              <ul>
                <li>Todos os Pontos de Vida</li>
                <li>Todos os Espaços de Magia</li>
                <li>Inspiração Heróica</li>
                <li>Condições removidas</li>
                <li>Recursos de classe (curto e longo)</li>
              </ul>
            </>
          ) : (
            <>
              <p>Ao realizar um Descanso Curto, você pode:</p>
              <ul>
                <li>Gastar Dados de Vida para recuperar PV</li>
                <li>Recuperar recursos de classe de descanso curto</li>
              </ul>
            </>
          )}

          {resourcesToShow.length > 0 && (
            <div className={styles.restoredBox}>
              <div className={styles.restoredTitle}>Recursos a restaurar:</div>
              <ul className={styles.restoredList}>
                {resourcesToShow.map(r => (
                  <li key={r.id} className={styles.restoredItem}>
                    {r.icon && <span aria-hidden className={styles.restoredIcon}>{r.icon}</span>}
                    <span className={styles.restoredName}>{r.name}</span>
                    <span className={styles.restoredCount}>+{r.restored}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p style={{ marginTop: 12 }}>Deseja prosseguir?</p>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
          <button onClick={onConfirm} className={styles.confirmBtn}>
            Confirmar {isLong ? 'Descanso Longo' : 'Descanso Curto'}
          </button>
        </div>
      </div>
    </div>
  );
}
