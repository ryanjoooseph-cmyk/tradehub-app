"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import ThemeToggle from "@/components/app/ThemeToggle";

type NavItem = { href: string; label: string; short: string };

const NAV: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", short: "D" },
  { href: "/app/calendar", label: "Calendar", short: "C" },
  { href: "/app/jobs", label: "Jobs", short: "J" },
  { href: "/app/clients", label: "Clients", short: "CL" },
  { href: "/app/invoices", label: "Invoices", short: "I" },
  { href: "/app/escrow", label: "Escrow", short: "E" },
  { href: "/app/team", label: "Team", short: "T" },
  { href: "/app/settings", label: "Settings", short: "S" },
];

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const activeHref = useMemo(() => {
    const hit = NAV.find((n) => pathname === n.href || pathname?.startsWith(n.href + "/"));
    return hit?.href ?? "/app/dashboard";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b bg-background/75 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground"
          >
            ≡
          </button>

          <Link href="/app/dashboard" className="text-sm font-semibold tracking-tight">
            TradeHub
          </Link>

          <div className="hidden md:flex flex-1 items-center">
            <div className="w-full max-w-xl">
              <div className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground">
                <span className="opacity-70">⌘</span>
                <span className="opacity-70">K</span>
                <span className="mx-1 h-4 w-px bg-border" />
                <span className="truncate">Search jobs, clients, invoices…</span>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/app/settings"
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Shell */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_1fr] gap-0">
        {/* Sidebar */}
        <aside
          className={cx(
            "sticky top-14 h-[calc(100dvh-3.5rem)] border-r bg-background/50 backdrop-blur",
            collapsed ? "w-[72px]" : "w-[260px]"
          )}
        >
          <div className="p-3">
            <div className="mb-3 rounded-lg border bg-gradient-to-br from-accent/40 to-transparent p-3">
              <div className="text-xs text-muted-foreground">Workspace</div>
              <div className="text-sm font-semibold">TradeHub HQ</div>
              <div className="mt-2 text-xs text-muted-foreground">Status: Live</div>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "group flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
                    )}
                  >
                    <span
                      className={cx(
                        "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-xs font-semibold",
                        active && "bg-background/60"
                      )}
                    >
                      {item.short}
                    </span>
                    <span className={cx(collapsed && "hidden")}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 p-5">
          <div className="rounded-xl border bg-gradient-to-b from-background to-background/60 p-4 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
