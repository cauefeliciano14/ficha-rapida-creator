import { Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { IdentityHeader } from "@/components/IdentityHeader";
import { SidebarSteps } from "@/components/SidebarSteps";
import { SummaryPanel } from "@/components/SummaryPanel";
import { CatalogGate } from "@/components/CatalogGate";
import { StepHeader } from "@/components/StepHeader";
import { useEnterToNextStep } from "@/hooks/useEnterToNextStep";
import { useBuilderStore, type StepId } from "@/state/builderStore";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { races } from "@/data/races";
import { validateCatalog } from "@/utils/validateCatalog";
import { getDevAuditStatus } from "@/utils/validateData";
import { lazyWithRetry } from "@/utils/lazyWithRetry";
import { ListChecks, Loader2, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ── Catalog validation (computed once at module load) ──
const catalogResult = validateCatalog({
  classIds: classes.map((c) => c.id),
  backgroundIds: backgrounds.map((b) => b.id),
  raceIds: races.map((r) => r.id),
});

if (!catalogResult.valid) {
  console.error("❌ Catálogo incompleto:", catalogResult.issues);
}

// ── Lazy-loaded step components ──
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

const STEP_COMPONENTS: Record<StepId, React.LazyExoticComponent<React.ComponentType>> = {
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
    <div className="flex min-h-screen flex-col bg-background">
      {import.meta.env.DEV && getDevAuditStatus().totalErrors > 0 && (
        <div className="bg-destructive text-destructive-foreground text-xs px-4 py-1.5 text-center rounded-b-xl mx-auto max-w-md">
          DEV: {getDevAuditStatus().totalErrors} erro(s) de dados
        </div>
      )}
      <Header />
      <IdentityHeader />
      <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <SidebarSteps />
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Mobile step/summary toggles */}
          <div className="border-b border-border/30 md:hidden" style={{ background: "hsl(var(--card) / 0.85)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center justify-between gap-2 px-3 py-2.5">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-9 text-xs border-border/30 hover:border-gold/20 hover:bg-secondary/40 rounded-xl transition-all duration-300"
                  >
                    <ListChecks className="h-3.5 w-3.5 text-gold/60" />
                    Etapas
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] max-w-sm p-0 rounded-r-3xl">
                  <SheetHeader className="border-b px-4 py-3.5 text-left" style={{ borderColor: "hsl(var(--gold) / 0.08)" }}>
                    <SheetTitle className="text-base font-display text-gold">Etapas</SheetTitle>
                  </SheetHeader>
                  <SidebarSteps />
                </SheetContent>
              </Sheet>

              {/* Mobile step indicator */}
              <div className="flex items-center gap-2 flex-1 justify-center">
                {visibleSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`rounded-full transition-all duration-300 ${
                      step.id === validStep
                        ? "h-2.5 w-7 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                        : completedSteps.includes(step.id)
                        ? "h-2.5 w-2.5 bg-success/60"
                        : "h-2 w-2 bg-border/40"
                    }`}
                    aria-label={`Etapa ${step.num}`}
                  />
                ))}
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-9 text-xs border-border/30 hover:border-gold/20 hover:bg-secondary/40 rounded-xl transition-all duration-300"
                  >
                    <PanelRight className="h-3.5 w-3.5 text-gold/60" />
                    Resumo
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] max-w-md p-0 rounded-l-3xl">
                  <SheetHeader className="border-b px-4 py-3.5 text-left" style={{ borderColor: "hsl(var(--gold) / 0.08)" }}>
                    <SheetTitle className="text-base font-display text-gold">Resumo</SheetTitle>
                  </SheetHeader>
                  <SummaryPanel />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Step content with scroll */}
          <div className="flex-1 overflow-y-auto" data-step-scroll="true">
            <StepHeader
              stepId={validStep}
              canNext={canNext}
              currentMissing={currentMissing}
              showEnterHint={canNext && !isLast}
            />
            <AnimatePresence initial={false} mode="wait" custom={navigationDirection}>
              <motion.div
                ref={activeStepContainerRef}
                tabIndex={-1}
                data-active-step-container="true"
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
          </div>
        </div>

        {/* Desktop summary panel */}
        <aside className="hidden xl:block">
          <SummaryPanel />
        </aside>
      </div>
    </div>
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
