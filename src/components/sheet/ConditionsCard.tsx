import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CONDITIONS_2024, findCondition } from '../../data/conditions2024';
import styles from './ConditionsCard.module.css';

/** Exaustão tem rastreador próprio; fica fora do seletor. */
const PICKABLE = CONDITIONS_2024.filter(c => c.name !== 'Exaustão').map(c => c.name);

function ConditionPill({ name, onRemove }: { name: string; onRemove: () => void }) {
  const info = findCondition(name);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const open = (hover || pinned) && !!info && !!pos;

  const place = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const w = 280;
    setPos({ top: r.bottom + 8, left: Math.max(12, Math.min(r.left, window.innerWidth - w - 12)) });
  };

  return (
    <div
      className={styles.pill}
      onMouseEnter={e => { place(e.currentTarget); setHover(true); }}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        className={styles.pillTextBtn}
        aria-expanded={open}
        onClick={e => { place(e.currentTarget.parentElement as HTMLElement); setPinned(p => !p); }}
        onBlur={() => setPinned(false)}
      >
        {info?.name ?? name}
      </button>
      <button onClick={onRemove} className={styles.removeBtn} aria-label={`Remover ${name}`}>✕</button>
      {open && info && pos && createPortal(
        <div className={styles.popover} style={{ top: pos.top, left: pos.left }} role="tooltip">
          <div className={styles.popoverTitle}>{info.name}</div>
          <ul className={styles.effects}>
            {info.effects.map(e => <li key={e}>{e}</li>)}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
}

interface ConditionsCardProps {
  activeConditions: string[];
  concentratingOn?: string | null;
  onAdd: (condition: string) => void;
  onRemove: (condition: string) => void;
  onStopConcentrating?: () => void;
}

export function ConditionsCard({
  activeConditions,
  concentratingOn,
  onAdd,
  onRemove,
  onStopConcentrating,
}: ConditionsCardProps) {
  const [selected, setSelected] = useState('');

  const activeCanon = activeConditions.map(c => findCondition(c)?.name ?? c);
  const available = PICKABLE.filter(c => !activeCanon.includes(c));
  const selectedInfo = selected ? findCondition(selected) : undefined;

  const handleAdd = () => {
    if (selected && !activeConditions.includes(selected)) {
      onAdd(selected);
      setSelected('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pillList}>
        {activeConditions.length === 0 && !concentratingOn && (
          <div className={styles.emptyText}>Adicionar ativas...</div>
        )}
        {concentratingOn && (
          <div className={`${styles.pill} ${styles.concentrationPill}`} title="Concentração Ativa">
            <span className={styles.pillText}>Concentração: {concentratingOn}</span>
            {onStopConcentrating && (
              <button onClick={onStopConcentrating} className={styles.removeBtn} aria-label="Parar concentração">✕</button>
            )}
          </div>
        )}
        {activeConditions.map(c => (
          <ConditionPill key={c} name={c} onRemove={() => onRemove(c)} />
        ))}
      </div>

      <div className={styles.addRow}>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className={styles.select}
        >
          <option value="">Adicionar condição…</option>
          {available.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={!selected}
          className={styles.addBtn}
        >
          +
        </button>
      </div>
      {selectedInfo && (
        <ul className={styles.previewEffects}>
          {selectedInfo.effects.map(e => <li key={e}>{e}</li>)}
        </ul>
      )}
    </div>
  );
}
