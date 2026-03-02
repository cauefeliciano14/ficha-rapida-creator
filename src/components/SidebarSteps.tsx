import { CheckCircle2, Circle, AlertCircle, Flame } from "lucide-react";
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
    <aside className="w-full md:w-60 shrink-0 border-r bg-sidebar flex flex-col overflow-y-auto">
      {/* Progress section */}
      <div className="px-4 pt-4 pb-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold/60 font-display">
            Progresso
          </p>
          <span className="text-[11px] font-bold text-gold/80 font-display">
            {doneCount}/{totalSteps}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-sidebar-border overflow-hidden">
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
          <p className="mt-1.5 text-[10px] text-success/80 flex items-center gap-1 animate-fade-in">
            <CheckCircle2 className="h-3 w-3" />
            Personagem completo!
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="px-2 py-3 flex-1">
        <nav className="flex flex-col gap-0.5" role="navigation" aria-label="Etapas do builder">
          {visibleSteps.map((step, index) => {
            const isDone = completedSteps.includes(step.id);
            const isActive = currentStep === step.id;
            const missing = requiredMissing[step.id] ?? [];
            const summary = stepSummary[step.id];
            const icon = STEP_ICONS[step.id] ?? "📌";
            const isNextUp = !isActive && !isDone && index === visibleSteps.findIndex((s) => !completedSteps.includes(s.id));

            const button = (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.num}. ${step.label}${isDone ? " — concluído" : ""}`}
                className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-all duration-200 w-full ${
                  isActive
                    ? "sidebar-step-active text-foreground font-medium border border-primary/30"
                    : isDone
                    ? "sidebar-step-done text-success/90 hover:bg-success/5 border border-transparent"
                    : isNextUp
                    ? "border border-dashed border-gold/20 text-muted-foreground hover:border-gold/30 hover:text-foreground hover:bg-sidebar-accent"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground border border-transparent"
                }`}
              >
                {/* Step number / icon */}
                <div className="shrink-0 flex items-center justify-center w-6 h-6">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : isActive ? (
                    <span className="text-sm leading-none">{icon}</span>
                  ) : missing.length > 0 ? (
                    <AlertCircle className="h-4 w-4 text-info/70" />
                  ) : isNextUp ? (
                    <Flame className="h-4 w-4 text-gold/50" />
                  ) : (
                    <span className="text-[11px] font-bold text-muted-foreground/50 font-display">
                      {step.num}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="min-w-0 flex-1">
                  <span className={`block truncate leading-tight text-xs sm:text-sm ${isActive ? "font-semibold" : ""}`}>
                    {step.label}
                  </span>
                  {summary && (
                    <span className={`mt-0.5 block truncate text-[10px] font-medium ${
                      isDone ? "text-success/60" : "text-gold/50"
                    }`}>
                      {summary}
                    </span>
                  )}
                </div>

                {/* Done badge */}
                {isDone && (
                  <span className="shrink-0 text-[10px] text-success/50 font-bold">✓</span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );

            if (!isActive && missing.length > 0) {
              return (
                <Tooltip key={step.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px] border-border/60">
                    <p className="font-semibold text-xs mb-1 text-foreground">Pendências:</p>
                    <ul className="space-y-1 text-[11px] leading-snug text-muted-foreground">
                      {missing.slice(0, 3).map((m) => (
                        <li key={m} className="flex items-start gap-1">
                          <span className="text-info/60 mt-0.5">•</span>
                          {m}
                        </li>
                      ))}
                      {missing.length > 3 && (
                        <li className="text-muted-foreground/60">+{missing.length - 3} mais</li>
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

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
          Clique em qualquer etapa para navegar diretamente.
        </p>
      </div>
    </aside>
  );
}
