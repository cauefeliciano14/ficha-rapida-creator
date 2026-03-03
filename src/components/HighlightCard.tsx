import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const highlightCardVariants = cva("rounded-2xl border p-4 shadow-sm transition-colors", {
  variants: {
    variant: {
      primary: "border-primary/30 bg-primary/5 text-foreground",
      gold: "border-gold/35 bg-gold/10 text-foreground",
      success: "border-emerald-500/35 bg-emerald-500/10 text-foreground",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const miniHighlightVariants = cva("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      primary: "border-primary/30 bg-primary/10 text-primary",
      gold: "border-gold/35 bg-gold/15 text-gold",
      success: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface HighlightCardProps extends VariantProps<typeof highlightCardVariants> {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}

interface MiniHighlightProps extends VariantProps<typeof miniHighlightVariants> {
  children: ReactNode;
  className?: string;
}

export function HighlightCard({ title, subtitle, children, variant, className }: HighlightCardProps) {
  return (
    <section className={cn(highlightCardVariants({ variant }), className)}>
      {(title || subtitle) && (
        <header className="mb-2 space-y-0.5">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}

export function MiniHighlight({ children, variant, className }: MiniHighlightProps) {
  return <span className={cn(miniHighlightVariants({ variant }), className)}>{children}</span>;
}
