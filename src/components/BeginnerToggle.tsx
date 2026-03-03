import { GraduationCap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useBuilderStore } from "@/state/builderStore";

export function BeginnerToggle() {
  const beginnerHelp = useBuilderStore((s) => s.preferences.beginnerHelp);
  const setPreferences = useBuilderStore((s) => s.setPreferences);

  return (
    <label className="dashboard-card-base dashboard-card-elevated inline-flex h-10 items-center gap-2 rounded-xl border border-border/50 bg-card/80 px-2.5 text-xs text-muted-foreground sm:gap-2.5 sm:px-3 sm:text-sm">
      <GraduationCap className="h-3.5 w-3.5 text-primary/70" />
      <span className="hidden sm:inline">Ajuda iniciante</span>
      <span className="sm:hidden">Ajuda</span>
      <Switch
        checked={beginnerHelp}
        onCheckedChange={(checked) => setPreferences({ beginnerHelp: checked })}
        aria-label="Alternar ajuda para iniciantes"
      />
    </label>
  );
}
