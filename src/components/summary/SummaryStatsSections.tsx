import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ABILITIES, ABILITY_SHORT, calcAbilityMod, type AbilityKey } from "@/utils/calculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type SkillRow = {
  name: string;
  ability: AbilityKey;
  total: number;
  proficient: boolean;
};

export function StatsGrid({ scores }: { scores: Partial<Record<AbilityKey, number>> }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {ABILITIES.map((ability) => {
        const total = Number.isFinite(scores[ability]) ? (scores[ability] as number) : 10;
        const mod = calcAbilityMod(total);
        return (
          <div key={ability} className="dashboard-card-base dashboard-card-interactive p-2 text-center">
            <p className="dashboard-section-title text-[10px]">{ABILITY_SHORT[ability]}</p>
            <p className="dashboard-kpi-value text-lg mt-1">{total}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{mod >= 0 ? "+" : ""}{mod}</p>
          </div>
        );
      })}
    </div>
  );
}

export function SkillsGrouped({
  allSkills,
  selectedSkills,
  finalScores,
  proficiencyBonus,
}: {
  allSkills: { name: string; ability: AbilityKey }[];
  selectedSkills: string[];
  finalScores: Partial<Record<AbilityKey, number>>;
  proficiencyBonus: number;
}) {
  const grouped = ABILITIES.map((ability) => {
    const list = allSkills
      .filter((skill) => skill.ability === ability)
      .map((skill) => {
        const baseScore = Number.isFinite(finalScores[ability]) ? (finalScores[ability] as number) : 10;
        const proficient = selectedSkills.includes(skill.name);
        const total = calcAbilityMod(baseScore) + (proficient ? proficiencyBonus : 0);

        return {
          name: skill.name,
          ability: skill.ability,
          total,
          proficient,
        } satisfies SkillRow;
      });

    return {
      ability,
      list,
    };
  }).filter((entry) => entry.list.length > 0);

  if (grouped.length === 0) {
    return <p className="text-xs text-muted-foreground/70 italic">Nenhuma perícia disponível.</p>;
  }

  return (
    <div className="space-y-2">
      {grouped.map(({ ability, list }) => (
        <div key={ability} className="dashboard-card-base bg-secondary/10 px-1.5 py-1">
          <p className="dashboard-section-title text-[10px] px-1 pb-0.5">{ABILITY_SHORT[ability]}</p>
          <div className="space-y-0.5">
            {list.map((skill) => (
              <div key={skill.name} className={`flex items-center gap-1.5 text-[11px] py-0.5 px-1 rounded ${skill.proficient ? "text-foreground" : "text-muted-foreground/60"}`}>
                {skill.proficient ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-success shrink-0" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full border border-muted-foreground/20 shrink-0" />
                )}
                <span className="flex-1 truncate">{skill.name}</span>
                <span className={`font-mono font-bold text-[11px] w-5 text-right ${skill.proficient ? "" : "text-muted-foreground/40"}`}>
                  {skill.total >= 0 ? "+" : ""}{skill.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <div className="flex items-center gap-2 mb-2">
        <CollapsibleTrigger className="group flex items-center gap-1 text-left">
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          <p className="dashboard-section-title">{title}</p>
        </CollapsibleTrigger>
        <div className="flex-1 h-px bg-border/40" />
      </div>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
