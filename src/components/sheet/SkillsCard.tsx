import { useState } from 'react';
import type { DerivedSkill } from '../../rules/types/DerivedSheet';

const ATTR_ABBR: Record<string, string> = {
  forca: 'FOR', destreza: 'DES', constituicao: 'CON',
  inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR',
};

const ATTR_LABELS: Record<string, string> = {
  forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição',
  inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma',
};

function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

interface SkillsCardProps {
  skills: DerivedSkill[];
  modifiers?: Record<string, number>;
  proficiencyBonus?: number;
  onRoll?: (label: string, type: string, modifier: number) => void;
}

export function SkillsCard({ skills, modifiers, proficiencyBonus, onRoll }: SkillsCardProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        
        {/* Helper Header Line */}
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px', paddingRight: '12px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '0.6rem', color: '#94a3b8', width: '30px', letterSpacing: '0.05em', fontWeight: 800 }}>PROF</span>
          <span style={{ fontSize: '0.6rem', color: '#94a3b8', width: '36px', letterSpacing: '0.05em', fontWeight: 800 }}>MOD</span>
          <span style={{ fontSize: '0.6rem', color: '#94a3b8', flex: 1, letterSpacing: '0.05em', fontWeight: 800 }}>PERÍCIA</span>
          <span style={{ fontSize: '0.6rem', color: '#94a3b8', width: '44px', textAlign: 'center', letterSpacing: '0.05em', fontWeight: 800 }}>BÔNUS</span>
        </div>

        {skills.map(skill => {
          const attrMod = modifiers?.[skill.attribute] ?? 0;
          const showTooltip = hoveredSkill === skill.label && modifiers && proficiencyBonus !== undefined;

          return (
            <div
              key={skill.label}
              onClick={() => onRoll?.(skill.label, `${ATTR_ABBR[skill.attribute] ?? ''} CHECK`, skill.modifier)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '3px 8px',
                background: hoveredSkill === skill.label ? 'rgba(255,255,255,0.03)' : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                position: 'relative',
                cursor: onRoll ? 'pointer' : 'default',
              }}
              onMouseEnter={() => setHoveredSkill(skill.label)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              
              {/* Prof Circle */}
              <div style={{ width: '30px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: skill.proficient ? 'none' : '2px solid rgba(255,255,255,0.2)',
                  background: skill.proficient ? '#dc2626' : 'transparent',
                  boxShadow: skill.proficient ? '0 0 8px rgba(220, 38, 38, 0.6)' : 'none',
                }} />
              </div>
              
              {/* Attribute Base (gray) */}
              <span style={{ fontSize: '0.7rem', color: '#64748b', width: '36px', fontWeight: 800 }}>
                {ATTR_ABBR[skill.attribute] ?? skill.attribute}
              </span>
              
              {/* Skill Name */}
              <span style={{ fontSize: '0.82rem', color: '#e2e8f0', flex: 1, fontWeight: skill.proficient ? 700 : 500 }}>
                {skill.label}
              </span>
              
              {/* Bonus Box */}
              <div style={{
                width: '44px',
                border: '1px solid #7f1d1d',
                borderRadius: '4px',
                background: 'rgba(0,0,0,0.6)',
                textAlign: 'center',
                padding: '3px 0',
                fontSize: '0.9rem',
                fontWeight: 900,
                color: '#f1f5f9'
              }}>
                {signedMod(skill.modifier)}
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
                    {skill.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    <span style={{ color: '#cbd5e1' }}>{ATTR_LABELS[skill.attribute] ?? skill.attribute}</span>
                    {' '}({signedMod(attrMod)})
                    {skill.proficient && (
                      <>
                        {' + '}
                        <span style={{ color: '#dc2626' }}>Proficiência</span>
                        {' '}({signedMod(proficiencyBonus!)})
                      </>
                    )}
                    {' = '}
                    <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{signedMod(skill.modifier)}</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '4px' }}>
                    🎲 Clique para rolar
                  </div>
                </div>
              )}
              
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '12px', 
          fontSize: '0.7rem', 
          color: '#64748b',
          fontStyle: 'italic',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '8px',
        }}>
          Perícias Adicionais
        </div>
      </div>
    </div>
  );
}
