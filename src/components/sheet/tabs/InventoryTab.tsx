import { useState, useMemo } from 'react';
import type { CharacterPlayState } from '../../../types/playState';
import { getArmorByName } from '../../../rules/data/armorRules';

interface InventoryItem {
  name: string;
  quantity?: number;
  notes?: string;
  cost?: string;
  weight?: string;
}

type FilterId = 'all' | 'equipment' | 'backpack' | 'attunement' | 'other';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'TODOS' },
  { id: 'equipment', label: 'EQUIPAMENTO' },
  { id: 'backpack', label: 'MOCHILA' },
  { id: 'attunement', label: 'SINTONIZADOS' },
  { id: 'other', label: 'OUTROS' },
];

function parseWeight(w?: string): number {
  if (!w || w === '—') return 0;
  const cleaned = w.replace(/[^\d,\.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

function parseCostToGold(cost?: string): number {
  if (!cost || cost === '—') return 0;
  const match = cost.match(/([\d,.]+)\s*(PO|PP|PC|PE)/i);
  if (!match) return 0;
  const val = parseFloat(match[1].replace(',', '.')) || 0;
  const unit = match[2].toUpperCase();
  if (unit === 'PO') return val;
  if (unit === 'PP') return val / 10;
  if (unit === 'PE') return val / 2;
  if (unit === 'PC') return val / 100;
  return 0;
}

interface InventoryTabProps {
  inventory: InventoryItem[];
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  equippedArmorId?: string | null;
  hasShieldEquipped?: boolean;
  onEquipArmor?: (armorId: string | null) => void;
  onEquipShield?: (equipped: boolean) => void;
}

export function InventoryTab({
  inventory,
  playState,
  onUpdatePlayState,
  equippedArmorId,
  hasShieldEquipped = false,
  onEquipArmor,
  onEquipShield,
}: InventoryTabProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [search, setSearch] = useState('');

  const isItemEquipped = (itemName: string): boolean => {
    const armorEntry = getArmorByName(itemName);
    if (armorEntry?.type === 'shield') return hasShieldEquipped;
    if (armorEntry) return armorEntry.id === equippedArmorId;
    return playState.equippedItemIds.includes(itemName);
  };

  const isItemAttuned = (itemName: string): boolean =>
    playState.attunedItemIds.includes(itemName);

  const filteredInventory = useMemo(() => {
    let items = inventory;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q));
    }
    switch (filter) {
      case 'equipment':
        return items.filter(i => isItemEquipped(i.name));
      case 'attunement':
        return items.filter(i => isItemAttuned(i.name));
      case 'backpack':
        return items.filter(i => !isItemEquipped(i.name));
      case 'other':
        return items.filter(i => !isItemEquipped(i.name) && !isItemAttuned(i.name));
      default:
        return items;
    }
  }, [inventory, filter, search, equippedArmorId, hasShieldEquipped, playState.equippedItemIds, playState.attunedItemIds]);

  const totalWeight = useMemo(() => {
    return inventory.reduce((sum, item) => sum + parseWeight(item.weight) * (item.quantity ?? 1), 0);
  }, [inventory]);

  const totalGold = useMemo(() => {
    return inventory.reduce((sum, item) => sum + parseCostToGold(item.cost) * (item.quantity ?? 1), 0);
  }, [inventory]);

  const equippedCount = inventory.filter(i => isItemEquipped(i.name)).length;
  const attunedCount = inventory.filter(i => isItemAttuned(i.name)).length;

  const toggleEquipped = (itemName: string) => {
    const armorEntry = getArmorByName(itemName);
    if (armorEntry?.type === 'shield') { onEquipShield?.(!hasShieldEquipped); return; }
    if (armorEntry) { onEquipArmor?.(equippedArmorId === armorEntry.id ? null : armorEntry.id); return; }
    onUpdatePlayState(prev => {
      const equipped = prev.equippedItemIds.includes(itemName)
        ? prev.equippedItemIds.filter(id => id !== itemName)
        : [...prev.equippedItemIds, itemName];
      return { ...prev, equippedItemIds: equipped };
    });
  };

  const toggleAttuned = (itemName: string) => {
    onUpdatePlayState(prev => {
      const attuned = prev.attunedItemIds.includes(itemName)
        ? prev.attunedItemIds.filter(id => id !== itemName)
        : [...prev.attunedItemIds, itemName];
      return { ...prev, attunedItemIds: attuned };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Summary bar */}
      <div style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        padding: '10px 14px',
        background: 'rgba(14,14,18,0.7)',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>PESO</span>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#f1f5f9' }}>
            {totalWeight.toFixed(1).replace('.', ',')} kg
          </span>
        </div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>OURO</span>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#fbbf24' }}>
            {totalGold.toFixed(1).replace('.', ',')} PO
          </span>
        </div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>EQUIP.</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80' }}>{equippedCount}</span>
        </div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>SINTON.</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a78bfa' }}>{attunedCount}/3</span>
        </div>
      </div>

      {/* Filter bar + search */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              background: filter === f.id ? 'rgba(153,27,27,0.3)' : 'transparent',
              border: `1px solid ${filter === f.id ? '#991b1b' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '4px',
              color: filter === f.id ? '#fca5a5' : '#94a3b8',
              padding: '4px 10px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            {f.label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Buscar item..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: '#f1f5f9',
            padding: '4px 10px',
            fontSize: '0.8rem',
            width: '160px',
          }}
        />
      </div>

      {/* Items */}
      {filteredInventory.length === 0 ? (
        <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
          {search || filter !== 'all' ? 'Nenhum item encontrado.' : 'Inventário vazio.'}
        </div>
      ) : (
        <div style={{
          background: 'rgba(17,18,24,0.6)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 50px 60px 60px 84px 84px',
            padding: '6px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            gap: '8px',
          }}>
            {['ITEM', 'QTD', 'PESO', 'CUSTO', 'EQUIP.', 'SINTONIZ.'].map(h => (
              <div key={h} style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800 }}>
                {h}
              </div>
            ))}
          </div>

          {filteredInventory.map((item, i) => {
            const isEquipped = isItemEquipped(item.name);
            const isAttuned = isItemAttuned(item.name);
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 50px 60px 60px 84px 84px',
                padding: '8px 10px',
                borderBottom: i < filteredInventory.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                alignItems: 'center',
                gap: '8px',
                background: isEquipped ? 'rgba(153,27,27,0.06)' : 'transparent',
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 700 }}>{item.name}</div>
                  {item.notes && (
                    <div style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '1px' }}>{item.notes}</div>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.quantity ?? 1}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.weight ?? '—'}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.cost ?? '—'}</div>
                <button
                  onClick={() => toggleEquipped(item.name)}
                  style={{
                    background: isEquipped ? '#991b1b' : 'transparent',
                    border: `1px solid ${isEquipped ? '#991b1b' : '#7f1d1d'}`,
                    borderRadius: '4px',
                    color: isEquipped ? '#ffffff' : '#94a3b8',
                    padding: '3px 8px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '74px',
                  }}
                >
                  {isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                </button>
                <button
                  onClick={() => toggleAttuned(item.name)}
                  style={{
                    background: isAttuned ? '#b45309' : 'transparent',
                    border: `1px solid ${isAttuned ? '#b45309' : '#7f1d1d'}`,
                    borderRadius: '4px',
                    color: isAttuned ? '#ffffff' : '#94a3b8',
                    padding: '3px 8px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '82px',
                  }}
                >
                  {isAttuned ? 'SINTONIZ.' : 'SINTONIZAR'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
