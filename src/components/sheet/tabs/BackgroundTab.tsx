import { useState } from 'react';

type FilterId = 'all' | 'background' | 'characteristics' | 'appearance';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all',             label: 'TODAS' },
  { id: 'background',      label: 'ANTECEDENTE' },
  { id: 'characteristics', label: 'CARACTERÍSTICAS' },
  { id: 'appearance',      label: 'APARÊNCIA' },
];

interface BackgroundTabProps {
  backgroundName?: string;
  backgroundDescription?: string;
  backgroundSkills?: string[];
  backgroundTool?: string;
  backgroundEquipment?: string;
  originTalent?: string;
}

export function BackgroundTab({
  backgroundName,
  backgroundDescription,
  backgroundSkills,
  backgroundTool,
  backgroundEquipment,
  originTalent,
}: BackgroundTabProps) {
  const [filter, setFilter] = useState<FilterId>('all');

  if (!backgroundName) {
    return (
      <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
        Nenhum antecedente selecionado.
      </div>
    );
  }

  const showBackground = filter === 'all' || filter === 'background';
  const showCharacteristics = filter === 'all' || filter === 'characteristics';
  const showAppearance = filter === 'all' || filter === 'appearance';

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

      {/* BACKGROUND section */}
      {showBackground && (
        <>
          <SectionHeader>ANTECEDENTE</SectionHeader>
          <div style={{ padding: '8px 12px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '6px' }}>
              {backgroundName}
            </div>
            {originTalent && (
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                <span style={{ fontStyle: 'italic' }}>{originTalent}</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}> • PHB-2024</span>
              </div>
            )}
            {originTalent && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                From <span style={{ color: '#94a3b8' }}>{backgroundName}</span>
              </div>
            )}
            {backgroundDescription && (
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '12px' }}>
                {backgroundDescription}
              </div>
            )}
            {backgroundSkills && backgroundSkills.length > 0 && (
              <div style={{ borderLeft: '2px solid #991b1b', paddingLeft: '10px', marginBottom: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{backgroundSkills.join(', ')}</div>
              </div>
            )}
            {backgroundTool && (
              <InfoRow label="FERRAMENTAS" value={backgroundTool} />
            )}
            {backgroundEquipment && (
              <InfoRow label="EQUIPAMENTO" value={backgroundEquipment} />
            )}
          </div>
        </>
      )}

      {/* CHARACTERISTICS section */}
      {showCharacteristics && (
        <>
          <SectionHeader>CARACTERÍSTICAS</SectionHeader>
          <CharacteristicsGrid />
        </>
      )}

      {/* APPEARANCE section */}
      {showAppearance && (
        <>
          <SectionHeader>APARÊNCIA</SectionHeader>
          <div style={{ padding: '8px 12px' }}>
            <AddPlaceholder label="Adicionar informação de Aparência" />
          </div>
        </>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.78rem', color: '#64748b', minWidth: '110px', flexShrink: 0, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{value}</span>
    </div>
  );
}

function CharacteristicsGrid() {
  const fields = [
    ['ALINHAMENTO', '—'], ['GÊNERO', '—'], ['OLHOS', '—'], ['TAMANHO', 'Médio'], ['ALTURA', '—'],
    ['FÉ', '—'], ['CABELO', '—'], ['PELE', '—'], ['IDADE', '—'], ['PESO', '—'],
  ];

  return (
    <div style={{ padding: '8px 12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px 16px', marginBottom: '16px' }}>
        {fields.map(([label, value]) => (
          <div key={label}>
            <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, marginBottom: '2px', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontSize: '0.82rem', color: value === '—' ? '#475569' : '#cbd5e1' }}>{value}</div>
          </div>
        ))}
      </div>

      {['Traços de Personalidade', 'Ideais', 'Vínculos', 'Defeitos'].map(section => (
        <div key={section} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.82rem', color: '#f1f5f9', fontWeight: 700, marginBottom: '4px' }}>{section}</div>
          <AddPlaceholder label={`Adicionar ${section}`} />
        </div>
      ))}
    </div>
  );
}

function AddPlaceholder({ label }: { label: string }) {
  return (
    <button style={{
      background: 'none',
      border: 'none',
      color: '#dc2626',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer',
      padding: '4px 0',
      textAlign: 'left',
    }}>
      + {label}
    </button>
  );
}
