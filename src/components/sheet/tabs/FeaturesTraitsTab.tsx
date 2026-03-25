import { useState } from 'react';
import type { ActiveTalentSummary } from '../../../rules/types/DerivedSheet';

interface Feature {
  level: number;
  name: string;
  description: string;
}

interface Trait {
  title: string;
  description: string;
}

type FilterId = 'all' | 'class' | 'species' | 'feats';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all',     label: 'TODAS' },
  { id: 'class',   label: 'CARACTERÍSTICAS DE CLASSE' },
  { id: 'species', label: 'TRAÇOS DE ESPÉCIE' },
  { id: 'feats',   label: 'TALENTOS' },
];

interface FeaturesTraitsTabProps {
  classFeatures: Feature[];
  speciesTraits: Trait[];
  originTalent?: string;
  activeTalents?: ActiveTalentSummary[];
  derivedTraits?: string[];
  backgroundName?: string;
  backgroundSkills?: string[];
  backgroundTool?: string;
  characterLevel: number;
}

export function FeaturesTraitsTab({
  classFeatures,
  speciesTraits,
  originTalent,
  activeTalents = [],
  derivedTraits = [],
  backgroundName,
  backgroundSkills,
  backgroundTool,
  characterLevel,
}: FeaturesTraitsTabProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const activeFeatures = classFeatures.filter(f => f.level <= characterLevel);

  const showClass = filter === 'all' || filter === 'class';
  const showSpecies = filter === 'all' || filter === 'species';
  const showFeats = filter === 'all' || filter === 'feats';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
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

      {/* CLASS FEATURES */}
      {showClass && activeFeatures.length > 0 && (
        <>
          <SectionHeader>CARACTERÍSTICAS DE CLASSE</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {activeFeatures.map((f, i) => (
              <FeatureEntry key={i} title={f.name} badge={`PHB-2024`} description={f.description} />
            ))}
          </div>
        </>
      )}

      {/* SPECIES TRAITS */}
      {showSpecies && speciesTraits.length > 0 && (
        <>
          <SectionHeader>TRAÇOS DE ESPÉCIE</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {speciesTraits.map((t, i) => (
              <FeatureEntry key={i} title={t.title} description={t.description} />
            ))}
          </div>
        </>
      )}

      {/* FEATS / TALENTS */}
      {showFeats && (activeTalents.length > 0 || originTalent) && (
        <>
          <SectionHeader>TALENTOS</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {activeTalents.map((talent) => (
              <div key={`${talent.source}-${talent.name}`} style={{
                padding: '10px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 700, fontStyle: 'italic' }}>{talent.name}</span>
                  <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 600 }}>
                    {talent.source === 'background' ? 'ANTECEDENTE' : 'ESPÉCIE'}
                  </span>
                </div>
                {talent.notes.length > 0 && (
                  <div style={{ borderLeft: '2px solid #991b1b', paddingLeft: '10px', marginTop: '6px' }}>
                    {talent.notes.map((note) => (
                      <div key={note} style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {activeTalents.length === 0 && originTalent && (
              <div style={{ padding: '10px 12px', fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 500 }}>{originTalent}</div>
            )}
          </div>
        </>
      )}

      {/* DERIVED TRAITS */}
      {showFeats && derivedTraits.length > 0 && (
        <>
          <SectionHeader>EFEITOS DERIVADOS</SectionHeader>
          <div style={{ padding: '8px 12px' }}>
            {derivedTraits.map((trait) => (
              <div key={trait} style={{
                fontSize: '0.8rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                borderLeft: '2px solid #991b1b',
                paddingLeft: '10px',
                marginBottom: '4px',
              }}>
                {trait}
              </div>
            ))}
          </div>
        </>
      )}

      {/* BACKGROUND (shown in class filter or all) */}
      {showClass && backgroundName && (
        <>
          <SectionHeader>ANTECEDENTE</SectionHeader>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: '0.88rem', color: '#f1f5f9', marginBottom: '6px', fontWeight: 700 }}>
              {backgroundName}
            </div>
            {backgroundSkills && backgroundSkills.length > 0 && (
              <div style={{ borderLeft: '2px solid #991b1b', paddingLeft: '10px', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {backgroundSkills.join(', ')}
                </div>
              </div>
            )}
            {backgroundTool && (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                <span style={{ color: '#64748b', fontWeight: 700 }}>Ferramentas: </span>
                {backgroundTool}
              </div>
            )}
          </div>
        </>
      )}

      {activeFeatures.length === 0 && speciesTraits.length === 0 && !originTalent && activeTalents.length === 0 && derivedTraits.length === 0 && (
        <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
          Nenhuma característica disponível.
        </div>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '0.7rem',
      color: '#dc2626',
      fontWeight: 800,
      letterSpacing: '0.05em',
      paddingBottom: '6px',
      borderBottom: '1px solid rgba(220,38,38,0.3)',
    }}>
      {children}
    </div>
  );
}

function FeatureEntry({ title, badge, description }: { title: string; badge?: string; description: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = description.length > 150;
  const shown = expanded || !long ? description : description.slice(0, 150) + '…';

  return (
    <div style={{
      padding: '10px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 700, fontStyle: 'italic' }}>{title}</span>
        {badge && (
          <span style={{
            fontSize: '0.65rem',
            color: '#64748b',
            fontWeight: 600,
          }}>
            • {badge}
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
        {shown}
        {long && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: '0.75rem',
            }}
          >
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>
    </div>
  );
}
