import { Suspense } from "react";
import { CatalogGate } from "@/components/CatalogGate";
import { useBuilderStore } from "@/state/builderStore";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { races } from "@/data/races";
import { validateCatalog } from "@/utils/validateCatalog";
import { lazyWithRetry } from "@/utils/lazyWithRetry";
import { Loader2 } from "lucide-react";
import { SinglePageShell } from "@/components/layout/SinglePageShell";
import { SidebarNav, SECTIONS } from "@/components/SidebarNav";
import { SummaryPanel } from "@/components/SummaryPanel";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ListChecks, LayoutDashboard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

const SECTION_COMPONENTS: Record<string, { Component: React.LazyExoticComponent<React.ComponentType>; icon: string }> = {
  class: { Component: StepClass, icon: "⚔️" },
  origin: { Component: StepBackground, icon: "📜" },
  race: { Component: StepRace, icon: "🧬" },
  abilities: { Component: StepAbilityMethod, icon: "💪" },
  equipment: { Component: StepEquipment, icon: "🛡️" },
  choices: { Component: StepChoices, icon: "✅" },
  sheet: { Component: StepSheet, icon: "📋" },
};

function StepFallback() {
  return (
    <div className="flex items-center justify-center h-32 animate-fade-in">
      <Loader2 className="h-5 w-5 animate-spin text-gold/60" />
    </div>
  );
}

function MobileToolbar() {
  return (
    <div className="lg:hidden sticky top-0 z-30 border-b border-border/30 px-3 py-2 flex items-center justify-between gap-2" style={{ background: "hsl(var(--card) / 0.9)", backdropFilter: "blur(12px)" }}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs rounded-xl">
            <ListChecks className="h-3.5 w-3.5 text-gold/60" />
            Seções
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] max-w-xs p-0 rounded-r-3xl">
          <SheetHeader className="border-b px-4 py-3.5 text-left">
            <SheetTitle className="text-base font-display text-gold">Seções</SheetTitle>
          </SheetHeader>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs rounded-xl">
            <LayoutDashboard className="h-3.5 w-3.5 text-gold/60" />
            Resumo
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90%] max-w-md overflow-y-auto p-0">
          <SheetHeader className="border-b px-4 py-3.5">
            <SheetTitle className="text-base font-display text-gold">Resumo</SheetTitle>
          </SheetHeader>
          <SummaryPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SinglePageBuilder() {
  const completedSteps = useBuilderStore((s) => s.completedSteps);

  return (
    <>
      <MobileToolbar />
      <SinglePageShell
        sidebar={<SidebarNav />}
        summary={<SummaryPanel />}
      >
        {SECTIONS.map((sec) => {
          const def = SECTION_COMPONENTS[sec.id];
          if (!def) return null;
          const { Component } = def;
          const isDone = completedSteps.includes(sec.id as any);

          return (
            <CollapsibleSection
              key={sec.id}
              sectionId={sec.id}
              title={sec.label}
              icon={<span className="text-base">{sec.icon}</span>}
              isComplete={isDone}
              defaultOpen={sec.id === "class"}
              statusLabel={isDone ? "Completo" : undefined}
            >
              <Suspense fallback={<StepFallback />}>
                <Component />
              </Suspense>
            </CollapsibleSection>
          );
        })}
      </SinglePageShell>
    </>
  );
}

const Index = () => {
  return (
    <CatalogGate issues={catalogResult.issues}>
      <SinglePageBuilder />
    </CatalogGate>
  );
};

export default Index;
