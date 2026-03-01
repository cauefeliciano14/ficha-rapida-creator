import { useState } from "react";
import { RotateCcw, Sword } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCharacterStore } from "@/state/characterStore";
import { useBuilderStore } from "@/state/builderStore";
import { Progress } from "@/components/ui/progress";

const RESET_CONFIRMATION_TEXT = "REINICIAR";

export function Header() {
  const [confirmationText, setConfirmationText] = useState("");
  const resetCharacter = useCharacterStore((s) => s.resetCharacter);
  const lastSavedAt = useCharacterStore((s) => s.lastSavedAt);
  const persistError = useCharacterStore((s) => s.persistError);
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);
  const completedSteps = useBuilderStore((s) => s.completedSteps);
  const getVisibleSteps = useBuilderStore((s) => s.getVisibleSteps);

  const visibleSteps = getVisibleSteps();
  const totalSteps = visibleSteps.length;
  const completedCount = visibleSteps.filter((s) => completedSteps.includes(s.id)).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const handleReset = () => {
    resetCharacter();
    resetBuilder();
    setConfirmationText("");
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setConfirmationText("");
  };

  const isResetDisabled = confirmationText.trim().toUpperCase() !== RESET_CONFIRMATION_TEXT;
  const savedAtLabel = lastSavedAt
    ? `Salvo ${new Date(lastSavedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    : "";

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="flex h-auto min-h-12 items-center justify-between px-3 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          <Sword className="h-5 w-5 text-gold" />
          <h1 className="text-sm font-bold tracking-wide font-display sm:text-base">
            <span className="sm:hidden">D&D Builder</span>
            <span className="hidden sm:inline">D&D 2024 Character Builder</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Save status */}
          <div className="hidden sm:flex items-center gap-1.5">
            {persistError ? (
              <span className="text-[10px] text-destructive font-medium animate-fade-in">⚠ Erro ao salvar</span>
            ) : savedAtLabel ? (
              <span className="text-[10px] text-muted-foreground">{savedAtLabel}</span>
            ) : null}
          </div>

          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gold">{progressPercent}%</span>
            <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out progress-glow"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--gold)))`,
                }}
              />
            </div>
          </div>

          <AlertDialog onOpenChange={handleDialogOpenChange}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-[36px] gap-1.5 px-2 text-muted-foreground hover:text-foreground sm:px-3"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Reiniciar</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja reiniciar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso apagará escolhas e progresso das etapas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Para confirmar, digite <strong>{RESET_CONFIRMATION_TEXT}</strong> abaixo.
                </p>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(event) => setConfirmationText(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Digite REINICIAR para confirmar"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={isResetDisabled}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Reiniciar mesmo assim
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="sm:hidden h-1 bg-secondary">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--gold)))`,
          }}
        />
      </div>
    </header>
  );
}