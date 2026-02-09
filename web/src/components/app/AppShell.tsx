"use client";

import Link from "next/link";
import TopbarActions from "./TopbarActions";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect, startTransition } from "react";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const NAV = [
  { href: "/app/dashboard", label: "Dashboard", icon: "D" },
  { href: "/app/jobs", label: "Jobs", icon: "J" },
  { href: "/app/calendar", label: "Calendar", icon: "C" },
  { href: "/app/clients", label: "Clients", icon: "C" },
  { href: "/app/invoices", label: "Invoices", icon: "I" },
  { href: "/app/escrow", label: "Escrow", icon: "E" },
  { href: "/app/team", label: "Team", icon: "T" },
  { href: "/app/agents", label: "Agents", icon: "A" },
  { href: "/app/settings", label: "Settings", icon: "S" },
  { href: "/dispatch", label: "Dispatch", icon: "D" },
  { href: "/escrow", label: "Escrow Ops", icon: "O" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-close sidebar on mobile navigation
  useEffect(() => {
    const isMobileViewport = window.innerWidth < 768;
    if (isMobileViewport) {
      startTransition(() => {
        setCollapsed(true);
      });
    }
  }, [pathname]);

  const activeHref = useMemo(() => {
    // Sort by longest path first to avoid false matches
    const sorted = [...NAV].sort((a, b) => b.href.length - a.href.length);
    const hit = sorted.find((n) => pathname.startsWith(n.href));
    return hit?.href ?? "";
  }, [pathname]);

  const title = useMemo(() => {
    const hit = NAV.find((n) => pathname === n.href);
    return hit?.label ?? "TradeHub";
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-background text-foreground antialiased">
      {/* Premium Topbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 lg:px-6">
          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Toggle sidebar"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/app/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
              T
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold tracking-tight">TradeHub</div>
              <div className="text-[11px] text-muted-foreground/80">Operations Platform</div>
            </div>
          </Link>

          {/* Topbar Actions (includes Marketplace) */}
          <TopbarActions />

          {/* Current Page Indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 md:grid-cols-[auto_1fr]">
        {/* Premium Sidebar */}
        <aside
          className={cx(
            "border-r border-border/40 bg-background/50",
            "md:sticky md:top-14 md:h-[calc(100dvh-56px)] md:overflow-y-auto",
            "transition-all duration-200 ease-out",
            collapsed ? "md:w-[68px]" : "md:w-[240px]"
          )}
        >
          <div className="flex h-full flex-col px-3 py-4">
            {/* Section Header */}
            <div className={cx(
              "mb-3 px-2 transition-opacity duration-200",
              collapsed && "opacity-0"
            )}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Workspace
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-1">
              {NAV.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      active
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-foreground" />
                    )}

                    {/* Icon Badge */}
                    <span className={cx(
                      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors",
                      active
                        ? "bg-foreground text-background"
                        : "bg-muted/80 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                    )}>
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span className={cx(
                      "truncate transition-all duration-200",
                      collapsed && "w-0 opacity-0"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className={cx(
              "mt-auto border-t border-border/40 pt-4 transition-opacity duration-200",
              collapsed && "opacity-0"
            )}>
              <div className="px-2 text-[11px] text-muted-foreground/50">
                TradeHub v1.0 • Premium
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-[calc(100dvh-56px)] bg-muted/5 px-4 py-6 md:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your {title.toLowerCase()} and operations
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
