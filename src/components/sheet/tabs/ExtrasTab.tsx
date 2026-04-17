import { useState } from 'react';
import type { CharacterPlayState, CustomCounter } from '../../../types/playState';
import { getDefaultClassCounters } from '../../../data/classResources';
import styles from './ExtrasTab.module.css';

interface ExtrasTabProps {
  extras: string;
  onUpdateExtras: (extras: string) => void;
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  classId?: string;
  characterLevel?: number;
}

const RESET_LABELS: Record<CustomCounter['resetOn'], string> = {
  short: 'Desc. Curto',
  long: 'Desc. Longo',
  manual: 'Manual',
};

export function ExtrasTab({ extras, onUpdateExtras, playState, onUpdatePlayState, classId, characterLevel = 1 }: ExtrasTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formMax, setFormMax] = useState('1');
  const [formReset, setFormReset] = useState<CustomCounter['resetOn']>('long');

  const allCounters = playState.customCounters ?? [];

  const defaultCounters = classId ? getDefaultClassCounters(classId, characterLevel) : [];
  const classIds = new Set(defaultCounters.map(d => d.id));

  // Class-derived counters render in the dedicated ClassResourcesCard;
  // here we only show user-created custom counters.
  const counters = allCounters.filter(c => !classIds.has(c.id));

  const handleAddClassResources = () => {
    // kept for backward compatibility but no longer surfaced in UI
    const missing = defaultCounters.filter(d => !allCounters.some(c => c.id === d.id));
    if (missing.length === 0) return;
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: [...(prev.customCounters ?? []), ...missing],
    }));
  };
  void handleAddClassResources;
  const missingDefaults: typeof defaultCounters = [];

  const handleAddCounter = () => {
    if (!formName.trim()) return;
    const max = Math.max(1, parseInt(formMax, 10) || 1);
    const newCounter: CustomCounter = {
      id: `ctr-${Date.now()}`,
      name: formName.trim(),
      current: max,
      max,
      resetOn: formReset,
    };
    onUpdatePlayState(prev => ({ ...prev, customCounters: [...(prev.customCounters ?? []), newCounter] }));
    setFormName(''); setFormMax('1'); setShowForm(false);
  };

  const updateCounter = (id: string, delta: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: (prev.customCounters ?? []).map(c =>
        c.id === id ? { ...c, current: Math.max(0, Math.min(c.max, c.current + delta)) } : c
      ),
    }));
  };

  const removeCounter = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: (prev.customCounters ?? []).filter(c => c.id !== id),
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

  return (
    <div className={styles.container}>

      {/* ── Contadores de Recursos ── */}
      <div className={styles.sectionTitle}>CONTADORES DE RECURSOS</div>

      {counters.length > 0 && (
        <div className={styles.counterList}>
          {counters.map(ctr => {
            const used = ctr.max - ctr.current;
            return (
              <div key={ctr.id} className={styles.counterCard}>
                <div className={styles.counterTop}>
                  <span className={styles.counterName}>{ctr.name}</span>
                  <span className={styles.counterReset}>{RESET_LABELS[ctr.resetOn]}</span>
                  <span className={styles.counterValue}>
                    {ctr.current}<span className={styles.counterMax}>/{ctr.max}</span>
                  </span>
                  <button onClick={() => resetCounter(ctr.id)} className={styles.counterResetBtn} title="Restaurar">↺</button>
                  <button onClick={() => removeCounter(ctr.id)} className={styles.counterRemoveBtn} title="Remover">✕</button>
                </div>
                <div className={styles.checkboxGroup} role="group" aria-label={ctr.name}>
                  {Array.from({ length: ctr.max }, (_, i) => {
                    const isAvailable = i < ctr.current;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`${styles.slotBox} ${isAvailable ? styles.slotAvailable : styles.slotSpent}`}
                        onClick={() => {
                          if (isAvailable) updateCounter(ctr.id, -(ctr.current - i));
                          else updateCounter(ctr.id, (i - ctr.current + 1));
                        }}
                        title={isAvailable ? 'Disponível — clique para gastar' : 'Gasto — clique para restaurar'}
                        aria-pressed={isAvailable}
                      >
                        {!isAvailable && <span className={styles.slotMark}>✕</span>}
                      </button>
                    );
                  })}
                </div>
                {used > 0 && (
                  <div className={styles.counterFooter}>
                    <span className={styles.usedLabel}>{used} usado{used > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {missingDefaults.length > 0 && !showForm && (
        <button onClick={handleAddClassResources} className={styles.addClassBtn}>
          ⚔ Adicionar recursos de {classId} (nível {characterLevel})
        </button>
      )}

      {showForm ? (
        <div className={styles.counterForm}>
          <input
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="Nome do recurso (ex: Ki Points, Rages)"
            className={styles.formInput}
          />
          <div className={styles.formRow}>
            <input
              type="number"
              min="1"
              value={formMax}
              onChange={e => setFormMax(e.target.value)}
              placeholder="Máximo"
              className={styles.formInput}
              style={{ flex: 1 }}
            />
            <select
              value={formReset}
              onChange={e => setFormReset(e.target.value as CustomCounter['resetOn'])}
              className={styles.formSelect}
              style={{ flex: 1 }}
            >
              <option value="long">Desc. Longo</option>
              <option value="short">Desc. Curto</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button onClick={handleAddCounter} disabled={!formName.trim()} className={styles.formSubmitBtn}>
              Adicionar
            </button>
            <button onClick={() => setShowForm(false)} className={styles.formCancelBtn}>Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className={styles.addBtn}>
          ＋ Novo Contador
        </button>
      )}

      {/* ── Notas Extras ── */}
      <div className={styles.sectionTitle} style={{ marginTop: '16px' }}>NOTAS EXTRAS</div>
      <div className={styles.hint}>
        Companions, condições especiais, informações de sessão, etc.
      </div>
      <textarea
        value={extras}
        onChange={e => onUpdateExtras(e.target.value)}
        placeholder="Extras, companions…"
        className={styles.textarea}
      />
    </div>
  );
}
