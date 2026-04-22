import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ClassHeroPreview.module.css';
import { CLASS_ROLE_META, ROLE_COLORS, ROLE_ICONS } from '../../data/classRoles';

interface ClassHeroPreviewProps {
  classId: string;
  className: string;
  description?: string;
  hitDie?: string | null;
  primaryAttribute?: string | null;
  anchorRect: DOMRect | null;
  pinned?: boolean;
  onPinToggle?: () => void;
  onClose?: () => void;
}

export function ClassHeroPreview({
  classId,
  className,
  description,
  hitDie,
  primaryAttribute,
  anchorRect,
  pinned = false,
  onPinToggle,
  onClose,
}: ClassHeroPreviewProps) {
  const meta = CLASS_ROLE_META[classId];
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!anchorRect) return;
    const PREVIEW_W = 320;
    const PREVIEW_H = 320;
    const PADDING = 12;

    let left = anchorRect.right + PADDING;
    if (left + PREVIEW_W > window.innerWidth - PADDING) {
      left = anchorRect.left - PREVIEW_W - PADDING;
    }
    if (left < PADDING) left = PADDING;

    let top = anchorRect.top;
    if (top + PREVIEW_H > window.innerHeight - PADDING) {
      top = window.innerHeight - PREVIEW_H - PADDING;
    }
    if (top < PADDING) top = PADDING;

    setPos({ top, left });
  }, [anchorRect]);

  if (!pos || !meta) return null;

  const heroSrc = `/imgs/${classId}.png`;
  const tagline = meta.tagline;

  return createPortal(
    <div
      className={styles.preview}
      style={{ top: pos.top, left: pos.left }}
      role="tooltip"
      data-pinned={pinned ? 'true' : 'false'}
      onClick={(e) => { e.stopPropagation(); onPinToggle?.(); }}
      title={pinned ? 'Clique para soltar' : 'Clique para fixar e ler com calma'}
    >
      {pinned && onClose && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Fechar preview fixado"
        >×</button>
      )}
      <div
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${heroSrc})` }}
      >
        <div className={styles.heroOverlay} />
        <h4 className={styles.heroTitle}>{className}</h4>
        {pinned && <span className={styles.pinBadge}>📌 Fixado</span>}
      </div>
      <div className={styles.body}>
        <p className={styles.tagline}>“{tagline}”</p>

        <div className={styles.chipRow}>
          {meta.roles.map(role => (
            <span
              key={role}
              className={styles.chip}
              style={{
                background: `${ROLE_COLORS[role]}22`,
                borderColor: `${ROLE_COLORS[role]}66`,
                color: ROLE_COLORS[role],
              }}
            >
              {ROLE_ICONS[role]} {role}
            </span>
          ))}
        </div>

        {description && (
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        )}

        <div className={styles.statsGrid}>
          {hitDie && (
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Dado de Vida</span>
              <span className={styles.statValue}>{hitDie}</span>
            </div>
          )}
          {primaryAttribute && (
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Atributo</span>
              <span className={styles.statValue}>{primaryAttribute}</span>
            </div>
          )}
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Estilo</span>
            <span className={styles.statValue}>{meta.playstyle}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Dificuldade</span>
            <span className={styles.statValue}>{meta.difficulty}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
