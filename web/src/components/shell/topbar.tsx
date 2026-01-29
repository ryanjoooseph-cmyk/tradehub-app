"use client";

import { Menu, Bell, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  return (
    <header className="h-16 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-card/40 hover:bg-accent/50"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 max-w-[520px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 rounded-xl bg-card/40" placeholder="Search jobs, clients, invoices…" />
        </div>

        <div className="flex items-center gap-2">
          <Button className="rounded-xl" type="button">
            <Plus className="h-4 w-4" />
            New
          </Button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-card/40 hover:bg-accent/50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="h-10 w-10 rounded-xl border bg-card/40 flex items-center justify-center font-semibold">
            R
          </div>
        </div>
      </div>
    </header>
  );
}
