import { Swords } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 dnd-header">
      <div className="flex h-auto min-h-16 items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="dashboard-card-base dashboard-card-elevated relative flex h-10 w-10 items-center justify-center border-primary/20 bg-primary/10 p-0">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-lg" />
            <Swords className="relative h-5 w-5 text-gold logo-glow" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <h1 className="font-display font-bold tracking-wide text-foreground">
              <span className="text-sm sm:hidden">D&D Builder</span>
              <span className="hidden text-base sm:inline">D&D 2024 Character Builder</span>
            </h1>
            <span className="dashboard-section-title hidden text-[10px] text-gold/60 sm:block">Criador de Personagem</span>
          </div>
          <div className="ml-1 hidden items-center gap-1 sm:flex">
            <span className="dashboard-kpi-value inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary/80">
              2024
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
