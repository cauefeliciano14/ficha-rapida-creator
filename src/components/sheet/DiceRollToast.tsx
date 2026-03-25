import type { DiceRollResult } from './useDiceRoller';

interface DiceRollToastProps {
  rolls: DiceRollResult[];
  characterName: string;
  onDismiss: (id: string) => void;
}

export function DiceRollToast({ rolls, characterName, onDismiss }: DiceRollToastProps) {
  if (rolls.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '400px',
    }}>
      {rolls.map(roll => (
        <div
          key={roll.id}
          onClick={() => onDismiss(roll.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(14, 14, 18, 0.97)',
            border: '1px solid #991b1b',
            borderRadius: '8px',
            padding: '10px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            cursor: 'pointer',
            animation: 'slideInRight 0.3s ease-out',
          }}
        >
          {/* D20 icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(153,27,27,0.3)',
            border: '2px solid #991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#dc2626' }}>D20</span>
          </div>

          {/* Roll info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{characterName.toUpperCase()}</span>
              {' ROLLED '}
              <span style={{ color: '#dc2626', fontWeight: 700 }}>{roll.type.toUpperCase()}</span>
              {' '}
              <span style={{ color: '#94a3b8' }}>{roll.label}</span>
            </div>
          </div>

          {/* Result */}
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: '#f1f5f9',
            minWidth: '40px',
            textAlign: 'center',
          }}>
            {roll.result}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
