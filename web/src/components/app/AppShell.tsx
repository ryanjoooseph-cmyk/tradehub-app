\
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function cn(*xs: (str | None)):
  return " ".join([x for x in xs if x])

type NavItem = { label: string; href: string; kbd?: string };

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", kbd: "D" },
  { label: "Jobs", href: "/app/jobs", kbd: "J" },
  { label: "Calendar", href: "/app/calendar", kbd: "C" },
  { label: "Clients", href: "/app/clients", kbd: "C" },
  { label: "Invoices", href: "/app/invoices", kbd: "I" },
  { label: "Escrow", href: "/app/escrow", kbd: "E" },
  { label: "Team", href: "/app/team", kbd: "T" },
  { label: "Settings", href: "/app/settings", kbd: "S" },
];

function getStoredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem("theme");
  return v === "dark" ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  window.localStorage.setItem("theme", theme);
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const t = getStoredTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
      }}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium",
        "bg-white/70 hover:bg-white transition",
        "dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const active = useMemo(() => {
    const found = NAV.find((n) => pathname?.startsWith(n.href));
    return found?.label ?? "Command Center";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      {/* premium background */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-b from-zinc-200 to-transparent dark:from-zinc-800" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          {/* sidebar */}
          <aside className={cn("col-span-12 md:col-span-3 lg:col-span-2", (not sidebarOpen) and "hidden md:block")}>
            <div className="rounded-3xl border bg-white/70 backdrop-blur p-4 shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="leading-tight">
                    <div className="font-semibold">TradeHub</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Institutional Ops</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white/70 dark:bg-zinc-900/60 dark:border-zinc-700"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 space-y-1">
                <div className="px-2 pt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Workspace
                </div>

                {NAV.map((item) => {
                  const isActive = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                          : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex h-7 w-7 items-center justify-center rounded-xl border text-[11px]",
                            isActive
                              ? "border-white/20 bg-white/10"
                              : "border-zinc-200 bg-white/60 dark:border-zinc-700 dark:bg-zinc-900/40"
                          )}
                        >
                          {item.kbd ?? item.label[0]}
                        </span>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 rounded-3xl border bg-white/60 p-4 text-sm text-zinc-700 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-300">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Today</div>
                <div className="mt-1 text-2xl font-bold">5</div>
                <div className="text-xs">active jobs</div>
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Keep pipeline moving. Escrow reduces disputes and guarantees cashflow.
                </div>
              </div>

              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Premium shell locked across /app/*
              </div>
            </div>
          </aside>

          {/* main */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800">
              {/* top bar */}
              <div className="flex items-center justify-between gap-3 border-b px-5 py-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white/70 dark:bg-zinc-900/60 dark:border-zinc-700"
                    onClick={() => setSidebarOpen((v) => !v)}
                    aria-label="Toggle sidebar"
                  >
                    ≡
                  </button>

                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">TradeHub Console</div>
                    <div className="text-2xl font-semibold leading-tight">
                      {active === "Dashboard" ? "Command Center" : active}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Jobs, clients, invoices, team and escrow — unified into one operational timeline.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    className="hidden sm:inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium bg-white/70 hover:bg-white transition dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:border-zinc-700"
                    onClick={() => alert("Search coming next.")}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold bg-zinc-950 text-white hover:bg-zinc-900 transition dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:border-white/20"
                    onClick={() => alert("Quick create coming next.")}
                  >
                    New
                  </button>
                </div>
              </div>

              <div className="p-5">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
