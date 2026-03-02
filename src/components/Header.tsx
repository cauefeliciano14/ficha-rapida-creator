import { useState } from "react";
import { RotateCcw, Sword, Settings } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCharacterStore } from "@/state/characterStore";
import { useBuilderStore } from "@/state/builderStore";

const RESET_CONFIRMATION_TEXT = "OK";

export function Header() {
  const [confirmationText, setConfirmationText] = useState("");
  const resetCharacter = useCharacterStore((s) => s.resetCharacter);
  const lastSavedAt = useCharacterStore((s) => s.lastSavedAt);
  const persistError = useCharacterStore((s) => s.persistError);
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);
  const preferences = useBuilderStore((s) => s.preferences);
  const setPreferences = useBuilderStore((s) => s.setPreferences);

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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="min-h-[44px] gap-1.5 px-2 sm:px-3">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Home/Config</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Home / Configurações do Builder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Preferências</p>
                  <p className="text-xs text-muted-foreground">Formato de exibição de atributos (placeholder funcional).</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant={preferences.abilityDisplay === "mod_first" ? "default" : "outline"} onClick={() => setPreferences({ abilityDisplay: "mod_first" })}>Modificador primeiro</Button>
                    <Button size="sm" variant={preferences.abilityDisplay === "score_first" ? "default" : "outline"} onClick={() => setPreferences({ abilityDisplay: "score_first" })}>Valor primeiro</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label htmlFor="beginner-help">Ajuda / Modo Iniciante</Label>
                    <p className="text-xs text-muted-foreground">Exibe textos explicativos contextuais.</p>
                  </div>
                  <Switch id="beginner-help" checked={preferences.beginnerHelp} onCheckedChange={(checked) => setPreferences({ beginnerHelp: checked })} />
                </div>
                <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                  Placeholder: controle de fontes e conteúdo (em breve).
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                  aria-label="Digite OK para confirmar"
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

    </header>
  );
}