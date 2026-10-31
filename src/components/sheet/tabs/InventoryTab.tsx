import { useState, lazy, Suspense } from 'react';
import type { CharacterPlayState, Container } from '../../../types/playState';
import { getArmorByName } from '../../../rules/data/armorRules';
import { Modal } from '../../ui/Modal';
import { ItemCardTooltip } from '../ItemCardTooltip';
import { getEquipKind, isInventoryItemEquipped, toggleEquippedKey, isConsumable } from '../../../rules/utils/equipment';
import styles from './InventoryTab.module.css';
import ddb from './ddbTab.module.css';

const ItemCatalog = lazy(() => import('../../equipment/ItemCatalog').then(m => ({ default: m.ItemCatalog })));

const CONTAINER_PRESETS = [
  { name: 'Mochila', capacityKg: 15 },
  { name: 'Saco', capacityKg: 15 },
  { name: 'Baú', capacityKg: 136 },
  { name: 'Bolsa de Componentes', capacityKg: 2 },
  { name: 'Barril', capacityKg: 70 },
  { name: 'Cesta', capacityKg: 18 },
];

interface InventoryItem {
  id?: string;
  name: string;
  quantity?: number;
  notes?: string;
  cost?: string;
  weight?: number;
}

interface SheetItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  weight?: number;
  containerId?: string;
}

interface InventoryTabProps {
  inventory: InventoryItem[];
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  equippedArmorId?: string | null;
  hasShieldEquipped?: boolean;
  onEquipArmor?: (armorId: string | null) => void;
  onEquipShield?: (equipped: boolean) => void;
  currency?: { cp: number; sp: number; ep: number; gp: number; pp: number };
  onUpdateCurrency?: (currency: { cp: number; sp: number; ep: number; gp: number; pp: number }) => void;
  carryingCapacity: number;
}

const COIN_CONFIG = [
  { key: 'pp' as const, label: 'PL', color: '#c0c0e0', title: 'Platina' },
  { key: 'gp' as const, label: 'PO', color: '#fbbf24', title: 'Ouro' },
  { key: 'ep' as const, label: 'PE', color: '#94a3b8', title: 'Electrum' },
  { key: 'sp' as const, label: 'PP', color: '#cbd5e1', title: 'Prata' },
  { key: 'cp' as const, label: 'PC', color: '#d97706', title: 'Cobre' },
];


const INV_COLS = '48px minmax(130px, 1.5fr) 64px 44px 64px minmax(110px, 1fr)';

const KIND_LABELS = { armor: 'Armadura', shield: 'Escudo', weapon: 'Arma' } as const;

export function InventoryTab({
  inventory,
  playState,
  onUpdatePlayState,
  equippedArmorId,
  hasShieldEquipped = false,
  onEquipArmor,
  onEquipShield,
  currency,
  onUpdateCurrency,
  carryingCapacity,
}: InventoryTabProps) {
  const [editingCoin, setEditingCoin] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formQty, setFormQty] = useState('1');
  const [formNotes, setFormNotes] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formContainerId, setFormContainerId] = useState('');
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'equipment' | 'backpack' | 'other'>('all');

  const sheetItems: SheetItem[] = playState.sheetItems ?? [];

  const toggleEquipped = (item: InventoryItem, index: number) => {
    const itemName = item.name;
    const kind = getEquipKind(itemName);
    if (kind === 'shield') { onEquipShield?.(!hasShieldEquipped); return; }
    if (kind === 'armor') {
      const armorId = getArmorByName(itemName)!.id;
      onEquipArmor?.(equippedArmorId === armorId ? null : armorId); return;
    }
    onUpdatePlayState(prev => {
      const isOn = isInventoryItemEquipped(prev.equippedItemIds, item, index, inventory);
      return { ...prev, equippedItemIds: toggleEquippedKey(prev.equippedItemIds, item, isOn) };
    });
  };

  const MAX_ATTUNEMENT = 3;
  const attunedCount = playState.attunedItemIds.length;

  const toggleAttuned = (itemName: string) => {
    onUpdatePlayState(prev => {
      const isAttuned = prev.attunedItemIds.includes(itemName);
      if (!isAttuned && prev.attunedItemIds.length >= MAX_ATTUNEMENT) return prev;
      const attuned = isAttuned
        ? prev.attunedItemIds.filter(id => id !== itemName)
        : [...prev.attunedItemIds, itemName];
      return { ...prev, attunedItemIds: attuned };
    });
  };

  const handleCoinChange = (coinKey: keyof NonNullable<typeof currency>, value: string) => {
    if (!currency || !onUpdateCurrency) return;
    onUpdateCurrency({ ...currency, [coinKey]: Math.max(0, parseInt(value, 10) || 0) });
  };

  const handleAddItem = () => {
    if (!formName.trim()) return;
    const newItem: SheetItem = {
      id: `si-${Date.now()}`,
      name: formName.trim(),
      quantity: Math.max(1, parseInt(formQty, 10) || 1),
      notes: formNotes.trim() || undefined,
      weight: parseFloat(formWeight) || undefined,
      containerId: formContainerId || undefined,
    };
    onUpdatePlayState(prev => ({ ...prev, sheetItems: [...(prev.sheetItems ?? []), newItem] }));
    setFormName(''); setFormQty('1'); setFormNotes(''); setFormWeight(''); setFormContainerId(''); setShowAddForm(false);
  };

  const handleAddContainer = (preset: typeof CONTAINER_PRESETS[number]) => {
    const container: Container = { id: `ct-${Date.now()}`, name: preset.name, capacityKg: preset.capacityKg };
    onUpdatePlayState(prev => ({ ...prev, containers: [...(prev.containers ?? []), container] }));
    setShowAddContainer(false);
  };

  const handleRemoveContainer = (containerId: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      containers: (prev.containers ?? []).filter(c => c.id !== containerId),
      sheetItems: (prev.sheetItems ?? []).map(i => i.containerId === containerId ? { ...i, containerId: undefined } : i),
    }));
  };

  const handleMoveItem = (itemId: string, containerId: string | undefined) => {
    onUpdatePlayState(prev => ({
      ...prev,
      sheetItems: (prev.sheetItems ?? []).map(i => i.id === itemId ? { ...i, containerId } : i),
    }));
  };

  const handleMarketplaceAdd = (item: any) => {
    const newItem: SheetItem = {
      id: crypto.randomUUID(),
      name: item.name,
      quantity: 1,
      notes: item.isMagic ? item.rarity : (item.type ?? undefined),
      weight: typeof item.weight === 'number' ? item.weight : (parseFloat(item.weight) || undefined),
    };
    onUpdatePlayState(prev => ({ ...prev, sheetItems: [...(prev.sheetItems ?? []), newItem] }));
  };

  const handleRemoveSheetItem = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      sheetItems: (prev.sheetItems ?? []).filter(i => i.id !== id),
    }));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      sheetItems: (prev.sheetItems ?? []).map(i =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
      ).filter(i => i.quantity > 0),
    }));
  };

  // Weight calculation
  const startingWeight = inventory.reduce((sum, i) => sum + ((i.weight ?? 0) * (i.quantity ?? 1)), 0);
  const addedWeight = sheetItems.reduce((sum, i) => sum + ((i.weight ?? 0) * i.quantity), 0);
  const totalWeight = startingWeight + addedWeight;
  const isOverweight = totalWeight > carryingCapacity;
  const showWeight = totalWeight > 0 || carryingCapacity > 0;

  const allItems = [...inventory];

  const q = searchText.toLowerCase();
  const matchesSearch = (name: string, notes?: string) => 
    !q || name.toLowerCase().includes(q) || (notes && notes.toLowerCase().includes(q));

  const filteredInitial = allItems.filter(i => {
    if (!matchesSearch(i.name, i.notes)) return false;
    if (filterCategory === 'backpack') return false; 
    if (filterCategory === 'other') return false; 
    return true;
  });

  const filteredLoose = sheetItems.filter(i => !i.containerId && matchesSearch(i.name, i.notes)).filter(i => {
    if (filterCategory === 'backpack') return false;
    if (filterCategory === 'equipment') {
      const isArmor = getArmorByName(i.name);
      return !!isArmor || playState.equippedItemIds.includes(i.name) || playState.equippedItemIds.includes(i.id);
    }
    return true;
  });

  const filteredContainers = (playState.containers ?? []).map(ct => ({
    ...ct,
    items: sheetItems.filter(i => i.containerId === ct.id && matchesSearch(i.name, i.notes))
  })).filter(() => filterCategory === 'all' || filterCategory === 'backpack');

  return (
    <div className={ddb.tab}>

      {/* Moedas */}
      {currency && onUpdateCurrency && (
        <div className={styles.currencySection}>
          <div className={ddb.sectionHeader}>MOEDAS</div>
          <div className={styles.currencyGrid}>
            {COIN_CONFIG.map(coin => (
              <div key={coin.key} className={styles.coinCard} title={coin.title}>
                <div className={styles.coinIcon} style={{ color: coin.color }}>●</div>
                {editingCoin === coin.key ? (
                  <input
                    type="number" min="0"
                    value={currency[coin.key]}
                    onChange={e => handleCoinChange(coin.key, e.target.value)}
                    onBlur={() => setEditingCoin(null)}
                    onKeyDown={e => { if (e.key === 'Enter') setEditingCoin(null); }}
                    className={styles.coinInput} autoFocus
                  />
                ) : (
                  <div className={styles.coinValue} onClick={() => setEditingCoin(coin.key)} role="button" tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') setEditingCoin(coin.key); }}>
                    {currency[coin.key]}
                  </div>
                )}
                <div className={styles.coinLabel}>{coin.label}</div>
              </div>
            ))}
          </div>
          {currency && (
            <div className={styles.totalGold}>
              <span>Total em PO: {(currency.pp * 10 + currency.gp + currency.ep * 0.5 + currency.sp * 0.1 + currency.cp * 0.01).toFixed(2)}</span>
              <button
                className={styles.convertBtn}
                title="Converter moedas automaticamente (10 pc→1 pp, 10 pp→1 po, 10 po→1 pl)"
                onClick={() => {
                  if (!onUpdateCurrency) return;
                  let cp = currency.cp;
                  let sp = currency.sp + Math.floor(cp / 10); cp = cp % 10;
                  let gp = currency.gp + Math.floor(sp / 10); sp = sp % 10;
                  let pp = currency.pp + Math.floor(gp / 10); gp = gp % 10;
                  onUpdateCurrency({ cp, sp, ep: currency.ep, gp, pp });
                }}
              >
                Converter ⇄
              </button>
            </div>
          )}
        </div>
      )}

      {/* Weight bar */}
      {showWeight && (() => {
        const ratio = carryingCapacity > 0 ? totalWeight / carryingCapacity : 0;
        const barColor = isOverweight ? '#ef4444' : ratio > 0.66 ? '#f59e0b' : ratio > 0.33 ? '#eab308' : '#22c55e';
        const textColor = isOverweight ? '#ef4444' : ratio > 0.66 ? '#f59e0b' : 'var(--text-bright)';
        return (
          <div className={styles.weightSection}>
            <div className={styles.weightHeader}>
              <span className={styles.weightLabel}>PESO CARREGADO</span>
              <span className={styles.weightValue} style={{ color: textColor }}>
                {totalWeight.toFixed(1)} / {carryingCapacity.toFixed(1)} kg
              </span>
            </div>
            <div className={styles.weightBar}>
              <div
                className={styles.weightBarFill}
                style={{
                  width: `${Math.min(ratio * 100, 100)}%`,
                  background: barColor,
                }}
              />
            </div>
            {isOverweight && <div className={styles.weightWarning}>⚠ Personagem sobrecarregado.</div>}
          </div>
        );
      })()}

      {/* Attunement slots */}
      <div className={styles.attunementSlots}>
        <span className={styles.attunementLabel}>SINTONIZAÇÃO</span>
        <div className={styles.attunementDots}>
          {[0, 1, 2].map(i => (
            <span key={i} className={i < attunedCount ? styles.slotFilled : styles.slotEmpty}>●</span>
          ))}
        </div>
        <span className={styles.attunementCount}>{attunedCount}/{MAX_ATTUNEMENT}</span>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchFilterSection}>
        <div className={styles.searchRow}>
          <input 
            type="text" 
            placeholder="Buscar no inventário..." 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className={ddb.search}
          />
        </div>
        <div className={ddb.pills}>
          <button onClick={() => setFilterCategory('all')} className={filterCategory === 'all' ? ddb.pillActive : ddb.pill}>Todos</button>
          <button onClick={() => setFilterCategory('equipment')} className={filterCategory === 'equipment' ? ddb.pillActive : ddb.pill}>Equipamento</button>
          <button onClick={() => setFilterCategory('backpack')} className={filterCategory === 'backpack' ? ddb.pillActive : ddb.pill}>Mochila</button>
          <button onClick={() => setFilterCategory('other')} className={filterCategory === 'other' ? ddb.pillActive : ddb.pill}>Outros</button>
        </div>
      </div>

      {/* Starting inventory */}
      {filteredInitial.length > 0 && (
        <section>
          <div className={ddb.sectionHeader}>EQUIPAMENTO</div>
          <div className={ddb.table}>
            <div className={ddb.thead} style={{ gridTemplateColumns: INV_COLS }}>
              <div className={ddb.center}>ATIVO</div>
              <div>NOME</div>
              <div className={ddb.center}>PESO</div>
              <div className={ddb.center}>QTD</div>
              <div className={ddb.center}>CUSTO</div>
              <div>NOTAS</div>
            </div>
            {filteredInitial.map((item, i) => {
              const kind = getEquipKind(item.name);
              const isEquipped = kind === 'shield'
                ? hasShieldEquipped
                : kind === 'armor'
                  ? getArmorByName(item.name)!.id === equippedArmorId
                  : isInventoryItemEquipped(playState.equippedItemIds, item, inventory.indexOf(item), inventory);
              const isAttuned = playState.attunedItemIds.includes(item.name);
              const attuneBlocked = !isAttuned && attunedCount >= MAX_ATTUNEMENT;
              const usedKey = item.id ?? item.name;
              const used = playState.usedConsumables?.[usedKey] ?? 0;
              const qty = Math.max(0, (item.quantity ?? 1) - used);
              const consumable = isConsumable(item.name);
              return (
                <div key={i} className={ddb.trow} style={{ gridTemplateColumns: INV_COLS }}>
                  <div className={ddb.center}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isEquipped}
                      aria-label={isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                      title={isEquipped ? 'Equipado — clique para desequipar' : 'Clique para equipar'}
                      onClick={() => toggleEquipped(item, inventory.indexOf(item))}
                      className={isEquipped ? ddb.checkOn : ddb.check}
                    >
                      {isEquipped ? '✓' : ''}
                    </button>
                  </div>
                  <div>
                    <ItemCardTooltip itemName={item.name}>
                      <div className={ddb.name}>{item.name}</div>
                    </ItemCardTooltip>
                    {kind && <div className={ddb.sub}>{KIND_LABELS[kind]}</div>}
                  </div>
                  <div className={`${ddb.center} ${ddb.notes}`}>
                    {item.weight != null ? `${(item.weight * qty).toFixed(1)} kg` : '—'}
                  </div>
                  <div className={ddb.center}>{qty}</div>
                  <div className={`${ddb.center} ${ddb.notes}`}>{item.cost ?? '—'}</div>
                  <div className={ddb.notes}>
                    {item.notes && <span>{item.notes} </span>}
                    {consumable && (
                      <>
                        <button
                          type="button"
                          className={styles.useBtn}
                          disabled={qty === 0}
                          title={qty === 0 ? 'Acabou' : 'Gastar 1'}
                          onClick={() => onUpdatePlayState(prev => ({
                            ...prev,
                            usedConsumables: { ...(prev.usedConsumables ?? {}), [usedKey]: (prev.usedConsumables?.[usedKey] ?? 0) + 1 },
                          }))}
                        >
                          USAR
                        </button>
                        {used > 0 && (
                          <button
                            type="button"
                            className={styles.restoreBtn}
                            title="Desfazer: devolver 1"
                            aria-label={`Devolver 1 ${item.name}`}
                            onClick={() => onUpdatePlayState(prev => ({
                              ...prev,
                              usedConsumables: { ...(prev.usedConsumables ?? {}), [usedKey]: Math.max(0, (prev.usedConsumables?.[usedKey] ?? 0) - 1) },
                            }))}
                          >
                            ↺
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => toggleAttuned(item.name)}
                      className={isAttuned ? styles.attuneBtnActive : attuneBlocked ? styles.attuneBtnDisabled : styles.attuneBtn}
                      disabled={attuneBlocked}
                      title={attuneBlocked ? 'Limite de 3 itens sintonizados' : undefined}
                    >
                      {isAttuned ? 'SINTONIZ.' : 'SINTONIZAR'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Containers */}
      {filteredContainers.map(ct => {
        const containerItems = ct.items;
        const usedKg = containerItems.reduce((s, i) => s + ((i.weight ?? 0) * i.quantity), 0);
        const isFull = usedKg >= ct.capacityKg;
        if (filterCategory === 'backpack' && containerItems.length === 0 && !searchText) return null; // hide empty containers if filtering by backpack unless searching all
        return (
          <div key={ct.id} className={styles.containerSection}>
            <div className={styles.containerHeader}>
              <span className={styles.containerIcon}>🎒</span>
              <span className={styles.containerName}>{ct.name}</span>
              <span className={styles.containerCapacity} style={{ color: isFull ? '#ef4444' : 'var(--text-dim)' }}>
                {usedKg.toFixed(1)}/{ct.capacityKg} kg
              </span>
              <button onClick={() => handleRemoveContainer(ct.id)} className={styles.removeBtn} title="Remover container">✕</button>
            </div>
            {containerItems.length > 0 ? (
              <div className={styles.sheetItemList}>
                {containerItems.map(item => (
                  <div key={item.id} className={styles.sheetItemRow}>
                    <div className={styles.sheetItemInfo}>
                      <ItemCardTooltip itemName={item.name}>
                        <span className={styles.itemName}>{item.name}</span>
                      </ItemCardTooltip>
                      {item.notes && <span className={styles.itemNotes}>{item.notes}</span>}
                      {item.weight != null && <span className={styles.itemWeight}>{(item.weight * item.quantity).toFixed(1)} kg</span>}
                    </div>
                    <select
                      className={styles.moveSelect}
                      value={item.containerId ?? ''}
                      onChange={e => handleMoveItem(item.id, e.target.value || undefined)}
                    >
                      <option value="">Solto</option>
                      {(playState.containers ?? []).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <div className={styles.sheetItemQtyCtrl}>
                      <button onClick={() => handleUpdateQty(item.id, -1)} className={styles.qtyBtn}>−</button>
                      <span className={styles.sheetItemQty}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQty(item.id, 1)} className={styles.qtyBtn}>+</button>
                    </div>
                    {isConsumable(item.name) && (
                      <button type="button" className={styles.useBtn} title="Gastar 1" onClick={() => handleUpdateQty(item.id, -1)}>USAR</button>
                    )}
                    <button onClick={() => handleRemoveSheetItem(item.id)} className={styles.removeBtn}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.containerEmpty}>Vazio</div>
            )}
          </div>
        );
      })}

      {/* Sheet items not in any container */}
      {filteredLoose.length > 0 && (
        <div>
          <div className={ddb.sectionHeader}>ITENS ADICIONADOS</div>
          <div className={styles.sheetItemList}>
            {filteredLoose.map(item => (
              <div key={item.id} className={styles.sheetItemRow}>
                <div className={styles.sheetItemInfo}>
                  <ItemCardTooltip itemName={item.name}>
                    <span className={styles.itemName}>{item.name}</span>
                  </ItemCardTooltip>
                  {item.notes && <span className={styles.itemNotes}>{item.notes}</span>}
                  {item.weight != null && <span className={styles.itemWeight}>{(item.weight * item.quantity).toFixed(1)} kg</span>}
                </div>
                {(playState.containers ?? []).length > 0 && (
                  <select
                    className={styles.moveSelect}
                    value=""
                    onChange={e => handleMoveItem(item.id, e.target.value || undefined)}
                  >
                    <option value="">Solto</option>
                    {(playState.containers ?? []).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
                <div className={styles.sheetItemQtyCtrl}>
                  <button onClick={() => handleUpdateQty(item.id, -1)} className={styles.qtyBtn}>−</button>
                  <span className={styles.sheetItemQty}>{item.quantity}</span>
                  <button onClick={() => handleUpdateQty(item.id, 1)} className={styles.qtyBtn}>+</button>
                </div>
                {isConsumable(item.name) && (
                      <button type="button" className={styles.useBtn} title="Gastar 1" onClick={() => handleUpdateQty(item.id, -1)}>USAR</button>
                    )}
                    <button onClick={() => handleRemoveSheetItem(item.id)} className={styles.removeBtn}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add item form */}
      {showAddForm ? (
        <div className={styles.addItemForm}>
          <div className={styles.addItemTitle}>ADICIONAR ITEM</div>
          <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Nome do item" className={styles.formInput} />
          <div className={styles.formRow}>
            <input type="number" min="1" value={formQty} onChange={e => setFormQty(e.target.value)} placeholder="Qtd." className={styles.formInput} style={{ flex: 1 }} />
            <input type="number" min="0" step="0.1" value={formWeight} onChange={e => setFormWeight(e.target.value)} placeholder="Peso (kg)" className={styles.formInput} style={{ flex: 1 }} />
          </div>
          {(playState.containers ?? []).length > 0 && (
            <select value={formContainerId} onChange={e => setFormContainerId(e.target.value)} className={styles.formInput}>
              <option value="">Solto (sem container)</option>
              {(playState.containers ?? []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <input value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Notas (opcional)" className={styles.formInput} />
          <div className={styles.formActions}>
            <button onClick={handleAddItem} disabled={!formName.trim()} className={styles.formSubmitBtn}>Adicionar</button>
            <button onClick={() => setShowAddForm(false)} className={styles.formCancelBtn}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className={styles.formRow}>
          <button onClick={() => setShowAddForm(true)} className={styles.addBtn} style={{ flex: 1 }}>
            ＋ Adicionar Item
          </button>
          <button onClick={() => setShowAddContainer(true)} className={styles.addBtn} style={{ flex: 1 }}>
            🎒 Container
          </button>
          <button onClick={() => setShowMarketplace(true)} className={styles.addBtn} style={{ flex: 1 }}>
            🛒 Loja
          </button>
        </div>
      )}

      {/* Add container picker */}
      {showAddContainer && (
        <div className={styles.addItemForm}>
          <div className={styles.addItemTitle}>ADICIONAR CONTAINER</div>
          <div className={styles.containerPresets}>
            {CONTAINER_PRESETS.map(p => (
              <button key={p.name} className={styles.containerPresetBtn} onClick={() => handleAddContainer(p)}>
                <span>{p.name}</span>
                <span className={styles.containerPresetCap}>{p.capacityKg} kg</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddContainer(false)} className={styles.formCancelBtn} style={{ alignSelf: 'flex-end' }}>Cancelar</button>
        </div>
      )}

      {filteredInitial.length === 0 && filteredContainers.every(c => c.items.length === 0) && filteredLoose.length === 0 && (
        <div className={styles.emptyText}>Nenhum item encontrado.</div>
      )}

      {/* Marketplace modal */}
      <Modal isOpen={showMarketplace} onClose={() => setShowMarketplace(false)} title="Loja de Itens">
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>Carregando catálogo...</div>}>
          <ItemCatalog onAddItem={handleMarketplaceAdd} />
        </Suspense>
      </Modal>
    </div>
  );
}
