import { useState } from 'react';
import type { CharacterPlayState, ClassResource } from '../../../types/playState';

interface ClassResourcesPanelProps {
  classResources: ClassResource[];
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
}

export function ClassResourcesPanel({ classResources, onUpdatePlayState }: ClassResourcesPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formMax, setFormMax] = useState('2');
  const [formRecharge, setFormRecharge] = useState<'short' | 'long'>('long');

  const toggleUse = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      classResources: (prev.classResources ?? []).map(r =>
        r.id === id
          ? { ...r, usedCount: r.usedCount < r.maxUses ? r.usedCount + 1 : 0 }
          : r
      ),
    }));
  };

  const removeResource = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      classResources: (prev.classResources ?? []).filter(r => r.id !== id),
    }));
  };

  const addResource = () => {
    if (!formName.trim()) return;
    const resource: ClassResource = {
      id: `cr-${Date.now()}`,
      name: formName.trim(),
      maxUses: Math.max(1, parseInt(formMax, 10) || 1),
      usedCount: 0,
      rechargeOn: formRecharge,
    };
    onUpdatePlayState(prev => ({
      ...prev,
      classResources: [...(prev.classResources ?? []), resource],
    }));
    setFormName('');
    setFormMax('2');
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 800, letterSpacing: '0.05em' }}>
          RECURSOS DE CLASSE
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          style={{
            background: 'none',
            border: 'none',
            color: '#dc2626',
            fontSize: '0.7rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ＋ ADICIONAR
        </button>
      </div>

      {classResources.length === 0 && !showForm && (
        <div style={{ color: '#475569', fontSize: '0.8rem', textAlign: 'center', padding: '8px' }}>
          Nenhum recurso rastreado. Adicione Fúria, Canalizar Divindade, etc.
        </div>
      )}

      {classResources.map(r => {
        const remaining = r.maxUses - r.usedCount;
        return (
          <div key={r.id} style={{
            background: 'rgba(17,18,24,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '10px 12px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 700 }}>{r.name}</span>
                <span style={{
                  fontSize: '0.55rem',
                  color: '#64748b',
                  marginLeft: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                }}>
                  {r.rechargeOn === 'short' ? 'DESC. CURTO' : 'DESC. LONGO'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: remaining > 0 ? '#4ade80' : '#f87171',
                  fontWeight: 800,
                }}>
                  {remaining}/{r.maxUses}
                </span>
                <button
                  onClick={() => removeResource(r.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    padding: '0 2px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {Array.from({ length: r.maxUses }, (_, i) => {
                const isUsed = i < r.usedCount;
                return (
                  <button
                    key={i}
                    onClick={() => toggleUse(r.id)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: `2px solid ${isUsed ? '#475569' : '#991b1b'}`,
                      background: isUsed ? 'rgba(255,255,255,0.03)' : 'rgba(153,27,27,0.35)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {isUsed && <span style={{ color: '#475569', fontSize: '0.65rem', fontWeight: 900 }}>✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {showForm && (
        <div style={{
          background: 'rgba(17,18,24,0.6)',
          border: '1px solid rgba(153,27,27,0.3)',
          borderRadius: '6px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <input
            autoFocus
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="Nome (ex: Fúria, Canalizar Divindade)"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: '#f1f5f9',
              padding: '6px 10px',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>USOS:</span>
              <input
                type="number"
                min="1"
                max="20"
                value={formMax}
                onChange={e => setFormMax(e.target.value)}
                style={{
                  width: '50px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#f1f5f9',
                  padding: '4px 6px',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            </div>
            <select
              value={formRecharge}
              onChange={e => setFormRecharge(e.target.value as 'short' | 'long')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#f1f5f9',
                padding: '4px 8px',
                fontSize: '0.78rem',
              }}
            >
              <option value="long">Descanso Longo</option>
              <option value="short">Descanso Curto</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={addResource}
              disabled={!formName.trim()}
              style={{
                flex: 1,
                background: formName.trim() ? 'rgba(153,27,27,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${formName.trim() ? 'rgba(153,27,27,0.4)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '4px',
                color: formName.trim() ? '#dc2626' : '#475569',
                padding: '6px 12px',
                fontSize: '0.82rem',
                cursor: formName.trim() ? 'pointer' : 'default',
                fontWeight: 600,
              }}
            >
              Adicionar
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '4px',
                color: '#64748b',
                padding: '6px 12px',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
