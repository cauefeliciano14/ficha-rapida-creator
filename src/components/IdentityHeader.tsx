import { useCharacterStore } from "@/state/characterStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Star } from "lucide-react";
import { SUPPORTED_LEVEL_MESSAGE } from "@/config/builder";

export function IdentityHeader() {
  const name = useCharacterStore((s) => s.name);
  const level = useCharacterStore((s) => s.level);
  const patchCharacter = useCharacterStore((s) => s.patchCharacter);

  const handleNameChange = (value: string) => {
    patchCharacter({ name: value });
  };

  const handleLevelChange = (value: string) => {
    const newLevel = parseInt(value);
    if (newLevel === 1 || newLevel === 2) {
      const currentLevel = level;
      if (currentLevel === 2 && newLevel === 1) {
        patchCharacter({
          level: newLevel,
          leveling: {
            pending: false, fromLevel: 1, toLevel: 1, hpMethod: null, hpRolls: {},
            choices: { subclassId: null, asiOrFeat: {} }, changesSummary: [],
          },
        });
      } else {
        patchCharacter({ level: newLevel });
      }
    }
  };

  return (
    <div id="identity-header-panel" className="identity-header-bg px-4 py-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          {/* Nome */}
          <div className="flex-1">
            <Label
              htmlFor="character-name"
              className="dashboard-section-title flex items-center gap-1.5 mb-2 text-gold/70"
            >
              <User className="h-3.5 w-3.5" />
              Nome do Personagem
            </Label>
            <div className="relative">
              <Input
                id="character-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Aelindra, a Maga"
                autoComplete="off"
                className="dashboard-card-interactive bg-secondary/20 border-border/40 hover:border-gold/20 focus:border-gold/40 focus:ring-gold/15 font-medium placeholder:text-muted-foreground/30 h-11 text-sm rounded-xl"
              />
              {name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Star className="h-3 w-3 text-gold/25" />
                </div>
              )}
            </div>
          </div>

          {/* Nível */}
          <div className="w-full sm:w-40">
            <Label
              htmlFor="character-level"
              className="dashboard-section-title flex items-center gap-1.5 mb-2 text-gold/70"
            >
              <span className="text-base">⚔️</span>
              Nível
            </Label>
            <Select value={level.toString()} onValueChange={handleLevelChange}>
              <SelectTrigger
                id="character-level"
                className="dashboard-card-interactive bg-secondary/20 border-border/40 hover:border-gold/20 focus:border-gold/40 focus:ring-gold/15 h-11 text-sm rounded-xl"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="text-gold/60 text-xs font-display font-bold">I</span>
                    Nível 1
                  </span>
                </SelectItem>
                <SelectItem value="2">
                  <span className="flex items-center gap-2">
                    <span className="text-gold/60 text-xs font-display font-bold">II</span>
                    Nível 2
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hint */}
        <p className="mt-3 text-[10px] text-muted-foreground/40 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold/30" />
          {SUPPORTED_LEVEL_MESSAGE}
        </p>
      </div>
    </div>
  );
}
