import type { CharacterPlayState, CustomCounter } from '../../types/playState';
import { getDefaultClassCounters } from '../../data/classResources';
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

  // Only show class-derived counters here (custom ones live in Extras tab)
  const classCounters = counters.filter(c => knownIds.has(c.id));
  const missingDefaults = defaultCounters.filter(d => !counters.some(c => c.id === d.id));

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
        const icon = ctr.icon ?? defaultCounters.find(d => d.id === ctr.id)?.icon;
        return (
          <div key={ctr.id} className={styles.card}>
            <div className={styles.top}>
              {icon && <span className={styles.icon} aria-hidden>{icon}</span>}
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
