import { useRef, useState, type ChangeEvent } from "react";
import { CheckCircle2, Download, FileUp, Printer, RotateCcw, Share2, Shield } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useBuilderStore } from "@/state/builderStore";
import { useCharacterStore, type CharacterState } from "@/state/characterStore";
import {
  downloadCharacterJSON,
  exportSharePayload,
  readFileAsJSON,
  sharePayloadToBase64,
  validateImportPayload,
} from "@/utils/export";

const RESET_CONFIRMATION_TEXT = "OK";

export function CommandCenter() {
  const [confirmationText, setConfirmationText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const character = useCharacterStore();
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);
  const savedAtLabel = character.lastSavedAt
    ? new Date(character.lastSavedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "";

  const handleExport = () => {
    downloadCharacterJSON(character);
    toast({ title: "Exportado", description: "Arquivo JSON baixado com sucesso." });
  };

  const handleShare = async () => {
    const payload = exportSharePayload(character);
    const b64 = sharePayloadToBase64(payload);
    await navigator.clipboard.writeText(b64);
    toast({ title: "Compartilhado", description: "Payload copiado para a área de transferência." });
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const raw = await readFileAsJSON(file);
      const result = validateImportPayload(raw);
      if (!result.success) {
        toast({ title: "Erro na importação", description: result.errors.join("\n"), variant: "destructive" });
        return;
      }
      if (result.data) {
        character.patchCharacter(result.data as Partial<CharacterState>);
        character.recalc();
      }
      toast({ title: "Importado", description: "Personagem importado com sucesso." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao importar.";
      toast({ title: "Erro", description: message, variant: "destructive" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    character.resetCharacter();
    resetBuilder();
    setConfirmationText("");
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setConfirmationText("");
  };

  const isResetDisabled = confirmationText.trim().toUpperCase() !== RESET_CONFIRMATION_TEXT;

  return (
    <div className="dashboard-card-base dashboard-card-elevated sticky top-0 z-20 rounded-2xl border border-border/40 bg-card/95 p-3 backdrop-blur sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {character.persistError ? (
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-medium text-destructive animate-fade-in">
              <Shield className="h-3 w-3" />
              Erro ao salvar
            </span>
          ) : savedAtLabel ? (
            <span className="flex items-center gap-1.5 rounded-full bg-success/5 px-2.5 py-1 text-[10px] text-success/70">
              <CheckCircle2 className="h-3 w-3" />
              Salvo às {savedAtLabel}
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] text-muted-foreground">Ainda não salvo</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportClick}>
            <FileUp className="h-4 w-4" />Importar
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open("/print", "_blank")}>
            <Printer className="h-4 w-4" />Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />Compartilhar
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />

          <AlertDialog onOpenChange={handleDialogOpenChange}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
              >
                <RotateCcw className="h-4 w-4" />Reiniciar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-destructive/20">
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
                <Input
                  type="text"
                  value={confirmationText}
                  onChange={(event) => setConfirmationText(event.target.value)}
                  aria-label="Digite OK para confirmar"
                  placeholder="Digite OK"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={isResetDisabled}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40"
                >
                  Reiniciar mesmo assim
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
