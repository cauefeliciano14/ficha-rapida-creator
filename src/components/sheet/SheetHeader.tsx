import { useState } from 'react';
import type { ClassLevel } from '../../types/multiclass';
import type { CharacterIdentityUpdate } from '../../types/character';
import { ManageCharacterModal } from './ManageCharacterModal';
import styles from './SheetHeader.module.css';

interface SheetHeaderProps {
  name: string;
  portrait: string | null;
  speciesName: string;
  className: string;
  level: number;
  creatureSize?: string;
  alignment?: string | null;
  subclassName?: string;
  classLevels?: ClassLevel[];
  backgroundName?: string;
  onUpdateIdentity?: (update: CharacterIdentityUpdate) => void;
}

export function SheetHeader({
  name, portrait, speciesName, className, level: _level, creatureSize: _size, alignment, subclassName, classLevels, backgroundName, onUpdateIdentity,
}: SheetHeaderProps) {
  void _level; void _size;
  const [manageOpen, setManageOpen] = useState(false);

  const isMulticlass = classLevels && classLevels.length > 1;
  const classDisplay = isMulticlass
    ? classLevels.map(cl => `${cl.className} ${cl.level}`).join(' / ')
    : `${className || '—'}${subclassName ? ` (${subclassName})` : ''}`;

  const handleManageSave = (data: { name?: string; portrait?: string | null; alignment?: string | null }) => {
    if (onUpdateIdentity) {
      onUpdateIdentity(data);
    }
  };

  return (
    <>
      <div className={styles.container}>
        {/* Portrait */}
        <div className={styles.portrait}>
          {portrait ? (
            <img
              src={`/imgs/portrait_caracter/${portrait}`}
              alt={name || 'Retrato'}
              className={styles.portraitImg}
            />
          ) : (
            <span className={styles.portraitPlaceholder}>🧙</span>
          )}
        </div>

        {/* Info block */}
        <div className={styles.infoBlock}>
          {/* Name row */}
          <div className={styles.nameRow}>
            <span className={styles.name}>{name || 'Sem Nome'}</span>
            <button
              className={styles.manageBtn}
              title="Gerenciar"
              onClick={() => setManageOpen(true)}
            >
              ⚙
            </button>
          </div>

          {/* Meta rows */}
          <div className={styles.metaGrid}>
            <span className={styles.metaLabel}>CLASSE</span>
            <span className={styles.metaValueAccent}>{classDisplay}</span>

            <span className={styles.metaLabel}>ORIGEM</span>
            <span className={styles.metaValue}>{backgroundName || 'Não definida'}</span>

            <span className={styles.metaLabel}>ESPÉCIE</span>
            <span className={styles.metaValue}>{speciesName || 'Não definida'}</span>
          </div>

          {/* Alignment row */}
          <div className={styles.alignmentRow}>
            <span className={styles.metaLabel}>ALINHAMENTO</span>
            <span className={styles.alignmentBadge}>{alignment || 'Não definido'}</span>
          </div>
        </div>
      </div>

      {manageOpen && (
        <ManageCharacterModal
          name={name}
          portrait={portrait}
          alignment={alignment}
          onSave={handleManageSave}
          onClose={() => setManageOpen(false)}
        />
      )}
    </>
  );
}
