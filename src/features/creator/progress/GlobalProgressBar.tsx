import { useMemo, type ReactNode } from 'react';
import { useCharacter } from '../../../context/CharacterContext';
import { useWizard } from '../../../context/WizardContext';
import { computeWizardProgress } from '../../../utils/wizardProgress';
import styles from './GlobalProgressBar.module.css';

interface Props {
  onQuickBuild?: () => void;
  quickBuildDisabled?: boolean;
  onOpenQuiz?: () => void;
  onRandomize?: () => void;
  onOpenTemplates?: () => void;
  /** Ações fixas à esquerda da barra (personagens, desfazer/refazer). */
  leading?: ReactNode;
}

export function GlobalProgressBar({ onQuickBuild, quickBuildDisabled, onOpenQuiz, onRandomize, onOpenTemplates, leading }: Props) {
  const { character, selectedBackground, validationResult } = useCharacter();
  const { currentStep, goToStep } = useWizard();

  const progress = useMemo(
    () => computeWizardProgress(character, selectedBackground, validationResult),
    [character, selectedBackground, validationResult],
  );

  return (
    <div id="creator-progress-bar" className={styles.bar} role="region" aria-label="Progresso da criação do personagem">
      {leading}
      {/* D&D Beyond: etapas como abas com nome, sem barra de porcentagem */}
      <nav className={styles.tabs} aria-label="Etapas">
        {[...progress.steps, { key: 'sheet', index: 5, label: 'Ficha', completed: false, pending: 0 }].map((step) => {
          const isActive = currentStep === step.index;
          return (
            <button
              key={step.key}
              type="button"
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => goToStep(step.index)}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Ir para ${step.label}`}
              title={step.pending > 0 ? `${step.pending} pendência${step.pending > 1 ? 's' : ''}` : undefined}
            >
              {step.label}
              {step.completed && !isActive ? <span className={styles.tabCheck}>✓</span> : null}
              {step.pending > 0 ? <span className={styles.tabCount}>{step.pending}</span> : null}
            </button>
          );
        })}
      </nav>

      {progress.totalPending > 0 ? (
        <span className={styles.pendingBadge} title="Total de escolhas pendentes">
          ⚠ {progress.totalPending} pendente{progress.totalPending > 1 ? 's' : ''}
        </span>
      ) : (
        <span className={styles.allDone}>✓ Tudo certo</span>
      )}

      {(onOpenTemplates || onOpenQuiz || onRandomize || onQuickBuild) && (
        <details className={styles.shortcuts}>
          <summary className={styles.shortcutsBtn}>Atalhos ▾</summary>
          <div className={styles.shortcutsMenu}>
            {onOpenTemplates && (
              <button type="button" onClick={onOpenTemplates} title="Personagens prontos em 1 clique">
                Personagens prontos
              </button>
            )}
            {onOpenQuiz && (
              <button type="button" onClick={onOpenQuiz} title="Quiz de 4 perguntas que sugere a classe ideal">
                Quiz: qual classe combina comigo?
              </button>
            )}
            {onRandomize && (
              <button type="button" onClick={onRandomize} title="Gera um personagem 100% aleatório válido">
                Personagem aleatório
              </button>
            )}
            {onQuickBuild && (
              <button
                type="button"
                onClick={onQuickBuild}
                disabled={quickBuildDisabled}
                title="Preenche atributos sugeridos, equipamento A e antecedente sinérgico"
              >
                Completar o resto automaticamente
              </button>
            )}
          </div>
        </details>
      )}
    </div>
  );
}
