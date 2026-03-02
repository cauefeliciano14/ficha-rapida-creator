import { useCharacterStore } from "@/state/characterStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ALL_SKILLS, calcAbilityMod, getFinalAbilityScores } from "@/utils/calculations";

export function StepPlaySheet() {
  const char = useCharacterStore();
  const finalScores = getFinalAbilityScores(char.abilityScores, char.racialBonuses, char.backgroundBonuses, char.asiBonuses, char.featAbilityBonuses);

  return (
    <Tabs defaultValue="abilities" className="space-y-4">
      <TabsList className="grid h-auto grid-cols-2 md:grid-cols-6">
        <TabsTrigger className="min-h-11" value="abilities">Abilities/Saves</TabsTrigger>
        <TabsTrigger className="min-h-11" value="actions">Actions</TabsTrigger>
        <TabsTrigger className="min-h-11" value="spells">Spells</TabsTrigger>
        <TabsTrigger className="min-h-11" value="inventory">Inventory</TabsTrigger>
        <TabsTrigger className="min-h-11" value="features">Features</TabsTrigger>
        <TabsTrigger className="min-h-11" value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="abilities"><Card className="p-4 text-sm">PB +{char.proficiencyBonus} • AC {char.armorClass} • HP {char.hitPoints.max}</Card></TabsContent>
      <TabsContent value="actions"><Card className="p-4 text-sm space-y-1">{char.attacks.map((a) => <p key={a.weaponId}>{a.name} ({a.attackBonus >= 0 ? '+' : ''}{a.attackBonus})</p>)}</Card></TabsContent>
      <TabsContent value="spells"><Card className="p-4 text-sm">Truques: {char.spells.cantrips.length} • Magias: {char.spells.prepared.length}</Card></TabsContent>
      <TabsContent value="inventory"><Card className="p-4 text-sm">Itens: {char.inventory.length}</Card></TabsContent>
      <TabsContent value="features"><Card className="p-4 text-sm">{char.features.map((f) => <p key={`${f.sourceType}-${f.sourceId}-${f.name}`}>{f.name}</p>)}</Card></TabsContent>
      <TabsContent value="notes"><Card className="p-4 text-sm">Perícias treinadas: {ALL_SKILLS.filter((s) => char.skills.includes(s.name)).length}. Percepção passiva: {10 + calcAbilityMod(finalScores.wis) + (char.skills.includes("Percepção") ? char.proficiencyBonus : 0)}</Card></TabsContent>
    </Tabs>
  );
}
