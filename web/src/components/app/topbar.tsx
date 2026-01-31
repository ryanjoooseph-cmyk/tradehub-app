"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";

export function Topbar() {
  return (
    <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4">
        <Link href="/app/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">TH</span>
          <span className="hidden sm:block">TradeHub</span>
        </Link>

        <div className="ml-2 hidden flex-1 items-center gap-2 md:flex">
          <div className="flex h-10 w-full max-w-xl items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search jobs, clients, invoices…"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button size="icon" variant="default" className="rounded-xl" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
