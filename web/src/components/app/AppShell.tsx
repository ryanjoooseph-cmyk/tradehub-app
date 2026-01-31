"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

type NavItem = { href: string; label: string; k: string };

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = useMemo(
    () => [
      { href: "/app/dashboard", label: "Dashboard", k: "D" },
      { href: "/app/jobs", label: "Jobs", k: "J" },
      { href: "/app/calendar", label: "Calendar", k: "C" },
      { href: "/app/clients", label: "Clients", k: "C" },
      { href: "/app/invoices", label: "Invoices", k: "I" },
      { href: "/app/escrow", label: "Escrow", k: "E" },
      { href: "/app/team", label: "Team", k: "T" },
      { href: "/app/settings", label: "Settings", k: "S" },
    ],
    []
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted md:hidden"
            aria-label="Toggle sidebar"
          >
            ≡
          </button>

          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-foreground" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">TradeHub</div>
              <div className="text-[11px] text-muted-foreground">Ops Platform</div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
              <span className="text-xs">⌘K</span>
              <span>Search jobs, clients, invoices…</span>
            </div>
            <span className="sr-only">theme-toggle-mounted</span><ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside
          className={[
            "border-r bg-background md:sticky md:top-14 md:h-[calc(100dvh-56px)]",
            open ? "block" : "hidden md:block",
          ].join(" ")}
        >
          <div className="px-2 py-3">
            <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
              Workspace
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((i) => {
                const active =
                  pathname === i.href || (i.href !== "/app/dashboard" && pathname?.startsWith(i.href));
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={[
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      active ? "bg-muted" : "hover:bg-muted/60",
                    ].join(" ")}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs">
                      {i.k}
                    </span>
                    <span className="truncate">{i.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 px-3 text-xs text-muted-foreground">
              Premium shell locked across app.
            </div>
          </div>
        </aside>

        <main className="min-h-[calc(100dvh-56px)] px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
