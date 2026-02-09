"use client";

import Link from "next/link";
import TopbarActions from "./TopbarActions";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect, startTransition } from "react";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Icon components
const Icons = {
  Dashboard: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Jobs: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Calendar: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clients: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Invoices: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  Escrow: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Team: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Agents: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Settings: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Dispatch: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  EscrowOps: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

const NAV_SECTIONS = [
  {
    label: "Operations",
    items: [
      { href: "/app/dashboard", label: "Dashboard", icon: Icons.Dashboard },
      { href: "/app/jobs", label: "Jobs", icon: Icons.Jobs },
      { href: "/app/calendar", label: "Calendar", icon: Icons.Calendar },
      { href: "/dispatch", label: "Dispatch", icon: Icons.Dispatch },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/app/clients", label: "Clients", icon: Icons.Clients },
      { href: "/app/invoices", label: "Invoices", icon: Icons.Invoices },
      { href: "/app/escrow", label: "Escrow", icon: Icons.Escrow },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/app/team", label: "Team", icon: Icons.Team },
      { href: "/app/agents", label: "Agents", icon: Icons.Agents },
      { href: "/escrow", label: "Escrow Ops", icon: Icons.EscrowOps },
    ],
  },
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
    const allItems = NAV_SECTIONS.flatMap(s => s.items);
    const sorted = [...allItems].sort((a, b) => b.href.length - a.href.length);
    const hit = sorted.find((n) => pathname.startsWith(n.href));
    return hit?.href ?? "";
  }, [pathname]);

  const title = useMemo(() => {
    const allItems = NAV_SECTIONS.flatMap(s => s.items);
    const hit = allItems.find((n) => pathname === n.href);
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-sm">
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
            "border-r border-border/40 bg-gradient-to-b from-muted/20 to-background",
            "md:sticky md:top-14 md:h-[calc(100dvh-56px)] md:overflow-y-auto",
            "transition-all duration-200 ease-out",
            collapsed ? "md:w-[68px]" : "md:w-[260px]"
          )}
        >
          <div className="flex h-full flex-col px-3 py-4">
            {/* Navigation Sections */}
            <nav className="flex flex-1 flex-col gap-6">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label}>
                  {/* Section Label */}
                  <div className={cx(
                    "mb-2 px-3 transition-opacity duration-200",
                    collapsed && "opacity-0 pointer-events-none"
                  )}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {section.label}
                    </span>
                  </div>

                  {/* Section Items */}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const active = activeHref === item.href;
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cx(
                            "nav-item group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                            active
                              ? "bg-accent/80 text-accent-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                          )}
                        >
                          {/* Active Indicator */}
                          {active && (
                            <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-600 to-indigo-600" />
                          )}

                          {/* Icon */}
                          <span className={cx(
                            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                            active
                              ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm"
                              : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                          )}>
                            <Icon />
                          </span>

                          {/* Label */}
                          <span className={cx(
                            "truncate transition-all duration-200",
                            collapsed && "w-0 opacity-0"
                          )}>
                            {item.label}
                          </span>

                          {/* Tooltip for collapsed state */}
                          {collapsed && (
                            <span className="nav-tooltip">
                              {item.label}
                            </span>
                          )}

                          {/* Active Pill */}
                          {active && !collapsed && (
                            <span className="ml-auto flex h-5 items-center rounded-full bg-gradient-to-r from-violet-600/10 to-indigo-600/10 px-2 text-[10px] font-semibold text-violet-700 dark:text-violet-400">
                              Active
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Settings (Bottom) */}
            <div className="mt-auto space-y-3 border-t border-border/40 pt-4">
              <Link
                href="/app/settings"
                className={cx(
                  "nav-item group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground transition-all group-hover:bg-muted group-hover:text-foreground">
                  <Icons.Settings />
                </span>
                <span className={cx(
                  "truncate transition-all duration-200",
                  collapsed && "w-0 opacity-0"
                )}>
                  Settings
                </span>
                {collapsed && (
                  <span className="nav-tooltip">Settings</span>
                )}
              </Link>

              {/* Profile Placeholder */}
              {!collapsed && (
                <div className="rounded-xl border border-border/40 bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
                      RJ
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">Ryan Joseph</div>
                      <div className="truncate text-xs text-muted-foreground">Admin</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className={cx(
                "px-3 text-[10px] text-muted-foreground/50 transition-opacity duration-200",
                collapsed && "opacity-0 pointer-events-none"
              )}>
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
