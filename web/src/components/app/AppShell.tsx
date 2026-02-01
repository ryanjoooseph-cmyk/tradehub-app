"use client";

import Link from "next/link";
import TopbarActions from "./TopbarActions";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const NAV = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/jobs", label: "Jobs" },
  { href: "/app/calendar", label: "Calendar" },
  { href: "/app/clients", label: "Clients" },
  { href: "/app/invoices", label: "Invoices" },
  { href: "/app/escrow", label: "Escrow" },
  { href: "/app/team", label: "Team" },
  { href: "/app/settings", label: "Settings" },
  { href: "/dispatch", label: "Dispatch" },
  { href: "/escrow", label: "Escrow Ops" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);useEffect(() => {
    setMounted(true);
  }, []);

  const activeHref = useMemo(() => {
    const hit = NAV.find((n) => pathname === n.href);
    return hit?.href ?? "";
  }, [pathname]);

  const title = useMemo(() => {
    const hit = NAV.find((n) => pathname === n.href);
    return hit?.label ?? "TradeHub";
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
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
            <TopbarActions />
            <div className="hidden sm:block rounded-md border px-3 py-2 text-sm text-muted-foreground">
              {title}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 px-0 md:grid-cols-[auto_1fr]">
        <aside
          className={cx(
            "border-r bg-background",
            "md:sticky md:top-14 md:h-[calc(100dvh-56px)]",
            collapsed ? "md:w-[72px]" : "md:w-[260px]"
          )}
        >
          <div className="px-2 py-3">
            <div className={cx("mb-2 px-3 text-xs font-semibold text-muted-foreground", collapsed && "sr-only")}>
              Workspace
            </div>

            <nav className="flex flex-col gap-1">
              {NAV.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      active ? "bg-muted" : "hover:bg-muted/60"
                    )}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs">
                      {item.label.slice(0, 1)}
                    </span>
                    <span className={cx("truncate", collapsed && "sr-only")}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className={cx("mt-4 px-3 text-xs text-muted-foreground", collapsed && "sr-only")}>
              Premium shell locked across app.
            </div>
          </div>
        </aside>

        <main className="min-h-[calc(100dvh-56px)] px-4 py-6 md:px-8">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <div className="text-2xl font-semibold tracking-tight">{title}</div>
              <div className="text-sm text-muted-foreground">Premium shell active</div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
