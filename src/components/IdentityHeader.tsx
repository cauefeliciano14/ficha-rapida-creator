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
    <div id="identity-header-panel" className="identity-header-bg px-3 py-3 sm:px-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end max-w-2xl">
        {/* Nome */}
        <div className="flex-1">
          <Label
            htmlFor="character-name"
            className="text-[10px] uppercase tracking-widest text-gold/70 font-bold font-display flex items-center gap-1.5 mb-1.5"
          >
            <User className="h-3 w-3" />
            Nome do Personagem
          </Label>
          <div className="relative">
            <Input
              id="character-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Aelindra, a Maga"
              autoComplete="off"
              className="bg-background/40 border-border/50 focus:border-gold/50 focus:ring-gold/20 transition-all font-medium placeholder:text-muted-foreground/40 h-10"
            />
            {name && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Star className="h-3 w-3 text-gold/30" />
              </div>
            )}
          </div>
        </div>

        {/* Nível */}
        <div className="w-full sm:w-36">
          <Label
            htmlFor="character-level"
            className="text-[10px] uppercase tracking-widest text-gold/70 font-bold font-display flex items-center gap-1.5 mb-1.5"
          >
            <span className="text-gold/70">⚔</span>
            Nível
          </Label>
          <Select value={level.toString()} onValueChange={handleLevelChange}>
            <SelectTrigger
              id="character-level"
              className="bg-background/40 border-border/50 focus:border-gold/50 focus:ring-gold/20 h-10"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                <span className="flex items-center gap-2">
                  <span className="text-gold/60 text-xs">I</span>
                  Nível 1
                </span>
              </SelectItem>
              <SelectItem value="2">
                <span className="flex items-center gap-2">
                  <span className="text-gold/60 text-xs">II</span>
                  Nível 2
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hint */}
      <p className="mt-2 text-[11px] text-muted-foreground/70 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-gold/30" />
        {SUPPORTED_LEVEL_MESSAGE}
      </p>
    </div>
  );
}
