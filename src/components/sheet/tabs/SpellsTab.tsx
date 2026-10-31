import { useMemo, useState } from 'react';
import type { DerivedSheet } from '../../../rules/types/DerivedSheet';
import type { CharacterPlayState } from '../../../types/playState';
import { signedMod, withSquares } from '../../../utils/format';
import { SpellCardTooltip } from '../SpellCardTooltip';
import spellsAll from '../../../data/spells/spells_all.json';
import styles from './SpellsTab.module.css';
import ddb from './ddbTab.module.css';

const ABILITY_LABELS: Record<string, string> = {
  inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma',
  forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição',
};

interface SpellsTabProps {
  derivedSheet: DerivedSheet;
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  learnedCantrips: string[];
  preparedSpells: string[];
  onUpdatePreparedSpells?: (spells: string[]) => void;
  /** Rola o acerto (d20 + bônus) ou os dados de dano/cura da magia, como no D&D Beyond. */
  onSpellRoll?: (roll: SpellRoll) => void;
}

export type SpellRoll =
  | { kind: 'attack'; spell: string; bonus: number }
  | { kind: 'damage'; spell: string; formula: string; damageType: string };

const SPELL_LEVEL_MAP = new Map<string, string>();
for (const sp of spellsAll as Array<{ name: string; level: string }>) {
  SPELL_LEVEL_MAP.set(sp.name, sp.level);
}

const SPELL_COLS = '78px minmax(130px, 1.4fr) 70px 80px 72px 84px minmax(90px, 1fr)';

const CIRCLE_ORDER = [
  'Truque', '1º Círculo', '2º Círculo', '3º Círculo', '4º Círculo',
  '5º Círculo', '6º Círculo', '7º Círculo', '8º Círculo', '9º Círculo',
];

export function SpellsTab({
  derivedSheet,
  playState,
  onUpdatePlayState,
  learnedCantrips,
  preparedSpells,
  onUpdatePreparedSpells,
  onSpellRoll,
}: SpellsTabProps) {
  const [circleFilter, setCircleFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [showAddSpell, setShowAddSpell] = useState(false);
  const [addSearch, setAddSearch] = useState('');

  const racialCantrips = derivedSheet.racialCantrips ?? [];
  const bonusCantrips = derivedSheet.bonusCantrips ?? [];
  const bonusPreparedSpells = derivedSheet.bonusPreparedSpells ?? [];

  const groupedPrepared = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const name of preparedSpells) {
      const circle = SPELL_LEVEL_MAP.get(name) ?? '?';
      if (!groups[circle]) groups[circle] = [];
      groups[circle].push(name);
    }
    return groups;
  }, [preparedSpells]);

  const availableCircles = useMemo(() => {
    const circles = new Set<string>();
    if (learnedCantrips.length > 0 || bonusCantrips.length > 0) circles.add('Truque');
    for (const c of Object.keys(groupedPrepared)) circles.add(c);
    if (bonusPreparedSpells.length > 0) circles.add('1º Círculo');
    return CIRCLE_ORDER.filter(c => circles.has(c));
  }, [groupedPrepared, learnedCantrips, bonusCantrips, bonusPreparedSpells]);

  // Search results from full spell list for "add" modal
  const addSearchResults = useMemo(() => {
    if (addSearch.trim().length < 2) return [];
    const q = addSearch.toLowerCase();
    return (spellsAll as any[])
      .filter(sp => sp.name.toLowerCase().includes(q) && !preparedSpells.includes(sp.name))
      .slice(0, 12);
  }, [addSearch, preparedSpells]);

  const handleUnprepare = (spellName: string) => {
    onUpdatePreparedSpells?.(preparedSpells.filter(s => s !== spellName));
  };

  const handleAddSpell = (spellName: string) => {
    if (!preparedSpells.includes(spellName)) {
      onUpdatePreparedSpells?.([...preparedSpells, spellName]);
    }
    setAddSearch('');
  };

  if (!derivedSheet.isCaster && bonusCantrips.length === 0 && bonusPreparedSpells.length === 0) {
    return <div className={styles.emptyText}>Esta classe não conjura magias.</div>;
  }

  const slots = derivedSheet.spellSlots ?? {};
  const slotLevels = Object.keys(slots).map(Number).filter(l => (slots as Record<number, number>)[l] > 0).sort((a, b) => a - b);

  const handleSpendSlot = (level: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      spentSpellSlots: { ...prev.spentSpellSlots, [level]: (prev.spentSpellSlots[level] ?? 0) + 1 },
    }));
  };

  const handleRestoreSlot = (level: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      spentSpellSlots: { ...prev.spentSpellSlots, [level]: Math.max(0, (prev.spentSpellSlots[level] ?? 0) - 1) },
    }));
  };

  const canEditSpells = !!onUpdatePreparedSpells;
  const castingScore = derivedSheet.finalAttributes?.[derivedSheet.spellcastingAbility ?? ''] ?? 10;
  const castingMod = Math.floor((castingScore - 10) / 2);
  const spellStats = { attack: derivedSheet.spellAttackBonus ?? 0, dc: derivedSheet.spellSaveDC ?? 0 };
  const remainingSlots = (level: number) =>
    ((slots as Record<number, number>)[level] ?? 0) - (playState.spentSpellSlots[level] ?? 0);
  const castProps = (circle: string) => {
    const lvl = parseInt(circle, 10);
    if (!lvl || slotLevels.length === 0) return {};
    // Pode conjurar com qualquer espaço de nível >= ao círculo
    const castLevel = slotLevels.find(l => l >= lvl && remainingSlots(l) > 0);
    return {
      onCast: () => { if (castLevel) handleSpendSlot(castLevel); },
      canCast: castLevel !== undefined,
    };
  };
  const q = searchText.toLowerCase();

  const filterSpells = (spells: string[]) =>
    q ? spells.filter(s => s.toLowerCase().includes(q)) : spells;

  return (
    <div className={ddb.tab}>
      {/* Cabeçalho: modificador / ataque mágico / CD */}
      <div className={ddb.headerStats}>
        <div className={ddb.stat}>
          <span className={ddb.statValue}>{signedMod(castingMod)}</span>
          <span className={ddb.statLabel}>Modificador</span>
        </div>
        <div className={ddb.stat}>
          <span className={ddb.statValue}>{signedMod(derivedSheet.spellAttackBonus ?? 0)}</span>
          <span className={ddb.statLabel}>Ataque mágico</span>
        </div>
        <div className={ddb.stat}>
          <span className={ddb.statValue}>{derivedSheet.spellSaveDC ?? 0}</span>
          <span className={ddb.statLabel}>CD de resistência</span>
        </div>
        <div className={styles.statsMeta}>
          <span><b>{ABILITY_LABELS[derivedSheet.spellcastingAbility ?? ''] ?? '—'}</b> · atributo de conjuração</span>
          <span>MAGIAS PREPARADAS: <b>{derivedSheet.preparedSpellCount ?? 0}</b> · TRUQUES CONHECIDOS: <b>{derivedSheet.cantripsKnown ?? 0}</b></span>
        </div>
      </div>

      {/* Spell slots — D&D Beyond style: grid of level cards with circular checkboxes */}
      {slotLevels.length > 0 && (
        <div className={styles.slotsCard}>
          <div className={styles.slotsTitle}>ESPAÇOS DE MAGIA</div>
          <div className={styles.slotsGrid}>
            {slotLevels.map(level => {
              const total = (slots as Record<number, number>)[level] ?? 0;
              const spent = playState.spentSpellSlots[level] ?? 0;
              const remaining = total - spent;
              return (
                <div key={level} className={styles.slotLevelCard}>
                  <div className={styles.slotLevelHeader}>
                    <span className={styles.slotLevelBadge}>{level}</span>
                    <span className={styles.slotLevelLabel}>Nível {level}</span>
                    <span className={styles.slotLevelCount}>{remaining}/{total}</span>
                  </div>
                  <div className={styles.slotCheckboxRow}>
                    {Array.from({ length: total }, (_, i) => {
                      const isAvailable = i < remaining;
                      return (
                        <button
                          key={i}
                          type="button"
                          className={`${styles.slotCheckbox} ${isAvailable ? styles.slotCheckboxAvailable : styles.slotCheckboxSpent}`}
                          onClick={() => isAvailable ? handleSpendSlot(level) : handleRestoreSlot(level)}
                          aria-label={isAvailable ? `Gastar espaço de nível ${level}` : `Restaurar espaço de nível ${level}`}
                          title={isAvailable ? `Clique para gastar espaço de nível ${level}` : `Clique para restaurar espaço de nível ${level}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Concentration banner */}
      {playState.concentratingOn && (
        <div className={styles.concentrationBanner}>
          <span className={styles.concentrationIcon}>◉</span>
          <span className={styles.concentrationText}>
            Concentrando em: <strong>{playState.concentratingOn}</strong>
          </span>
          <button
            className={styles.concentrationEndBtn}
            onClick={() => onUpdatePlayState(prev => ({ ...prev, concentratingOn: null }))}
          >
            Encerrar
          </button>
        </div>
      )}

      {/* Search bar */}
      <div className={styles.searchRow}>
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Buscar magia…"
          className={ddb.search}
        />
        {canEditSpells && (
          <button onClick={() => setShowAddSpell(v => !v)} className={styles.addSpellBtn}>
            {showAddSpell ? '✕ Fechar' : '＋ Adicionar Magia'}
          </button>
        )}
      </div>

      {/* Add spell search */}
      {showAddSpell && (
        <div className={styles.addSpellPanel}>
          <input
            type="text"
            value={addSearch}
            onChange={e => setAddSearch(e.target.value)}
            placeholder="Buscar na lista completa de magias…"
            className={styles.searchInput}
            autoFocus
          />
          {addSearchResults.length > 0 && (
            <div className={styles.addSpellResults}>
              {addSearchResults.map((sp: any) => (
                <div key={sp.name} className={styles.addSpellResult} onClick={() => handleAddSpell(sp.name)}>
                  <span className={styles.addSpellName}>{sp.name}</span>
                  <span className={styles.addSpellMeta}>{sp.level} · {sp.school}</span>
                </div>
              ))}
            </div>
          )}
          {addSearch.length >= 2 && addSearchResults.length === 0 && (
            <div className={styles.emptyText}>Nenhuma magia encontrada.</div>
          )}
        </div>
      )}

      {/* Circle filter */}
      {availableCircles.length > 1 && !q && (
        <div className={ddb.pills}>
          <button onClick={() => setCircleFilter('all')} className={circleFilter === 'all' ? ddb.pillActive : ddb.pill}>Todos</button>
          {availableCircles.map(c => (
            <button key={c} onClick={() => setCircleFilter(c)} className={circleFilter === c ? ddb.pillActive : ddb.pill}>{c}</button>
          ))}
        </div>
      )}

      {/* Spell lists */}
      {learnedCantrips.length > 0 && (circleFilter === 'all' || circleFilter === 'Truque') && filterSpells(learnedCantrips).length > 0 && (
        <SpellList title="TRUQUES" spells={filterSpells(learnedCantrips)} accent="#fbbf24" stats={spellStats} onRoll={onSpellRoll} atWill />
      )}
      {racialCantrips.length > 0 && (circleFilter === 'all' || circleFilter === 'Truque') && filterSpells(racialCantrips).length > 0 && (
        <SpellList title="TRUQUES RACIAIS" spells={filterSpells(racialCantrips)} accent="#22c55e" badge="Racial" stats={spellStats} onRoll={onSpellRoll} atWill />
      )}
      {bonusCantrips.filter(s => s.source === 'talent').length > 0 && (circleFilter === 'all' || circleFilter === 'Truque') && (
        <SpellList
          title="TRUQUES DE TALENTO"
          spells={filterSpells(bonusCantrips.filter(s => s.source === 'talent').map(s => `${s.name} — ${s.origin}`))}
          accent="#38bdf8" badge="Talento" stats={spellStats} onRoll={onSpellRoll} atWill
          concentratingOn={playState.concentratingOn}
          onSetConcentration={name => onUpdatePlayState(prev => ({ ...prev, concentratingOn: name }))}
        />
      )}

      {CIRCLE_ORDER.filter(c => c !== 'Truque' && groupedPrepared[c]).map(circle => {
        if (!q && circleFilter !== 'all' && circleFilter !== circle) return null;
        const filtered = filterSpells(groupedPrepared[circle]);
        if (filtered.length === 0) return null;
        return (
          <SpellList
            key={circle}
            title={circle.toUpperCase()}
            spells={filtered}
            accent="#e06060"
            stats={spellStats} onRoll={onSpellRoll}
            {...castProps(circle)}
            canRemove={canEditSpells}
            onRemove={handleUnprepare}
            concentratingOn={playState.concentratingOn}
            onSetConcentration={name => onUpdatePlayState(prev => ({ ...prev, concentratingOn: name }))}
          />
        );
      })}

      {groupedPrepared['?'] && (circleFilter === 'all' || circleFilter === '?') && filterSpells(groupedPrepared['?']).length > 0 && (
        <SpellList
          title="MAGIAS PREPARADAS"
          spells={filterSpells(groupedPrepared['?'])}
          accent="#e06060"
          stats={spellStats} onRoll={onSpellRoll}
          canRemove={canEditSpells}
          onRemove={handleUnprepare}
          concentratingOn={playState.concentratingOn}
          onSetConcentration={name => onUpdatePlayState(prev => ({ ...prev, concentratingOn: name }))}
        />
      )}

      {bonusPreparedSpells.length > 0 && (circleFilter === 'all' || circleFilter === '1º Círculo') && (
        <SpellList
          title="MAGIAS EXTRA"
          subtitle="Preparadas por traços raciais ou talentos."
          spells={filterSpells(bonusPreparedSpells.map(s => `${s.name} — ${s.origin}`))}
          accent="#34d399" badge="Extra" stats={spellStats} onRoll={onSpellRoll}
          concentratingOn={playState.concentratingOn}
          onSetConcentration={name => onUpdatePlayState(prev => ({ ...prev, concentratingOn: name }))}
        />
      )}

      {learnedCantrips.length === 0 && bonusCantrips.length === 0 && preparedSpells.length === 0 && bonusPreparedSpells.length === 0 && !showAddSpell && (
        <div className={styles.emptySpells}>Nenhuma magia selecionada.</div>
      )}
    </div>
  );
}

const SAVE_ABBR: Record<string, string> = {
  'força': 'FOR', 'destreza': 'DES', 'constituição': 'CON',
  'inteligência': 'INT', 'sabedoria': 'SAB', 'carisma': 'CAR',
};

/** Tempo curto e padronizado: "Reação, que você executa quando…" vira "Reação". */
function shortTime(time: string | undefined): string {
  if (!time) return '—';
  const t = time.toLowerCase();
  if (t.startsWith('reação')) return 'Reação';
  if (t.startsWith('ação bônus')) return 'Ação Bônus';
  if (t.startsWith('ação')) return 'Ação';
  return time.split(/[,(]| ou /)[0].trim()
    .replace(/minutos?/i, 'min').replace(/horas?/i, 'h');
}

/** Alcance curto para a tabela: "9 metros (6 qd)" vira "9 m (6 qd)". */
function shortRange(range: string | undefined): string {
  if (!range) return '—';
  return withSquares(range).replace(/\s*metros?\b/gi, ' m').replace(/\s+/g, ' ').trim();
}

/** Notas curtas, no estilo do DDB: "D: 1 min · V, S". */
function shortNotes(components: string | undefined, duration: string | undefined): string {
  const comp = typeof components === 'string' ? components.split('(')[0].trim().replace(/\s*,\s*/g, '/') : '';
  let dur = typeof duration === 'string' ? duration : '';
  dur = dur
    .replace(/^Concentração,\s*até\s*/i, 'C, ')
    .replace(/Instantânea/i, 'Inst.')
    .replace(/\bminutos?\b/gi, 'min')
    .replace(/\bhoras?\b/gi, 'h')
    .replace(/\brodadas?\b/gi, 'rod.')
    .replace(/\bdias?\b/gi, 'd');
  return [dur && `D: ${dur}`, comp].filter(Boolean).join(' · ');
}

function getSpellInfo(name: string): any | undefined {
  return (spellsAll as any[]).find(sp => sp.name === name);
}

/** Deriva ACERTO/CD e EFEITO a partir do texto da magia (heurística). */
function spellHitAndEffect(info: any, stats: { attack: number; dc: number }) {
  const desc: string = typeof info?.description === 'string' ? info.description : '';
  const lower = desc.toLowerCase();
  let hit: string | null = null;
  const save = lower.match(/salvaguarda de (força|destreza|constituição|inteligência|sabedoria|carisma)/);
  if (save) hit = `${SAVE_ABBR[save[1]]} ${stats.dc}`;
  else if (/ataque (mágico|com magia)/.test(lower)) hit = signedMod(stats.attack);
  let effect: string | null = null;
  let formula: string | null = null;
  let effectType = '';
  const dmg = desc.match(/(\d+d\d+(?:\s*\+\s*\d+)?)[^.]*?dano (\p{L}+)/u);
  if (dmg) {
    formula = dmg[1].replace(/\s/g, '');
    effectType = dmg[2];
    effect = `${formula} ${effectType}`;
  } else {
    const heal = /recupera|pontos de vida/.test(lower) ? desc.match(/\d+d\d+/) : null;
    if (heal) {
      formula = heal[0];
      effectType = 'Cura';
      effect = `${formula} Cura`;
    }
  }
  const isAttack = !save && /ataque (mágico|com magia)/.test(lower);
  return { hit, effect, formula, effectType, isAttack };
}

function SpellList({
  title, subtitle, spells, accent, badge, canRemove, onRemove,
  concentratingOn, onSetConcentration, stats, atWill, onCast, canCast, onRoll,
}: {
  title: string; subtitle?: string; spells: string[]; accent: string;
  badge?: string; canRemove?: boolean; onRemove?: (name: string) => void;
  concentratingOn?: string | null; onSetConcentration?: (name: string | null) => void;
  stats: { attack: number; dc: number }; atWill?: boolean;
  onCast?: () => void; canCast?: boolean;
  onRoll?: (roll: SpellRoll) => void;
}) {
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

  return (
    <section style={{ '--accent': accent } as React.CSSProperties}>
      <div className={ddb.sectionHeader}>
        {title}
        {badge && <span className={ddb.sectionMeta}>· {badge}</span>}
      </div>
      {subtitle && <div className={styles.spellSectionSubtitle}>{subtitle}</div>}
      <div className={ddb.table}>
        <div className={ddb.thead} style={{ gridTemplateColumns: SPELL_COLS }}>
          <div />
          <div>NOME</div>
          <div className={ddb.center}>TEMPO</div>
          <div className={ddb.center}>ALCANCE</div>
          <div className={ddb.center}>ACERTO/CD</div>
          <div className={ddb.center}>EFEITO</div>
          <div>NOTAS</div>
        </div>
        {spells.map(s => {
          const rawName = s.split(' — ')[0].trim();
          const origin = s.includes(' — ') ? s.split(' — ').slice(1).join(' — ') : null;
          const info = getSpellInfo(rawName);
          const isRitual = typeof info?.castingTime === 'string' && info.castingTime.toLowerCase().includes('ritual');
          const isConc = typeof info?.duration === 'string' && info.duration.toLowerCase().includes('concentra');
          const { hit, effect, formula, effectType, isAttack } = spellHitAndEffect(info, stats);
          const isExpanded = expandedSpell === s;
          const notes = shortNotes(info?.components, info?.duration);

          return (
            <div key={s}>
              <div
                className={ddb.trowClickable}
                style={{ gridTemplateColumns: SPELL_COLS }}
                onClick={() => setExpandedSpell(isExpanded ? null : s)}
              >
                <div onClick={e => e.stopPropagation()}>
                  {atWill ? (
                    <span className={styles.atWill}>à vontade</span>
                  ) : onCast ? (
                    <button
                      className={ddb.redBtn}
                      disabled={!canCast}
                      onClick={onCast}
                      title={canCast ? 'Gastar um espaço de magia' : 'Sem espaços de magia disponíveis'}
                    >
                      Conjurar
                    </button>
                  ) : null}
                </div>
                <div>
                  <SpellCardTooltip spellName={rawName}>
                    <span className={ddb.name}>{rawName}</span>
                  </SpellCardTooltip>
                  {origin && <span className={ddb.featureSource}>{' — '}{origin}</span>}
                  {isConc && <span className={styles.tagConcentrationSmall} title="Concentração">C</span>}
                  {isRitual && <span className={styles.tagRitualSmall} title="Ritual">R</span>}
                  <div className={ddb.sub}>{info?.school ?? ''}</div>
                </div>
                <div className={`${ddb.center} ${ddb.notes}`} title={info?.castingTime}>{shortTime(info?.castingTime)}</div>
                <div className={`${ddb.center} ${ddb.notes}`} title={info ? withSquares(info.range) : undefined}>{info ? shortRange(info.range) : '—'}</div>
                <div className={ddb.center} onClick={e => e.stopPropagation()}>
                  {hit && isAttack && onRoll ? (
                    <button type="button" className={`${ddb.box} ${styles.rollBtn}`} title="Rolar ataque" onClick={() => onRoll({ kind: 'attack', spell: rawName, bonus: stats.attack })}>{hit}</button>
                  ) : hit ? <span className={ddb.box}>{hit}</span> : '—'}
                </div>
                <div className={`${ddb.center} ${ddb.notes}`} onClick={e => e.stopPropagation()}>
                  {formula && onRoll ? (
                    <button type="button" className={`${ddb.box} ${styles.rollBtn}`} title={`Rolar ${effectType === 'Cura' ? 'cura' : 'dano'} (${effectType})`} onClick={() => onRoll({ kind: 'damage', spell: rawName, formula, damageType: effectType })}>{effect}</button>
                  ) : (effect ?? '—')}
                </div>
                <div className={ddb.notes}>{notes || '—'}</div>
              </div>

              {isExpanded && (
                <div className={styles.spellExpanded} style={{ border: `1px solid ${accent}40` }}>
                  <div className={styles.spellExpandedHeader}>
                    <div>
                      <div className={styles.spellExpandedName} style={{ color: accent }}>{s}</div>
                      {info && (
                        <div className={styles.spellExpandedMeta}>
                          {info.level === 'Truque' ? `Truque de ${info.school}` : `${info.level}, ${info.school}`}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      {isConc && onSetConcentration && (
                        <button
                          onClick={e => { e.stopPropagation(); onSetConcentration(concentratingOn === rawName ? null : rawName); }}
                          className={concentratingOn === rawName ? styles.concentratingActiveBtn : styles.concentratingBtn}
                          title={concentratingOn === rawName ? 'Encerrar concentração' : 'Iniciar concentração nesta magia'}
                        >
                          {concentratingOn === rawName ? '◉ Concentrando' : '◎ Concentrar'}
                        </button>
                      )}
                      {canRemove && onRemove && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemove(rawName); }}
                          className={styles.unprepareBtn}
                          title="Remover da lista de preparadas"
                        >
                          Remover
                        </button>
                      )}
                      <button onClick={() => setExpandedSpell(null)} className={styles.collapseBtn}>Recolher ▲</button>
                    </div>
                  </div>
                  {info ? (
                    <>
                      <div className={styles.spellTags}>
                        {isRitual && <span className={styles.tagRitual}>Ritual</span>}
                        {isConc && <span className={styles.tagConcentration}>Concentração</span>}
                      </div>
                      <div className={styles.spellDetails}>
                        <span className={styles.spellDetailLabel}>Conjuração:</span>
                        <span className={styles.spellDetailValue}>{info.castingTime}</span>
                        <span className={styles.spellDetailLabel}>Alcance:</span>
                        <span className={styles.spellDetailValue}>{withSquares(info.range)}</span>
                        <span className={styles.spellDetailLabel}>Componentes:</span>
                        <span className={styles.spellDetailValue}>{info.components}</span>
                        <span className={styles.spellDetailLabel}>Duração:</span>
                        <span className={styles.spellDetailValue}>{info.duration}</span>
                      </div>
                      <div className={styles.spellDescription}>{info.description}</div>
                    </>
                  ) : (
                    <div className={styles.spellNotFound}>Detalhes não encontrados.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
