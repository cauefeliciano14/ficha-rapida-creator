import { useState } from 'react';
import type { WeaponAttack } from '../../../rules/types/DerivedSheet';
import type { CharacterPlayState, CustomAction } from '../../../types/playState';
import { signedMod, withSquares } from '../../../utils/format';
import { ActionTypeBadge } from '../../ui/ActionTypeBadge';
import styles from './ActionsTab.module.css';
import ddb from './ddbTab.module.css';

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


const RESET_LABELS: Record<string, string> = {
  short: 'Descanso Curto', long: 'Descanso Longo',
};

const ATTACK_COLS = 'minmax(130px, 1.4fr) 70px 72px 92px minmax(90px, 1fr)';

const COMBAT_ACTIONS: Array<{ name: string; desc: string }> = [
  { name: 'Atacar', desc: 'Faça um ataque com arma ou desarmado.' },
  { name: 'Disparada', desc: 'Ganhe deslocamento extra igual ao seu Deslocamento neste turno.' },
  { name: 'Desengajar', desc: 'Seu movimento não provoca Ataques de Oportunidade neste turno.' },
  { name: 'Esquivar', desc: 'Ataques contra você têm Desvantagem e você tem Vantagem em salvaguardas de Destreza.' },
  { name: 'Agarrar', desc: 'Ataque desarmado para impor a condição Agarrado.' },
  { name: 'Ajudar', desc: 'Conceda Vantagem ao próximo teste ou ataque de um aliado.' },
  { name: 'Esconder', desc: 'Faça um teste de Destreza (Furtividade) para ficar Invisível.' },
  { name: 'Improvisar', desc: 'Faça algo que nenhuma outra ação cobre.' },
  { name: 'Influenciar', desc: 'Teste de Carisma ou Sabedoria para alterar a atitude de uma criatura.' },
  { name: 'Magia', desc: 'Conjure uma magia com tempo de conjuração de uma ação.' },
  { name: 'Preparar', desc: 'Prepare uma ação para disparar com um gatilho, usando sua Reação.' },
  { name: 'Procurar', desc: 'Teste de Sabedoria para encontrar algo.' },
  { name: 'Empurrar', desc: 'Ataque desarmado para empurrar 1,5 m ou derrubar o alvo.' },
  { name: 'Estudar', desc: 'Teste de Inteligência para lembrar ou analisar algo.' },
  { name: 'Usar', desc: 'Use um objeto que exija uma ação.' },
];

function attackSubtitle(atk: WeaponAttack): string {
  const props = atk.properties.join(' ').toLowerCase();
  if (atk.weaponName.toLowerCase().includes('desarmado')) return 'Ataque desarmado';
  if (props.includes('munição') || props.includes('municao')) return 'Arma à distância';
  if (props.includes('arremesso')) return 'Arma corpo a corpo ou à distância';
  return 'Arma corpo a corpo';
}

interface ActionsTabProps {
  attacksPerAction?: number;
  weaponAttacks: WeaponAttack[];
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  onAttackClick?: (attack: WeaponAttack) => void;
  /** Rola só o dano (clique na caixa de dano). */
  onDamageClick?: (attack: WeaponAttack) => void;
}

export function ActionsTab({ attacksPerAction = 1, weaponAttacks, playState, onUpdatePlayState, onAttackClick, onDamageClick }: ActionsTabProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [showForm, setShowForm] = useState(false);
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<CustomAction['type']>('action');
  const [formDesc, setFormDesc] = useState('');
  const [formMaxUses, setFormMaxUses] = useState('');
  const [formResetOn, setFormResetOn] = useState<'short' | 'long'>('long');

  const filteredAttacks = filter === 'all' || filter === 'attack' ? weaponAttacks : [];
  const filteredCustom = playState.customActions.filter(
    a => filter === 'all' || a.type === filter
  );

  const handleAddCustom = () => {
    if (!formName.trim()) return;
    const maxUses = parseInt(formMaxUses, 10) || undefined;
    const newAction: CustomAction = {
      id: `ca-${Date.now()}`,
      name: formName.trim(),
      type: formType,
      description: formDesc.trim(),
      maxUses,
      usesSpent: 0,
      resetOn: maxUses ? formResetOn : undefined,
    };
    onUpdatePlayState(prev => ({ ...prev, customActions: [...prev.customActions, newAction] }));
    setFormName(''); setFormDesc(''); setFormType('action');
    setFormMaxUses(''); setShowForm(false);
  };

  const handleRemoveCustom = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customActions: prev.customActions.filter(a => a.id !== id),
    }));
  };

  const handleSpendUse = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customActions: prev.customActions.map(a =>
        a.id === id && a.maxUses !== undefined
          ? { ...a, usesSpent: Math.min((a.usesSpent ?? 0) + 1, a.maxUses) }
          : a
      ),
    }));
  };

  const handleRestoreUse = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customActions: prev.customActions.map(a =>
        a.id === id ? { ...a, usesSpent: Math.max(0, (a.usesSpent ?? 0) - 1) } : a
      ),
    }));
  };

  return (
    <div className={ddb.tab}>
      {/* Filter pills */}
      <div className={ddb.pills}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={filter === f.id ? ddb.pillActive : ddb.pill}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Weapon attacks table */}
      {filteredAttacks.length > 0 && (
        <section>
          <div className={ddb.sectionHeader}>
            AÇÕES <span className={ddb.sectionMeta}>· Ataques por ação: {attacksPerAction}</span>
          </div>
          <div className={ddb.table}>
            <div className={ddb.thead} style={{ gridTemplateColumns: ATTACK_COLS }}>
              <div>ATAQUE</div>
              <div className={ddb.center}>ALCANCE</div>
              <div className={ddb.center}>ACERTO/CD</div>
              <div className={ddb.center}>DANO</div>
              <div>NOTAS</div>
            </div>
            {filteredAttacks.map((atk, i) => (
              <div
                key={i}
                className={onAttackClick ? ddb.trowClickable : ddb.trow}
                style={{ gridTemplateColumns: ATTACK_COLS }}
                onClick={() => onAttackClick?.(atk)}
                role={onAttackClick ? 'button' : undefined}
                tabIndex={onAttackClick ? 0 : undefined}
                onKeyDown={onAttackClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onAttackClick(atk); } : undefined}
              >
                <div>
                  <div className={ddb.name}>
                    {atk.weaponName}
                    {' '}<ActionTypeBadge type={atk.actionType} />
                  </div>
                  <div className={ddb.sub}>{attackSubtitle(atk)}</div>
                </div>
                <div className={ddb.center}>{atk.range === 'Corpo a Corpo' ? <>1,5 m<div className={ddb.sub}>Alcance</div></> : withSquares(atk.range)}</div>
                <div className={ddb.center}>
                  <span className={`${ddb.box} ${onAttackClick ? styles.damageRoll : ""}`} title={onAttackClick ? "Rolar ataque" : undefined}>{signedMod(atk.attackBonus)}</span>
                </div>
                <div className={ddb.center}>
                  {onDamageClick ? (
                    <button
                      type="button"
                      className={`${ddb.box} ${styles.damageRoll}`}
                      title={`Rolar dano (${atk.damageType})`}
                      aria-label={`Rolar dano de ${atk.weaponName}`}
                      onClick={(e) => { e.stopPropagation(); onDamageClick(atk); }}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      {atk.damageDice}{atk.damageBonus !== 0 ? signedMod(atk.damageBonus) : ''}
                      <span className={styles.damageType}>{atk.damageType.substring(0, 3)}</span>
                    </button>
                  ) : (
                    <span className={ddb.box} title={atk.damageType}>
                      {atk.damageDice}{atk.damageBonus !== 0 ? signedMod(atk.damageBonus) : ''}
                      <span className={styles.damageType}>{atk.damageType.substring(0, 3)}</span>
                    </span>
                  )}
                </div>
                <div className={ddb.notes}>{atk.properties.join(', ') || '—'}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom actions */}
      {filteredCustom.length > 0 && (
        <div className={styles.customList}>
          {filteredCustom.map(ca => {
            const remaining = ca.maxUses !== undefined ? ca.maxUses - (ca.usesSpent ?? 0) : null;
            return (
              <div key={ca.id} className={styles.customCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                    <span className={styles.customName}>{ca.name}</span>
                    <ActionTypeBadge type={ca.type} />
                    {ca.resetOn && (
                      <span className={styles.resetBadge}>{RESET_LABELS[ca.resetOn]}</span>
                    )}
                  </div>
                  {ca.description && <div className={styles.customDesc}>{ca.description}</div>}
                  {ca.maxUses !== undefined && (
                    <div className={styles.usesRow}>
                      <span className={styles.usesLabel}>Usos:</span>
                      <div className={styles.usesDots}>
                        {Array.from({ length: ca.maxUses }, (_, i) => (
                          <div
                            key={i}
                            className={i < (remaining ?? 0) ? styles.useDotFilled : styles.useDotEmpty}
                          />
                        ))}
                      </div>
                      <span className={styles.usesCount}>{remaining}/{ca.maxUses}</span>
                      <button
                        onClick={() => handleSpendUse(ca.id)}
                        disabled={(remaining ?? 0) <= 0}
                        className={styles.useBtn}
                      >
                        Usar
                      </button>
                      <button
                        onClick={() => handleRestoreUse(ca.id)}
                        disabled={(ca.usesSpent ?? 0) <= 0}
                        className={styles.restoreBtn}
                      >
                        Restaurar
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => handleRemoveCustom(ca.id)} className={styles.removeBtn}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {filteredAttacks.length === 0 && filteredCustom.length === 0 && filter !== 'all' && filter !== 'action' && (
        <div className={styles.emptyText}>Nenhuma ação nesta categoria.</div>
      )}

      {(filter === 'all' || filter === 'action') && (
        <section>
          <div className={ddb.sectionHeader}>AÇÕES EM COMBATE</div>
          {/* Como no D&D Beyond: só os nomes, em linha; clicar mostra o que a ação faz. */}
          <div className={styles.combatChips}>
            {COMBAT_ACTIONS.map(a => (
              <button
                key={a.name}
                type="button"
                title={a.desc}
                aria-expanded={openAction === a.name}
                className={`${styles.combatChip} ${openAction === a.name ? styles.combatChipOpen : ''}`}
                onClick={() => setOpenAction(openAction === a.name ? null : a.name)}
              >
                {a.name}
              </button>
            ))}
          </div>
          {openAction && (
            <div className={styles.combatDetail}>
              <span className={ddb.name}>{openAction}.</span>{' '}
              {COMBAT_ACTIONS.find(a => a.name === openAction)?.desc}
            </div>
          )}
        </section>
      )}

      {/* Add custom action */}
      {showForm ? (
        <div className={styles.formCard}>
          <div className={styles.formTitle}>NOVA AÇÃO PERSONALIZADA</div>
          <input
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="Nome da ação"
            className={styles.formInput}
          />
          <select
            value={formType}
            onChange={e => setFormType(e.target.value as CustomAction['type'])}
            className={styles.formSelect}
          >
            <option value="action">Ação</option>
            <option value="bonus">Ação Bônus</option>
            <option value="reaction">Reação</option>
            <option value="other">Outro</option>
            <option value="limited">Uso Limitado</option>
          </select>
          <div className={styles.formRow}>
            <input
              type="number"
              min="0"
              value={formMaxUses}
              onChange={e => setFormMaxUses(e.target.value)}
              placeholder="Usos máx. (opcional)"
              className={styles.formInput}
              style={{ flex: 1 }}
            />
            {formMaxUses && parseInt(formMaxUses, 10) > 0 && (
              <select
                value={formResetOn}
                onChange={e => setFormResetOn(e.target.value as 'short' | 'long')}
                className={styles.formSelect}
                style={{ flex: 1 }}
              >
                <option value="short">Desc. Curto</option>
                <option value="long">Desc. Longo</option>
              </select>
            )}
          </div>
          <textarea
            value={formDesc}
            onChange={e => setFormDesc(e.target.value)}
            placeholder="Descrição (opcional)"
            rows={2}
            className={styles.formTextarea}
          />
          <div className={styles.formActions}>
            <button
              onClick={handleAddCustom}
              disabled={!formName.trim()}
              className={styles.formSubmitBtn}
            >
              Adicionar
            </button>
            <button onClick={() => setShowForm(false)} className={styles.formCancelBtn}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className={ddb.addLink}>
          ＋ Ação Personalizada
        </button>
      )}
    </div>
  );
}
