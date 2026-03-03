import { useMemo, type ReactNode, type RefObject } from "react";
import { races } from "@/data/races";
import { classes } from "@/data/classes";
import { SidebarSteps } from "@/components/SidebarSteps";
import { SummaryPanel } from "@/components/SummaryPanel";
import { StepHeader } from "@/components/StepHeader";
import { CommandCenter } from "@/components/CommandCenter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ListChecks, Shield, Sword, LayoutDashboard } from "lucide-react";
import { useCharacterStore } from "@/state/characterStore";
import type { StepDef, StepId } from "@/state/builderStore";

interface DashboardShellProps {
  validStep: StepId;
  visibleSteps: StepDef[];
  completedSteps: StepId[];
  goToStep: (step: StepId) => void;
  currentMissing: string[];
  canNext: boolean;
  isLast: boolean;
  activeStepContainerRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}

export function DashboardShell({
  validStep,
  visibleSteps,
  completedSteps,
  goToStep,
  currentMissing,
  canNext,
  isLast,
  activeStepContainerRef,
  children,
}: DashboardShellProps) {
  const char = useCharacterStore();

  const raceName = useMemo(() => races.find((r) => r.id === char.race)?.name ?? "—", [char.race]);
  const className = useMemo(() => classes.find((c) => c.id === char.class)?.name ?? "—", [char.class]);
  const pendingRequired = useMemo(() => {
    return visibleSteps.filter((step) => !completedSteps.includes(step.id) && step.id !== "sheet");
  }, [visibleSteps, completedSteps]);

  const progress = Math.round((completedSteps.length / Math.max(visibleSteps.length, 1)) * 100);
  const completedCount = completedSteps.length;
  const pendingCount = Math.max(visibleSteps.length - completedCount, 0);

  return (
    <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
      <aside className="hidden md:block">
        <SidebarSteps />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <div className="border-b border-border/30 md:hidden" style={{ background: "hsl(var(--card) / 0.85)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs rounded-xl">
                  <ListChecks className="h-3.5 w-3.5 text-gold/60" />
                  Etapas
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] max-w-sm p-0 rounded-r-3xl">
                <SheetHeader className="border-b px-4 py-3.5 text-left">
                  <SheetTitle className="text-base font-display text-gold">Etapas</SheetTitle>
                </SheetHeader>
                <SidebarSteps />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 flex-1 justify-center">
              {visibleSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`rounded-full transition-all duration-300 ${
                    step.id === validStep
                      ? "h-2.5 w-7 bg-primary"
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
                <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs rounded-xl">
                  <LayoutDashboard className="h-3.5 w-3.5 text-gold/60" />
                  Widgets
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90%] max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-base font-display text-gold">Dashboard</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  <CommandCenter />
                  {renderCards()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6" data-step-scroll="true">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-8 space-y-3">
              <CommandCenter />
              <StepHeader
                stepId={validStep}
                canNext={canNext}
                currentMissing={currentMissing}
                showEnterHint={canNext && !isLast}
              />
              <div ref={activeStepContainerRef} tabIndex={-1} data-active-step-container="true">
                {children}
              </div>
            </div>

            <div className="hidden xl:flex xl:col-span-4 flex-col gap-3">{renderCards()}</div>
          </div>

          <div className="xl:hidden mt-4 space-y-3">{renderCards()}</div>
        </div>
      </div>
    </div>
  );

  function renderCards() {
    return (
      <>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Progresso geral</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-semibold">{progress}%</span>
              <span className="text-xs text-muted-foreground">{completedCount} concluídas · {pendingCount} pendentes</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Pendências obrigatórias</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pendingRequired.length === 0 ? (
              <p className="text-sm text-success">Tudo certo! Nenhuma pendência obrigatória.</p>
            ) : (
              pendingRequired.slice(0, 3).map((step) => (
                <div key={step.id} className="flex items-center justify-between gap-2 text-sm">
                  <span>Etapa {step.num}: {step.label}</span>
                  <Button size="sm" variant="secondary" onClick={() => goToStep(step.id)}>Ir</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Identidade do personagem</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Nome:</strong> {char.name || "—"}</p>
            <p><strong>Nível:</strong> {char.level}</p>
            <p><strong>Raça:</strong> {raceName}</p>
            <p><strong>Classe:</strong> {className}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Resumo de combate</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-md border p-2 text-center"><Shield className="h-4 w-4 mx-auto mb-1" />CA {char.armorClass}</div>
            <div className="rounded-md border p-2 text-center"><Sword className="h-4 w-4 mx-auto mb-1" />PV {char.hitPoints.max}</div>
            <div className="rounded-md border p-2 text-center">+{char.proficiencyBonus} Prof.</div>
          </CardContent>
        </Card>

        <div className="rounded-lg border bg-card">
          <SummaryPanel />
        </div>
      </>
    );
  }
}
