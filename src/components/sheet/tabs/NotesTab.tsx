import { useState } from 'react';

type CategoryId = 'all' | 'orgs' | 'allies' | 'enemies' | 'backstory' | 'other';

interface NoteEntry {
  id: string;
  text: string;
}

interface CategorizedNotes {
  orgs: NoteEntry[];
  allies: NoteEntry[];
  enemies: NoteEntry[];
  backstory: NoteEntry[];
  other: NoteEntry[];
}

const CATEGORIES: Array<{ id: CategoryId; label: string }> = [
  { id: 'all',       label: 'TODAS' },
  { id: 'orgs',      label: 'ORGS' },
  { id: 'allies',    label: 'ALIADOS' },
  { id: 'enemies',   label: 'INIMIGOS' },
  { id: 'backstory', label: 'BACKSTORY' },
  { id: 'other',     label: 'OUTRO' },
];

const SECTION_LABELS: Record<string, string> = {
  orgs: 'ORGANIZAÇÕES',
  allies: 'ALIADOS',
  enemies: 'INIMIGOS',
  backstory: 'BACKSTORY',
  other: 'OUTRO',
};

function parseLegacyNotes(raw: string): CategorizedNotes {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        orgs: parsed.orgs ?? [],
        allies: parsed.allies ?? [],
        enemies: parsed.enemies ?? [],
        backstory: parsed.backstory ?? [],
        other: parsed.other ?? [],
      };
    }
  } catch { /* not JSON, treat as legacy */ }

  if (raw.trim()) {
    return {
      orgs: [],
      allies: [],
      enemies: [],
      backstory: [],
      other: [{ id: `legacy-${Date.now()}`, text: raw }],
    };
  }
  return { orgs: [], allies: [], enemies: [], backstory: [], other: [] };
}

function serializeNotes(notes: CategorizedNotes): string {
  return JSON.stringify(notes);
}

interface NotesTabProps {
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

export function NotesTab({ notes, onUpdateNotes }: NotesTabProps) {
  const [filter, setFilter] = useState<CategoryId>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const categorized = parseLegacyNotes(notes);

  const update = (newNotes: CategorizedNotes) => {
    onUpdateNotes(serializeNotes(newNotes));
  };

  const addEntry = (category: keyof CategorizedNotes) => {
    const newId = `note-${Date.now()}`;
    update({
      ...categorized,
      [category]: [...categorized[category], { id: newId, text: '' }],
    });
    setEditingId(newId);
    setEditText('');
  };

  const saveEntry = (category: keyof CategorizedNotes, id: string) => {
    if (!editText.trim()) {
      // Remove empty entry
      update({
        ...categorized,
        [category]: categorized[category].filter(e => e.id !== id),
      });
    } else {
      update({
        ...categorized,
        [category]: categorized[category].map(e =>
          e.id === id ? { ...e, text: editText.trim() } : e
        ),
      });
    }
    setEditingId(null);
    setEditText('');
  };

  const removeEntry = (category: keyof CategorizedNotes, id: string) => {
    update({
      ...categorized,
      [category]: categorized[category].filter(e => e.id !== id),
    });
    if (editingId === id) {
      setEditingId(null);
      setEditText('');
    }
  };

  const visibleCategories = filter === 'all'
    ? (['orgs', 'allies', 'enemies', 'backstory', 'other'] as const)
    : [filter as keyof CategorizedNotes];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            style={{
              background: filter === c.id ? '#991b1b' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: filter === c.id ? '#ffffff' : '#94a3b8',
              padding: '4px 8px',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Category sections */}
      {visibleCategories.map(catKey => {
        const entries = categorized[catKey];
        return (
          <div key={catKey}>
            {/* Section header */}
            <div style={{
              fontSize: '0.7rem',
              color: '#dc2626',
              fontWeight: 800,
              letterSpacing: '0.05em',
              paddingBottom: '6px',
              borderBottom: '1px solid rgba(220,38,38,0.3)',
              marginBottom: '8px',
            }}>
              {SECTION_LABELS[catKey]}
            </div>

            {/* Entries */}
            {entries.map(entry => (
              <div key={entry.id} style={{
                padding: '8px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                {editingId === entry.id ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          saveEntry(catKey, entry.id);
                        }
                        if (e.key === 'Escape') {
                          if (!entry.text) removeEntry(catKey, entry.id);
                          else { setEditingId(null); setEditText(''); }
                        }
                      }}
                      rows={3}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '4px',
                        color: '#f1f5f9',
                        fontSize: '0.85rem',
                        padding: '8px 10px',
                        resize: 'vertical',
                        outline: 'none',
                        lineHeight: 1.5,
                      }}
                    />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => saveEntry(catKey, entry.id)}
                        style={{
                          background: 'rgba(153,27,27,0.2)',
                          border: '1px solid rgba(153,27,27,0.4)',
                          borderRadius: '4px',
                          color: '#dc2626',
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => {
                          if (!entry.text) removeEntry(catKey, entry.id);
                          else { setEditingId(null); setEditText(''); }
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '4px',
                          color: '#64748b',
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        flex: 1,
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                        lineHeight: 1.5,
                        cursor: 'pointer',
                        whiteSpace: 'pre-wrap',
                      }}
                      onClick={() => { setEditingId(entry.id); setEditText(entry.text); }}
                    >
                      {entry.text || <span style={{ color: '#475569', fontStyle: 'italic' }}>Clique para editar...</span>}
                    </div>
                    <button
                      onClick={() => removeEntry(catKey, entry.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#475569',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        padding: '2px 4px',
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* Add button */}
            <button
              onClick={() => addEntry(catKey)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px 0',
                textAlign: 'left',
              }}
            >
              + Adicionar {SECTION_LABELS[catKey].charAt(0) + SECTION_LABELS[catKey].slice(1).toLowerCase()}
            </button>
          </div>
        );
      })}
    </div>
  );
}
