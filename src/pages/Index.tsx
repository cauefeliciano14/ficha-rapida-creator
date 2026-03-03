import { Suspense, useEffect, useRef, type LazyExoticComponent, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CatalogGate } from "@/components/CatalogGate";
import { useEnterToNextStep } from "@/hooks/useEnterToNextStep";
import { useBuilderStore, type StepId } from "@/state/builderStore";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { races } from "@/data/races";
import { validateCatalog } from "@/utils/validateCatalog";
import { lazyWithRetry } from "@/utils/lazyWithRetry";
import { Loader2 } from "lucide-react";
import { BuilderShell } from "@/components/layout/BuilderShell";
import { DashboardShell } from "@/components/layout/DashboardShell";

const catalogResult = validateCatalog({
  classIds: classes.map((c) => c.id),
  backgroundIds: backgrounds.map((b) => b.id),
  raceIds: races.map((r) => r.id),
});

if (!catalogResult.valid) {
  console.error("❌ Catálogo incompleto:", catalogResult.issues);
}

const StepClass = lazyWithRetry(
  () => import("@/components/steps/StepClass").then((m) => ({ default: m.StepClass })),
  "StepClass",
);
const StepBackground = lazyWithRetry(
  () => import("@/components/steps/StepBackground").then((m) => ({ default: m.StepBackground })),
  "StepBackground",
);
const StepRace = lazyWithRetry(
  () => import("@/components/steps/StepRace").then((m) => ({ default: m.StepRace })),
  "StepRace",
);
const StepAbilityMethod = lazyWithRetry(
  () => import("@/components/steps/StepAbilityMethod").then((m) => ({ default: m.StepAbilityMethod })),
  "StepAbilityMethod",
);
const StepEquipment = lazyWithRetry(
  () => import("@/components/steps/StepEquipment").then((m) => ({ default: m.StepEquipment })),
  "StepEquipment",
);
const StepChoices = lazyWithRetry(
  () => import("@/components/steps/StepChoices").then((m) => ({ default: m.StepChoices })),
  "StepChoices",
);
const StepSheet = lazyWithRetry(
  () => import("@/components/steps/StepSheet").then((m) => ({ default: m.StepSheet })),
  "StepSheet",
);

const STEP_COMPONENTS: Record<StepId, LazyExoticComponent<ComponentType>> = {
  class: StepClass,
  origin: StepBackground,
  race: StepRace,
  abilities: StepAbilityMethod,
  equipment: StepEquipment,
  choices: StepChoices,
  sheet: StepSheet,
};

function StepFallback() {
  return (
    <div className="flex items-center justify-center h-64 animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-gold/60" />
        <p className="text-xs text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

function BuilderContent() {
  const currentStep = useBuilderStore((s) => s.currentStep);
  const completedSteps = useBuilderStore((s) => s.completedSteps);
  const requiredMissing = useBuilderStore((s) => s.requiredMissing);
  const nextStep = useBuilderStore((s) => s.nextStep);
  const goToStep = useBuilderStore((s) => s.goToStep);
  const getVisibleSteps = useBuilderStore((s) => s.getVisibleSteps);

  const visibleSteps = getVisibleSteps();
  const fallbackStep = visibleSteps[0]?.id ?? "class";
  const isKnownStep = currentStep in STEP_COMPONENTS;
  const isVisibleStep = visibleSteps.some((step) => step.id === currentStep);
  const validStep = isKnownStep && isVisibleStep ? currentStep : fallbackStep;

  useEffect(() => {
    if (validStep !== currentStep) {
      goToStep(validStep as StepId);
    }
  }, [currentStep, validStep, goToStep]);

  const currentIdx = visibleSteps.findIndex((s) => s.id === validStep);
  const previousIdxRef = useRef(currentIdx);
  const navigationDirection = currentIdx >= previousIdxRef.current ? 1 : -1;

  useEffect(() => {
    previousIdxRef.current = currentIdx;
  }, [currentIdx]);

  const isLast = currentIdx >= visibleSteps.length - 1;
  const currentMissing = requiredMissing[validStep] ?? [];
  const isCurrentComplete = completedSteps.includes(validStep);
  const canNext = isCurrentComplete && currentMissing.length === 0;

  const StepComponent = STEP_COMPONENTS[validStep];
  const activeStepContainerRef = useRef<HTMLDivElement>(null);

  useEnterToNextStep({
    canGoNext: canNext && !isLast,
    goNext: nextStep,
    containerRef: activeStepContainerRef,
  });

  useEffect(() => {
    const scroller = document.querySelector("[data-step-scroll='true']") as HTMLElement | null;
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      const headerTitle = document.querySelector("[data-step-header-title]") as HTMLElement | null;
      if (headerTitle) headerTitle.focus();
    }, 300);
  }, [currentStep, validStep]);

  return (
    <BuilderShell>
      <DashboardShell
        validStep={validStep}
        visibleSteps={visibleSteps}
        completedSteps={completedSteps}
        goToStep={goToStep}
        currentMissing={currentMissing}
        canNext={canNext}
        isLast={isLast}
        activeStepContainerRef={activeStepContainerRef}
      >
        <AnimatePresence initial={false} mode="wait" custom={navigationDirection}>
          <motion.div
            key={validStep}
            custom={navigationDirection}
            initial={{ opacity: 0, x: navigationDirection > 0 ? 24 : -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: navigationDirection > 0 ? -24 : 24, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<StepFallback />}>
              <StepComponent />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </DashboardShell>
    </BuilderShell>
  );
}

const Index = () => {
  return (
    <CatalogGate issues={catalogResult.issues}>
      <BuilderContent />
    </CatalogGate>
  );
};

export default Index;
