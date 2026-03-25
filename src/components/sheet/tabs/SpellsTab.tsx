import { useMemo, useState } from 'react';
import type { DerivedSheet } from '../../../rules/types/DerivedSheet';
import type { CharacterPlayState } from '../../../types/playState';
import spellsAll from '../../../data/spells/spells_all.json';

const ABILITY_LABELS: Record<string, string> = {
  inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma',
  forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição',
};

function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

interface SpellsTabProps {
  derivedSheet: DerivedSheet;
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  learnedCantrips: string[];
  preparedSpells: string[];
}

interface SpellInfo {
  name: string;
  level: string;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  damage?: string;
  savingThrow?: string;
}

const SPELL_MAP = new Map<string, SpellInfo>();
for (const sp of spellsAll as SpellInfo[]) {
  SPELL_MAP.set(sp.name, sp);
}

const CIRCLE_ORDER = [
  'Truque', '1º Círculo', '2º Círculo', '3º Círculo', '4º Círculo',
  '5º Círculo', '6º Círculo', '7º Círculo', '8º Círculo', '9º Círculo',
];

function castingTimeAbbrev(ct: string): string {
  if (ct.includes('ação bônus') || ct.includes('Ação Bônus')) return '1BA';
  if (ct.includes('reação') || ct.includes('Reação')) return '1R';
  if (ct.includes('1 minuto')) return '1min';
  if (ct.includes('10 minutos')) return '10min';
  if (ct.includes('1 hora')) return '1h';
  if (ct.includes('ação') || ct.includes('Ação')) return '1A';
  return ct.length > 6 ? ct.substring(0, 6) : ct;
}

function rangeAbbrev(range: string): string {
  return range
    .replace('metros', 'ft.')
    .replace('metro', 'ft.')
    .replace('Pessoal', 'Self')
    .replace('Toque', 'Touch');
}

function componentsAbbrev(comp: string): string {
  const parts: string[] = [];
  if (comp.includes('V')) parts.push('V');
  if (comp.includes('S')) parts.push('S');
  if (comp.includes('M')) parts.push('M');
  return parts.join('/');
}

function getSpellEffect(sp: SpellInfo, spellAttackBonus: number, modValue: number): { text: string; isAttack: boolean; saveDC?: string } {
  const desc = sp.description?.toLowerCase() ?? '';
  const dmg = sp.damage;

  if (dmg) {
    const bonus = modValue !== 0 ? `${signedMod(modValue)}` : '';
    return { text: `${dmg}${bonus}`, isAttack: true };
  }

  if (desc.includes('teste de resistência') || desc.includes('saving throw') || sp.savingThrow) {
    const stMatch = sp.savingThrow ?? '';
    return { text: stMatch ? stMatch.substring(0, 3).toUpperCase() : 'Save', isAttack: false };
  }

  if (desc.includes('cura') || desc.includes('heal')) return { text: 'Healing', isAttack: false };
  if (desc.includes('buff') || desc.includes('vantagem')) return { text: 'Buff', isAttack: false };
  if (desc.includes('controle') || desc.includes('control')) return { text: 'Control', isAttack: false };
  if (desc.includes('criação') || desc.includes('create')) return { text: 'Creation*', isAttack: false };
  if (desc.includes('comunicação') || desc.includes('communi')) return { text: 'Communication*', isAttack: false };

  return { text: '—', isAttack: false };
}

function durationAbbrev(dur: string): string {
  if (dur.includes('Instantân') || dur.includes('instantân')) return '';
  if (dur.includes('Concentração')) {
    const m = dur.match(/(\d+)\s*(minuto|hora|rodada)/i);
    if (m) return `D: ${m[1]}${m[2][0]}`;
    return 'D: Conc.';
  }
  const m = dur.match(/(\d+)\s*(minuto|hora|rodada|dia)/i);
  if (m) return `D: ${m[1]}${m[2][0]}`;
  return dur.length > 10 ? dur.substring(0, 10) : dur;
}

export function SpellsTab({
  derivedSheet,
  playState,
  onUpdatePlayState,
  learnedCantrips,
  preparedSpells,
}: SpellsTabProps) {
  const [search, setSearch] = useState('');
  const [circleFilter, setCircleFilter] = useState<string>('all');
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

  const racialCantrips = derivedSheet.racialCantrips ?? [];
  const bonusCantrips = derivedSheet.bonusCantrips ?? [];
  const bonusPreparedSpells = derivedSheet.bonusPreparedSpells ?? [];
  const spellMod = derivedSheet.modifiers?.[derivedSheet.spellcastingAbility ?? ''] ?? 0;

  // Build unified spell list with source tagging
  const allSpells = useMemo(() => {
    const list: Array<{ name: string; source: string; circle: string; info: SpellInfo | undefined }> = [];

    for (const name of learnedCantrips) {
      list.push({ name, source: 'Classe', circle: 'Truque', info: SPELL_MAP.get(name) });
    }
    for (const name of racialCantrips) {
      if (!list.some(s => s.name === name)) {
        list.push({ name, source: 'Racial', circle: 'Truque', info: SPELL_MAP.get(name) });
      }
    }
    for (const bc of bonusCantrips) {
      if (!list.some(s => s.name === bc.name)) {
        list.push({ name: bc.name, source: bc.origin, circle: 'Truque', info: SPELL_MAP.get(bc.name) });
      }
    }
    for (const name of preparedSpells) {
      const info = SPELL_MAP.get(name);
      list.push({ name, source: 'Classe', circle: info?.level ?? '?', info });
    }
    for (const bp of bonusPreparedSpells) {
      if (!list.some(s => s.name === bp.name && s.circle !== 'Truque')) {
        const info = SPELL_MAP.get(bp.name);
        list.push({ name: bp.name, source: bp.origin, circle: info?.level ?? '1º Círculo', info });
      }
    }
    return list;
  }, [learnedCantrips, racialCantrips, bonusCantrips, preparedSpells, bonusPreparedSpells]);

  const availableCircles = useMemo(() => {
    const circles = new Set(allSpells.map(s => s.circle));
    return CIRCLE_ORDER.filter(c => circles.has(c));
  }, [allSpells]);

  const filteredSpells = useMemo(() => {
    let filtered = allSpells;
    if (circleFilter !== 'all') filtered = filtered.filter(s => s.circle === circleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q) ||
        (s.info?.school ?? '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [allSpells, circleFilter, search]);

  // Group by circle
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filteredSpells> = {};
    for (const sp of filteredSpells) {
      if (!groups[sp.circle]) groups[sp.circle] = [];
      groups[sp.circle].push(sp);
    }
    return groups;
  }, [filteredSpells]);

  if (!derivedSheet.isCaster && bonusCantrips.length === 0 && bonusPreparedSpells.length === 0 && learnedCantrips.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569', fontSize: '0.9rem' }}>
        Esta classe não conjura magias.
      </div>
    );
  }

  const slots = derivedSheet.spellSlots ?? {};
  const slotLevels = Object.keys(slots).map(Number).filter(l => (slots as Record<number, number>)[l] > 0).sort((a, b) => a - b);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Spell stats header */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        {derivedSheet.spellcastingAbility && (
          <StatPill label="MODIFICADOR" value={signedMod(spellMod)} />
        )}
        <StatPill label="ATAQUE MÁGICO" value={signedMod(derivedSheet.spellAttackBonus ?? 0)} />
        <StatPill label="CD DE MAGIA" value={String(derivedSheet.spellSaveDC ?? 0)} />
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(17,18,24,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px',
          padding: '6px 10px',
        }}>
          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar Magias, Escolas, Tags..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#f1f5f9',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Circle filter pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <FilterPill active={circleFilter === 'all'} onClick={() => setCircleFilter('all')}>TODAS</FilterPill>
        {availableCircles.map(c => {
          const label = c === 'Truque' ? '- 0 -' : c.replace('º Círculo', 'º');
          return <FilterPill key={c} active={circleFilter === c} onClick={() => setCircleFilter(c)}>{label}</FilterPill>;
        })}
      </div>

      {/* Spell sections by circle */}
      {CIRCLE_ORDER.map(circle => {
        const spells = grouped[circle];
        if (!spells || spells.length === 0) return null;
        const isCantrip = circle === 'Truque';
        const circleNum = isCantrip ? 0 : parseInt(circle);
        const slotTotal = isCantrip ? 0 : (slots as Record<number, number>)[circleNum] ?? 0;
        const slotSpent = isCantrip ? 0 : (playState.spentSpellSlots[circleNum] ?? 0);

        return (
          <div key={circle}>
            {/* Section header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '6px',
              borderBottom: '1px solid rgba(220,38,38,0.3)',
              marginBottom: '4px',
            }}>
              <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 800, letterSpacing: '0.05em' }}>
                {isCantrip ? 'TRUQUE' : circle.toUpperCase()}
              </span>
              {!isCantrip && slotTotal > 0 && (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {Array.from({ length: slotTotal }, (_, i) => {
                    const isUsed = i < slotSpent;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          onUpdatePlayState(prev => ({
                            ...prev,
                            spentSpellSlots: {
                              ...prev.spentSpellSlots,
                              [circleNum]: isUsed
                                ? Math.max(0, (prev.spentSpellSlots[circleNum] ?? 0) - 1)
                                : (prev.spentSpellSlots[circleNum] ?? 0) + 1,
                            },
                          }));
                        }}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '3px',
                          border: `2px solid ${isUsed ? '#475569' : '#991b1b'}`,
                          background: isUsed ? 'transparent' : '#991b1b',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={isUsed ? 'Restaurar slot' : 'Gastar slot'}
                      >
                        {isUsed && <span style={{ color: '#475569', fontSize: '0.6rem', fontWeight: 900 }}>✕</span>}
                      </button>
                    );
                  })}
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginLeft: '4px' }}>SLOTS</span>
                </div>
              )}
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '32px minmax(140px, 1fr) 40px 60px 60px 80px minmax(80px, 1fr)',
              padding: '4px 8px',
              gap: '4px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {['', 'NOME', 'TEMPO', 'ALCANCE', 'ACERTO/CD', 'EFEITO', 'NOTAS'].map(h => (
                <span key={h} style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800 }}>{h}</span>
              ))}
            </div>

            {/* Spell rows */}
            {spells.map((sp, i) => {
              const info = sp.info;
              const effect = info ? getSpellEffect(info, derivedSheet.spellAttackBonus ?? 0, spellMod) : { text: '—', isAttack: false };
              const isExpanded = expandedSpell === sp.name;

              return (
                <div key={`${sp.name}-${sp.source}-${i}`}>
                  <div
                    onClick={() => setExpandedSpell(isExpanded ? null : sp.name)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px minmax(140px, 1fr) 40px 60px 60px 80px minmax(80px, 1fr)',
                      padding: '8px 8px',
                      gap: '4px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      alignItems: 'center',
                      background: isExpanded ? 'rgba(153,27,27,0.08)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* AT WILL / CAST badge */}
                    <span style={{
                      fontSize: '0.55rem',
                      color: isCantrip ? '#64748b' : '#dc2626',
                      fontWeight: 800,
                      textAlign: 'center',
                      lineHeight: 1.1,
                      border: isCantrip ? 'none' : '1px solid rgba(220,38,38,0.3)',
                      borderRadius: '3px',
                      padding: isCantrip ? '0' : '2px 3px',
                      background: isCantrip ? 'transparent' : 'rgba(220,38,38,0.08)',
                    }}>
                      {isCantrip ? 'AT\nWILL' : 'CAST'}
                    </span>

                    {/* Name + source */}
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 700, fontStyle: 'italic' }}>{sp.name}</div>
                      <div style={{ fontSize: '0.6rem', color: '#64748b' }}>
                        {sp.source}
                      </div>
                    </div>

                    {/* Casting time */}
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                      {info ? castingTimeAbbrev(info.castingTime) : '—'}
                    </span>

                    {/* Range */}
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                      {info ? rangeAbbrev(info.range) : '—'}
                    </span>

                    {/* Hit/DC */}
                    <span style={{ textAlign: 'center' }}>
                      {effect.isAttack ? (
                        <span style={{
                          display: 'inline-block',
                          border: '1px solid #991b1b',
                          borderRadius: '20px',
                          padding: '1px 6px',
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          color: '#f1f5f9',
                          background: 'rgba(0,0,0,0.5)',
                        }}>
                          {signedMod(derivedSheet.spellAttackBonus ?? 0)}
                        </span>
                      ) : info?.savingThrow ? (
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                          <span style={{ fontSize: '0.6rem', color: '#64748b', display: 'block' }}>{info.savingThrow.substring(0, 3).toUpperCase()}</span>
                          {derivedSheet.spellSaveDC}
                        </span>
                      ) : (
                        <span style={{ color: '#475569' }}>—</span>
                      )}
                    </span>

                    {/* Effect */}
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#f1f5f9',
                      textAlign: 'center',
                      ...(effect.isAttack ? {
                        border: '1px solid #7f1d1d',
                        background: 'rgba(0,0,0,0.4)',
                        borderRadius: '4px',
                        padding: '2px 4px',
                      } : {}),
                    }}>
                      {effect.text}
                    </span>

                    {/* Notes: duration + components */}
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {info ? `${durationAbbrev(info.duration)}${durationAbbrev(info.duration) ? ', ' : ''}${componentsAbbrev(info.components)}` : '—'}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && info && (
                    <div style={{
                      padding: '12px 14px 12px 40px',
                      background: 'rgba(0,0,0,0.2)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '8px' }}>
                        {info.level === 'Truque' ? `Truque de ${info.school}` : `${info.level}, ${info.school}`}
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: '4px 12px',
                        fontSize: '0.78rem',
                        marginBottom: '8px',
                      }}>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Conjuração:</span>
                        <span style={{ color: '#e2e8f0' }}>{info.castingTime}</span>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Alcance:</span>
                        <span style={{ color: '#e2e8f0' }}>{info.range}</span>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Componentes:</span>
                        <span style={{ color: '#e2e8f0' }}>{info.components}</span>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Duração:</span>
                        <span style={{ color: '#e2e8f0' }}>{info.duration}</span>
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {info.description}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {filteredSpells.length === 0 && (
        <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>
          {search ? 'Nenhuma magia encontrada.' : 'Nenhuma magia selecionada.'}
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f1f5f9' }}>{value}</div>
      <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800 }}>{label}</div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? '#991b1b' : 'transparent',
        border: 'none',
        borderRadius: '4px',
        color: active ? '#ffffff' : '#94a3b8',
        padding: '4px 8px',
        fontSize: '0.7rem',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      {children}
    </button>
  );
}
