import React, { useEffect, useState } from 'react';
import { calculateModifier, roll4d6DropLowest, calculateTotalPointCost, applyBackgroundBonus } from '../utils/attributeUtils';
import { ATTR_KEYS, ATTR_META } from '../utils/attributeConstants';
import classAttributeSuggestions from '../data/classAttributeSuggestions';
import css from './AttributesStep.module.css';
import type { DerivedSheet } from '../rules/types/DerivedSheet';
import { DiceAnimation } from './DiceAnimation';


const STD_VALUES = [15, 14, 13, 12, 10, 8];

const POINT_BUY_OPTIONS = [
  { value: 8,  label: '8' },
  { value: 9,  label: '9 (-1 pto)' },
  { value: 10, label: '10 (-2 pts)' },
  { value: 11, label: '11 (-3 pts)' },
  { value: 12, label: '12 (-4 pts)' },
  { value: 13, label: '13 (-5 pts)' },
  { value: 14, label: '14 (-7 pts)' },
  { value: 15, label: '15 (-9 pts)' },
];

interface RollEntry {
  dice: number[];
  dropped: number;
  total: number;
  assignedTo: string | null;
}

interface AttributesStepProps {
  character: any;
  setCharacter: any;
  getAttributeBonus: (attr: string) => number;
  selectedBackground: any;
  derived?: Pick<DerivedSheet, 'finalAttributes' | 'modifiers' | 'attributeBreakdowns'>;
}

export const AttributesStep = React.memo(
  ({ character, setCharacter, getAttributeBonus, selectedBackground, derived }: AttributesStepProps) => {
  const attrs = character.attributes;
  const [rollingSlots, setRollingSlots] = useState<Set<number>>(new Set());

  // Sync background bonuses whenever they change
  useEffect(() => {
    const bgBonus: Record<string, number> = {};
    ATTR_KEYS.forEach(k => bgBonus[k] = getAttributeBonus(k));
    const hasChanged = ATTR_KEYS.some(k => bgBonus[k] !== (attrs.backgroundBonus[k] || 0));
    if (hasChanged) {
      const final = applyBackgroundBonus(attrs.base, bgBonus);
      const modifiers: Record<string, number> = {};
      ATTR_KEYS.forEach(k => modifiers[k] = calculateModifier(final[k]));
      setCharacter((prev: any) => ({
        ...prev,
        attributes: { ...prev.attributes, backgroundBonus: bgBonus, final, modifiers }
      }));
    }
  }, [getAttributeBonus]);

  const updateBase = (newBase: Record<string, number>) => {
    const final = applyBackgroundBonus(newBase, attrs.backgroundBonus);
    const modifiers: Record<string, number> = {};
    ATTR_KEYS.forEach(k => modifiers[k] = calculateModifier(final[k]));
    const pointBuySpent = calculateTotalPointCost(newBase);
    setCharacter((prev: any) => ({
      ...prev,
      attributes: { ...prev.attributes, base: newBase, final, modifiers, pointBuySpent }
    }));
  };

  const setMethod = (method: string | null) => {
    const defaultBase = method === 'pointBuy'
      ? Object.fromEntries(ATTR_KEYS.map(k => [k, 8]))
      : Object.fromEntries(ATTR_KEYS.map(k => [k, 0]));
    const final = applyBackgroundBonus(defaultBase, attrs.backgroundBonus);
    const modifiers: Record<string, number> = {};
    ATTR_KEYS.forEach(k => modifiers[k] = calculateModifier(final[k]));
    setCharacter((prev: any) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        method,
        base: defaultBase,
        final,
        modifiers,
        randomRolls: method === 'random' ? [] : undefined,
        pointBuySpent: method === 'pointBuy' ? 0 : undefined,
      }
    }));
  };

  const handleStandardApply = () => {
    const classId = character.characterClass?.id || 'guerreiro';
    const suggestion = classAttributeSuggestions[classId] || [15, 14, 13, 12, 10, 8];
    const newBase: Record<string, number> = {};
    ATTR_KEYS.forEach((k, idx) => { newBase[k] = suggestion[idx]; });
    updateBase(newBase);
  };

  const handlePointBuyChange = (attr: string, value: number) => {
    const newBase = { ...attrs.base, [attr]: value };
    if (calculateTotalPointCost(newBase) > 27) return;
    updateBase(newBase);
  };

  // --- Dice Rolls (flat, no groups) ---
  const rolls: RollEntry[] = attrs.randomRolls || [];

  const handleRollSlot = (slotIdx: number) => {
    setRollingSlots(prev => new Set([...prev, slotIdx]));
    setTimeout(() => {
      const result = roll4d6DropLowest();
      setCharacter((prev: any) => {
        const prevRolls: RollEntry[] = prev.attributes.randomRolls || [];
        const newRolls = [...prevRolls];
        newRolls[slotIdx] = { ...result, assignedTo: null };
        return { ...prev, attributes: { ...prev.attributes, randomRolls: newRolls } };
      });
      setRollingSlots(prev => { const s = new Set(prev); s.delete(slotIdx); return s; });
    }, 700);
  };

  const handleRollAll = () => {
    for (let i = 0; i < 6; i++) {
      if (!rolls[i]) handleRollSlot(i);
    }
  };

  const handleAssignRoll = (slotIdx: number, attrKey: string | null) => {
    setCharacter((prev: any) => {
      const prevRolls: RollEntry[] = prev.attributes.randomRolls || [];
      const newRolls = prevRolls.map((r: RollEntry, ri: number) =>
        ri === slotIdx ? { ...r, assignedTo: attrKey } : r
      );
      return { ...prev, attributes: { ...prev.attributes, randomRolls: newRolls } };
    });
  };

  const handleResetRolls = () => {
    const defaultBase = Object.fromEntries(ATTR_KEYS.map(k => [k, 0]));
    const final = applyBackgroundBonus(defaultBase, attrs.backgroundBonus);
    const modifiers: Record<string, number> = {};
    ATTR_KEYS.forEach(k => modifiers[k] = calculateModifier(final[k]));
    setCharacter((prev: any) => ({
      ...prev,
      attributes: { ...prev.attributes, randomRolls: [], base: defaultBase, final, modifiers }
    }));
  };

  const handleApplyRolls = () => {
    const newBase = Object.fromEntries(ATTR_KEYS.map(k => [k, 0]));
    rolls.forEach((r: RollEntry) => { if (r.assignedTo) newBase[r.assignedTo] = r.total; });
    updateBase(newBase);
  };

  const usedAttrs = new Set(rolls.filter((r: RollEntry) => r.assignedTo).map((r: RollEntry) => r.assignedTo));
  const canApplyRolls = rolls.length === 6 && usedAttrs.size === 6;
  const isAnyRolling = rollingSlots.size > 0;

  const pointsRemaining = 27 - (attrs.pointBuySpent || 0);
  const fmtMod = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

  const isEmptyBase = (attr: string) => !attrs.base[attr];
  const totalFor = (attr: string): number | null => {
    if (isEmptyBase(attr)) return null;
    return derived?.finalAttributes?.[attr] ?? attrs.final[attr] ?? null;
  };
  const modFor = (attr: string): number | null => {
    if (isEmptyBase(attr)) return null;
    return derived?.modifiers?.[attr] ?? attrs.modifiers[attr] ?? null;
  };

  const METHODS: { id: string; label: string }[] = [
    { id: 'standard', label: 'Conjunto Padrão' },
    { id: 'pointBuy', label: 'Custo de Pontos' },
    { id: 'random', label: 'Rolagem' },
  ];

  const usedStd = (attr: string) =>
    ATTR_KEYS.filter(k => k !== attr && attrs.base[k] !== 0).map(k => attrs.base[k]);

  const renderInput = (attr: string) => {
    if (attrs.method === 'standard') {
      return (
        <select className={css.select} aria-label={ATTR_META[attr].full} value={attrs.base[attr] || 0}
          onChange={e => updateBase({ ...attrs.base, [attr]: Number(e.target.value) })}>
          <option value={0}>--</option>
          {STD_VALUES.map(v => (
            <option key={v} value={v} disabled={usedStd(attr).includes(v)}>{v}</option>
          ))}
        </select>
      );
    }
    if (attrs.method === 'pointBuy') {
      return (
        <select className={css.select} aria-label={ATTR_META[attr].full} value={attrs.base[attr]}
          onChange={e => handlePointBuyChange(attr, Number(e.target.value))}>
          {POINT_BUY_OPTIONS.map(opt => {
            const wouldCost = calculateTotalPointCost({ ...attrs.base, [attr]: opt.value });
            const tooExpensive = wouldCost > 27 && opt.value > attrs.base[attr];
            return <option key={opt.value} value={opt.value} disabled={tooExpensive}>{opt.label}</option>;
          })}
        </select>
      );
    }
    return <div className={css.readonly}>{attrs.base[attr] || '--'}</div>;
  };

  const otherRows = (attr: string) =>
    (derived?.attributeBreakdowns?.[attr] ?? []).filter(r => r.label !== 'Base' && r.label !== 'Antecedente');

  return (
    <div className={css.root}>
      <div className={css.methodBar}>
        <span className={css.methodLabel}>Método de geração</span>
        <div className={css.segmented} role="tablist">
          {METHODS.map(m => (
            <button key={m.id} type="button" role="tab" aria-selected={attrs.method === m.id}
              className={`${css.segment} ${attrs.method === m.id ? css.segmentActive : ''}`}
              onClick={() => attrs.method !== m.id && setMethod(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        {attrs.method === 'standard' && (
          <button type="button" className={css.ghostBtn} onClick={handleStandardApply}>Aplicar sugestão da classe</button>
        )}
        {attrs.method === 'pointBuy' && (
          <span className={css.points}>Pontos restantes: <strong className={pointsRemaining < 0 ? css.neg : ''}>{pointsRemaining}/27</strong></span>
        )}
      </div>

      {!attrs.method && <div className={css.empty}>Selecione um método de geração acima.</div>}

      {attrs.method && (
        <div className={css.scoreRow}>
          {ATTR_KEYS.map(attr => (
            <div key={attr} className={css.scoreCol}>
              <div className={css.scoreName}>{ATTR_META[attr].abbr}</div>
              {renderInput(attr)}
              <div className={css.scoreTotal}>TOTAL: <strong>{totalFor(attr) ?? '--'}</strong></div>
            </div>
          ))}
        </div>
      )}

      {attrs.method === 'random' && (
        <div className={css.panel}>
          <div className={css.panelHead}>
            <span>Rolagem de dados (4d6, descarta o menor)</span>
            <div className={css.actions}>
              <button type="button" className={css.ghostBtn} onClick={handleRollAll} disabled={rolls.length >= 6 || isAnyRolling}>Rolar todos</button>
              <button type="button" className={css.ghostBtn} onClick={handleResetRolls}>Redefinir</button>
              <button type="button" className={css.primaryBtn} onClick={handleApplyRolls} disabled={!canApplyRolls}>Aplicar valores</button>
            </div>
          </div>
          <div className={css.rollGrid}>
            {Array.from({ length: 6 }).map((_, slotIdx) => {
              const roll = rolls[slotIdx];
              if (rollingSlots.has(slotIdx)) return <div key={slotIdx} className={css.rollSlot}><DiceAnimation diceCount={4} /></div>;
              if (!roll) {
                return (
                  <div key={slotIdx} className={css.rollSlot}>
                    <button type="button" className={css.ghostBtn} onClick={() => handleRollSlot(slotIdx)} disabled={isAnyRolling}>Rolar</button>
                  </div>
                );
              }
              const droppedIdx = roll.dice.reduce((minI: number, curr: number, i: number, arr: number[]) => curr < arr[minI] ? i : minI, 0);
              return (
                <div key={slotIdx} className={css.rollSlot}>
                  <span className={css.rollTotal}>{roll.total}</span>
                  <div className={css.dice}>
                    {roll.dice.map((d: number, di: number) => (
                      <span key={di} className={`${css.die} ${di === droppedIdx ? css.dieDropped : ''}`}>{d}</span>
                    ))}
                  </div>
                  <select className={css.select} value={roll.assignedTo || ''} onChange={e => handleAssignRoll(slotIdx, e.target.value || null)}>
                    <option value="">--</option>
                    {ATTR_KEYS.map(k => (
                      <option key={k} value={k} disabled={usedAttrs.has(k) && roll.assignedTo !== k}>{ATTR_META[k].abbr}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {attrs.method && (
        <section>
          <h3 className={css.sectionTitle}>Cálculo dos atributos</h3>
          <div className={css.calcGrid}>
            {ATTR_KEYS.map(attr => {
              const base = attrs.base[attr] || 0;
              const bonus = attrs.backgroundBonus[attr] || 0;
              const total = totalFor(attr);
              const mod = modFor(attr);
              return (
                <div key={attr} className={css.calcCard}>
                  <div className={css.calcHead}>{ATTR_META[attr].full}</div>
                  <div className={`${css.calcRow} ${css.calcHi}`}><span>Total</span><strong>{total ?? '--'}</strong></div>
                  <div className={`${css.calcRow} ${css.calcHi}`}><span>Modificador</span><strong>{mod !== null ? fmtMod(mod) : '--'}</strong></div>
                  <div className={css.calcRow}><span>Valor base</span><span>{base || '--'}</span></div>
                  <div className={css.calcRow}>
                    <span>Bônus {selectedBackground?.name ? `(${selectedBackground.name})` : '(antecedente)'}</span>
                    <span>{bonus > 0 ? `+${bonus}` : '+0'}</span>
                  </div>
                  {otherRows(attr).map((r, i) => (
                    <div key={i} className={css.calcRow}><span>Bônus ({r.label})</span><span>{r.value >= 0 ? `+${r.value}` : r.value}</span></div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}, (prev, next) => {
  return (
    prev.getAttributeBonus === next.getAttributeBonus &&
    prev.selectedBackground?.id === next.selectedBackground?.id &&
    prev.character.attributes === next.character.attributes &&
    prev.derived === next.derived &&
    prev.character.characterClass?.id === next.character.characterClass?.id
  );
});
