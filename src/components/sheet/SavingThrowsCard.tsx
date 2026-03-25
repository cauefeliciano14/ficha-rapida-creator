import { useState } from 'react';
import type { DerivedSavingThrow } from '../../rules/types/DerivedSheet';

const ATTR_LABELS: Record<string, string> = {
  forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição',
  inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma',
};

function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

interface SavingThrowsCardProps {
  derivedSavingThrows: DerivedSavingThrow[];
  modifiers?: Record<string, number>;
  proficiencyBonus?: number;
}

export function SavingThrowsCard({ derivedSavingThrows, modifiers, proficiencyBonus }: SavingThrowsCardProps) {
  const [hoveredST, setHoveredST] = useState<string | null>(null);

  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
        {derivedSavingThrows.map(st => {
          const isProf = st.proficient;
          const shortLabel = st.label.substring(0, 3).toUpperCase();
          const attrMod = modifiers?.[st.attribute] ?? 0;
          const showTooltip = hoveredST === st.attribute && modifiers && proficiencyBonus !== undefined;
          
          return (
            <div
              key={st.attribute}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                position: 'relative',
                height: '36px',
                cursor: 'default',
              }}
              onMouseEnter={() => setHoveredST(st.attribute)}
              onMouseLeave={() => setHoveredST(null)}
            >
              {/* Hexagon Border */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isProf ? '#991b1b' : '#7f1d1d',
                clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)',
                zIndex: 1,
              }} />
              <div style={{
                position: 'absolute',
                inset: '2px',
                background: 'rgba(14, 14, 18, 0.95)',
                clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)',
                zIndex: 2,
              }} />

              {/* Proficiency dot */}
              <div style={{
                position: 'absolute',
                left: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isProf ? '#dc2626' : 'transparent',
                border: isProf ? 'none' : '2px solid rgba(255,255,255,0.2)',
                boxShadow: isProf ? '0 0 8px rgba(220,38,38,0.6)' : 'none',
                zIndex: 5,
              }} />

              <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', padding: '0 14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9' }}>
                  {shortLabel}
                </span>
                <div style={{
                  color: isProf ? '#f87171' : '#e2e8f0',
                  fontSize: '1rem',
                  fontWeight: 900
                }}>
                  {signedMod(st.modifier)}
                </div>
              </div>

              {/* Tooltip */}
              {showTooltip && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(14, 14, 18, 0.97)',
                  border: '1px solid #991b1b',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  zIndex: 100,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                  pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#f1f5f9', fontWeight: 700, marginBottom: '4px' }}>
                    Salvaguarda de {ATTR_LABELS[st.attribute] ?? st.attribute}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    <span style={{ color: '#cbd5e1' }}>Mod {ATTR_LABELS[st.attribute]}</span>
                    {' '}({signedMod(attrMod)})
                    {isProf && (
                      <>
                        {' + '}
                        <span style={{ color: '#dc2626' }}>Proficiência</span>
                        {' '}({signedMod(proficiencyBonus!)})
                      </>
                    )}
                    {' = '}
                    <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{signedMod(st.modifier)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '12px', 
        fontSize: '0.7rem', 
        color: '#64748b', 
        fontStyle: 'italic' 
      }}>
        Modificadores de Testes de Resistência
      </div>
    </div>
  );
}
