import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import languagesData from '../../data/languages.json';
import { CREATION_STORAGE_KEY, CREATION_STATE_VERSION } from '../../utils/persistence';
import { useCharacter } from '../../context/CharacterContext';
import { useWizard } from '../../context/WizardContext';
const ClassSelectionStep = lazy(() => import('../../components/steps/ClassSelectionStep').then(m => ({ default: m.ClassSelectionStep })));
const BackgroundStep = lazy(() => import('../../components/steps/BackgroundStep').then(m => ({ default: m.BackgroundStep })));
const SpeciesStep = lazy(() => import('../../components/steps/SpeciesStep').then(m => ({ default: m.SpeciesStep })));
const AttributesStepWrapper = lazy(() => import('../../components/steps/AttributesStepWrapper').then(m => ({ default: m.AttributesStepWrapper })));
const EquipmentStepWrapper = lazy(() => import('../../components/steps/EquipmentStepWrapper').then(m => ({ default: m.EquipmentStepWrapper })));
const CharacterSheetStep = lazy(() => import('../../components/steps/CharacterSheetStep').then(m => ({ default: m.CharacterSheetStep })));
const PortraitPickerModal = lazy(() => import('./portrait/PortraitPickerModal').then(m => ({ default: m.PortraitPickerModal })));
const CharacterManagerModal = lazy(() => import('./CharacterManagerModal').then(m => ({ default: m.CharacterManagerModal })));
import { listSavedCharacters } from '../../utils/persistence';
import styles from './layout/CreatorShell.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useCompletionCelebration } from '../../hooks/useCompletionCelebration';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ChangeHistoryLogger } from '../../components/ChangeHistoryLogger';
import { MobileTopBar, MobileBottomNav } from './mobile/MobileNavBar';
import mobileStyles from './mobile/MobileNavBar.module.css';
const OnboardingModal = lazy(() => import('../../components/ui/OnboardingModal').then(m => ({ default: m.OnboardingModal })));

export function CreatorShell() {
  const {
    character,
    setCharacter,
    selectedBackground,
    attrChoiceMode,
    attrPlus1,
    attrPlus2,
    characterLevel,
    derivedSheet,
    playState,
    setPlayState,
    handleResetCharacter,
    validationResult,
    activeCharacterId,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCharacter();
  const {
    currentStep,
    setCurrentStep,
    isPortraitModalOpen,
    setIsPortraitModalOpen,
    sidebarCollapsed,
    summaryCollapsed,
    goToStep,
  } = useWizard();

  useKeyboardShortcuts({ currentStep, goToStep, maxStep: 5, isModalOpen: isPortraitModalOpen });
  useCompletionCelebration(validationResult.isValid);
  const isMobile = useMediaQuery('(max-width: 779px)');

  const [isCharacterManagerOpen, setIsCharacterManagerOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstSave = useRef(true);
  const booted = useRef(false);

  // Auto-open Character Manager if no active char, but we have saves
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    if (!activeCharacterId) {
      const saves = listSavedCharacters();
      if (saves.length > 0) {
        setIsCharacterManagerOpen(true);
      }
    }
  }, [activeCharacterId]);

  useEffect(() => {
    localStorage.setItem(CREATION_STORAGE_KEY, JSON.stringify({
      version: CREATION_STATE_VERSION,
      character,
      currentStep,
      auxiliaryState: { selectedBackground, attrChoiceMode, attrPlus1, attrPlus2, characterLevel },
      shellState: { sidebarCollapsed, summaryCollapsed },
    }));

    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setShowSaved(true);
    saveTimerRef.current = setTimeout(() => setShowSaved(false), 2200);
  }, [
    character,
    currentStep,
    selectedBackground,
    attrChoiceMode,
    attrPlus1,
    attrPlus2,
    characterLevel,
    sidebarCollapsed,
    summaryCollapsed,
  ]);

  useEffect(() => {
    if (currentStep === 5 && playState.currentHp === 0 && derivedSheet.maxHP > 0) {
      setPlayState(prev => ({ ...prev, currentHp: derivedSheet.maxHP }));
    }
  }, [currentStep, playState.currentHp, derivedSheet.maxHP, setPlayState]);

  const _handleFullReset = () => {
    handleResetCharacter();
    setCurrentStep(0);
  };

  const renderStepContent = () => (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando etapa...</div>}>
      {currentStep === 0 && <ClassSelectionStep languagesData={languagesData} />}
      {currentStep === 1 && <BackgroundStep />}
      {currentStep === 2 && <SpeciesStep languagesData={languagesData} />}
      {currentStep === 3 && <AttributesStepWrapper />}
      {currentStep === 4 && <EquipmentStepWrapper />}
      {currentStep === 5 && <CharacterSheetStep />}
    </Suspense>
  );

  return (
    <div className={`layout-container ${styles.shellFrame}`}>
      <ChangeHistoryLogger />

      {isMobile ? (
        <>
          <MobileTopBar
            onOpenManager={() => setIsCharacterManagerOpen(true)}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <div className={mobileStyles.mobileContent}>
            {renderStepContent()}
          </div>
          <MobileBottomNav />
        </>
      ) : (
        <>
          <div className={styles.topActions}>
            <button
              onClick={() => setIsCharacterManagerOpen(true)}
              className={styles.savesFab}
              title="Gerenciar Personagens"
            >
              <span className={styles.savesFabIcon}>📚</span>
              Personagens
            </button>
            <button onClick={undo} disabled={!canUndo} className={styles.undoBtn} title="Desfazer (Ctrl+Z)">↩</button>
            <button onClick={redo} disabled={!canRedo} className={styles.undoBtn} title="Refazer (Ctrl+Shift+Z)">↪</button>
          </div>
          {showSaved && <div className="saved-indicator">✓ Progresso salvo</div>}
          <AnimatePresence>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {isPortraitModalOpen && (
        <Suspense fallback={null}>
          <PortraitPickerModal
            currentPortrait={character.portrait}
            onClose={() => setIsPortraitModalOpen(false)}
            onSelect={(portrait) => {
              setCharacter((prev) => ({ ...prev, portrait }));
              setIsPortraitModalOpen(false);
            }}
          />
        </Suspense>
      )}

      {isCharacterManagerOpen && (
        <Suspense fallback={null}>
          <CharacterManagerModal onClose={() => setIsCharacterManagerOpen(false)} />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <OnboardingModal />
      </Suspense>
    </div>
  );
}
