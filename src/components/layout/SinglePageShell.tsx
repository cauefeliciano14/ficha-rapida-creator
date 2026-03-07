import { type ReactNode } from "react";
import { Header } from "@/components/Header";
import { IdentityHeader } from "@/components/IdentityHeader";
import { getDevAuditStatus } from "@/utils/validateData";

interface SinglePageShellProps {
  sidebar: ReactNode;
  summary: ReactNode;
  children: ReactNode;
}

export function SinglePageShell({ sidebar, summary, children }: SinglePageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {import.meta.env.DEV && getDevAuditStatus().totalErrors > 0 && (
        <div className="bg-destructive text-destructive-foreground text-xs px-4 py-1.5 text-center rounded-b-xl mx-auto max-w-md">
          DEV: {getDevAuditStatus().totalErrors} erro(s) de dados
        </div>
      )}
      <Header />
      <IdentityHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - anchor nav - desktop only */}
        <aside className="hidden lg:flex w-56 shrink-0 border-r border-sidebar-border bg-sidebar flex-col overflow-y-auto sticky top-0 h-screen">
          {sidebar}
        </aside>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto" id="main-scroll-area">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-4">
            {children}
          </div>
        </main>

        {/* Summary sidebar - xl only */}
        <aside className="hidden xl:flex w-72 shrink-0 border-l border-border/40 flex-col overflow-y-auto sticky top-0 h-screen">
          {summary}
        </aside>
      </div>
    </div>
  );
}
