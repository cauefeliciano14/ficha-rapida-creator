import { StepHeader } from '../StepHeader';
import { CharacterSummaryPanel } from '../../features/creator/summary/CharacterSummaryPanel';
import { type ChoiceImpactSection } from '../../features/creator/ChoiceImpact';
import { WhyMatters } from '../ui/WhyMatters';
import shellStyles from '../../features/creator/layout/CreatorShell.module.css';
import styles from './StepLayout.module.css';
import { useWizard } from '../../context/WizardContext';

export interface StepLayoutProps {
  onPrev?: () => void;
  onNext: () => void;
  canAdvance: boolean;
  characterName: string;
  setCharacterName: (name: string) => void;
  portrait: string | null;
  onPortraitClick: () => void;
  errors?: string[];
  hrMarginBottom?: string;
  impactSection?: ChoiceImpactSection;
  hideSidebar?: boolean;
  hideSummary?: boolean;
  hideHeader?: boolean;
  isResetMode?: boolean;
  onReset?: () => void;
  children: React.ReactNode;
}

const STEP_LABELS: Record<number, string> = {
  1: 'Classe',
  2: 'Origem',
  3: 'Raça',
  4: 'Atributos',
  5: 'Equipamento',
  6: 'Ficha',
};

export const StepLayout: React.FC<StepLayoutProps> = ({
  onPrev,
  onNext,
  canAdvance,
  characterName,
  setCharacterName,
  portrait,
  onPortraitClick,
  errors,
  hrMarginBottom: _hrMarginBottom,
  impactSection,
  hideSummary,
  hideHeader,
  isResetMode,
  onReset,
  children,
}) => {
  const {
    currentStep,
    summaryCollapsed,
    setSummaryCollapsed,
  } = useWizard();

  const isSheetStep = currentStep === 5;

  const shellClass = [
    shellStyles.shell,
    summaryCollapsed && !isSheetStep ? shellStyles.shellSummaryCollapsed : '',
    isSheetStep ? shellStyles.shellFullSheet : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="step-container" aria-label={STEP_LABELS[currentStep + 1] ?? `Etapa ${currentStep + 1}`}>
      <div className={shellClass}>
        {/* As etapas ficam nas abas da barra superior (estilo D&D Beyond). */}
        <main className={`${shellStyles.main} ${isSheetStep ? shellStyles.mainFullSheet : ''}`}>
          <div className={`${shellStyles.mainInner} ${hideHeader ? styles.mainInnerNoHeader : ''} ${isSheetStep ? styles.mainInnerFullSheet : ''}`}>
            {/* Voltar de etapa já está nas abas e no rodapé; aqui só o "Por que isso importa?". */}
            {!hideHeader && impactSection && (
              <div className={styles.topNav}>
                <span />
                <WhyMatters contextKey={impactSection} variant="link" />
              </div>
            )}
            <div className={styles.content}>{children}</div>
            {/* O que ainda falta, logo acima do Avançar (antes ele só ficava cinza sem explicar). */}
            {!canAdvance && errors && errors.length > 0 && (
              <div className={styles.pendingBox} role="status">
                <div className={styles.pendingTitle}>Para avançar, falta:</div>
                <ul className={styles.pendingList}>
                  {errors.map(e => <li key={e}>{e}</li>)}
                </ul>
              </div>
            )}
            {/* D&D Beyond: navegação no fim da etapa, não no topo */}
            {!hideHeader && (
              <div className={styles.footerNav}>
                <StepHeader
                  onPrev={onPrev}
                  onNext={onNext}
                  canAdvance={canAdvance}
                  characterName={characterName}
                  setCharacterName={setCharacterName}
                  portrait={portrait}
                  onPortraitClick={onPortraitClick}
                  isResetMode={isResetMode}
                  onReset={onReset}
                />
              </div>
            )}
          </div>
        </main>

        {(!hideSummary && !isSheetStep) && (
          <aside
            className={`${shellStyles.summary} ${summaryCollapsed ? shellStyles.summaryCollapsed : ''}`}
          >
            {summaryCollapsed ? (
              <div className={shellStyles.collapsedStrip}>
                <button
                  className={shellStyles.collapsedExpandBtn}
                  onClick={() => setSummaryCollapsed(false)}
                  title="Expandir resumo"
                  aria-label="Expandir painel de resumo"
                >
                  ‹
                </button>
              </div>
            ) : (
              <>
                <button
                  className={shellStyles.collapseToggle}
                  onClick={() => setSummaryCollapsed(true)}
                  title="Recolher resumo"
                  aria-label="Recolher painel de resumo"
                >
                  ›
                </button>
                <CharacterSummaryPanel />
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};
