import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/state/builderStore";

interface BeginnerToggleProps {
  className?: string;
}

export function BeginnerToggle({ className }: BeginnerToggleProps) {
  const beginnerHelp = useBuilderStore((s) => s.preferences.beginnerHelp);
  const setPreferences = useBuilderStore((s) => s.setPreferences);

  const label = beginnerHelp ? "Modo Novato" : "Modo Veterano";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            role="switch"
            aria-checked={beginnerHelp}
            onClick={() => setPreferences({ beginnerHelp: !beginnerHelp })}
            className={cn(
              "inline-flex h-9 items-center rounded-xl border px-1.5 text-xs font-medium transition-colors",
              beginnerHelp
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                : "border-muted-foreground/30 bg-secondary/30 text-muted-foreground hover:bg-secondary/50",
              className
            )}
          >
            <span
              className={cn(
                "inline-flex min-w-[88px] items-center justify-center gap-1 rounded-lg px-2 py-1 transition-colors",
                beginnerHelp ? "bg-primary text-primary-foreground" : "bg-transparent"
              )}
            >
              <span aria-hidden="true">📖</span>
              Novato
            </span>
            <span
              className={cn(
                "inline-flex min-w-[88px] items-center justify-center gap-1 rounded-lg px-2 py-1 transition-colors",
                !beginnerHelp ? "bg-foreground text-background" : "bg-transparent"
              )}
            >
              <span aria-hidden="true">⚡</span>
              Veterano
            </span>
            <span className="sr-only">Alternar para {beginnerHelp ? "Veterano" : "Novato"}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[280px]">
          <p className="text-xs leading-relaxed">
            {label}: no modo <strong>Novato</strong> exibimos dicas e explicações extras. No modo
            <strong> Veterano</strong>, a interface fica mais enxuta.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
