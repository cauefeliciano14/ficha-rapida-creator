import type { SpellSlots } from '../../../rules/types/DerivedSheet';
import type { CharacterPlayState } from '../../../types/playState';

interface SpellSlotsPanelProps {
  spellSlots: SpellSlots;
  spentSpellSlots: Record<number, number>;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
}

function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function SpellSlotsPanel({ spellSlots, spentSpellSlots, onUpdatePlayState }: SpellSlotsPanelProps) {
  const levels = Object.entries(spellSlots)
    .map(([k, v]) => ({ level: Number(k), total: v as number }))
    .filter(s => s.total > 0)
    .sort((a, b) => a.level - b.level);

  if (levels.length === 0) return null;

  const toggleSlot = (level: number, index: number) => {
    const spent = spentSpellSlots[level] ?? 0;
    const isUsed = index < spent;
    onUpdatePlayState(prev => ({
      ...prev,
      spentSpellSlots: {
        ...prev.spentSpellSlots,
        [level]: isUsed
          ? Math.max(0, (prev.spentSpellSlots[level] ?? 0) - 1)
          : (prev.spentSpellSlots[level] ?? 0) + 1,
      },
    }));
  };

  return (
    <div style={{
      background: 'rgba(14,14,18,0.9)',
      border: '2px solid #991b1b',
      borderRadius: '6px',
      padding: '20px 16px 14px',
      position: 'relative',
      boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
    }}>
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#7f1d1d',
        color: '#f1f5f9',
        fontSize: '0.75rem',
        fontWeight: 800,
        letterSpacing: '0.1em',
        padding: '4px 12px',
        borderRadius: '4px',
        border: '1px solid #4a0404',
        whiteSpace: 'nowrap',
        zIndex: 2,
      }}>
        ESPAÇOS DE MAGIA
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(levels.length, 9)}, 1fr)`,
        gap: '6px',
      }}>
        {levels.map(({ level, total }) => {
          const spent = spentSpellSlots[level] ?? 0;
          const remaining = total - spent;
          return (
            <div key={level} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.6rem',
                color: '#dc2626',
                fontWeight: 800,
                marginBottom: '6px',
                letterSpacing: '0.03em',
              }}>
                {level}º
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                alignItems: 'center',
              }}>
                {Array.from({ length: total }, (_, i) => {
                  const isUsed = i < spent;
                  return (
                    <button
                      key={i}
                      onClick={() => toggleSlot(level, i)}
                      title={isUsed ? 'Restaurar slot' : 'Gastar slot'}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '4px',
                        border: `2px solid ${isUsed ? '#475569' : '#991b1b'}`,
                        background: isUsed ? 'rgba(255,255,255,0.03)' : 'rgba(153,27,27,0.4)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {isUsed && (
                        <span style={{ color: '#475569', fontSize: '0.6rem', fontWeight: 900 }}>✕</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{
                fontSize: '0.6rem',
                color: remaining > 0 ? '#94a3b8' : '#475569',
                fontWeight: 700,
                marginTop: '4px',
              }}>
                {remaining}/{total}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
