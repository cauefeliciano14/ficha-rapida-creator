import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { skills as catalogSkills, skillsById, skillsByName, type SkillData } from "@/data/skills";
import type { AbilityKey } from "@/utils/calculations";

const ABILITY_ORDER: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];
const ABILITY_SHORT_PT: Record<AbilityKey, string> = {
  str: "FOR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "SAB",
  cha: "CAR",
};

interface SkillsGroupedProps {
  skills?: Array<string | SkillData>;
  className?: string;
}

interface SkillsBadgesProps {
  skills?: Array<string | SkillData>;
  className?: string;
}

function normalizeSkill(entry: string | SkillData): SkillData | null {
  if (typeof entry !== "string") return entry;
  return skillsById[entry] ?? skillsByName[entry] ?? null;
}

function groupSkills(input?: Array<string | SkillData>) {
  const source = input?.length ? input : catalogSkills;
  const grouped = new Map<AbilityKey, SkillData[]>();

  for (const ability of ABILITY_ORDER) {
    grouped.set(ability, []);
  }

  for (const skill of source) {
    const normalized = normalizeSkill(skill);
    if (!normalized) continue;
    grouped.get(normalized.ability)?.push(normalized);
  }

  for (const ability of ABILITY_ORDER) {
    grouped.get(ability)?.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  return grouped;
}

export function SkillsGrouped({ skills, className }: SkillsGroupedProps) {
  const grouped = groupSkills(skills);

  return (
    <div className={cn("space-y-3", className)}>
      {ABILITY_ORDER.map((ability) => {
        const items = grouped.get(ability) ?? [];
        if (!items.length) return null;

        return (
          <section key={ability} className="rounded-xl border border-border/60 bg-card p-3">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {ABILITY_SHORT_PT[ability]}
            </h4>
            <SkillsBadges skills={items} />
          </section>
        );
      })}
    </div>
  );
}

export function SkillsBadges({ skills, className }: SkillsBadgesProps) {
  const source = skills?.length ? skills : catalogSkills;
  const normalized = source.map(normalizeSkill).filter((item): item is SkillData => item !== null);

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {normalized.map((skill) => (
        <Badge key={skill.id} variant="secondary" className="font-normal">
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}
