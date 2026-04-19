import { useMemo } from 'react';
import { useCharacter } from '../../../context/CharacterContext';
import { useWizard } from '../../../context/WizardContext';
import { computeWizardProgress } from '../../../utils/wizardProgress';
import styles from './GlobalProgressBar.module.css';

interface Props {
  onQuickBuild?: () => void;
  quickBuildDisabled?: boolean;
}

const STEP_ABBR = ['Cl', 'Or', 'Es', 'At', 'Eq'];

export function GlobalProgressBar({ onQuickBuild, quickBuildDisabled }: Props) {
  const { character, selectedBackground, validationResult } = useCharacter();
  const { currentStep, goToStep } = useWizard();

  const progress = useMemo(
    () => computeWizardProgress(character, selectedBackground, validationResult),
    [character, selectedBackground, validationResult],
  );

  const isComplete = progress.percent === 100;

  return (
    <div className={styles.bar} role="region" aria-label="Progresso da criação do personagem">
      <div className={styles.percentBlock}>
        <span className={styles.percentValue}>{progress.percent}%</span>
        <span className={styles.percentLabel}>completo</span>
      </div>

      <div className={styles.track} role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`${styles.fill} ${isComplete ? styles.fillComplete : ''}`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className={styles.steps}>
        {progress.steps.map((step, i) => {
          const isActive = currentStep === step.index;
          const dotClass = isActive
            ? styles.dotActive
            : step.completed
              ? styles.dotComplete
              : step.pending > 0
                ? styles.dotPending
                : '';
          return (
            <button
              key={step.key}
              type="button"
              className={`${styles.dot} ${dotClass}`}
              onClick={() => goToStep(step.index)}
              title={`${step.label}${step.pending > 0 ? ` — ${step.pending} pendência${step.pending > 1 ? 's' : ''}` : step.completed ? ' — completo' : ''}`}
              aria-label={`Ir para ${step.label}`}
            >
              {step.completed ? '✓' : step.pending > 0 ? step.pending : STEP_ABBR[i]}
            </button>
          );
        })}
      </div>

      {progress.totalPending > 0 ? (
        <span className={styles.pendingBadge} title="Total de escolhas pendentes">
          ⚠ {progress.totalPending} pendente{progress.totalPending > 1 ? 's' : ''}
        </span>
      ) : (
        <span className={styles.allDone}>✓ Tudo certo</span>
      )}

      {onQuickBuild && (
        <button
          type="button"
          className={styles.quickBuildBtn}
          onClick={onQuickBuild}
          disabled={quickBuildDisabled}
          title="Preenche atributos sugeridos, equipamento A e antecedente sinérgico"
        >
          ⚡ Quick Build
        </button>
      )}
    </div>
  );
}
