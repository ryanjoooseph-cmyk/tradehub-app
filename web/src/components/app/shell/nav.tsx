"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import React from "react";

const items = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/jobs", label: "Jobs" },
  { href: "/app/calendar", label: "Calendar" },
  { href: "/app/clients", label: "Clients" },
  { href: "/app/invoices", label: "Invoices" },
  { href: "/app/escrow", label: "Escrow" },
  { href: "/app/team", label: "Team" },
  { href: "/app/settings", label: "Settings" },
];

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

function ThemeIconToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const current = (theme === "system" ? resolvedTheme : theme) ?? "light";
  const isDark = current === "dark";
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs hover:bg-accent/40"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function Sidebar() {
  const p = usePathname() || "";
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:gap-3 lg:border-r lg:bg-background">
      <div className="px-5 pt-5">
        <div className="text-lg font-semibold tracking-tight">TradeHub</div>
        <div className="text-xs text-muted-foreground">Ops Command Platform</div>
      </div>

      <nav className="px-3 pb-4">
        <div className="space-y-1">
          {items.map((it) => {
            const active = p === it.href || p.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cx(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                )}
              >
                <span className="font-medium">{it.label}</span>
                <span className={cx("h-2 w-2 rounded-full", active ? "bg-foreground/70" : "bg-foreground/20")} />
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto px-5 pb-5">
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm font-medium">Live Ops</div>
          <div className="mt-1 text-xs text-muted-foreground">Realtime health, cashflow, disputes & escrow.</div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="font-semibold">18</div>
              <div className="text-muted-foreground">Jobs</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="font-semibold">0</div>
              <div className="text-muted-foreground">Disputes</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="font-semibold">$42k</div>
              <div className="text-muted-foreground">A/R</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar() {
  const p = usePathname() || "";
  const title = items.find((i) => p === i.href || p.startsWith(i.href + "/"))?.label ?? "App";
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold tracking-tight">{title}</div>
        <div className="hidden md:block text-xs text-muted-foreground">Institutional-grade ops for trades.</div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeIconToggle />
        <Link href="/app/settings" className="rounded-lg border px-3 py-2 text-xs hover:bg-accent/40">
          Settings
        </Link>
      </div>
    </header>
  );
}
