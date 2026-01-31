"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { LayoutDashboard, CalendarDays, Users, Receipt, Shield, Settings, Briefcase } from "lucide-react";

const nav = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/jobs", label: "Jobs", icon: Briefcase },
  { href: "/app/clients", label: "Clients", icon: Users },
  { href: "/app/invoices", label: "Invoices", icon: Receipt },
  { href: "/app/escrow", label: "Escrow", icon: Shield },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidenav() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-border/60 bg-background/40 backdrop-blur lg:block">
      <div className="h-[calc(100vh-4rem)] overflow-auto p-4">
        <div className="mb-3 rounded-2xl border border-border/60 bg-muted/25 p-4">
          <div className="text-sm font-semibold">Operations</div>
          <div className="mt-1 text-xs text-muted-foreground">Institution-grade workflow shell</div>
        </div>

        <div className="space-y-1">
          {nav.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active ? "bg-foreground text-background" : "hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-background" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Scheduler
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Drag & drop jobs into calendar (next screen).
          </div>
        </div>
      </div>
    </aside>
  );
}
