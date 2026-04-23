import React, { useState, memo, useCallback } from "react";
import speciesData from "../../data/species.json";
import { SpeciesDetails } from "../SpeciesDetails";
import { StepLayout } from "./StepLayout";
import styles from "./StepLayout.module.css";
import { useCharacter } from "../../context/CharacterContext";
import { useWizard } from "../../context/WizardContext";
import { ComparisonModal } from "../ComparisonModal";
import { SmartHints } from "../ui/SmartHints";
import { computeSpeciesHints } from "../../utils/smartHints";
import type languagesDataType from "../../data/languages.json";
import { getSpeciesTheme } from "../../data/speciesThemeColors";
import cardStyles from "./SpeciesCardTrading.module.css";

export interface SpeciesStepProps {
  languagesData: typeof languagesDataType;
}

// ── Memoized species card (mesmo padrão do ClassCard) ──────────────────
interface SpeciesCardProps {
  sp: { id: string; name: string; description?: string };
  isSelected: boolean;
  isCompareTarget: boolean;
  onActivate: (id: string) => void;
  onDetails: (id: string) => void;
}
const SpeciesCard = memo(function SpeciesCard({
  sp, isSelected, isCompareTarget, onActivate, onDetails,
}: SpeciesCardProps) {
  const theme = getSpeciesTheme(sp.id);
  const handleClick = useCallback(() => onActivate(sp.id), [sp.id, onActivate]);
  const handleDetails = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onDetails(sp.id); },
    [sp.id, onDetails],
  );
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${cardStyles.card} ${isSelected ? cardStyles.cardSelected : ""} ${isCompareTarget ? cardStyles.cardCompareTarget : ""}`}
      style={{
        ['--card-glow' as string]: theme.glow,
        ['--banner-color' as string]: theme.banner,
      } as React.CSSProperties}
      aria-label={`Selecionar espécie ${sp.name}`}
    >
      {theme.art ? (
        <img
          src={theme.art}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={cardStyles.art}
        />
      ) : null}
      <div className={cardStyles.scrim} />
      <div className={cardStyles.banner}>{sp.name.charAt(0)}</div>

      <div className={cardStyles.content}>
        <h3 className={cardStyles.title}>{sp.name}</h3>
        {sp.description ? <p className={cardStyles.description}>{sp.description}</p> : null}
      </div>

      <div className={cardStyles.footerRow}>
        <span className={cardStyles.sourceLabel}>Player&apos;s Handbook</span>
        <div className={cardStyles.actions}>
          <button type="button" className={cardStyles.detailsLink} onClick={handleDetails}>
            Detalhes ↗
          </button>
          <button
            type="button"
            className={`${cardStyles.actionBtn} ${isSelected ? cardStyles.actionBtnPrimary : ""}`}
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
          >
            {isSelected ? "✓ Selecionada" : "Selecionar"}
          </button>
        </div>
      </div>
    </button>
  );
});

export const SpeciesStep: React.FC<SpeciesStepProps> = ({ languagesData }) => {
  const {
    character,
    setCharacter,
    handleSelectSpecies,
    validationResult,
  } = useCharacter();

  const { setCurrentStep, setIsPortraitModalOpen } = useWizard();

  const validationErrors = validationResult.byStep.species;
  const canAdvance = validationErrors.length === 0;

  const speciesHints = computeSpeciesHints(character);

  // ── Comparison mode ──
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<[string | null, string | null]>([null, null]);
  const [compareOpen, setCompareOpen] = useState(false);

  const handleCompareClick = (spId: string) => {
    if (!compareMode) return;
    setCompareIds(prev => {
      if (prev[0] === spId) return [null, prev[1]];
      if (prev[1] === spId) return [prev[0], null];
      if (!prev[0]) return [spId, prev[1]];
      if (!prev[1]) {
        setTimeout(() => setCompareOpen(true), 0);
        return [prev[0], spId];
      }
      return [spId, null];
    });
  };

  const buildSpComparison = (spId: string | null) => {
    if (!spId) return null;
    const sp = (speciesData.species as any[]).find((s: any) => s.id === spId);
    if (!sp) return null;
    const traitNames = (sp.racialTraits || []).map((t: any) => t.title).slice(0, 6).join(', ');
    return {
      name: sp.name,
      rows: [
        { label: 'Tipo', value: sp.vitalInfo?.type || '—' },
        { label: 'Tamanho', value: sp.vitalInfo?.size || '—' },
        { label: 'Deslocamento', value: sp.vitalInfo?.speed || '—' },
        { label: 'Traços', value: traitNames || '—' },
        { label: 'Linhagem', value: sp.lineage?.title || '—' },
      ],
    };
  };

  return (
    <StepLayout
      onPrev={() => setCurrentStep(1)}
      onNext={() => setCurrentStep(3)}
      canAdvance={canAdvance}
      characterName={character.name}
      setCharacterName={(n: string) =>
        setCharacter((prev) => ({ ...prev, name: n }))
      }
      portrait={character.portrait}
      onPortraitClick={() => setIsPortraitModalOpen(true)}
      impactSection="species"
    >
      <div className={styles.stepContent}>
        <div className={styles.sectionIntro}>
          <div className={styles.sectionTitleRow}>
            <span className={styles.sectionIcon}>✦</span>
            <span>Escolha sua Espécie: Raça</span>
          </div>
          <p className={styles.sectionDescription}>
            A espécie define traços inatos e escolhas raciais. Selecione uma opção para abrir uma visão mais fluida, com as informações principais e os detalhes específicos lado a lado.
          </p>
        </div>

        <button
          onClick={() => { setCompareMode(m => !m); setCompareIds([null, null]); }}
          style={{
            padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600, borderRadius: '8px', cursor: 'pointer',
            border: compareMode ? '1px solid rgba(212,160,23,0.4)' : '1px solid rgba(255,255,255,0.1)',
            background: compareMode ? 'rgba(212,160,23,0.12)' : 'transparent',
            color: compareMode ? '#d4a017' : '#94a3b8',
            alignSelf: 'flex-start', marginBottom: '4px',
          }}
        >
          {compareMode ? '✕ Sair da comparação' : '⚖ Comparar espécies'}
        </button>

        {speciesHints.length > 0 && <SmartHints hints={speciesHints} />}

        <div className={styles.selectionLayout}>
          <div className={styles.selectionRail} style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {speciesData.species.map((sp: any) => {
              const isSelected = character.species?.id === sp.id;
              const isComparing = compareMode && (compareIds[0] === sp.id || compareIds[1] === sp.id);
              return (
                <button
                  key={sp.id}
                  style={{ minHeight: '44px', padding: '10px 12px' }}
                  type="button"
                  className={`${styles.selectionButton} ${isSelected || isComparing ? styles.selectionButtonActive : ""}`.trim()}
                  onClick={() => {
                    if (compareMode) { handleCompareClick(sp.id); return; }
                    handleSelectSpecies(sp);
                  }}
                >
                  <span className={styles.selectionButtonName}>{sp.name}</span>
                  {isSelected && <span className={styles.selectionButtonMarker}>✓</span>}
                </button>
              );
            })}
          </div>

          <div className={styles.selectionDetails}>
            {character.species ? (
              <SpeciesDetails
                character={character}
                setCharacter={setCharacter}
                species={character.species}
                languagesData={languagesData}
              />
            ) : (
              <div className={`${styles.selectionPlaceholder} ${styles.placeholderPanel}`}>
                <span
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "8px",
                    opacity: 0.5,
                    filter: "grayscale(0.3)",
                  }}
                >
                  👤
                </span>
                <p style={{ margin: "0 0 4px", color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 600 }}>
                  Nenhuma espécie selecionada
                </p>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.5, maxWidth: "28rem" }}>
                  Escolha uma espécie ao lado para ver traços raciais, linhagens e idiomas disponíveis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ComparisonModal
        isOpen={compareOpen}
        onClose={() => { setCompareOpen(false); setCompareIds([null, null]); }}
        title="Comparação de Espécies"
        itemA={buildSpComparison(compareIds[0])}
        itemB={buildSpComparison(compareIds[1])}
      />
    </StepLayout>
  );
};
