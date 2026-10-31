import { useEffect, useRef, useState } from 'react';
import type { CharacterPlayState, CustomCounter } from '../../types/playState';
import {
  getDefaultClassCounters,
  CLASS_RESOURCES,
  SUBCLASS_RESOURCES,
  getResourceTemplate,
  resolveResourceMax,
  resolveResourceReset,
} from '../../data/classResources';
import styles from './ClassResourcesCard.module.css';

interface ClassResourcesCardProps {
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  classId?: string;
  characterLevel?: number;
  subclassName?: string;
  /** Modificadores de atributo, para recursos que dependem deles (ex.: Inspiração de Bardo = Carisma). */
  abilityModifiers?: Record<string, number>;
}

const RESET_LABELS: Record<CustomCounter['resetOn'], string> = {
  short: 'Volta no Descanso Curto',
  long: 'Volta no Descanso Longo',
  manual: 'Não volta sozinho',
};

function normalizeSubclass(name?: string): string {
  if (!name) return '';
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function ClassResourcesCard({
  playState,
  onUpdatePlayState,
  classId,
  characterLevel = 1,
  subclassName,
  abilityModifiers,
}: ClassResourcesCardProps) {
  const counters = playState.customCounters ?? [];
  const defaultCounters = classId
    ? getDefaultClassCounters(classId, characterLevel, subclassName, abilityModifiers)
    : [];
  const knownIds = new Set(defaultCounters.map(d => d.id));
  const subKey = normalizeSubclass(subclassName);
  const allTemplates = [
    ...(classId ? (CLASS_RESOURCES[classId] ?? []) : []),
    ...(subKey ? (SUBCLASS_RESOURCES[subKey] ?? []) : []),
  ];

  const classCounters = counters.filter(c => knownIds.has(c.id));
  const missingDefaults = defaultCounters.filter(d => !counters.some(c => c.id === d.id));

  // Newly-unlocked badge state: ids unlocked by latest level-up (auto-cleared after ~5s)
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  /* ─────────────────────────────────────────────────────────────
     Auto-sync: detect level changes
     - Update existing counter `max` (preserves used amount)
     - Add subclass-unlocked counters when level threshold reached
     ───────────────────────────────────────────────────────────── */
  const modsKey = JSON.stringify(abilityModifiers ?? {});
  const lastSyncRef = useRef<{ classId?: string; subKey: string; level: number; modsKey: string } | null>(null);
  useEffect(() => {
    if (!classId) return;
    const prev = lastSyncRef.current;
    if (prev && prev.classId === classId && prev.subKey === subKey && prev.level === characterLevel && prev.modsKey === modsKey) return;
    const wasInitial = !prev;
    const prevLevel = prev?.level ?? characterLevel;
    lastSyncRef.current = { classId, subKey, level: characterLevel, modsKey };
    if (wasInitial) return;

    const newlyUnlocked: string[] = [];

    onUpdatePlayState(curr => {
      const list = curr.customCounters ?? [];
      let changed = false;
      const newlyUnlockedDetails: Array<{ id: string; name: string; icon?: string; max: number }> = [];

      // 1) Recalculate max for existing counters
      const updated = list.map(c => {
        const tmpl = allTemplates.find(t => t.id === c.id);
        if (!tmpl) return c;
        const newMax = resolveResourceMax(tmpl, characterLevel, abilityModifiers);
        const newReset = resolveResourceReset(tmpl, characterLevel);
        if (newMax === c.max && newReset === c.resetOn) return c;
        const used = Math.max(0, c.max - c.current);
        const newCurrent = Math.max(0, Math.min(newMax, newMax - used));
        changed = true;
        if (c.max === 0 && newMax > 0) {
          newlyUnlocked.push(c.id);
          newlyUnlockedDetails.push({ id: c.id, name: c.name, icon: c.icon, max: newMax });
        }
        return { ...c, max: newMax, current: newCurrent, resetOn: newReset };
      });

      // 2) Auto-add subclass counters that just crossed unlockLevel (if leveling up)
      if (characterLevel > prevLevel && subKey) {
        const subTemplates = SUBCLASS_RESOURCES[subKey] ?? [];
        const lvlIdx = Math.max(0, Math.min(19, characterLevel - 1));
        for (const t of subTemplates) {
          if (t.unlockLevel > prevLevel && t.unlockLevel <= characterLevel) {
            const max = t.maxByLevel[lvlIdx];
            if (max > 0 && !updated.some(c => c.id === t.id)) {
              updated.push({ id: t.id, name: t.name, icon: t.icon, current: max, max, resetOn: t.resetOn });
              newlyUnlocked.push(t.id);
              newlyUnlockedDetails.push({ id: t.id, name: t.name, icon: t.icon, max });
              changed = true;
            }
          }
        }
      }

      // 3) Append to unlock history
      if (newlyUnlockedDetails.length > 0) {
        const prevHistory = curr.unlockHistory ?? [];
        const nextHistory = [
          ...prevHistory,
          { level: characterLevel, timestamp: Date.now(), resources: newlyUnlockedDetails },
        ];
        return { ...curr, customCounters: updated, unlockHistory: nextHistory };
      }

      return changed ? { ...curr, customCounters: updated } : curr;
    });

    if (newlyUnlocked.length) {
      setUnlockedIds(new Set(newlyUnlocked));
      const t = setTimeout(() => setUnlockedIds(new Set()), 5000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, characterLevel, subKey, modsKey]);

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

  const dismissBadge = (id: string) => {
    setUnlockedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (!classId || (defaultCounters.length === 0 && classCounters.length === 0)) {
    return <p className={styles.intro}>Nenhum por enquanto. Sua classe libera usos limitados em níveis mais altos.</p>;
  }

  return (
    <div className={styles.list}>
      {classCounters.map(ctr => {
        const used = ctr.max - ctr.current;
        const tmpl = getResourceTemplate(ctr.id);
        const icon = ctr.icon ?? tmpl?.icon;
        const rules = tmpl?.description;
        const isNewlyUnlocked = unlockedIds.has(ctr.id);
        return (
          <div key={ctr.id} className={`${styles.card} ${isNewlyUnlocked ? styles.cardUnlocked : ''}`}>
            {isNewlyUnlocked && (
              <button
                type="button"
                className={styles.unlockBadge}
                onClick={() => dismissBadge(ctr.id)}
                title="Clique para fechar"
                aria-label="Novo recurso desbloqueado"
              >
                <span className={styles.unlockSparkle} aria-hidden>✨</span>
                Novo recurso desbloqueado!
              </button>
            )}
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
              <span className={styles.nameBlock}>
                <span className={styles.name}>{ctr.name}</span>
                <span className={styles.reset}>{RESET_LABELS[ctr.resetOn]}</span>
              </span>
              <span className={styles.value} title={`${ctr.current} de ${ctr.max} disponíveis`}>
                {ctr.current}<span className={styles.max}>/{ctr.max}</span>
              </span>
              {used > 0 && (
                <button
                  onClick={() => resetCounter(ctr.id)}
                  className={styles.resetBtn}
                  title="Recuperar todos os usos"
                  aria-label={`Recuperar ${ctr.name}`}
                >↺</button>
              )}
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
