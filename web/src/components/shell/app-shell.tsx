"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:block">
        <Sidebar />
      </div>

      <div className="md:pl-[280px]">
        <Topbar onOpenMobileNav={() => setOpen(true)} />

        <main className="px-4 md:px-6 py-6">
          <div className="mx-auto w-full max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
