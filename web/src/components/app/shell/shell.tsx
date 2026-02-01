import React from "react";
import { Sidebar, Topbar } from "@/components/app/shell/nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
