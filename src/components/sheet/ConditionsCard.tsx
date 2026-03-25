import { D6_CONDITIONS } from '../../rules/calculators/sheet';

interface ConditionsCardProps {
  activeConditions: string[];
  onAdd: (condition: string) => void;
  onRemove: (condition: string) => void;
}

export function ConditionsCard({ activeConditions, onAdd, onRemove }: ConditionsCardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {D6_CONDITIONS.map(condition => {
        const isActive = activeConditions.includes(condition);
        return (
          <div
            key={condition}
            onClick={() => isActive ? onRemove(condition) : onAdd(condition)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              background: isActive ? 'rgba(248,113,113,0.08)' : 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: isActive ? '#f87171' : '#94a3b8' }}>
                {condition}
              </span>
            </div>
            
            {/* Toggle switch */}
            <div style={{
              width: '36px',
              height: '20px',
              borderRadius: '10px',
              background: isActive ? '#991b1b' : 'rgba(255,255,255,0.1)',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: isActive ? '18px' : '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: isActive ? '#f87171' : '#475569',
                transition: 'left 0.2s, background 0.2s',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
