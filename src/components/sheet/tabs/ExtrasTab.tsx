import { useState } from 'react';
import type { CharacterPlayState, CustomCounter } from '../../../types/playState';
import { getDefaultClassCounters } from '../../../data/classResources';
import styles from './ExtrasTab.module.css';

interface ExtrasTabProps {
  extras: string;
  onUpdateExtras: (extras: string) => void;
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  classId?: string;
  characterLevel?: number;
}

const RESET_LABELS: Record<CustomCounter['resetOn'], string> = {
  short: 'Desc. Curto',
  long: 'Desc. Longo',
  manual: 'Manual',
};

type EmojiCategoryKey = 'recent' | 'all' | 'combate' | 'magia' | 'natureza' | 'status' | 'objetos';

const EMOJI_CATEGORIES: Record<Exclude<EmojiCategoryKey, 'all' | 'recent'>, { label: string; emojis: { e: string; kw: string }[] }> = {
  combate: {
    label: 'Combate',
    emojis: [
      { e: '⚔️', kw: 'espadas ataque combate' },
      { e: '🗡️', kw: 'adaga punhal furtivo' },
      { e: '🛡️', kw: 'escudo defesa proteção' },
      { e: '🏹', kw: 'arco flecha distância' },
      { e: '🪓', kw: 'machado barbaro' },
      { e: '🔱', kw: 'tridente lança' },
      { e: '💥', kw: 'explosão crítico impacto' },
      { e: '🎯', kw: 'alvo mira precisão' },
      { e: '🥊', kw: 'soco desarmado monge' },
      { e: '🩸', kw: 'sangue ferida frenesi' },
      { e: '💀', kw: 'morte caveira veneno' },
      { e: '🎲', kw: 'dado superioridade manobra' },
    ],
  },
  magia: {
    label: 'Magia',
    emojis: [
      { e: '✨', kw: 'magia faísca cantrip' },
      { e: '🪄', kw: 'varinha magico' },
      { e: '🔮', kw: 'orbe adivinhação cristal' },
      { e: '🌀', kw: 'portal teleporte vento' },
      { e: '🔥', kw: 'fogo chama bola fúria' },
      { e: '⚡', kw: 'raio relâmpago canalizar' },
      { e: '❄️', kw: 'gelo frio cone' },
      { e: '☀️', kw: 'sol luz radiante paladino' },
      { e: '🌙', kw: 'lua druida sombra' },
      { e: '⭐', kw: 'estrela celestial' },
      { e: '💫', kw: 'tonteira encantamento' },
      { e: '🌈', kw: 'arco iris prismático' },
      { e: '☁️', kw: 'nuvem nevoa' },
      { e: '💧', kw: 'gota agua ki' },
    ],
  },
  natureza: {
    label: 'Natureza',
    emojis: [
      { e: '🌿', kw: 'erva planta druida' },
      { e: '🍃', kw: 'folha vento' },
      { e: '🌳', kw: 'arvore floresta' },
      { e: '🌸', kw: 'flor primavera' },
      { e: '🐺', kw: 'lobo transformação selvagem' },
      { e: '🐻', kw: 'urso fera' },
      { e: '🦅', kw: 'aguia voo familiar' },
      { e: '🐍', kw: 'cobra veneno' },
      { e: '🕷️', kw: 'aranha teia' },
      { e: '🦂', kw: 'escorpião veneno' },
      { e: '🌊', kw: 'onda mar agua' },
      { e: '⛰️', kw: 'montanha terra' },
    ],
  },
  status: {
    label: 'Status',
    emojis: [
      { e: '❤️', kw: 'coração vida pv hp' },
      { e: '💚', kw: 'cura bencao verde' },
      { e: '💙', kw: 'azul mana' },
      { e: '💛', kw: 'amarelo inspiração' },
      { e: '⏳', kw: 'tempo ampulheta concentração' },
      { e: '🕐', kw: 'relógio rodada turno' },
      { e: '😴', kw: 'sono descanso' },
      { e: '👁️', kw: 'olho percepção visão' },
      { e: '🎭', kw: 'mascara enganação ator' },
      { e: '🎵', kw: 'música bardo inspiração' },
      { e: '🦶', kw: 'pe deslocamento movimento' },
      { e: '🧠', kw: 'mente psíquico int' },
    ],
  },
  objetos: {
    label: 'Objetos',
    emojis: [
      { e: '⚙️', kw: 'engrenagem geral padrão' },
      { e: '🧪', kw: 'poção alquimia' },
      { e: '🍶', kw: 'frasco veneno oleo' },
      { e: '📜', kw: 'pergaminho rolo magia' },
      { e: '📖', kw: 'livro grimório mago' },
      { e: '🔑', kw: 'chave abrir' },
      { e: '🗝️', kw: 'chave antiga segredo' },
      { e: '🎒', kw: 'mochila inventário' },
      { e: '💰', kw: 'moeda ouro tesouro' },
      { e: '💎', kw: 'gema joia' },
      { e: '🕯️', kw: 'vela luz tocha' },
      { e: '🔔', kw: 'sino alarme' },
    ],
  },
};

const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flatMap(c => c.emojis);

function normalizeText(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function ExtrasTab({ extras, onUpdateExtras, playState, onUpdatePlayState, classId, characterLevel = 1 }: ExtrasTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formMax, setFormMax] = useState('1');
  const [formReset, setFormReset] = useState<CustomCounter['resetOn']>('long');
  const [formIcon, setFormIcon] = useState<string>('⚙️');
  const [emojiCategory, setEmojiCategory] = useState<EmojiCategoryKey>('all');
  const [emojiQuery, setEmojiQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('emoji-recent');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.slice(0, 8) : [];
    } catch { return []; }
  });

  const pushRecentEmoji = (emoji: string) => {
    setRecentEmojis(prev => {
      const next = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 8);
      try { localStorage.setItem('emoji-recent', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const filteredEmojis = (() => {
    if (emojiCategory === 'recent') {
      return recentEmojis.map(e => {
        const found = ALL_EMOJIS.find(x => x.e === e);
        return found ?? { e, kw: e };
      });
    }
    const pool = emojiCategory === 'all'
      ? ALL_EMOJIS
      : EMOJI_CATEGORIES[emojiCategory].emojis;
    const q = normalizeText(emojiQuery);
    if (!q) return pool;
    return pool.filter(x => normalizeText(x.kw).includes(q) || x.e.includes(emojiQuery));
  })();

  const allCounters = playState.customCounters ?? [];

  const defaultCounters = classId ? getDefaultClassCounters(classId, characterLevel) : [];
  const classIds = new Set(defaultCounters.map(d => d.id));

  // Class-derived counters render in the dedicated ClassResourcesCard;
  // here we only show user-created custom counters.
  const counters = allCounters.filter(c => !classIds.has(c.id));

  const handleAddClassResources = () => {
    // kept for backward compatibility but no longer surfaced in UI
    const missing = defaultCounters.filter(d => !allCounters.some(c => c.id === d.id));
    if (missing.length === 0) return;
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: [...(prev.customCounters ?? []), ...missing],
    }));
  };
  void handleAddClassResources;
  const missingDefaults: typeof defaultCounters = [];

  const handleAddCounter = () => {
    if (!formName.trim()) return;
    const max = Math.max(1, parseInt(formMax, 10) || 1);
    const newCounter: CustomCounter = {
      id: `ctr-${Date.now()}`,
      name: formName.trim(),
      current: max,
      max,
      resetOn: formReset,
      icon: formIcon,
    };
    onUpdatePlayState(prev => ({ ...prev, customCounters: [...(prev.customCounters ?? []), newCounter] }));
    setFormName(''); setFormMax('1'); setFormIcon('⚙️'); setShowForm(false);
  };

  const updateCounter = (id: string, delta: number) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: (prev.customCounters ?? []).map(c =>
        c.id === id ? { ...c, current: Math.max(0, Math.min(c.max, c.current + delta)) } : c
      ),
    }));
  };

  const removeCounter = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: (prev.customCounters ?? []).filter(c => c.id !== id),
    }));
  };

  const resetCounter = (id: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      customCounters: (prev.customCounters ?? []).map(c =>
        c.id === id ? { ...c, current: c.max } : c
      ),
    }));
  };

  return (
    <div className={styles.container}>

      {/* ── Contadores Personalizados (Class resources viewable on main sheet card) ── */}
      <div className={styles.sectionTitle}>CONTADORES PERSONALIZADOS</div>
      <div className={styles.hint}>
        Recursos da sua classe aparecem no card lateral da ficha. Aqui você pode criar contadores extras (poções, cargas de itens etc.).
      </div>

      {counters.length > 0 && (
        <div className={styles.counterList}>
          {counters.map(ctr => {
            const used = ctr.max - ctr.current;
            return (
              <div key={ctr.id} className={styles.counterCard}>
                <div className={styles.counterTop}>
                  {ctr.icon && <span aria-hidden style={{ fontSize: '1rem', lineHeight: 1 }}>{ctr.icon}</span>}
                  <span className={styles.counterName}>{ctr.name}</span>
                  <span className={styles.counterReset}>{RESET_LABELS[ctr.resetOn]}</span>
                  <span className={styles.counterValue}>
                    {ctr.current}<span className={styles.counterMax}>/{ctr.max}</span>
                  </span>
                  <button onClick={() => resetCounter(ctr.id)} className={styles.counterResetBtn} title="Restaurar">↺</button>
                  <button onClick={() => removeCounter(ctr.id)} className={styles.counterRemoveBtn} title="Remover">✕</button>
                </div>
                <div className={styles.checkboxGroup} role="group" aria-label={ctr.name}>
                  {Array.from({ length: ctr.max }, (_, i) => {
                    const isAvailable = i < ctr.current;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`${styles.slotBox} ${isAvailable ? styles.slotAvailable : styles.slotSpent}`}
                        onClick={() => {
                          if (isAvailable) updateCounter(ctr.id, -(ctr.current - i));
                          else updateCounter(ctr.id, (i - ctr.current + 1));
                        }}
                        title={isAvailable ? 'Disponível — clique para gastar' : 'Gasto — clique para restaurar'}
                        aria-pressed={isAvailable}
                      >
                        {!isAvailable && <span className={styles.slotMark}>✕</span>}
                      </button>
                    );
                  })}
                </div>
                {used > 0 && (
                  <div className={styles.counterFooter}>
                    <span className={styles.usedLabel}>{used} usado{used > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {missingDefaults.length > 0 && !showForm && (
        <button onClick={handleAddClassResources} className={styles.addClassBtn}>
          ⚔ Adicionar recursos de {classId} (nível {characterLevel})
        </button>
      )}

      {showForm ? (
        <div className={styles.counterForm}>
          <input
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="Nome do recurso (ex: Poções, Cargas)"
            className={styles.formInput}
          />
          <div className={styles.iconPickerLabel}>Ícone</div>
          <div className={styles.emojiToolbar}>
            <input
              type="search"
              value={emojiQuery}
              onChange={e => setEmojiQuery(e.target.value)}
              placeholder="Buscar ícone (ex: fogo, cura, dado)"
              className={styles.emojiSearch}
              aria-label="Buscar ícone"
            />
            <div className={styles.emojiTabs} role="tablist" aria-label="Categorias de ícones">
              {(['all', 'combate', 'magia', 'natureza', 'status', 'objetos'] as EmojiCategoryKey[]).map(key => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={emojiCategory === key}
                  onClick={() => setEmojiCategory(key)}
                  className={`${styles.emojiTab} ${emojiCategory === key ? styles.emojiTabActive : ''}`}
                >
                  {key === 'all' ? 'Todos' : EMOJI_CATEGORIES[key].label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.iconPicker} role="radiogroup" aria-label="Escolher ícone">
            {filteredEmojis.length === 0 ? (
              <span className={styles.emojiEmpty}>Nenhum ícone encontrado.</span>
            ) : filteredEmojis.map(({ e: emoji, kw }) => (
              <button
                key={emoji}
                type="button"
                role="radio"
                aria-checked={formIcon === emoji}
                onClick={() => setFormIcon(emoji)}
                className={`${styles.iconPickerBtn} ${formIcon === emoji ? styles.iconPickerBtnActive : ''}`}
                title={kw}
              >{emoji}</button>
            ))}
          </div>
          <div className={styles.formRow}>
            <input
              type="number"
              min="1"
              value={formMax}
              onChange={e => setFormMax(e.target.value)}
              placeholder="Máximo"
              className={styles.formInput}
              style={{ flex: 1 }}
            />
            <select
              value={formReset}
              onChange={e => setFormReset(e.target.value as CustomCounter['resetOn'])}
              className={styles.formSelect}
              style={{ flex: 1 }}
            >
              <option value="long">Desc. Longo</option>
              <option value="short">Desc. Curto</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button onClick={handleAddCounter} disabled={!formName.trim()} className={styles.formSubmitBtn}>
              Adicionar
            </button>
            <button onClick={() => setShowForm(false)} className={styles.formCancelBtn}>Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className={styles.addBtn}>
          ＋ Novo Contador
        </button>
      )}

      {/* ── Notas Extras ── */}
      <div className={styles.sectionTitle} style={{ marginTop: '16px' }}>NOTAS EXTRAS</div>
      <div className={styles.hint}>
        Companions, condições especiais, informações de sessão, etc.
      </div>
      <textarea
        value={extras}
        onChange={e => onUpdateExtras(e.target.value)}
        placeholder="Extras, companions…"
        className={styles.textarea}
      />
    </div>
  );
}
