import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { IdentityHeader } from "@/components/IdentityHeader";
import { getDevAuditStatus } from "@/utils/validateData";

interface BuilderShellProps {
  children: ReactNode;
}

export function BuilderShell({ children }: BuilderShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {import.meta.env.DEV && getDevAuditStatus().totalErrors > 0 && (
        <div className="bg-destructive text-destructive-foreground text-xs px-4 py-1.5 text-center rounded-b-xl mx-auto max-w-md">
          DEV: {getDevAuditStatus().totalErrors} erro(s) de dados
        </div>
      )}
      <Header />
      <IdentityHeader />
      {children}
    </div>
  );
}
