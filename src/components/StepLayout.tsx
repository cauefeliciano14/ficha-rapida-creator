import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StepLayoutProps {
  listPanel?: ReactNode;
  detailPanel: ReactNode;
  emptyState?: ReactNode;
  hasSelection?: boolean;
  isLoadingList?: boolean;
}

export function StepLayout({
  listPanel,
  detailPanel,
  emptyState,
  hasSelection = true,
  isLoadingList = false,
}: StepLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row gap-0">
      {listPanel ? (
        <aside className="w-full md:w-80 md:shrink-0 border-b md:border-b-0 md:border-r p-4 overflow-y-auto">
          {isLoadingList ? (
            <div className="space-y-2" aria-label="Carregando opções">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ) : (
            listPanel
          )}
        </aside>
      ) : null}

      <section className="flex-1 overflow-y-auto p-4 md:p-6">
        {hasSelection ? detailPanel : emptyState ?? <DefaultEmptyState />}
      </section>
    </div>
  );
}

function DefaultEmptyState() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
      Selecione um item para ver os detalhes.
    </div>
  );
}
