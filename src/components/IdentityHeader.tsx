import { useCharacterStore } from "@/state/characterStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Hash } from "lucide-react";

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
    <div id="identity-header-panel" className="border-b bg-card/80 backdrop-blur-sm px-3 py-3 sm:px-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end max-w-2xl">
        <div className="flex-1">
          <Label htmlFor="character-name" className="text-[10px] uppercase tracking-widest text-gold/60 font-bold font-display flex items-center gap-1">
            <User className="h-3 w-3" /> Nome do Personagem
          </Label>
          <Input
            id="character-name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ex: Aelindra, a Maga"
            autoComplete="off"
            className="mt-1 bg-transparent border-border/50 focus:border-gold/50 transition-colors font-medium"
          />
        </div>
        <div className="w-full sm:w-32">
          <Label htmlFor="character-level" className="text-[10px] uppercase tracking-widest text-gold/60 font-bold font-display flex items-center gap-1">
            <Hash className="h-3 w-3" /> Nível
          </Label>
          <Select value={level.toString()} onValueChange={handleLevelChange}>
            <SelectTrigger id="character-level" className="mt-1 bg-transparent border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Nível 1</SelectItem>
              <SelectItem value="2">Nível 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}