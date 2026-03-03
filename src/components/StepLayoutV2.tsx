import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StepLayoutV2Props {
  /**
   * Título principal da etapa
   */
  title: string;

  /**
   * Descrição ou objetivo da etapa
   */
  description?: string;

  /**
   * Painel de lista/seleção (esquerda em desktop, topo em mobile)
   */
  listPanel?: ReactNode;

  /**
   * Painel de detalhes (direita em desktop, embaixo em mobile)
   */
  detailPanel: ReactNode;

  /**
   * Estado vazio quando nada está selecionado
   */
  emptyState?: ReactNode;

  /**
   * Se há uma seleção ativa
   */
  hasSelection?: boolean;

  /**
   * Se a lista está carregando
   */
  isLoadingList?: boolean;

  /**
   * Seções adicionais abaixo do conteúdo principal (ex: dicas, avisos)
   */
  footerSection?: ReactNode;
}

export function StepLayoutV2({
  title,
  description,
  listPanel,
  detailPanel,
  emptyState,
  hasSelection = true,
  isLoadingList = false,
  footerSection,
}: StepLayoutV2Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      {(title || description) && (
        <div className="dashboard-card-base rounded-none border-x-0 border-t-0 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-b from-card/60 to-card/30">
          {title && (
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-display mb-1">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-0 flex-1 overflow-hidden">
        {/* List Panel */}
        {listPanel ? (
          <aside className="w-full md:w-80 md:shrink-0 border-b md:border-b-0 md:border-r border-border/30 overflow-y-auto bg-card/20">
            {isLoadingList ? (
              <div className="p-4 space-y-2" aria-label="Carregando opções">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                {listPanel}
              </div>
            )}
          </aside>
        ) : null}

        {/* Detail Panel */}
        <section className="flex-1 overflow-y-auto">
          {hasSelection ? (
            <div className="p-4 sm:p-6">
              {detailPanel}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              {emptyState ?? <DefaultEmptyState />}
            </div>
          )}
        </section>
      </div>

      {/* Footer Section */}
      {footerSection && (
        <div className="dashboard-card-base rounded-none border-x-0 border-b-0 bg-card/30 p-4 sm:p-6">
          {footerSection}
        </div>
      )}
    </div>
  );
}

function DefaultEmptyState() {
  return (
    <div className="empty-state-container">
      <div className="text-3xl opacity-30">📋</div>
      <p className="text-sm text-muted-foreground/60 font-display text-center">
        Selecione uma opção para ver os detalhes
      </p>
    </div>
  );
}

/**
 * Componente para seções dentro do painel de detalhes
 */
interface DetailSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function DetailSection({ title, description, children, icon }: DetailSectionProps) {
  return (
    <div className="mb-6 last:mb-0">
      {/* Section Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          {icon && <div className="text-xl">{icon}</div>}
          <h3 className="dashboard-section-title text-xs sm:text-sm text-gold/80">{title}</h3>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground/70 ml-7">{description}</p>
        )}
      </div>

      {/* Section Content */}
      <div className="ml-0">
        {children}
      </div>
    </div>
  );
}

/**
 * Componente para cards de seleção dentro da lista
 */
interface SelectionCardProps {
  isSelected: boolean;
  isActive?: boolean;
  hasPending?: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: ReactNode;
  icon?: ReactNode;
}

export function SelectionCard({
  isSelected,
  isActive,
  hasPending,
  onClick,
  title,
  subtitle,
  description,
  badge,
  icon,
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`card-selection-base w-full group ${
        isSelected
          ? "card-selection-selected"
          : "card-selection-unselected"
      } ${isActive ? "ring-2 ring-gold/20" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {icon && (
          <div className="shrink-0 text-xl mt-0.5">
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm text-foreground">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {badge && (
              <div className="shrink-0">
                {badge}
              </div>
            )}
          </div>

          {description && (
            <p className="text-xs text-muted-foreground/60 mt-1.5 leading-relaxed">
              {description}
            </p>
          )}

          {hasPending && (
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning/8 border border-warning/15">
              <span className="text-warning/70 text-xs">⚠️</span>
              <span className="text-[10px] text-warning/70 font-medium">Pendências</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
