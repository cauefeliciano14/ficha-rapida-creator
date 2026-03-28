import { useState } from 'react';
import type { CharacterPlayState, CurrencyPouch } from '../../../types/playState';

interface CurrencyPanelProps {
  currency: CurrencyPouch;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
}

const COINS: Array<{ key: keyof CurrencyPouch; label: string; abbr: string; color: string }> = [
  { key: 'po', label: 'Ouro', abbr: 'PO', color: '#fbbf24' },
  { key: 'pp', label: 'Prata', abbr: 'PP', color: '#94a3b8' },
  { key: 'pe', label: 'Electrum', abbr: 'PE', color: '#a78bfa' },
  { key: 'pc', label: 'Cobre', abbr: 'PC', color: '#f97316' },
];

function totalInGold(c: CurrencyPouch): number {
  return c.po + c.pp / 10 + c.pe / 2 + c.pc / 100;
}

export function CurrencyPanel({ currency, onUpdatePlayState }: CurrencyPanelProps) {
  const [editing, setEditing] = useState<keyof CurrencyPouch | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (key: keyof CurrencyPouch) => {
    setEditing(key);
    setEditValue(String(currency[key]));
  };

  const commitEdit = () => {
    if (editing) {
      const val = Math.max(0, parseInt(editValue, 10) || 0);
      const key = editing;
      onUpdatePlayState(prev => ({
        ...prev,
        currency: { ...prev.currency, [key]: val },
      }));
      setEditing(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Coin grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}>
        {COINS.map(coin => (
          <div key={coin.key} style={{
            background: 'rgba(17,18,24,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '8px 6px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
            onClick={() => !editing && startEdit(coin.key)}
          >
            <div style={{
              fontSize: '0.6rem',
              color: coin.color,
              fontWeight: 800,
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}>
              {coin.abbr}
            </div>
            {editing === coin.key ? (
              <input
                autoFocus
                type="number"
                min="0"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => e.key === 'Enter' && commitEdit()}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${coin.color}`,
                  borderRadius: '4px',
                  color: '#f1f5f9',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  padding: '2px 0',
                  outline: 'none',
                }}
              />
            ) : (
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                color: '#f1f5f9',
              }}>
                {currency[coin.key]}
              </div>
            )}
            <div style={{
              fontSize: '0.55rem',
              color: '#64748b',
              marginTop: '2px',
            }}>
              {coin.label}
            </div>
          </div>
        ))}
      </div>

      {/* Total in gold */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 10px',
        background: 'rgba(251,191,36,0.06)',
        border: '1px solid rgba(251,191,36,0.15)',
        borderRadius: '4px',
      }}>
        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>TOTAL EM OURO</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fbbf24' }}>
          {totalInGold(currency).toFixed(1).replace('.', ',')} PO
        </span>
      </div>
    </div>
  );
}
