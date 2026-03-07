import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useBuilderStore } from "@/state/builderStore";
import { useCharacterStore } from "@/state/characterStore";
import { classes } from "@/data/classes";
import { races } from "@/data/races";
import { backgrounds } from "@/data/backgrounds";

export interface SectionDef {
  id: string;
  label: string;
  icon: string;
}

export const SECTIONS: SectionDef[] = [
  { id: "class", label: "Classe", icon: "⚔️" },
  { id: "origin", label: "Origem", icon: "📜" },
  { id: "race", label: "Raça", icon: "🧬" },
  { id: "abilities", label: "Atributos", icon: "💪" },
  { id: "equipment", label: "Equipamento", icon: "🛡️" },
  { id: "choices", label: "Escolhas", icon: "✅" },
  { id: "sheet", label: "Ficha", icon: "📋" },
];

export function SidebarNav() {
  const [activeSection, setActiveSection] = useState<string>("class");
  const completedSteps = useBuilderStore((s) => s.completedSteps);
  const classId = useCharacterStore((s) => s.class);
  const raceId = useCharacterStore((s) => s.race);
  const bgId = useCharacterStore((s) => s.background);

  const cls = classes.find((c) => c.id === classId);
  const race = races.find((r) => r.id === raceId);
  const bg = backgrounds.find((b) => b.id === bgId);

  const summaryMap: Record<string, string | undefined> = {
    class: cls?.name,
    origin: bg?.name,
    race: race?.name,
  };

  // IntersectionObserver to highlight active section on scroll
  useEffect(() => {
    const scrollArea = document.getElementById("main-scroll-area");
    if (!scrollArea) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) setActiveSection(id);
          }
        }
      },
      { root: scrollArea, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach((sec) => {
      const el = document.querySelector(`[data-section-id="${sec.id}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((sectionId: string) => {
    const el = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const doneCount = completedSteps.filter((id) => SECTIONS.some((s) => s.id === id)).length;
  const progressPct = Math.round((doneCount / SECTIONS.length) * 100);

  return (
    <div className="flex flex-col h-full">
      {/* Progress header */}
      <div className="px-4 pt-5 pb-4 border-b border-sidebar-border">
        <p className="dashboard-section-title mb-3 text-gold/70">Seções</p>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-foreground/80 font-medium">Progresso</span>
          <span className="text-[11px] text-primary/90 font-display bg-primary/10 px-2.5 py-1 rounded-full font-bold">
            {doneCount}/{SECTIONS.length}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              background: progressPct === 100
                ? "linear-gradient(to right, hsl(152 55% 42%), hsl(152 55% 52%))"
                : "linear-gradient(to right, hsl(25 95% 53%), hsl(40 70% 50%))",
            }}
          />
        </div>
      </div>

      {/* Section links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Navegação por seções">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const isDone = completedSteps.includes(sec.id as any);
          const summary = summaryMap[sec.id];

          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? "sidebar-step-active"
                  : isDone
                  ? "sidebar-step-done hover:bg-success/5"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              {/* Status icon */}
              <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-secondary/40 text-xs">
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                ) : isActive ? (
                  <span className="text-sm leading-none">{sec.icon}</span>
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground/40" />
                )}
              </span>

              {/* Label + summary */}
              <div className="min-w-0 flex-1">
                <span className={`block truncate text-[12px] font-medium leading-tight ${
                  isActive ? "font-semibold text-foreground" : isDone ? "text-success/80" : ""
                }`}>
                  {sec.label}
                </span>
                {summary && (
                  <span className="block truncate text-[10px] text-muted-foreground/50 mt-0.5">
                    {summary}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground/40 leading-relaxed">
          💡 Clique para navegar. Preencha em qualquer ordem.
        </p>
      </div>
    </div>
  );
}
