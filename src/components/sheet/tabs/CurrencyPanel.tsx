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

interface ConversionOption {
  from: keyof CurrencyPouch;
  to: keyof CurrencyPouch;
  label: string;
  fromAmount: number;
  toAmount: number;
}

const CONVERSIONS: ConversionOption[] = [
  { from: 'pc', to: 'pp', label: '10 PC → 1 PP', fromAmount: 10, toAmount: 1 },
  { from: 'pp', to: 'po', label: '10 PP → 1 PO', fromAmount: 10, toAmount: 1 },
  { from: 'pe', to: 'po', label: '2 PE → 1 PO', fromAmount: 2, toAmount: 1 },
  { from: 'po', to: 'pp', label: '1 PO → 10 PP', fromAmount: 1, toAmount: 10 },
  { from: 'pp', to: 'pc', label: '1 PP → 10 PC', fromAmount: 1, toAmount: 10 },
  { from: 'po', to: 'pe', label: '1 PO → 2 PE', fromAmount: 1, toAmount: 2 },
];

export function CurrencyPanel({ currency, onUpdatePlayState }: CurrencyPanelProps) {
  const [editing, setEditing] = useState<keyof CurrencyPouch | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showConvert, setShowConvert] = useState(false);

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
        currency: { ...(prev.currency ?? { po: 0, pp: 0, pe: 0, pc: 0 }), [key]: val },
      }));
      setEditing(null);
    }
  };

  const doConvert = (conv: ConversionOption) => {
    if (currency[conv.from] < conv.fromAmount) return;
    onUpdatePlayState(prev => {
      const c = { ...(prev.currency ?? { po: 0, pp: 0, pe: 0, pc: 0 }) };
      c[conv.from] -= conv.fromAmount;
      c[conv.to] += conv.toAmount;
      return { ...prev, currency: c };
    });
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

      {/* Total + convert toggle */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fbbf24' }}>
            {totalInGold(currency).toFixed(1).replace('.', ',')} PO
          </span>
          <button
            onClick={() => setShowConvert(prev => !prev)}
            style={{
              background: showConvert ? 'rgba(153,27,27,0.3)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${showConvert ? '#991b1b' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              color: showConvert ? '#fca5a5' : '#94a3b8',
              padding: '2px 8px',
              fontSize: '0.65rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⇄ CONVERTER
          </button>
        </div>
      </div>

      {/* Conversion panel */}
      {showConvert && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
        }}>
          {CONVERSIONS.map((conv, i) => {
            const canConvert = currency[conv.from] >= conv.fromAmount;
            return (
              <button
                key={i}
                onClick={() => doConvert(conv)}
                disabled={!canConvert}
                style={{
                  background: canConvert ? 'rgba(17,18,24,0.8)' : 'rgba(17,18,24,0.4)',
                  border: `1px solid ${canConvert ? 'rgba(153,27,27,0.4)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '4px',
                  color: canConvert ? '#f1f5f9' : '#475569',
                  padding: '6px 4px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  cursor: canConvert ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                }}
              >
                {conv.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
