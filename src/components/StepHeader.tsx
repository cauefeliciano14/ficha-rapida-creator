import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useBuilderStore, type StepId } from "@/state/builderStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepHeaderProps {
  stepId: StepId;
  canNext: boolean;
  currentMissing: string[];
  showEnterHint?: boolean;
}

export function StepHeader({ stepId, canNext, currentMissing, showEnterHint = false }: StepHeaderProps) {
  const visibleSteps = useBuilderStore((s) => s.getVisibleSteps());
  const nextStep = useBuilderStore((s) => s.nextStep);
  const prevStep = useBuilderStore((s) => s.prevStep);
  const isMobile = useIsMobile();

  const currentIdx = visibleSteps.findIndex((s) => s.id === stepId);
  const isFirst = currentIdx <= 0;
  const isLast = currentIdx >= visibleSteps.length - 1;
  const stepLabel = visibleSteps[currentIdx]?.label || stepId;
  const stepNum = visibleSteps[currentIdx]?.num ?? currentIdx + 1;
  const totalSteps = visibleSteps.length;

  const visibleMissing = currentMissing.slice(0, 3);
  const hasMoreMissing = currentMissing.length > 3;
  const summaryLabel =
    currentMissing.length === 1 ? "1 pendência para continuar" : `${currentMissing.length} pendências para continuar`;
  const mobileSummaryLabel = currentMissing.length === 1 ? "1 pendência" : `${currentMissing.length} pendências`;
  const showMissingSummary = !canNext && currentMissing.length > 0;

  const missingSummary = (
    <div className="text-xs text-info flex items-center gap-2 min-w-0" aria-live="polite">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning/80" aria-hidden="true" />
      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
        <span className="font-medium text-warning/80">{summaryLabel}:</span>
        {visibleMissing.map((item, index) => (
          <span key={`${item}-${index}`} className="truncate max-w-[180px] lg:max-w-[220px] text-muted-foreground">
            {item}
            {index < visibleMissing.length - 1 ? "," : ""}
          </span>
        ))}
        {hasMoreMissing && <span className="text-muted-foreground/60">+{currentMissing.length - visibleMissing.length}</span>}
      </div>
    </div>
  );

  const detailsContent = (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Pendências desta etapa</p>
      <ul className="space-y-1.5 text-sm">
        {currentMissing.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-2 text-foreground">
            <span className="text-warning/60 mt-0.5 shrink-0">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="sticky top-0 z-10 step-header-bar px-4 py-3 sm:px-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: title + missing */}
      <div className="flex min-w-0 flex-col gap-1.5">
        {/* Step label row */}
        <div className="flex items-start justify-between gap-2 sm:items-center sm:gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Step counter badge */}
            <span className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-bold text-primary font-display">
              {stepNum}
            </span>
            <h1
              className="text-lg font-semibold font-display min-w-0 truncate text-foreground"
              data-step-header-title
              tabIndex={-1}
            >
              {stepLabel}
            </h1>
            {canNext && !isLast && (
              <Sparkles className="h-3.5 w-3.5 text-gold/50 shrink-0 animate-pulse" />
            )}
          </div>

          {/* Mobile missing badge */}
          {showMissingSummary && isMobile && (
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-1 text-xs font-medium text-warning/80 border border-warning/20" aria-live="polite">
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                <span>{mobileSummaryLabel}</span>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                    type="button"
                    aria-label="Ver todas as pendências"
                  >
                    ver
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[70vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-display">Pendências para continuar</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6 pt-2">{detailsContent}</div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>

        {/* Desktop missing summary */}
        {showMissingSummary && !isMobile && (
          <div className="flex items-center gap-1">
            {missingSummary}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="inline-flex min-h-[32px] w-fit items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  type="button"
                  aria-label="Expandir lista completa de pendências"
                >
                  {hasMoreMissing ? "ver todas" : "detalhes"}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 border-border/60">
                {detailsContent}
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Enter hint */}
        {showEnterHint && !isMobile && (
          <p className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
            <kbd className="inline-flex items-center rounded border border-border/60 bg-secondary px-1 py-0.5 text-[9px] font-mono">Enter</kbd>
            para avançar
          </p>
        )}
      </div>

      {/* Right: navigation buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Step progress indicator */}
        <div className="hidden sm:flex items-center gap-1 mr-1">
          {visibleSteps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.id === stepId
                  ? "w-4 bg-primary"
                  : i < currentIdx
                  ? "w-1.5 bg-success/60"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <button
          onClick={prevStep}
          disabled={isFirst}
          className="flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-all duration-200 border border-border/60 hover:bg-secondary hover:border-border disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Voltar</span>
        </button>

        <button
          onClick={nextStep}
          disabled={isLast || !canNext}
          className={`flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-all duration-200 ${
            canNext && !isLast
              ? "btn-next-epic text-primary-foreground"
              : isLast && canNext
              ? "bg-success text-success-foreground hover:bg-success/90"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
          }`}
        >
          {isLast ? "Finalizar" : "Próximo"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
