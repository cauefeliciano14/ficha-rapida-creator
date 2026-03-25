import type { CharacterPlayState } from '../../types/playState';

interface DeathSavesCardProps {
  deathSaves: { successes: number; failures: number };
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
}

export function DeathSavesCard({ deathSaves, onUpdatePlayState }: DeathSavesCardProps) {
  const toggleSuccess = (index: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      deathSaves: {
        ...prev.deathSaves,
        successes: prev.deathSaves.successes > index ? index : index + 1,
      },
    }));
  };

  const toggleFailure = (index: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      deathSaves: {
        ...prev.deathSaves,
        failures: prev.deathSaves.failures > index ? index : index + 1,
      },
    }));
  };

  const resetDeathSaves = () => {
    onUpdatePlayState(prev => ({
      ...prev,
      deathSaves: { successes: 0, failures: 0 },
    }));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '8px 0',
    }}>
      {/* Successes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 800, width: '62px', letterSpacing: '0.03em' }}>
          SUCESSOS
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <button
              key={`s-${i}`}
              onClick={() => toggleSuccess(i)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: `2px solid ${i < deathSaves.successes ? '#4ade80' : 'rgba(255,255,255,0.2)'}`,
                background: i < deathSaves.successes ? '#4ade80' : 'transparent',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.15s',
                boxShadow: i < deathSaves.successes ? '0 0 8px rgba(74,222,128,0.5)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Failures */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: 800, width: '62px', letterSpacing: '0.03em' }}>
          FALHAS
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <button
              key={`f-${i}`}
              onClick={() => toggleFailure(i)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: `2px solid ${i < deathSaves.failures ? '#f87171' : 'rgba(255,255,255,0.2)'}`,
                background: i < deathSaves.failures ? '#f87171' : 'transparent',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.15s',
                boxShadow: i < deathSaves.failures ? '0 0 8px rgba(248,113,113,0.5)' : 'none',
              }}
            />
          ))}
        </div>
        
        {/* Reset button */}
        {(deathSaves.successes > 0 || deathSaves.failures > 0) && (
          <button
            onClick={resetDeathSaves}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              fontSize: '0.65rem',
              cursor: 'pointer',
              padding: '0 4px',
              marginLeft: 'auto',
            }}
          >
            ↺ Resetar
          </button>
        )}
      </div>
    </div>
  );
}
