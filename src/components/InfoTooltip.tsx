import type { ReactNode } from "react";
import { Info, Lightbulb, ScrollText, TriangleAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/state/builderStore";

type InfoTooltipVariant = "tip" | "info" | "warning" | "rule";
type InlineHintVariant = "tip" | "info" | "rule";

interface InfoTooltipProps {
  content: ReactNode;
  children: ReactNode;
  variant?: InfoTooltipVariant;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

interface InlineHintProps {
  children: ReactNode;
  variant?: InlineHintVariant;
  className?: string;
}

const variantStyles: Record<InfoTooltipVariant, string> = {
  tip: "border-emerald-400/30 bg-emerald-50/10 text-emerald-100",
  info: "border-sky-400/30 bg-sky-50/10 text-sky-100",
  warning: "border-amber-400/30 bg-amber-50/10 text-amber-100",
  rule: "border-violet-400/30 bg-violet-50/10 text-violet-100",
};

const inlineStyles: Record<InlineHintVariant, string> = {
  tip: "text-emerald-700 dark:text-emerald-300",
  info: "text-sky-700 dark:text-sky-300",
  rule: "text-violet-700 dark:text-violet-300",
};

const iconByVariant: Record<InfoTooltipVariant, typeof Lightbulb> = {
  tip: Lightbulb,
  info: Info,
  warning: TriangleAlert,
  rule: ScrollText,
};

export function InfoTooltip({
  content,
  children,
  variant = "info",
  side = "top",
  className,
}: InfoTooltipProps) {
  const beginnerHelp = useBuilderStore((s) => s.preferences.beginnerHelp);

  if (!beginnerHelp) {
    return <>{children}</>;
  }

  const Icon = iconByVariant[variant];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={cn("max-w-xs rounded-xl border p-3", variantStyles[variant], className)}>
          <div className="flex items-start gap-2">
            <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="text-xs leading-relaxed">{content}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function InlineHint({ children, variant = "info", className }: InlineHintProps) {
  const beginnerHelp = useBuilderStore((s) => s.preferences.beginnerHelp);

  if (!beginnerHelp) {
    return null;
  }

  return (
    <p className={cn("text-xs leading-relaxed", inlineStyles[variant], className)}>
      {children}
    </p>
  );
}
