import { useState } from 'react';
import type { WeaponAttack } from '../../../rules/types/DerivedSheet';
import type { CharacterPlayState, CustomAction } from '../../../types/playState';

type FilterId = 'all' | 'attack' | 'action' | 'bonus' | 'reaction' | 'other' | 'limited';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all',      label: 'TODAS' },
  { id: 'attack',   label: 'ATAQUE' },
  { id: 'action',   label: 'AÇÃO' },
  { id: 'bonus',    label: 'AÇÃO BÔNUS' },
  { id: 'reaction', label: 'REAÇÃO' },
  { id: 'other',    label: 'OUTRO' },
  { id: 'limited',  label: 'USO LIMITADO' },
];

const TYPE_LABELS: Record<string, string> = {
  action: 'Ação', bonus: 'Ação Bônus', reaction: 'Reação', other: 'Outro',
};

const COMBAT_ACTIONS = [
  'Atacar', 'Correr', 'Desengajar', 'Esquivar', 'Ajudar', 'Esconder',
  'Improvisar', 'Influenciar', 'Magia', 'Preparar', 'Procurar',
  'Empurrar', 'Estudar', 'Utilizar',
];

function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

interface ActionsTabProps {
  weaponAttacks: WeaponAttack[];
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  isCaster?: boolean;
  spellAttackBonus?: number;
  spellSaveDC?: number;
  spellcastingAbility?: string;
}

export function ActionsTab({ weaponAttacks, playState, onUpdatePlayState, isCaster, spellAttackBonus, spellSaveDC, spellcastingAbility }: ActionsTabProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<CustomAction['type']>('action');
  const [formDesc, setFormDesc] = useState('');

  const filteredAttacks = filter === 'all' || filter === 'attack' ? weaponAttacks : [];
  const filteredCustom = playState.customActions.filter(
    a => filter === 'all' || a.type === filter
  );

  const handleAddCustom = () => {
    if (!formName.trim()) return;
    const newAction: CustomAction = {
      id: `ca-${Date.now()}`,
      name: formName.trim(),
      type: formType,
      description: formDesc.trim(),
    };
    onUpdatePlayState(prev => ({ ...prev, customActions: [...prev.customActions, newAction] }));
    setFormName('');
    setFormDesc('');
    setFormType('action');
    setShowForm(false);
  };

  const handleRemoveCustom = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customActions: prev.customActions.filter(a => a.id !== id),
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* Filter Menu Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              background: filter === f.id ? '#991b1b' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: filter === f.id ? '#ffffff' : '#94a3b8',
              padding: '4px 8px',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ACTIONS section header */}
      {(filter === 'all' || filter === 'attack') && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 800, letterSpacing: '0.05em' }}>
            AÇÕES · Ataques por Ação: 1
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            GERENCIAR PERSONALIZADO ✎
          </button>
        </div>
      )}

      {/* Weapon attacks table */}
      {filteredAttacks.length > 0 && (
        <div style={{
          background: 'rgba(17,18,24,0.6)',
          border: 'none',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(120px, 1fr) 70px 70px 90px minmax(100px, 1fr)',
            padding: '2px 8px 4px 8px',
            background: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            gap: '8px'
          }}>
            {['ATAQUE', 'ALCANCE', 'ACERTO/CD', 'DANO', 'NOTAS'].map((h, i) => (
              <div key={h} style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textAlign: i > 0 && i < 4 ? 'center' : 'left' }}>
                {h}
              </div>
            ))}
          </div>
          {filteredAttacks.map((atk, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(120px, 1fr) 70px 70px 90px minmax(100px, 1fr)',
              padding: '8px',
              borderBottom: i < filteredAttacks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 700 }}>{atk.weaponName}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  {atk.actionType === 'attack' ? 'Arma Corpo a Corpo' : atk.range}
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>{atk.range}</div>
              
              <div style={{ textAlign: 'center' }}>
                <span style={{ 
                  display: 'inline-block',
                  border: '1px solid #991b1b',
                  borderRadius: '20px',
                  padding: '1px 8px',
                  fontSize: '0.8rem', 
                  fontWeight: 900, 
                  color: '#f1f5f9',
                  background: 'rgba(0,0,0,0.5)'
                }}>
                  {signedMod(atk.attackBonus)}
                </span>
              </div>
              
              <div style={{ fontSize: '0.75rem', color: '#f1f5f9', textAlign: 'center', border: '1px solid #7f1d1d', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', padding: '2px 4px' }}>
                {atk.damageDice !== '1' ? atk.damageDice : '1'}{atk.damageBonus !== 0 ? ` ${signedMod(atk.damageBonus)}` : ''}
                <span style={{ fontSize: '0.6rem', color: '#94a3b8', marginLeft: '2px' }}>{atk.damageType.substring(0,3)}</span>
              </div>

              {/* NOTES column - properties */}
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.4 }}>
                {atk.properties.length > 0 ? atk.properties.join(', ') : '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spell Attack Summary for casters */}
      {isCaster && (filter === 'all' || filter === 'attack') && (
        <div style={{
          background: 'rgba(17,18,24,0.6)',
          border: '1px solid rgba(153,27,27,0.3)',
          borderRadius: '6px',
          padding: '12px 14px',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '10px' }}>
            ATAQUE MÁGICO
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>ATRIBUTO</div>
              <div style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 700, textTransform: 'capitalize' }}>
                {spellcastingAbility?.substring(0, 3).toUpperCase() ?? '—'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>ACERTO</div>
              <span style={{
                display: 'inline-block',
                border: '1px solid #991b1b',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '0.9rem',
                fontWeight: 900,
                color: '#f1f5f9',
                background: 'rgba(0,0,0,0.5)',
              }}>
                {signedMod(spellAttackBonus ?? 0)}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>CD DE MAGIA</div>
              <span style={{
                display: 'inline-block',
                border: '1px solid #7f1d1d',
                borderRadius: '4px',
                padding: '2px 10px',
                fontSize: '0.9rem',
                fontWeight: 900,
                color: '#f1f5f9',
                background: 'rgba(0,0,0,0.4)',
              }}>
                {spellSaveDC ?? 0}
              </span>
            </div>
          </div>
        </div>
      )

      {/* Actions in Combat */}
      {(filter === 'all' || filter === 'action') && (
        <div style={{
          background: 'rgba(17,18,24,0.4)',
          borderRadius: '6px',
          padding: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#f1f5f9', fontWeight: 700, marginBottom: '8px' }}>
            Ações em Combate
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {COMBAT_ACTIONS.map(action => (
              <span key={action} style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                padding: '2px 0',
              }}>
                {action}{action !== COMBAT_ACTIONS[COMBAT_ACTIONS.length - 1] ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unarmed Strike description */}
      {(filter === 'all' || filter === 'attack') && weaponAttacks.some(a => a.weaponName === 'Ataque Desarmado') && (
        <div style={{
          background: 'rgba(17,18,24,0.4)',
          borderRadius: '6px',
          padding: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 700, marginBottom: '6px' }}>
            Ataque Desarmado
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Você faz um ataque corpo a corpo que envolve usar seu corpo para causar um dos seguintes efeitos:
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6, marginTop: '6px' }}>
            <span style={{ color: '#f1f5f9', fontStyle: 'italic' }}>Dano.</span> Você faz uma jogada de ataque contra a criatura, e em um acerto, você causa 1 + mod FOR de dano de Concussão.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6, marginTop: '4px' }}>
            <span style={{ color: '#f1f5f9', fontStyle: 'italic' }}>Agarrar.</span> O alvo deve ter sucesso em um teste de resistência de FOR/DES (CD = 8 + Bônus de Prof. + mod FOR) ou ficará com a condição Agarrado.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6, marginTop: '4px' }}>
            <span style={{ color: '#f1f5f9', fontStyle: 'italic' }}>Empurrar.</span> O alvo deve ter sucesso em um teste de resistência de FOR/DES (CD = 8 + Bônus de Prof. + mod FOR) ou será empurrado 1,5m ou ficará com a condição Caído.
          </div>
        </div>
      )}

      {/* Custom actions */}
      {filteredCustom.length > 0 && (
        <>
          {filter === 'all' && (
            <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 800, letterSpacing: '0.05em', marginTop: '8px' }}>
              AÇÕES BÔNUS
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredCustom.map(ca => (
              <div key={ca.id} style={{
                background: 'rgba(17,18,24,0.6)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '6px',
                padding: '10px 14px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 600 }}>{ca.name}</span>
                    <span style={{
                      fontSize: '0.62rem',
                      color: '#dc2626',
                      background: 'rgba(220,38,38,0.1)',
                      border: '1px solid rgba(220,38,38,0.2)',
                      borderRadius: '4px',
                      padding: '1px 6px',
                    }}>
                      {TYPE_LABELS[ca.type] ?? ca.type}
                    </span>
                  </div>
                  {ca.description && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>{ca.description}</div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveCustom(ca.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '2px 4px',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {filteredAttacks.length === 0 && filteredCustom.length === 0 && (
        <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>
          Nenhuma ação nesta categoria.
        </div>
      )}

      {/* Add custom action form */}
      {showForm && (
        <div style={{
          background: 'rgba(17,18,24,0.6)',
          border: '1px solid rgba(153,27,27,0.3)',
          borderRadius: '6px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: 600, letterSpacing: '0.08em' }}>
            NOVA AÇÃO PERSONALIZADA
          </div>
          <input
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="Nome da ação"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: '#f1f5f9',
              padding: '6px 10px',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <select
            value={formType}
            onChange={e => setFormType(e.target.value as CustomAction['type'])}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: '#f1f5f9',
              padding: '6px 10px',
              fontSize: '0.85rem',
            }}
          >
            <option value="action">Ação</option>
            <option value="bonus">Ação Bônus</option>
            <option value="reaction">Reação</option>
            <option value="other">Outro</option>
          </select>
          <textarea
            value={formDesc}
            onChange={e => setFormDesc(e.target.value)}
            placeholder="Descrição (opcional)"
            rows={2}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: '#f1f5f9',
              padding: '6px 10px',
              fontSize: '0.82rem',
              resize: 'vertical',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddCustom}
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

      {!showForm && (filter === 'all' || filter === 'action') && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: '4px',
            color: '#64748b',
            padding: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          ＋ Ação Personalizada
        </button>
      )}
    </div>
  );
}
