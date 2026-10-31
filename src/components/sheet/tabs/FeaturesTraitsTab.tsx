import { useState } from 'react';
import type { ActiveTalentSummary } from '../../../rules/types/DerivedSheet';
import styles from './FeaturesTraitsTab.module.css';
import ddb from './ddbTab.module.css';

type FilterId = 'all' | 'class' | 'species' | 'feats';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'class', label: 'Classe' },
  { id: 'species', label: 'Espécie' },
  { id: 'feats', label: 'Talentos' },
];

interface Feature {
  level: number;
  name: string;
  description: string;
}

interface Trait {
  title: string;
  description: string;
}

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
  className?: string;
  speciesName?: string;
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
  className,
  speciesName,
}: FeaturesTraitsTabProps) {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterId>('all');
  const show = (id: FilterId) => filter === 'all' || filter === id;
  const activeFeatures = classFeatures.filter(f => f.level <= characterLevel);
  const q = searchText.toLowerCase();

  const filterFeatures = (features: Feature[]) =>
    q ? features.filter(f => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) : features;
  const filterTraits = (traits: Trait[]) =>
    q ? traits.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : traits;

  const filteredFeatures = show('class') ? filterFeatures(activeFeatures) : [];
  const filteredTraits = show('species') ? filterTraits(speciesTraits) : [];
  const talentsVisible = show('feats') ? activeTalents : [];
  const originVisible = show('feats') ? originTalent : undefined;

  return (
    <div className={ddb.tab}>
      <div className={ddb.pills}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={filter === f.id ? ddb.pillActive : ddb.pill}>
            {f.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        placeholder="Buscar características…"
        className={ddb.search}
      />

      {filteredFeatures.length > 0 && (
        <Section title="CARACTERÍSTICAS DE CLASSE">
          {className && <div className={ddb.subHeader}>{className}</div>}
          <div>
            {filteredFeatures.map((f, i) => (
              <FeatureEntry key={i} title={f.name} badge={`${className ? `${className} ` : ''}${f.level}`} description={f.description} />
            ))}
          </div>
        </Section>
      )}

      {filteredTraits.length > 0 && (
        <Section title="TRAÇOS DE ESPÉCIE">
          {speciesName && <div className={ddb.subHeader}>{speciesName}</div>}
          <div>
            {filteredTraits.map((t, i) => (
              <FeatureEntry key={i} title={t.title} badge={speciesName} description={t.description} />
            ))}
          </div>
        </Section>
      )}

      {(talentsVisible.length > 0 || originVisible) && (
        <Section title="TALENTOS APLICADOS">
          {talentsVisible.map((talent) => (
            <div key={`${talent.source}-${talent.name}`} className={ddb.feature}>
              <div className={ddb.featureName}>
                {talent.name}
                <span className={ddb.featureSource}>
                  {talent.source === 'background' ? 'Antecedente' : 'Espécie'}
                </span>
              </div>
              {talent.notes.length > 0 && (
                <div className={ddb.nested}>
                  {talent.notes.map((note) => <div key={note}>{note}</div>)}
                </div>
              )}
            </div>
          ))}
          {talentsVisible.length === 0 && originVisible && (
            <div className={ddb.feature}>
              <div className={ddb.featureName}>{originVisible}<span className={ddb.featureSource}>Talento de origem</span></div>
            </div>
          )}
        </Section>
      )}

      {filter === 'all' && derivedTraits.length > 0 && (
        <Section title="EFEITOS DERIVADOS">
          <div className={ddb.nested}>
            {derivedTraits.map((trait) => <div key={trait}>{trait}</div>)}
          </div>
        </Section>
      )}

      {filter === 'all' && backgroundName && (
        <Section title="ANTECEDENTE">
          <div className={ddb.featureName}>{backgroundName}</div>
          {backgroundSkills && backgroundSkills.length > 0 && (
            <div className={styles.bgDetail}>
              <span className={styles.bgDetailLabel}>Perícias: </span>
              {backgroundSkills.join(', ')}
            </div>
          )}
          {backgroundTool && (
            <div className={styles.bgDetailMargin}>
              <span className={styles.bgDetailLabel}>Ferramentas: </span>
              {backgroundTool}
            </div>
          )}
        </Section>
      )}

      {filteredFeatures.length === 0 && filteredTraits.length === 0 && !originVisible && talentsVisible.length === 0 && (filter !== 'all' || derivedTraits.length === 0) && (
        <div className={styles.emptyText}>Nenhuma característica disponível.</div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className={ddb.sectionHeader}>{title}</div>
      {children}
    </section>
  );
}

function FeatureEntry({ title, badge, description }: { title: string; badge?: string; description: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = description.length > 120;
  const shown = expanded || !long ? description : description.slice(0, 120) + '…';

  return (
    <div className={ddb.feature}>
      <div className={ddb.featureName}>
        {title}
        {badge && <span className={ddb.featureSource}>{badge}</span>}
      </div>
      <div className={ddb.featureDesc}>
        {shown}
        {long && (
          <button onClick={() => setExpanded(prev => !prev)} className={styles.moreBtn}>
            {expanded ? 'MENOS' : 'MAIS'}
          </button>
        )}
      </div>
    </div>
  );
}
