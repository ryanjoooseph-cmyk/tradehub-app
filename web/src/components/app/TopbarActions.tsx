"use client";

import { useMemo, useState } from "react";
import { Bell, Search, Zap } from "lucide-react";
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
    ],
    []
  );

  return (
    <div className="ml-auto flex items-center gap-2">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm hover:bg-muted/40"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline text-muted-foreground">Search</span>
        <span className="hidden sm:inline text-xs text-muted-foreground">⌘K</span>
      </button>

      <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted/40" aria-label="Quick actions">
        <Zap className="h-4 w-4" />
      </button>

      <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted/40" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </button>

      <ThemeToggle />

      <CommandPalette open={open} onOpenChange={setOpen} items={items} />
    </div>
  );
}
