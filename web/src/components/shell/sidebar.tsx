"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav";
import { cn } from "@/lib/cn";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="h-full w-[280px] border-r bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="h-16 px-5 flex items-center gap-3 border-b">
        <div className="h-9 w-9 rounded-xl border bg-card/50 flex items-center justify-center font-bold">TH</div>
        <div className="leading-tight">
          <div className="font-semibold tracking-tight">TradeHub</div>
          <div className="text-xs text-muted-foreground">Operations OS</div>
        </div>
      </div>

      <div className="p-3">
        <div className="px-2 pb-2 text-[11px] font-medium text-muted-foreground">Workspace</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/app" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-background" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border bg-card/40 p-4">
          <div className="text-sm font-medium">Upgrade</div>
          <div className="mt-1 text-xs text-muted-foreground">Unlock advanced scheduling, automation, and analytics.</div>
          <button className="mt-3 w-full rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground shadow hover:opacity-95">
            Go Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
