import { CheckCircle2, Circle, AlertCircle, Flame, ChevronRight } from "lucide-react";
import { useCharacterStore } from "@/state/characterStore";
import { useBuilderStore } from "@/state/builderStore";
import { classes } from "@/data/classes";
import { races } from "@/data/races";
import { backgrounds } from "@/data/backgrounds";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STEP_ICONS: Record<string, string> = {
  class: "⚔️",
  origin: "📜",
  race: "🧬",
  abilities: "💪",
  equipment: "🛡️",
  choices: "✅",
  sheet: "📋",
};

const STEP_DESCRIPTIONS: Record<string, string> = {
  class: "Escolha sua classe de personagem",
  origin: "Defina a origem e antecedente",
  race: "Selecione sua raça",
  abilities: "Distribua seus atributos",
  equipment: "Escolha seu equipamento",
  choices: "Faça escolhas adicionais",
  sheet: "Revise sua ficha final",
};

export function SidebarSteps() {
  const classId = useCharacterStore((s) => s.class);
  const raceId = useCharacterStore((s) => s.race);
  const bgId = useCharacterStore((s) => s.background);

  const cls = classes.find((c) => c.id === classId);
  const race = races.find((r) => r.id === raceId);
  const bg = backgrounds.find((b) => b.id === bgId);

  const currentStep = useBuilderStore((s) => s.currentStep);
  const completedSteps = useBuilderStore((s) => s.completedSteps);
  const requiredMissing = useBuilderStore((s) => s.requiredMissing);
  const goToStep = useBuilderStore((s) => s.goToStep);
  const getVisibleSteps = useBuilderStore((s) => s.getVisibleSteps);

  const visibleSteps = getVisibleSteps();
  const totalSteps = visibleSteps.length;
  const doneCount = completedSteps.filter((id) => visibleSteps.some((s) => s.id === id)).length;
  const progressPct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  const stepSummary: Record<string, string | undefined> = {
    class: cls?.name,
    origin: bg?.name,
    race: race?.name,
  };

  return (
    <aside className="w-full md:w-72 shrink-0 border-r bg-sidebar flex flex-col overflow-y-auto">
      {/* Header Section */}
      <div className="px-4 pt-4 pb-3 border-b border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/80">
        <div className="mb-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gold/70 font-display mb-2">
            Sua Jornada
          </p>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-foreground font-medium">Progresso da Criação</span>
            <span className="text-[11px] font-bold text-gold/80 font-display bg-primary/10 px-2 py-1 rounded">
              {doneCount}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-sidebar-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              background: progressPct === 100
                ? "linear-gradient(to right, hsl(142 60% 40%), hsl(142 60% 50%))"
                : "linear-gradient(to right, hsl(0 72% 51%), hsl(43 74% 49%))",
              boxShadow: progressPct > 0 ? "0 0 8px hsl(0 72% 51% / 0.4)" : "none",
            }}
          />
        </div>

        {progressPct === 100 && (
          <p className="mt-2 text-[10px] text-success/80 flex items-center gap-1 animate-fade-in font-medium">
            <CheckCircle2 className="h-3 w-3" />
            Personagem Completo!
          </p>
        )}
      </div>

      {/* Steps Navigation */}
      <div className="px-2 py-3 flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1" role="navigation" aria-label="Etapas do builder">
          {visibleSteps.map((step, index) => {
            const isDone = completedSteps.includes(step.id);
            const isActive = currentStep === step.id;
            const missing = requiredMissing[step.id] ?? [];
            const summary = stepSummary[step.id];
            const icon = STEP_ICONS[step.id] ?? "📌";
            const isNextUp = !isActive && !isDone && index === visibleSteps.findIndex((s) => !completedSteps.includes(s.id));
            const description = STEP_DESCRIPTIONS[step.id];

            const button = (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.num}. ${step.label}${isDone ? " — concluído" : ""}`}
                className={`group relative flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 w-full ${
                  isActive
                    ? "sidebar-step-active"
                    : isDone
                    ? "sidebar-step-done"
                    : isNextUp
                    ? "border border-dashed border-gold/20 text-muted-foreground hover:border-gold/40 hover:text-foreground hover:bg-sidebar-accent"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground border border-transparent"
                }`}
              >
                {/* Step Icon/Number */}
                <div className="shrink-0 flex items-center justify-center w-7 h-7 mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : isActive ? (
                    <span className="text-base leading-none animate-pulse">{icon}</span>
                  ) : missing.length > 0 ? (
                    <AlertCircle className="h-5 w-5 text-warning/70" />
                  ) : isNextUp ? (
                    <Flame className="h-5 w-5 text-gold/60" />
                  ) : (
                    <span className="text-[12px] font-bold text-muted-foreground/60 font-display">
                      {step.num}
                    </span>
                  )}
                </div>

                {/* Step Content */}
                <div className="min-w-0 flex-1">
                  {/* Label */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`block truncate leading-tight text-xs sm:text-sm font-medium ${
                      isActive ? "font-semibold text-foreground" : isDone ? "text-success/80" : ""
                    }`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-gold/60 shrink-0 animate-pulse" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-tight">
                    {description}
                  </p>

                  {/* Summary */}
                  {summary && (
                    <span className={`mt-1 block truncate text-[10px] font-medium ${
                      isDone ? "text-success/60" : "text-gold/50"
                    }`}>
                      ✓ {summary}
                    </span>
                  )}
                </div>
              </button>
            );

            if (!isActive && missing.length > 0) {
              return (
                <Tooltip key={step.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[220px] border-border/60">
                    <p className="font-semibold text-xs mb-1.5 text-foreground">Pendências:</p>
                    <ul className="space-y-1 text-[11px] leading-snug text-muted-foreground">
                      {missing.slice(0, 3).map((m) => (
                        <li key={m} className="flex items-start gap-1">
                          <span className="text-warning/60 mt-0.5 shrink-0">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                      {missing.length > 3 && (
                        <li className="text-muted-foreground/50 pt-1">+{missing.length - 3} mais</li>
                      )}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border bg-gradient-to-t from-sidebar/80 to-sidebar">
        <p className="text-[10px] text-muted-foreground/50 leading-relaxed flex items-start gap-1.5">
          <span className="text-gold/60 mt-0.5">💡</span>
          <span>Clique em qualquer etapa para navegar. Conclua cada uma para prosseguir.</span>
        </p>
      </div>
    </aside>
  );
}
