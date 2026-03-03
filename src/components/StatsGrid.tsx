import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { calcAbilityMod, type AbilityKey, ABILITY_SHORT } from "@/utils/calculations";

interface StatsGridItem {
  key: AbilityKey;
  score: number;
  modifier?: number;
  rightSlot?: ReactNode;
}

interface StatsGridProps {
  stats: StatsGridItem[];
  className?: string;
}

interface StatsRowProps {
  label: string;
  value: number | string;
  modifier?: number;
  highlightModifier?: boolean;
  className?: string;
}

function formatModifier(modifier: number) {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function StatsRow({ label, value, modifier, highlightModifier = true, className }: StatsRowProps) {
  return (
    <div className={cn("flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{value}</span>
        {typeof modifier === "number" && (
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-xs font-semibold",
              highlightModifier
                ? "bg-primary/15 text-primary"
                : "bg-secondary/60 text-muted-foreground"
            )}
          >
            {formatModifier(modifier)}
          </span>
        )}
      </div>
    </div>
  );
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {stats.map((stat) => {
        const modifier = stat.modifier ?? calcAbilityMod(stat.score);
        return (
          <div key={stat.key} className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">{ABILITY_SHORT[stat.key]}</span>
              {stat.rightSlot}
            </div>
            <StatsRow label="Valor" value={stat.score} modifier={modifier} />
          </div>
        );
      })}
    </div>
  );
}
