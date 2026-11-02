import React, { useState } from 'react';
import css from './equipment.module.css';
import { getArmorByName } from '../../rules/data/armorRules';
import { getEquipKind, isInventoryItemEquipped, expandEquippableUnits, equipBlockReason } from '../../rules/utils/equipment';
import type { InventoryItem } from '../../types/character';

interface InventorySectionProps {
  inventory: InventoryItem[];
  onRemoveItem: (id: string) => void;
  onChangeQuantity: (id: string, delta: number) => void;
  equippedArmorId?: string | null;
  hasShieldEquipped?: boolean;
  onEquipArmor?: (armorId: string | null) => void;
  onEquipShield?: (equipped: boolean) => void;
  onToggleEquip?: (id: string) => void;
  equippedWeaponNames?: string[];
}

const separator: React.CSSProperties = {
  height: '1px',
  background: 'rgba(255,255,255,0.06)',
  margin: '8px 0',
};

const detailLabel: React.CSSProperties = {
  color: 'var(--text-faint)',
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const detailValue: React.CSSProperties = {
  color: 'var(--text-body)',
  fontSize: '0.85rem',
  fontWeight: 500,
};

const inferTags = (item: InventoryItem): string[] => {
  const tags: string[] = [];
  const base = item.itemBase;
  if (!base) return tags;

  const name = (base.name || item.name || '').toLowerCase();
  const desc = (base.description || '').toLowerCase();
  const cat = (base.category || '').toLowerCase();
  const props = (base.properties || '').toLowerCase();

  if (cat.includes('arma') || base.damage) tags.push('COMBATE');
  if (base.damage) tags.push('DANO');
  if (cat.includes('armadura') || base.ac) tags.push('DEFESA');
  if (desc.includes('cura') || desc.includes('heal') || name.includes('poção de cura')) tags.push('CURA');
  if (desc.includes('utilidade') || cat.includes('equipamento') || cat.includes('ferramenta')) tags.push('UTILIDADE');
  if (props.includes('arremesso') || props.includes('munição') || cat.includes('munição')) tags.push('DISTÂNCIA');
  if (base.isMagic) tags.push('MÁGICO');

  return [...new Set(tags)];
};

const tagColor = (tag: string): { bg: string; color: string } => {
  const map: Record<string, { bg: string; color: string }> = {
    'COMBATE': { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
    'DANO': { bg: 'rgba(249,115,22,0.15)', color: '#fdba74' },
    'DEFESA': { bg: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
    'CURA': { bg: 'rgba(34,197,94,0.15)', color: '#86efac' },
    'UTILIDADE': { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
    'DISTÂNCIA': { bg: 'rgba(168,85,247,0.15)', color: '#c4b5fd' },
    'MÁGICO': { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
  };
  return map[tag] || { bg: 'rgba(255,255,255,0.08)', color: '#94a3b8' };
};

export const InventorySection: React.FC<InventorySectionProps> = ({ inventory, onRemoveItem, onChangeQuantity, equippedArmorId, hasShieldEquipped, onEquipArmor, onEquipShield, onToggleEquip, equippedWeaponNames = [] }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [equipNotice, setEquipNotice] = useState<string | null>(null);

  // Na escolha de equipamento, itens iguais ficam numa linha só (×N).
  // Na ficha, cada arma/armadura/escudo aparece numa linha própria.
  const groups: Array<{ first: (typeof inventory)[number]; entries: typeof inventory; total: number }> = [];
  for (const entry of inventory) {
    const g = groups.find(x => x.first.name === entry.name);
    if (g) { g.entries.push(entry); g.total += entry.quantity; }
    else groups.push({ first: entry, entries: [entry], total: entry.quantity });
  }
  const units = expandEquippableUnits(inventory);
  const unitEquipped = (unitIndex: number) => isInventoryItemEquipped(equippedWeaponNames, units[unitIndex], unitIndex, units);

  if (inventory.length === 0) {
    return (
      <p style={{ color: 'var(--text-faint)', fontSize: '0.9rem', margin: 0 }}>
        Você não possui nenhum item no seu inventário. Adicione Equipamento Inicial acima ou adicione itens da lista abaixo.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {equipNotice && (
        <div role="alert" style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 10px', border: '1px solid #c53131', borderRadius: 6, background: 'rgba(197,49,49,0.12)', color: '#fff', fontSize: '0.8rem' }}>
          <span>{equipNotice}</span>
          <button type="button" onClick={() => setEquipNotice(null)} aria-label="Fechar aviso" style={{ border: 'none', background: 'transparent', color: '#b0b7bd', cursor: 'pointer' }}>✕</button>
        </div>
      )}
      {groups.map(({ first: item, entries, total }, i) => {
        const last = entries[entries.length - 1];
        const groupUnitIdx = units.map((u, idx) => (u.name === item.name ? idx : -1)).filter(idx => idx >= 0);
        const equippedUnitIdx = groupUnitIdx.find(unitEquipped);
        const isOpen = expandedId === item.id;
        const base = item.itemBase;
        const tags = inferTags(item);
        const armorEntry = getArmorByName(item.name);
        const isArmorItem = armorEntry && armorEntry.type !== 'shield';
        const isShieldItem = armorEntry && armorEntry.type === 'shield';
        const isEquippedArmor = isArmorItem && equippedArmorId === armorEntry.id;
        const isEquippedShield = isShieldItem && hasShieldEquipped;
        const equipKind = getEquipKind(item.name);
        const isEquipped = Boolean(isEquippedArmor || isEquippedShield || (equipKind === 'weapon' && equippedUnitIdx !== undefined));
        const canToggle = equipKind !== null && (onToggleEquip || (equipKind !== 'weapon' && onEquipArmor && onEquipShield));
        return (
          <div key={item.id} style={{
            background: i % 2 === 0 ? 'var(--surface-row-alt)' : 'transparent',
            borderRadius: '6px',
            border: '1px solid var(--border-faint)',
            overflow: 'hidden',
          }}>
            {/* Header row */}
            <div
              onClick={() => setExpandedId(isOpen ? null : item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <span style={{ color: 'var(--text-bright)', fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                {base?.type && (
                  <span className={css.tagPill} style={{ flexShrink: 0 }}>{base.type}</span>
                )}
                {item.isStartingGear && (
                  <span className={css.tagPill} style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', flexShrink: 0 }}>Inicial</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => onChangeQuantity(last.id, -1)} className={css.qtyBtn} aria-label={`Diminuir ${item.name}`}>−</button>
                <span style={{ color: 'var(--text-bright)', fontWeight: 600, fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>{total}</span>
                <button onClick={() => onChangeQuantity(last.id, 1)} className={css.qtyBtn} aria-label={`Aumentar ${item.name}`}>+</button>
                {canToggle && (
                  <button
                    type="button"
                    aria-pressed={isEquipped}
                    title={isEquipped ? 'Clique para desequipar' : 'Equipar este item'}
                    onClick={() => {
                      if (!isEquipped) {
                        const target = units[groupUnitIdx[0]] ?? item;
                        const reason = equipBlockReason({ units, equippedKeys: equippedWeaponNames, shieldEquipped: Boolean(hasShieldEquipped), target });
                        if (reason) { setEquipNotice(reason); return; }
                      }
                      setEquipNotice(null);
                      if (onToggleEquip && equipKind === 'weapon') {
                        // Liga a primeira unidade livre; desliga a que está equipada.
                        const unit = units[equippedUnitIdx ?? groupUnitIdx[0]];
                        onToggleEquip(unit?.id ?? item.id);
                      } else if (onToggleEquip) {
                        onToggleEquip(item.id);
                      } else if (isArmorItem) {
                        onEquipArmor?.(isEquippedArmor ? null : armorEntry.id);
                      } else if (isShieldItem) {
                        onEquipShield?.(!hasShieldEquipped);
                      }
                    }}
                    style={{
                      background: isEquipped ? '#c53131' : 'transparent',
                      border: '1px solid #c53131',
                      borderRadius: '5px',
                      color: isEquipped ? '#fff' : '#e57373',
                      padding: '3px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      minWidth: '76px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isEquipped ? 'Equipado' : 'Equipar'}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded details */}
            {isOpen && (
              <div style={{ padding: '0 12px 14px 12px', display: 'flex', flexDirection: 'column' }}>
                {/* Item type & subtype header */}
                {base && (
                  <>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginBottom: '2px' }}>
                      {base.category && <span>{base.category}</span>}
                      {base.type && base.type !== base.category && <span> · {base.type}</span>}
                      {base.isMagic && base.rarity && <span> · <span style={{ color: 'var(--color-magic)' }}>{base.rarity}</span></span>}
                    </div>
                    <div style={separator} />
                  </>
                )}

                {/* Detail grid: Weight, Cost, Source */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', padding: '4px 0' }}>
                  {base?.weight && (
                    <div>
                      <div style={detailLabel}>Peso</div>
                      <div style={detailValue}>{base.weight}</div>
                    </div>
                  )}
                  {base?.cost && (
                    <div>
                      <div style={detailLabel}>Custo</div>
                      <div style={detailValue}>{base.cost}</div>
                    </div>
                  )}
                  {base?.damage && (
                    <div>
                      <div style={detailLabel}>Dano</div>
                      <div style={detailValue}>{base.damage}</div>
                    </div>
                  )}
                  {base?.ac && (
                    <div>
                      <div style={detailLabel}>CA</div>
                      <div style={detailValue}>{base.ac}</div>
                    </div>
                  )}
                  {item.source && (
                    <div>
                      <div style={detailLabel}>Fonte</div>
                      <div style={detailValue}>{item.source === 'class' ? 'Classe' : item.source === 'bg' ? 'Antecedente' : 'Comprado'}</div>
                    </div>
                  )}
                </div>

                {/* Properties */}
                {base?.properties && base.properties !== '\u2014' && (
                  <>
                    <div style={separator} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {base.properties.split(', ').map((p: string) => (
                        <span key={p} className={css.tagPill}>{p}</span>
                      ))}
                    </div>
                  </>
                )}

                {/* Attunement */}
                {base?.attunement && (
                  <>
                    <div style={separator} />
                    <div style={{ color: 'var(--color-magic)', fontSize: '0.82rem', fontStyle: 'italic' }}>
                      {base.attunement}
                    </div>
                  </>
                )}

                {/* Description */}
                {base?.description && (
                  <>
                    <div style={separator} />
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', margin: 0, lineHeight: 1.6, maxHeight: '150px', overflowY: 'auto' }}>
                      {typeof base.description === 'string' && base.description.length > 600
                        ? base.description.slice(0, 600) + '...'
                        : base.description}
                    </p>
                  </>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <>
                    <div style={separator} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {tags.map(tag => {
                        const tc = tagColor(tag);
                        return (
                          <span key={tag} style={{ background: tc.bg, color: tc.color, padding: '2px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Remove button */}
                <div style={separator} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                  <button onClick={() => onRemoveItem(item.id)} className={`${css.btnSmall} ${css.btnDanger}`} style={{ padding: '8px 24px', fontSize: '0.82rem' }}>
                    Remover Item
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
