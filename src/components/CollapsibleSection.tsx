import { useState, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sectionVariants = cva("rounded-2xl border px-4 transition-all duration-300", {
  variants: {
    variant: {
      default: "border-border/50 bg-card/70 backdrop-blur-sm",
      muted: "border-border/40 bg-secondary/20",
      primary: "border-primary/20 bg-primary/5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface CollapsibleSectionProps extends VariantProps<typeof sectionVariants> {
  title: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Show a green checkmark when section is complete */
  isComplete?: boolean;
  /** Section anchor id for scroll-to navigation */
  sectionId?: string;
  /** Status label shown next to title */
  statusLabel?: string;
}

interface SimpleCollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  variant,
  badge,
  icon,
  children,
  className,
  isComplete,
  sectionId,
  statusLabel,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      id={sectionId}
      data-section-id={sectionId}
      className={cn(
        sectionVariants({ variant }),
        open && "border-gold/15 shadow-[0_4px_24px_hsl(0_0%_0%/0.15)]",
        isComplete && !open && "border-success/20",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 py-3.5 text-left hover:opacity-90 transition-opacity"
        aria-expanded={open}
      >
        {/* Icon */}
        {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}

        {/* Completion indicator */}
        {isComplete && (
          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
        )}

        {/* Title */}
        <span className="truncate text-sm font-semibold flex-1">{title}</span>

        {/* Status label */}
        {statusLabel && (
          <span className="text-[10px] font-medium text-muted-foreground/60 shrink-0">
            {statusLabel}
          </span>
        )}

        {/* Badge */}
        {badge && <span className="shrink-0">{badge}</span>}

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground/50 shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-0 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SimpleCollapsible({ title, children, defaultOpen = false, className }: SimpleCollapsibleProps) {
  return (
    <CollapsibleSection title={title} defaultOpen={defaultOpen} className={className}>
      {children}
    </CollapsibleSection>
  );
}
