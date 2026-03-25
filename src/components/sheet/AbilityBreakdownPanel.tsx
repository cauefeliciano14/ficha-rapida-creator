import type { BackgroundBonusDistribution, AttributeKey } from '../../rules/types/CharacterChoices';
import { calculateModifier } from '../../rules/calculators/attributes';

const ABILITY_LABELS: Record<string, { label: string; abbr: string }> = {
  forca: { label: 'Força', abbr: 'FOR' },
  destreza: { label: 'Destreza', abbr: 'DES' },
  constituicao: { label: 'Constituição', abbr: 'CON' },
  inteligencia: { label: 'Inteligência', abbr: 'INT' },
  sabedoria: { label: 'Sabedoria', abbr: 'SAB' },
  carisma: { label: 'Carisma', abbr: 'CAR' },
};

interface AbilityBreakdownPanelProps {
  abilityKey: string;
  baseAttributes: Record<string, number>;
  finalAttributes: Record<string, number>;
  bonusDistribution: BackgroundBonusDistribution | null;
  onClose: () => void;
}

function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function AbilityBreakdownPanel({
  abilityKey,
  baseAttributes,
  finalAttributes,
  bonusDistribution,
  onClose,
}: AbilityBreakdownPanelProps) {
  const info = ABILITY_LABELS[abilityKey];
  if (!info) return null;

  const baseScore = baseAttributes[abilityKey] ?? 8;
  const finalScore = finalAttributes[abilityKey] ?? 8;
  const bonus = bonusDistribution?.distribution?.[abilityKey as AttributeKey] ?? 0;
  const mod = calculateModifier(finalScore);

  const bonusSource = bonusDistribution
    ? bonusDistribution.mode === '+2/+1'
      ? 'Origem (+2/+1)'
      : 'Origem (+1/+1/+1)'
    : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(14, 14, 18, 0.98)',
          border: '2px solid #991b1b',
          borderRadius: '12px',
          padding: '24px',
          width: '320px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {info.abbr}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f1f5f9' }}>
              {info.label}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Total Score + Modifier */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '20px',
          padding: '16px',
          background: 'rgba(153,27,27,0.1)',
          border: '1px solid rgba(153,27,27,0.3)',
          borderRadius: '8px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>
              {finalScore}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>
              TOTAL
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>
              {signedMod(mod)}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>
              MODIFICADOR
            </div>
          </div>
        </div>

        {/* Breakdown table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={rowStyle}>
            <span style={rowLabelStyle}>Valor Base</span>
            <span style={rowValueStyle}>{baseScore}</span>
          </div>
          {bonus > 0 && (
            <div style={rowStyle}>
              <div>
                <span style={rowLabelStyle}>{bonusSource}</span>
              </div>
              <span style={{ ...rowValueStyle, color: '#4ade80' }}>+{bonus}</span>
            </div>
          )}
          <div style={{ ...rowStyle, background: 'rgba(153,27,27,0.15)' }}>
            <span style={{ ...rowLabelStyle, color: '#f1f5f9', fontWeight: 800 }}>Pontuação Final</span>
            <span style={{ ...rowValueStyle, color: '#f1f5f9', fontWeight: 900 }}>{finalScore}</span>
          </div>
        </div>

        {/* Modifier explanation */}
        <div style={{
          marginTop: '16px',
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: '#64748b',
          lineHeight: 1.5,
        }}>
          Modificador = floor(({finalScore} − 10) ÷ 2) = <span style={{ color: '#dc2626', fontWeight: 700 }}>{signedMod(mod)}</span>
        </div>
      </div>
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 14px',
  background: 'rgba(14, 14, 18, 0.8)',
};

const rowLabelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#94a3b8',
  fontWeight: 600,
};

const rowValueStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#cbd5e1',
  fontWeight: 700,
};
