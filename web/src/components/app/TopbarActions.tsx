"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Search, Zap, Store } from "lucide-react";
import CommandPalette from "../ops/shell/CommandPalette";
import ThemeToggle from "./ThemeToggle";

export default function TopbarActions() {
  const [open, setOpen] = useState(false);
  const items = useMemo(
    () => [
      { label: "Dashboard", href: "/app/dashboard", keywords: ["home", "overview"] },
      { label: "Jobs", href: "/app/jobs", keywords: ["pipeline", "work"] },
      { label: "Calendar", href: "/app/calendar", keywords: ["schedule"] },
      { label: "Clients", href: "/app/clients", keywords: ["crm"] },
      { label: "Invoices", href: "/app/invoices", keywords: ["billing"] },
      { label: "Escrow", href: "/app/escrow", keywords: ["payments", "trust"] },
      { label: "Team", href: "/app/team", keywords: ["staff"] },
      { label: "Settings", href: "/app/settings", keywords: ["config"] },
      { label: "Dispatch", href: "/dispatch", keywords: ["ops"] },
      { label: "Escrow Ops", href: "/escrow", keywords: ["admin"] },
      { label: "Marketplace", href: "/app/market", keywords: ["store", "shop", "buy"] },
    ],
    []
  );

  return (
    <div className="ml-auto flex items-center gap-2">
      {/* Marketplace Link - Premium CTA */}
      <Link
        href="/app/market"
        className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        <Store className="h-4 w-4" />
        <span>Marketplace</span>
      </Link>

      {/* Mobile Marketplace Icon */}
      <Link
        href="/app/market"
        className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm transition-all hover:from-violet-700 hover:to-indigo-700"
        aria-label="Marketplace"
      >
        <Store className="h-4 w-4" />
      </Link>

      {/* Search */}
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/50 bg-background px-3 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Quick Actions */}
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Quick actions"
      >
        <Zap className="h-4 w-4" />
      </button>

      {/* Notifications */}
      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {/* Notification Dot */}
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Command Palette */}
      <CommandPalette open={open} onOpenChange={setOpen} items={items} />
    </div>
  );
}
