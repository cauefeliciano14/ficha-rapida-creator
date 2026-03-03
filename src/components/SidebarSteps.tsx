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
    <aside className="w-full md:w-72 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col overflow-y-auto">
      {/* Header Section */}
      <div className="px-4 pt-5 pb-4 border-b border-sidebar-border">
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold/60 font-display mb-3">
            Sua Jornada
          </p>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs text-foreground/80 font-medium">Progresso</span>
            <span className="text-[11px] font-bold text-primary/90 font-display bg-primary/10 px-2.5 py-1 rounded-full">
              {doneCount}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-secondary/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              background: progressPct === 100
                ? `linear-gradient(to right, hsl(152 55% 42%), hsl(152 55% 52%))`
                : `linear-gradient(to right, hsl(25 95% 53%), hsl(40 70% 50%))`,
              boxShadow: progressPct > 0 ? "0 0 10px hsl(25 95% 53% / 0.3)" : "none",
            }}
          />
        </div>

        {progressPct === 100 && (
          <p className="mt-2.5 text-[10px] text-success/80 flex items-center gap-1.5 animate-fade-in font-medium">
            <CheckCircle2 className="h-3 w-3" />
            Personagem Completo!
          </p>
        )}
      </div>

      {/* Steps Navigation */}
      <div className="px-2.5 py-3 flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1.5" role="navigation" aria-label="Etapas do builder">
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
                className={`group relative flex items-start gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-300 w-full ${
                  isActive
                    ? "sidebar-step-active"
                    : isDone
                    ? "sidebar-step-done hover:bg-success/5"
                    : isNextUp
                    ? "border border-dashed border-gold/15 text-muted-foreground hover:border-gold/30 hover:text-foreground hover:bg-sidebar-accent/80"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground border border-transparent"
                }`}
              >
                {/* Step Icon/Number */}
                <div className="shrink-0 flex items-center justify-center w-8 h-8 mt-0.5 rounded-xl bg-secondary/40">
                  {isDone ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                  ) : isActive ? (
                    <span className="text-base leading-none">{icon}</span>
                  ) : missing.length > 0 ? (
                    <AlertCircle className="h-4.5 w-4.5 text-warning/70" />
                  ) : isNextUp ? (
                    <Flame className="h-4.5 w-4.5 text-gold/50" />
                  ) : (
                    <span className="text-[11px] font-bold text-muted-foreground/50 font-display">
                      {step.num}
                    </span>
                  )}
                </div>

                {/* Step Content */}
                <div className="min-w-0 flex-1">
                  {/* Label */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`block truncate leading-tight text-[13px] font-medium ${
                      isActive ? "font-semibold text-foreground" : isDone ? "text-success/80" : ""
                    }`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5 leading-tight">
                    {description}
                  </p>

                  {/* Summary */}
                  {summary && (
                    <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      isDone ? "bg-success/8 text-success/60" : "bg-gold/5 text-gold/50"
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
                  <TooltipContent side="right" className="max-w-[220px] rounded-xl">
                    <p className="font-semibold text-xs mb-1.5 text-foreground">Pendências:</p>
                    <ul className="space-y-1 text-[11px] leading-snug text-muted-foreground">
                      {missing.slice(0, 3).map((m) => (
                        <li key={m} className="flex items-start gap-1.5">
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
      <div className="px-4 py-3.5 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground/40 leading-relaxed flex items-start gap-2">
          <span className="text-gold/40 mt-0.5 text-sm">💡</span>
          <span>Clique em qualquer etapa para navegar. Conclua cada uma para prosseguir.</span>
        </p>
      </div>
    </aside>
  );
}
