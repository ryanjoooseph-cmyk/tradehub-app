"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Calendar, ClipboardList, LayoutGrid, Users, Settings, Receipt, Search } from "lucide-react";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/app", label: "Dashboard", icon: LayoutGrid },
  { href: "/app/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/app/calendar", label: "Calendar", icon: Calendar },
  { href: "/app/clients", label: "Clients", icon: Users },
  { href: "/app/invoices", label: "Invoices", icon: Receipt },
  { href: "/app/team", label: "Team", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="hidden md:flex w-72 flex-col border-r bg-card/40 backdrop-blur">
          <div className="px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow" />
              <div className="leading-tight">
                <div className="font-semibold">TradeHub</div>
                <div className="text-xs text-muted-foreground">Operations OS</div>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {nav.map((i) => {
              const active = path === i.href || path.startsWith(i.href + "/");
              const Icon = i.icon;
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {i.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Build</span>
              <span className="font-mono">{process.env.NEXT_PUBLIC_BUILD_ID ?? "local"}</span>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
              <div className="flex items-center gap-3 w-full max-w-xl">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full rounded-xl border bg-card/50 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Search jobs, clients, invoices…"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pl-3">
                <button className="h-10 w-10 rounded-xl border bg-card/50 hover:bg-accent/50 grid place-items-center">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="h-10 px-3 rounded-xl border bg-card/50 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400" />
                  <div className="leading-tight">
                    <div className="text-sm font-medium">Owner</div>
                    <div className="text-xs text-muted-foreground">Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 md:px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
