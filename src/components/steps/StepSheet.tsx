import { useMemo, useEffect } from "react";
import { useCharacterStore } from "@/state/characterStore";
import { useBuilderStore } from "@/state/builderStore";
import { validateCharacterCompleteness } from "@/utils/validation";
import { StepReview } from "./StepReview";
import { StepPlaySheet } from "./StepPlaySheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function StepSheet() {
  const char = useCharacterStore();
  const builder = useBuilderStore();

  const validation = useMemo(
    () => validateCharacterCompleteness(char, builder.choicesRequirements?.needsStep ?? false),
    [
      char.race, char.subrace, char.class, char.background,
      char.abilityGeneration.confirmed, char.abilityGeneration.method,
      char.classSkillChoices, char.classEquipmentChoice, char.backgroundEquipmentChoice,
      char.spells.cantrips, char.spells.prepared, char.spells.spellcastingAbility,
      char.raceAbilityChoices, char.backgroundAbilityChoices,
      char.inventory, char.equipped, char.features,
      char.classFeatureChoices, char.level,
      builder.choicesRequirements?.needsStep,
    ]
  );

  const missingKey = useMemo(() => validation.missing.map((m) => m.id).join("|"), [validation.missing]);
  const sheetReady = validation.isComplete;

  useEffect(() => {
    if (validation.isComplete) {
      builder.completeStep("sheet");
      builder.setMissing("sheet", []);
    } else {
      builder.uncompleteStep("sheet");
      builder.setMissing("sheet", validation.missing.map((m) => m.label));
    }
  }, [validation.isComplete, missingKey]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card className="p-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Status da ficha</p>
          <p className="text-xs text-muted-foreground">Checklist completo para jogar e próximos passos.</p>
        </div>
        <Badge className={sheetReady ? "bg-success text-success-foreground" : ""} variant={sheetReady ? "default" : "outline"}>
          {sheetReady ? "Sheet Ready" : "Em progresso"}
        </Badge>
      </Card>

      <Tabs defaultValue="review" className="space-y-3">
        <TabsList className="grid grid-cols-2 w-full max-w-md h-auto">
          <TabsTrigger className="min-h-11" value="review">Review</TabsTrigger>
          <TabsTrigger className="min-h-11" value="play">Play Sheet</TabsTrigger>
        </TabsList>
        <TabsContent value="review"><StepReview /></TabsContent>
        <TabsContent value="play"><StepPlaySheet /></TabsContent>
      </Tabs>

      <Card className="p-4">
        <p className="text-sm font-semibold">What&apos;s next</p>
        <ul className="mt-2 text-xs text-muted-foreground list-disc pl-4 space-y-1">
          <li>Revise pendências do Review e ajuste etapas necessárias.</li>
          <li>Abra a Play Sheet para consulta rápida durante a sessão.</li>
          <li>Use /print para gerar versão de impressão.</li>
        </ul>
      </Card>
    </div>
  );
}
