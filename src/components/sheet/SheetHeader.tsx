import type { ClassLevel } from '../../types/multiclass';
import type { CharacterIdentityUpdate } from '../../types/character';
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
  /** Abre o seletor de retrato. */
  onPortraitClick?: () => void;
}

export function SheetHeader({
  name, portrait, speciesName, className, level: _level, creatureSize: _size, alignment, subclassName, classLevels, backgroundName, onUpdateIdentity, onPortraitClick,
}: SheetHeaderProps) {
  void _size;

  const isMulticlass = classLevels && classLevels.length > 1;
  const classDisplay = isMulticlass
    ? classLevels.map(cl => `${cl.className} ${cl.level}`).join(' / ')
    : `${className || '—'}${subclassName ? ` (${subclassName})` : ''}`;


  return (
    <>
      <div className={styles.container}>
        {/* Portrait */}
        <button
          type="button"
          className={styles.portrait}
          onClick={onPortraitClick}
          disabled={!onPortraitClick}
          title="Trocar retrato"
          aria-label="Trocar retrato do personagem"
        >
          {portrait ? (
            <img
              src={`/imgs/portrait_caracter/${portrait}`}
              alt={name || 'Retrato'}
              className={styles.portraitImg}
            />
          ) : (
            <span className={styles.portraitPlaceholder}>🧙</span>
          )}
        </button>

        {/* Info block */}
        <div className={styles.infoBlock}>
          {/* Name row */}
          <div className={styles.nameRow}>
            <input
              className={styles.name}
              value={name}
              placeholder="Sem Nome"
              aria-label="Nome do personagem"
              onChange={e => onUpdateIdentity?.({ name: e.target.value })}
            />
          </div>

          {/* D&D Beyond: "Gnomo Bardo 1" numa linha, detalhes menores abaixo */}
          <div className={styles.subtitle}>
            {[speciesName, classDisplay].filter(Boolean).join(' ')}
            {!isMulticlass && _level ? ` ${_level}` : ''}
          </div>
          <div className={styles.details}>
            <span>{backgroundName || 'Sem antecedente'}</span>
            <span className={styles.dotSep}>•</span>
            <span>{alignment || 'Sem alinhamento'}</span>
          </div>
        </div>
      </div>

    </>
  );
}
