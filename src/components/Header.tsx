import { useState } from "react";
import { RotateCcw, Swords, Shield, CheckCircle2 } from "lucide-react";
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

const RESET_CONFIRMATION_TEXT = "OK";

export function Header() {
  const [confirmationText, setConfirmationText] = useState("");
  const resetCharacter = useCharacterStore((s) => s.resetCharacter);
  const lastSavedAt = useCharacterStore((s) => s.lastSavedAt);
  const persistError = useCharacterStore((s) => s.persistError);
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);

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
    ? `${new Date(lastSavedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    : "";

  return (
    <header className="sticky top-0 z-50 dnd-header">
      <div className="flex h-auto min-h-16 items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-lg" />
            <Swords className="relative h-5 w-5 text-gold logo-glow" />
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <h1 className="font-display font-bold tracking-wide text-foreground">
              <span className="sm:hidden text-sm">D&D Builder</span>
              <span className="hidden sm:inline text-base">D&D 2024 Character Builder</span>
            </h1>
            <span className="hidden sm:block text-[10px] text-gold/40 tracking-widest font-display uppercase">
              Criador de Personagem
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 ml-1">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold text-primary/80 tracking-wide">
              2024
            </span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Save status */}
          <div className="hidden sm:flex items-center gap-1.5 mr-1">
            {persistError ? (
              <span className="flex items-center gap-1.5 text-[10px] text-destructive font-medium animate-fade-in rounded-full bg-destructive/10 px-2.5 py-1">
                <Shield className="h-3 w-3" />
                Erro ao salvar
              </span>
            ) : savedAtLabel ? (
              <span className="flex items-center gap-1.5 text-[10px] text-success/70 rounded-full bg-success/5 px-2.5 py-1">
                <CheckCircle2 className="h-3 w-3" />
                Salvo às {savedAtLabel}
              </span>
            ) : null}
          </div>

          {/* Reset */}
          <AlertDialog onOpenChange={handleDialogOpenChange}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-[40px] gap-1.5 px-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Reiniciar</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-destructive/20 rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">Reiniciar personagem?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso apagará todas as escolhas e o progresso das etapas. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Para confirmar, digite <strong className="text-foreground">{RESET_CONFIRMATION_TEXT}</strong> abaixo:
                </p>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(event) => setConfirmationText(event.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Digite OK para confirmar"
                  placeholder="Digite OK"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={isResetDisabled}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40 rounded-xl"
                >
                  Reiniciar mesmo assim
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}
