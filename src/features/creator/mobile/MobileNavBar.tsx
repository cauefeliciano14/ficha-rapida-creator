import styles from './MobileNavBar.module.css';
import { useWizard } from '../../../context/WizardContext';
import { useCharacter } from '../../../context/CharacterContext';

const STEPS = [
  { label: 'Classe', icon: '⚔️', key: 'class' },
  { label: 'Origem', icon: '📜', key: 'background' },
  { label: 'Espécie', icon: '🧝', key: 'species' },
  { label: 'Atributos', icon: '🎲', key: 'attributes' },
  { label: 'Equip.', icon: '🛡️', key: 'equipment' },
  { label: 'Ficha', icon: '📋', key: 'sheet' },
] as const;

export function MobileTopBar({
  onOpenManager,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  onOpenManager: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const { currentStep } = useWizard();
  const { character, validationResult } = useCharacter();

  const stepsCompleted = STEPS.filter((s, i) => {
    if (i >= 5) return validationResult.isValid;
    const issues = validationResult.byStep[s.key as keyof typeof validationResult.byStep];
    return issues && issues.length === 0 && i < currentStep;
  }).length;

  const progressPercent = Math.round((stepsCompleted / STEPS.length) * 100);

  return (
    <>
      <div className={styles.topBar}>
        {character.portrait ? (
          <img src={character.portrait} alt="" className={styles.topPortrait} />
        ) : (
          <div className={styles.topPortraitPlaceholder}>🧙</div>
        )}
        <div className={styles.topInfo}>
          <div className={styles.topName}>{character.name || 'Novo Personagem'}</div>
          <div className={styles.topStepLabel}>
            {STEPS[currentStep]?.icon} {STEPS[currentStep]?.label} · Etapa {currentStep + 1}/6
          </div>
        </div>
        <div className={styles.topActions}>
          <button onClick={onUndo} disabled={!canUndo} className={styles.topBtn} title="Desfazer">↩</button>
          <button onClick={onRedo} disabled={!canRedo} className={styles.topBtn} title="Refazer">↪</button>
          <button onClick={onOpenManager} className={styles.topBtn} title="Personagens">📚</button>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </>
  );
}

export function MobileBottomNav() {
  const { currentStep, goToStep } = useWizard();
  const { character, selectedBackground, validationResult } = useCharacter();

  const getStepState = (index: number): 'active' | 'done' | 'pending' | 'idle' => {
    if (currentStep === index) return 'active';
    const step = STEPS[index];
    if (!step) return 'idle';

    if (index === 5) return validationResult.isValid ? 'done' : 'idle';

    const key = step.key as keyof typeof validationResult.byStep;
    const issues = validationResult.byStep[key];
    const hasIssues = issues && issues.length > 0;

    if (!hasIssues) {
      if (key === 'class' && character.characterClass) return 'done';
      if (key === 'background' && selectedBackground) return 'done';
      if (key === 'species' && character.species) return 'done';
      if (key === 'attributes' && index < currentStep) return 'done';
      if (key === 'equipment' && index < currentStep) return 'done';
    }

    if (hasIssues && index < currentStep) return 'pending';
    return 'idle';
  };

  const getPendingCount = (index: number): number => {
    if (index === 5) return validationResult.errors.length;
    const key = STEPS[index]?.key as keyof typeof validationResult.byStep;
    return validationResult.byStep[key]?.length ?? 0;
  };

  return (
    <nav className={styles.bottomNav}>
      {STEPS.map((step, index) => {
        const state = getStepState(index);
        const pending = getPendingCount(index);

        return (
          <button
            key={index}
            className={`${styles.navItem} ${state === 'active' ? styles.navItemActive : ''} ${state === 'done' ? styles.navItemDone : ''}`}
            onClick={() => goToStep(index)}
            aria-label={`${step.label} - Etapa ${index + 1}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <span className={styles.navIcon}>
              {state === 'done' ? '✓' : step.icon}
            </span>
            <span className={styles.navLabel}>{step.label}</span>
            {state === 'pending' && pending > 0 && (
              <span className={styles.badge}>{pending}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
