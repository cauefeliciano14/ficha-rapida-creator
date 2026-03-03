import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sectionVariants = cva("rounded-2xl border px-4", {
  variants: {
    variant: {
      default: "border-border bg-card",
      muted: "border-border/70 bg-secondary/20",
      primary: "border-primary/30 bg-primary/5",
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
}: CollapsibleSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "section" : undefined} className={cn(sectionVariants({ variant }), className)}>
      <AccordionItem value="section" className="border-b-0">
        <AccordionTrigger className="py-3 hover:no-underline">
          <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
            {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
            <span className="truncate text-sm font-semibold">{title}</span>
            {badge && <span className="shrink-0">{badge}</span>}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-3 pt-0 text-sm">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function SimpleCollapsible({ title, children, defaultOpen = false, className }: SimpleCollapsibleProps) {
  return (
    <CollapsibleSection title={title} defaultOpen={defaultOpen} className={className}>
      {children}
    </CollapsibleSection>
  );
}
