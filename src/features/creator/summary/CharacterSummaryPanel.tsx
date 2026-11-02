import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { useCharacter } from '../../../context/CharacterContext';
import { useWizard } from '../../../context/WizardContext';
import { FANTASY_NAMES } from '../../../data/fantasyNames';
import { HelpTooltip } from '../../../components/ui/HelpTooltip';
import { alignmentsData } from '../../../data/alignmentsData';
import { IdentityFieldsPanel } from './IdentityFieldsPanel';
import { copyTextToClipboard } from '../../../utils/clipboard';
import { buildSummaryCopyText } from '../../../utils/summaryCopy';
import styles from './CharacterSummaryPanel.module.css';
import { useWhyDidYouRender } from '../../../utils/renderDiagnostics';

function CharacterSummaryPanelInner() {
  const { character, setCharacter, selectedBackground, derivedSheet, characterLevel, validationResult } = useCharacter();
  const { setIsPortraitModalOpen } = useWizard();

  useWhyDidYouRender('CharacterSummaryPanel', {
    characterClassId: character.characterClass?.id,
    speciesId: character.species?.id,
    backgroundId: selectedBackground?.id,
    derivedSheet,
    validationResult,
    characterLevel,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const generateAndShow = () => {
    if (suggestionsOpen) {
      setSuggestionsOpen(false);
      return;
    }
    const shuffled = [...FANTASY_NAMES].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 5));
    setSuggestionsOpen(true);
  };

  const pickSuggestion = (name: string) => {
    setCharacter((prev: any) => ({ ...prev, name }));
    setSuggestionsOpen(false);
  };

  const handleCopySummary = async () => {
    const text = buildSummaryCopyText(
      character.characterClass?.name,
      character.species?.name,
      selectedBackground?.name,
      derivedSheet.finalAttributes,
    );
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };


  useEffect(() => {
    if (!suggestionsOpen) return;
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [suggestionsOpen]);

  useEffect(() => {
    if (!suggestionsOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSuggestionsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [suggestionsOpen]);

  // ── Reactive flash detection ───────────────────────────────────────────────
  const prevDerivedRef = useRef<typeof derivedSheet | null>(null);
  const prevClassIdRef = useRef<string | undefined>(undefined);
  const [flashedSections, setFlashedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const prev = prevDerivedRef.current;
    const currClassId = character.characterClass?.id;

    if (prev === null) {
      prevDerivedRef.current = derivedSheet;
      prevClassIdRef.current = currClassId;
      return;
    }

    const changed = new Set<string>();
    if (prev.maxHP !== derivedSheet.maxHP) changed.add('hp');
    if (prev.armorClass !== derivedSheet.armorClass) changed.add('ca');
    if (JSON.stringify(prev.finalAttributes) !== JSON.stringify(derivedSheet.finalAttributes)) {
      changed.add('attributes');
    }
    if (JSON.stringify(prev.skillProficiencies) !== JSON.stringify(derivedSheet.skillProficiencies)) {
      changed.add('skills');
    }
    if (JSON.stringify(prev.languages) !== JSON.stringify(derivedSheet.languages)) {
      changed.add('languages');
    }
    if (prevClassIdRef.current !== currClassId) changed.add('identity');

    prevDerivedRef.current = derivedSheet;
    prevClassIdRef.current = currClassId;

    if (changed.size === 0) return;

    setFlashedSections(changed);
    const t = setTimeout(() => setFlashedSections(new Set()), 1500);
    return () => clearTimeout(t);
  }, [derivedSheet, character.characterClass?.id]);

  // ── Data ──────────────────────────────────────────────────────────────────
  const quickFacts = [
    { label: 'Nível', value: String(characterLevel ?? derivedSheet.level ?? 1), flash: false, tooltip: null },
    { label: 'CA', value: String(derivedSheet.armorClass), flash: flashedSections.has('ca'), tooltip: 'Classe de Armadura: determina a dificuldade de acertar ataques contra você. Baseada em armadura, escudo e modificador de Destreza.' },
    { label: 'PV', value: String(derivedSheet.maxHP), flash: flashedSections.has('hp'), tooltip: 'Pontos de Vida: a quantidade de dano que seu personagem pode receber antes de cair. Baseado no Dado de Vida da classe + modificador de Constituição.' },
  ];

  const coreStats = useMemo(
    () => [
      ['FOR', derivedSheet.finalAttributes.forca],
      ['DES', derivedSheet.finalAttributes.destreza],
      ['CON', derivedSheet.finalAttributes.constituicao],
      ['INT', derivedSheet.finalAttributes.inteligencia],
      ['SAB', derivedSheet.finalAttributes.sabedoria],
      ['CAR', derivedSheet.finalAttributes.carisma],
    ],
    [derivedSheet.finalAttributes],
  );

  const identityFlash = flashedSections.has('identity');
  const attrFlash = flashedSections.has('attributes');

  return (
    <div className={styles.panel}>
      <div className={styles.headerRow}>
        <div className={styles.sectionTitle}>Resumo</div>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={handleCopySummary}
          title="Copiar classe, raça, antecedente e atributos como texto"
          aria-label="Copiar resumo do personagem"
        >
          {copied ? '✓ Copiado' : '⧉ Copiar'}
        </button>
      </div>


      <div className={`${styles.identityCard} ${identityFlash ? styles.flashHighlight : ''}`}>
        <div className={styles.identityHeader}>
          <button
            type="button"
            className={`${styles.identityAvatar} ${character.portrait ? styles.avatarFilled : ''}`.trim()}
            onClick={() => setIsPortraitModalOpen(true)}
            aria-label="Escolher retrato do personagem"
            style={{ cursor: 'pointer', outline: 'none', padding: 0 }}
          >
            {character.portrait
              ? <img src={`/imgs/portrait_caracter/${character.portrait}`} alt="Retrato" className={styles.avatarImg} />
              : <div className={styles.avatarPlaceholder}>+</div>
            }
          </button>

          <div className={styles.identityInfo} style={{ position: 'relative' }}>
            <div className={styles.nameInputRow} ref={suggestionsRef}>
              <input
                type="text"
                className={styles.characterNameInput}
                value={character.name || ''}
                onChange={(e) => setCharacter((prev: any) => ({ ...prev, name: e.target.value }))}
                placeholder="Nome"
                aria-label="Nome do personagem"
              />
              <button
                type="button"
                className={`${styles.suggestBtn} ${suggestionsOpen ? styles.suggestBtnActive : ''}`}
                onClick={generateAndShow}
                title="Sugerir nomes"
              >
                ✦
              </button>
              {suggestionsOpen && (
                <div className={styles.suggestionsDropdown} role="listbox">
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      className={styles.suggestionItem}
                      onClick={() => pickSuggestion(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.identitySubtitle}>
          {[character.species?.name, character.characterClass?.name].filter(Boolean).join(' ') || 'Escolha classe e raça'}
          {selectedBackground?.name ? <span className={styles.identityOrigin}> · {selectedBackground.name}</span> : null}
        </div>
        <select
          className={styles.alignmentSelect}
          value={character.alignment ?? ''}
          onChange={e => setCharacter((prev: any) => ({ ...prev, alignment: e.target.value || null }))}
          aria-label="Alinhamento do personagem"
        >
          <option value="">Alinhamento…</option>
          {alignmentsData.map(a => (
            <option key={a.id} value={a.title}>{a.title}</option>
          ))}
        </select>
      </div>

      <div className={styles.quickFactsGrid}>
        {quickFacts.map((fact) => (
          <SummaryPill key={fact.label} label={fact.label} value={fact.value} flash={fact.flash} tooltip={fact.tooltip} />
        ))}
      </div>

      <div className={`${styles.identityCard} ${attrFlash ? styles.flashHighlight : ''}`}>
        <div className={styles.cardHeader}>
          <div className={styles.identityTitle}>Atributos finais</div>
        </div>
        <div className={styles.attrGrid}>
          {coreStats.map(([label, value]) => (
            <SummaryPill key={label} label={String(label)} value={String(value)} />
          ))}
        </div>
      </div>


      {/* ── Campos de Identidade (colapsáveis) ── */}
      <IdentityFieldsPanel
        character={character}
        onUpdateCharacter={setCharacter}
      />


    </div>
  );
}

const SummaryPill = memo(function SummaryPill({ label, value, flash, tooltip }: { label: string; value: string; flash?: boolean; tooltip?: string | null }) {
  return (
    <div className={`${styles.summaryPillCard} ${flash ? styles.flashHighlight : ''}`}>
      <div className={styles.pillLabelRow}>
        <span className={styles.pillLabel}>{label}</span>
        {tooltip && (
          <HelpTooltip label={label} title={label}>
            {tooltip}
          </HelpTooltip>
        )}
      </div>
      <div className={styles.pillValue}>{value}</div>
    </div>
  );
});

/**
 * Outer memo: the summary reads many fields from CharacterContext, but the
 * provider itself rebuilds a new value object on every state tick. This memo
 * is a no-op against context changes (context updates always flow through),
 * but it short-circuits parent-driven re-renders — i.e., when the wizard
 * shell re-renders for unrelated reasons (currentStep tick, sidebar toggle).
 */
export const CharacterSummaryPanel = memo(CharacterSummaryPanelInner);
