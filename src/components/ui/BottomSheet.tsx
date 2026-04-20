import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './BottomSheet.module.css';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragOffset(delta);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (dragOffset > 120) onClose();
    setDragOffset(0);
    dragStartY.current = null;
  }, [dragOffset, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={dragOffset ? { transform: `translateY(${dragOffset}px)`, transition: 'none' } : undefined}
      >
        <div
          className={styles.dragHandle}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.dragBar} />
        </div>
        {(title || true) && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title ?? ''}</h2>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </>,
    document.body,
  );
}
