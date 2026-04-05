import { useState } from 'react';
import { PORTRAITS } from '../../data/portraits';
import { alignmentsData } from '../../data/alignmentsData';
import styles from './ManageCharacterModal.module.css';

interface ManageCharacterModalProps {
  name: string;
  portrait: string | null;
  alignment: string | null;
  onSave: (data: { name?: string; portrait?: string | null; alignment?: string | null }) => void;
  onClose: () => void;
}

export function ManageCharacterModal({ name, portrait, alignment, onSave, onClose }: ManageCharacterModalProps) {
  const [editName, setEditName] = useState(name);
  const [editPortrait, setEditPortrait] = useState<string | null>(portrait);
  const [editAlignment, setEditAlignment] = useState(alignment ?? '');
  const [showPortraitGrid, setShowPortraitGrid] = useState(false);

  const handleSave = () => {
    onSave({
      ...(editName !== name ? { name: editName } : {}),
      ...(editPortrait !== portrait ? { portrait: editPortrait } : {}),
      ...(editAlignment !== (alignment ?? '') ? { alignment: editAlignment || null } : {}),
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Gerenciar Personagem</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Name */}
        <div className={styles.field}>
          <label className={styles.label}>Nome</label>
          <input
            className={styles.input}
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Nome do personagem"
          />
        </div>

        {/* Alignment */}
        <div className={styles.field}>
          <label className={styles.label}>Alinhamento</label>
          <select
            className={styles.select}
            value={editAlignment}
            onChange={e => setEditAlignment(e.target.value)}
          >
            <option value="">— Escolher —</option>
            {alignmentsData.map(a => (
              <option key={a.id} value={a.title}>{a.title}</option>
            ))}
          </select>
        </div>

        {/* Portrait */}
        <div className={styles.field}>
          <label className={styles.label}>Retrato</label>
          <div className={styles.portraitSection}>
            {editPortrait && (
              <div className={styles.currentPortrait}>
                <img
                  src={`/imgs/portrait_caracter/${editPortrait}`}
                  alt="Retrato atual"
                  className={styles.currentPortraitImg}
                />
                <span className={styles.currentPortraitLabel}>Retrato atual</span>
                <button
                  className={styles.removePortraitBtn}
                  onClick={() => setEditPortrait(null)}
                >
                  Remover
                </button>
              </div>
            )}
            <button
              className={styles.input}
              style={{ cursor: 'pointer', textAlign: 'left' }}
              onClick={() => setShowPortraitGrid(prev => !prev)}
            >
              {showPortraitGrid ? '▾ Fechar galeria' : '▸ Escolher retrato'}
            </button>
            {showPortraitGrid && (
              <div className={styles.portraitGrid}>
                {PORTRAITS.map(p => (
                  <button
                    key={p}
                    className={`${styles.portraitOption} ${editPortrait === p ? styles.portraitOptionSelected : ''}`}
                    onClick={() => setEditPortrait(p)}
                  >
                    <img
                      src={`/imgs/portrait_caracter/${p}`}
                      alt=""
                      className={styles.portraitOptionImg}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <button
          className={styles.input}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            fontWeight: 700,
            background: 'rgba(249, 115, 22, 0.15)',
            borderColor: 'rgba(249, 115, 22, 0.4)',
            marginTop: 8,
          }}
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
