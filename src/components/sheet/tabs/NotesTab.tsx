import { useState } from 'react';
import type { CharacterAppearance, PersonalityTraits, CharacterIdentityUpdate } from '../../../types/character';
import styles from './NotesTab.module.css';
import ddb from './ddbTab.module.css';

interface NotesTabProps {
  notes: string;
  onUpdateNotes: (notes: string) => void;
  backstory?: string;
  organizations?: string;
  allies?: string;
  enemies?: string;
  onUpdateAllies?: (value: string) => void;
  onUpdateEnemies?: (value: string) => void;
  onUpdateIdentity?: (update: CharacterIdentityUpdate) => void;
  /** Campos de identidade agora editados na aba Antecedente (mantidos por compatibilidade). */
  appearance?: CharacterAppearance;
  personalityTraits?: PersonalityTraits;
  faith?: string;
  lifestyle?: string;
  alignment?: string | null;
}

export function NotesTab({
  notes,
  onUpdateNotes,
  backstory = '',
  organizations = '',
  allies = '',
  enemies = '',
  onUpdateAllies,
  onUpdateEnemies,
  onUpdateIdentity,
}: NotesTabProps) {
  return (
    <div className={ddb.tab}>
      <NoteSection
        title="ORGANIZAÇÕES"
        addLabel="Adicionar organização"
        value={organizations}
        placeholder="Guildas, ordens, facções…"
        onChange={onUpdateIdentity ? v => onUpdateIdentity({ organizations: v }) : undefined}
      />
      <NoteSection
        title="ALIADOS"
        addLabel="Adicionar aliado"
        value={allies}
        placeholder="Quem está do seu lado…"
        onChange={onUpdateAllies}
      />
      <NoteSection
        title="INIMIGOS"
        addLabel="Adicionar inimigo"
        value={enemies}
        placeholder="Quem quer te ver pelas costas…"
        onChange={onUpdateEnemies}
      />
      <NoteSection
        title="HISTÓRIA"
        addLabel="Adicionar história"
        value={backstory}
        placeholder="A história do seu personagem, de onde vem, o que o motiva…"
        rows={6}
        onChange={onUpdateIdentity ? v => onUpdateIdentity({ backstory: v }) : undefined}
      />
      <NoteSection
        title="OUTROS"
        addLabel="Adicionar anotação"
        value={notes}
        placeholder="Anotações livres sobre sessões, objetivos, etc."
        rows={6}
        onChange={onUpdateNotes}
      />
    </div>
  );
}

function NoteSection({
  title, addLabel, value, placeholder, onChange, rows = 3,
}: {
  title: string;
  addLabel: string;
  value: string;
  placeholder: string;
  onChange?: (value: string) => void;
  rows?: number;
}) {
  const [open, setOpen] = useState(false);
  const showEditor = !!onChange && (open || value.trim().length > 0);

  return (
    <section>
      <div className={ddb.sectionHeader}>{title}</div>
      {showEditor ? (
        <textarea
          className={styles.textarea}
          value={value}
          onChange={e => onChange!(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          autoFocus={open && !value}
        />
      ) : onChange ? (
        <button type="button" className={ddb.addLink} onClick={() => setOpen(true)}>
          + {addLabel}
        </button>
      ) : (
        <div className={value ? ddb.featureDesc : ddb.empty}>{value || '—'}</div>
      )}
    </section>
  );
}
