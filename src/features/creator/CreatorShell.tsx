import { useEffect, useState, useRef, lazy, Suspense, useCallback } from 'react';
import languagesData from '../../data/languages.json';
import { CREATION_STORAGE_KEY, CREATION_STATE_VERSION } from '../../utils/persistence';
import { useCharacter } from '../../context/CharacterContext';
import { useWizard } from '../../context/WizardContext';
// Lazy imports kept as factories so we can prefetch them on idle / hover
const importClassStep = () => import('../../components/steps/ClassSelectionStep').then(m => ({ default: m.ClassSelectionStep }));
const importBackgroundStep = () => import('../../components/steps/BackgroundStep').then(m => ({ default: m.BackgroundStep }));
const importSpeciesStep = () => import('../../components/steps/SpeciesStep').then(m => ({ default: m.SpeciesStep }));
const importAttrStep = () => import('../../components/steps/AttributesStepWrapper').then(m => ({ default: m.AttributesStepWrapper }));
const importEquipStep = () => import('../../components/steps/EquipmentStepWrapper').then(m => ({ default: m.EquipmentStepWrapper }));
const importSheetStep = () => import('../../components/steps/CharacterSheetStep').then(m => ({ default: m.CharacterSheetStep }));
const ClassSelectionStep = lazy(importClassStep);
const BackgroundStep = lazy(importBackgroundStep);
const SpeciesStep = lazy(importSpeciesStep);
const AttributesStepWrapper = lazy(importAttrStep);
const EquipmentStepWrapper = lazy(importEquipStep);
const CharacterSheetStep = lazy(importSheetStep);
const STEP_IMPORTERS = [importClassStep, importBackgroundStep, importSpeciesStep, importAttrStep, importEquipStep, importSheetStep];
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
import { GlobalProgressBar } from './progress/GlobalProgressBar';
import { applyQuickBuild } from '../../utils/quickBuild';
import { buildRandomCharacter } from '../../utils/randomCharacter';
const ArchetypeQuizModal = lazy(() => import('./quiz/ArchetypeQuizModal').then(m => ({ default: m.ArchetypeQuizModal })));
const OnboardingModal = lazy(() => import('../../components/ui/OnboardingModal').then(m => ({ default: m.OnboardingModal })));
const BuildTemplatesModal = lazy(() => import('./templates/BuildTemplatesModal').then(m => ({ default: m.BuildTemplatesModal })));
import { applyBuildTemplate } from '../../utils/buildTemplate';
import type { BuildTemplate } from '../../data/buildTemplates';
import { queueWrite } from '../../utils/idleStorage';
import { useWhyDidYouRender } from '../../utils/renderDiagnostics';
import { prefetchClassImages } from '../../data/classMetaCache';
import bgData from '../../data/db.json';

export function CreatorShell() {
  const {
    character,
    setCharacter,
    selectedBackground,
    setSelectedBackground,
    attrChoiceMode,
    setAttrChoiceMode,
    attrPlus1,
    setAttrPlus1,
    attrPlus2,
    setAttrPlus2,
    characterLevel,
    derivedSheet,
    playState,
    setPlayState,

    validationResult,
    activeCharacterId,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCharacter();
  const {
    currentStep,

    isPortraitModalOpen,
    setIsPortraitModalOpen,
    sidebarCollapsed,
    summaryCollapsed,
    goToStep,
  } = useWizard();

  useKeyboardShortcuts({ currentStep, goToStep, maxStep: 5, isModalOpen: isPortraitModalOpen });
  useCompletionCelebration(validationResult.isValid);

  useWhyDidYouRender('CreatorShell', { currentStep, character, derivedSheet });

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Prefetch all step chunks on idle so navigation never shows a loader flash
  useEffect(() => {
    const ric: (cb: () => void) => number =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
        ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const id = ric(() => {
      STEP_IMPORTERS.forEach(fn => { void fn(); });
      // Prefetch class hero art + icons so step 1 is instant on hover/selection
      try {
        prefetchClassImages((bgData.classes as Array<{ id: string }>).map(c => c.id));
      } catch { /* noop */ }
    });
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic) cic(id); else window.clearTimeout(id);
    };
  }, []);

  const handlePickTemplate = useCallback((tpl: BuildTemplate) => {
    const result = applyBuildTemplate(tpl, character);
    setCharacter(result.character);
    setSelectedBackground(result.selectedBackground);
    setAttrChoiceMode(result.attrChoiceMode);
    setAttrPlus1(result.attrPlus1);
    setAttrPlus2(result.attrPlus2);
    goToStep(0);
  }, [character, setCharacter, setSelectedBackground, setAttrChoiceMode, setAttrPlus1, setAttrPlus2, goToStep]);

  const handleQuickBuild = useCallback(() => {
    if (!character.characterClass) {
      goToStep(0);
      return;
    }
    const result = applyQuickBuild({ character, selectedBackground });
    setCharacter(result.character);
    if (result.selectedBackground !== selectedBackground) {
      setSelectedBackground(result.selectedBackground);
    }
    if (result.attrChoiceMode) setAttrChoiceMode(result.attrChoiceMode);
    if (result.attrPlus1) setAttrPlus1(result.attrPlus1);
    if (result.attrPlus2) setAttrPlus2(result.attrPlus2);
  }, [character, selectedBackground, setCharacter, setSelectedBackground, setAttrChoiceMode, setAttrPlus1, setAttrPlus2, goToStep]);

  const handleRandomize = useCallback(() => {
    const result = buildRandomCharacter(character);
    setCharacter(result.character);
    setSelectedBackground(result.selectedBackground);
    setAttrChoiceMode(result.attrChoiceMode);
    setAttrPlus1(result.attrPlus1);
    setAttrPlus2(result.attrPlus2);
    goToStep(0);
  }, [character, setCharacter, setSelectedBackground, setAttrChoiceMode, setAttrPlus1, setAttrPlus2, goToStep]);

  const handleQuizPickClass = useCallback((cls: { id: string; name: string; description: string }) => {
    setCharacter((prev) => ({ ...prev, characterClass: cls }));
    goToStep(0);
  }, [setCharacter, goToStep]);
  const isMobile = useMediaQuery('(max-width: 779px)');
  const prevStepRef = useRef(currentStep);
  const slideDirection = currentStep >= prevStepRef.current ? 1 : -1;

  useEffect(() => {
    prevStepRef.current = currentStep;
  }, [currentStep]);

  const handleSwipeLeft = useCallback(() => {
    if (currentStep < 5) goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const handleSwipeRight = useCallback(() => {
    if (currentStep > 0) goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const swipeRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 });
  const [swipeHint, setSwipeHint] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    swipeRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
    setSwipeHint(null);
    setSwipeProgress(0);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - swipeRef.current.startX;
    const dy = e.touches[0].clientY - swipeRef.current.startY;
    if (Math.abs(dx) < 20 || Math.abs(dy) > Math.abs(dx) * 0.7) {
      setSwipeHint(null);
      setSwipeProgress(0);
      return;
    }
    const dir = dx < 0 ? 'left' : 'right';
    const canSwipe = dir === 'left' ? currentStep < 5 : currentStep > 0;
    if (!canSwipe) { setSwipeHint(null); setSwipeProgress(0); return; }
    setSwipeHint(dir);
    setSwipeProgress(Math.min(Math.abs(dx) / 120, 1));
  }, [currentStep]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    setSwipeHint(null);
    setSwipeProgress(0);
    const dx = e.changedTouches[0].clientX - swipeRef.current.startX;
    const dy = e.changedTouches[0].clientY - swipeRef.current.startY;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
    if (dx < 0) handleSwipeLeft();
    else handleSwipeRight();
  }, [handleSwipeLeft, handleSwipeRight]);

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

  // Persistence routed through the idle queue: writes are coalesced, diffed,
  // and flushed in requestIdleCallback so they never block typing/clicking.
  useEffect(() => {
    const payload = {
      version: CREATION_STATE_VERSION,
      character,
      currentStep,
      auxiliaryState: { selectedBackground, attrChoiceMode, attrPlus1, attrPlus2, characterLevel },
      shellState: { sidebarCollapsed, summaryCollapsed },
    };
    queueWrite(CREATION_STORAGE_KEY, payload);

    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setShowSaved(true);
    saveTimerRef.current = setTimeout(() => setShowSaved(false), 1600);
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


  const renderStepContent = () => (
    // Empty fallback prevents the "Carregando..." flash; chunks are prefetched on idle
    <Suspense fallback={<div style={{ minHeight: 320 }} />}>
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
          <GlobalProgressBar onQuickBuild={handleQuickBuild} quickBuildDisabled={!character.characterClass} onOpenQuiz={() => setIsQuizOpen(true)} onRandomize={handleRandomize} onOpenTemplates={() => setIsTemplatesOpen(true)} />
          <div
            className={`${mobileStyles.mobileContent} ${swipeHint === 'left' ? mobileStyles.swipeHintLeft : ''} ${swipeHint === 'right' ? mobileStyles.swipeHintRight : ''}`}
            style={swipeHint ? { '--swipe-progress': swipeProgress } as React.CSSProperties : undefined}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: slideDirection * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection * -60 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
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
          <GlobalProgressBar onQuickBuild={handleQuickBuild} quickBuildDisabled={!character.characterClass} onOpenQuiz={() => setIsQuizOpen(true)} onRandomize={handleRandomize} onOpenTemplates={() => setIsTemplatesOpen(true)} />
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

      {isTemplatesOpen && (
        <Suspense fallback={null}>
          <BuildTemplatesModal
            onClose={() => setIsTemplatesOpen(false)}
            onPick={handlePickTemplate}
          />
        </Suspense>
      )}

      {isQuizOpen && (
        <Suspense fallback={null}>
          <ArchetypeQuizModal
            onClose={() => setIsQuizOpen(false)}
            onPickClass={handleQuizPickClass}
          />
        </Suspense>
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
