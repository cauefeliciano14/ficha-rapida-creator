import type { CharacterAppearance, CharacterIdentityUpdate, PersonalityTraits } from '../../../types/character';
import styles from './BackgroundTab.module.css';
import ddb from './ddbTab.module.css';

interface BackgroundTabProps {
  backgroundName?: string;
  backgroundDescription?: string;
  backgroundSkills?: string[];
  backgroundTool?: string;
  backgroundEquipment?: string;
  originTalent?: string;
  alignment?: string | null;
  faith?: string;
  lifestyle?: string;
  speciesName?: string;
  appearance?: CharacterAppearance;
  personalityTraits?: PersonalityTraits;
  onUpdateIdentity?: (update: CharacterIdentityUpdate) => void;
}

const ALIGNMENTS = [
  'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
  'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
  'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau',
];

const LIFESTYLES = ['Miserável', 'Pobre', 'Modesto', 'Confortável', 'Rico', 'Aristocrático'];

const APPEARANCE_FIELDS: Array<[keyof CharacterAppearance, string]> = [
  ['height', 'Altura'],
  ['weight', 'Peso'],
  ['eyeColor', 'Olhos'],
  ['hairColor', 'Cabelo'],
  ['skinColor', 'Pele'],
];

const PERSONALITY_FIELDS: Array<[keyof PersonalityTraits, string, string]> = [
  ['traits', 'Traços de personalidade', 'Como você age, fala e se comporta…'],
  ['ideals', 'Ideais', 'O que você acredita e valoriza…'],
  ['bonds', 'Vínculos', 'Com quem ou o que você se importa…'],
  ['flaws', 'Defeitos', 'Suas fraquezas e falhas…'],
];

const EMPTY_APPEARANCE: CharacterAppearance = { height: '', weight: '', eyeColor: '', hairColor: '', skinColor: '' };
const EMPTY_PERSONALITY: PersonalityTraits = { traits: '', ideals: '', bonds: '', flaws: '' };

export function BackgroundTab({
  backgroundName,
  backgroundDescription,
  backgroundSkills,
  backgroundTool,
  backgroundEquipment,
  originTalent,
  alignment = null,
  faith = '',
  lifestyle = '',
  speciesName,
  appearance = EMPTY_APPEARANCE,
  personalityTraits = EMPTY_PERSONALITY,
  onUpdateIdentity,
}: BackgroundTabProps) {
  const canEdit = !!onUpdateIdentity;

  const appearanceSummary = APPEARANCE_FIELDS
    .map(([field, label]) => (appearance[field] ? `${label}: ${appearance[field]}` : null))
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={ddb.tab}>
      {/* Antecedente */}
      <section>
        <div className={ddb.sectionHeader}>ANTECEDENTE</div>
        {backgroundName ? (
          <div className={styles.block}>
            <div className={ddb.featureName}>{backgroundName}</div>
            {backgroundDescription && <div className={ddb.featureDesc}>{backgroundDescription}</div>}
            {backgroundSkills && backgroundSkills.length > 0 && (
              <div className={styles.infoRow}>
                <span className={ddb.charLabel}>Perícias</span>
                <span className={ddb.charValue}>{backgroundSkills.join(', ')}</span>
              </div>
            )}
            {backgroundTool && (
              <div className={styles.infoRow}>
                <span className={ddb.charLabel}>Ferramentas</span>
                <span className={ddb.charValue}>{backgroundTool}</span>
              </div>
            )}
            {backgroundEquipment && (
              <div className={styles.infoRow}>
                <span className={ddb.charLabel}>Equipamento</span>
                <span className={ddb.charValue}>{backgroundEquipment}</span>
              </div>
            )}
            {originTalent && (
              <div className={ddb.nested}>
                <span className={ddb.charLabel}>Talento de origem </span>
                <span className={styles.accent}>{originTalent}</span>
              </div>
            )}
          </div>
        ) : (
          <div className={ddb.empty}>Nenhum antecedente selecionado.</div>
        )}
      </section>

      {/* Características */}
      <section>
        <div className={ddb.sectionHeader}>CARACTERÍSTICAS</div>
        <div className={ddb.charGrid}>
          <div>
            <div className={ddb.charLabel}>Alinhamento</div>
            {canEdit ? (
              <select
                className={styles.input}
                value={alignment ?? ''}
                onChange={e => onUpdateIdentity!({ alignment: e.target.value || null })}
              >
                <option value="">—</option>
                {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            ) : (
              <div className={ddb.charValue}>{alignment || '—'}</div>
            )}
          </div>
          <div>
            <div className={ddb.charLabel}>Fé</div>
            {canEdit ? (
              <input
                className={styles.input}
                value={faith}
                onChange={e => onUpdateIdentity!({ faith: e.target.value })}
                placeholder="—"
              />
            ) : (
              <div className={ddb.charValue}>{faith || '—'}</div>
            )}
          </div>
          <div>
            <div className={ddb.charLabel}>Estilo de vida</div>
            {canEdit ? (
              <select
                className={styles.input}
                value={lifestyle}
                onChange={e => onUpdateIdentity!({ lifestyle: e.target.value })}
              >
                <option value="">—</option>
                {LIFESTYLES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            ) : (
              <div className={ddb.charValue}>{lifestyle || '—'}</div>
            )}
          </div>
          {speciesName && (
            <div>
              <div className={ddb.charLabel}>Raça</div>
              <div className={ddb.charValue}>{speciesName}</div>
            </div>
          )}
          {APPEARANCE_FIELDS.map(([field, label]) => (
            <div key={field}>
              <div className={ddb.charLabel}>{label}</div>
              {canEdit ? (
                <input
                  className={styles.input}
                  value={appearance[field] ?? ''}
                  onChange={e => onUpdateIdentity!({ appearance: { [field]: e.target.value } })}
                  placeholder="—"
                />
              ) : (
                <div className={ddb.charValue}>{appearance[field] || '—'}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Personalidade */}
      {PERSONALITY_FIELDS.map(([field, label, placeholder]) => (
        <section key={field}>
          <div className={ddb.sectionHeader}>{label.toUpperCase()}</div>
          {canEdit ? (
            <textarea
              className={styles.textarea}
              value={personalityTraits[field] ?? ''}
              onChange={e => onUpdateIdentity!({ personalityTraits: { [field]: e.target.value } })}
              placeholder={placeholder}
              rows={2}
            />
          ) : (
            <div className={personalityTraits[field] ? ddb.featureDesc : ddb.empty}>
              {personalityTraits[field] || '—'}
            </div>
          )}
        </section>
      ))}

      {/* Aparência */}
      <section>
        <div className={ddb.sectionHeader}>APARÊNCIA</div>
        <div className={appearanceSummary ? ddb.featureDesc : ddb.empty}>
          {appearanceSummary || 'Preencha altura, peso, olhos, cabelo e pele em Características.'}
        </div>
      </section>
    </div>
  );
}
