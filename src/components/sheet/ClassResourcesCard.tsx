import { useEffect, useRef } from 'react';
import type { CharacterPlayState, CustomCounter } from '../../types/playState';
import { getDefaultClassCounters, CLASS_RESOURCES } from '../../data/classResources';
import styles from './ClassResourcesCard.module.css';

interface ClassResourcesCardProps {
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  classId?: string;
  characterLevel?: number;
}

const RESET_LABELS: Record<CustomCounter['resetOn'], string> = {
  short: 'D. Curto',
  long: 'D. Longo',
  manual: 'Manual',
};

export function ClassResourcesCard({
  playState,
  onUpdatePlayState,
  classId,
  characterLevel = 1,
}: ClassResourcesCardProps) {
  const counters = playState.customCounters ?? [];
  const defaultCounters = classId ? getDefaultClassCounters(classId, characterLevel) : [];
  const knownIds = new Set(defaultCounters.map(d => d.id));
  const templates = classId ? (CLASS_RESOURCES[classId] ?? []) : [];

  // Only show class-derived counters here (custom ones live in Extras tab)
  const classCounters = counters.filter(c => knownIds.has(c.id));
  const missingDefaults = defaultCounters.filter(d => !counters.some(c => c.id === d.id));

  /* ─────────────────────────────────────────────────────────────
     Auto-sync max with current level (preserves "used" amount)
     - When level ↑: extra slots are added as available
     - When level ↓: cap current to new max
     ───────────────────────────────────────────────────────────── */
  const lastSyncRef = useRef<{ classId?: string; level: number } | null>(null);
  useEffect(() => {
    if (!classId) return;
    const prev = lastSyncRef.current;
    // Skip first run for stability (only sync on subsequent level changes)
    if (prev && prev.classId === classId && prev.level === characterLevel) return;
    lastSyncRef.current = { classId, level: characterLevel };
    if (!prev) return; // initial mount: don't touch user state

    onUpdatePlayState(curr => {
      const list = curr.customCounters ?? [];
      let changed = false;
      const next = list.map(c => {
        const tmpl = templates.find(t => t.id === c.id);
        if (!tmpl) return c;
        const newMax = tmpl.maxByLevel[Math.max(0, Math.min(19, characterLevel - 1))];
        if (newMax === c.max) return c;
        const used = Math.max(0, c.max - c.current);
        const newCurrent = Math.max(0, Math.min(newMax, newMax - used));
        changed = true;
        return { ...c, max: newMax, current: newCurrent };
      });
      return changed ? { ...curr, customCounters: next } : curr;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, characterLevel]);

  const handleAddClassResources = () => {
    if (missingDefaults.length === 0) return;
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: [...(prev.customCounters ?? []), ...missingDefaults],
    }));
  };

  const updateCounter = (id: string, newCurrent: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: (prev.customCounters ?? []).map(c =>
        c.id === id ? { ...c, current: Math.max(0, Math.min(c.max, newCurrent)) } : c
      ),
    }));
  };

  const resetCounter = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: (prev.customCounters ?? []).map(c =>
        c.id === id ? { ...c, current: c.max } : c
      ),
    }));
  };

  if (!classId || (defaultCounters.length === 0 && classCounters.length === 0)) {
    return null;
  }

  return (
    <div className={styles.list}>
      {classCounters.map(ctr => {
        const used = ctr.max - ctr.current;
        const tmpl = templates.find(t => t.id === ctr.id);
        const icon = ctr.icon ?? tmpl?.icon;
        const rules = tmpl?.description;
        return (
          <div key={ctr.id} className={styles.card}>
            <div className={styles.top}>
              {icon && (
                <span
                  className={styles.iconWrap}
                  tabIndex={rules ? 0 : -1}
                  aria-label={rules ? `Regras: ${ctr.name}` : undefined}
                >
                  <span className={styles.icon} aria-hidden>{icon}</span>
                  {rules && (
                    <span role="tooltip" className={styles.iconTooltip}>
                      <span className={styles.tooltipTitle}>{ctr.name}</span>
                      <span className={styles.tooltipBody}>{rules}</span>
                    </span>
                  )}
                </span>
              )}
              <span className={styles.name}>{ctr.name}</span>
              <span className={styles.reset}>{RESET_LABELS[ctr.resetOn]}</span>
              <span className={styles.value}>
                {ctr.current}<span className={styles.max}>/{ctr.max}</span>
              </span>
              <button
                onClick={() => resetCounter(ctr.id)}
                className={styles.resetBtn}
                title="Restaurar"
              >↺</button>
            </div>
            <div className={styles.boxes} role="group" aria-label={ctr.name}>
              {Array.from({ length: ctr.max }, (_, i) => {
                const isAvailable = i < ctr.current;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.box} ${isAvailable ? styles.boxAvailable : styles.boxSpent}`}
                    onClick={() => {
                      if (isAvailable) updateCounter(ctr.id, i);
                      else updateCounter(ctr.id, i + 1);
                    }}
                    title={isAvailable ? 'Disponível — clique para gastar' : 'Gasto — clique para restaurar'}
                    aria-pressed={isAvailable}
                  >
                    {!isAvailable && <span className={styles.mark}>✕</span>}
                  </button>
                );
              })}
            </div>
            {used > 0 && (
              <div className={styles.footer}>
                <span className={styles.usedLabel}>{used} usado{used > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        );
      })}

      {missingDefaults.length > 0 && (
        <button onClick={handleAddClassResources} className={styles.addBtn}>
          ⚔ Adicionar recursos de {classId} (nível {characterLevel})
        </button>
      )}
    </div>
  );
}
