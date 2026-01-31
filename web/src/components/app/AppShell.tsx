"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/app/ThemeToggle";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/calendar", label: "Calendar" },
  { href: "/app/jobs", label: "Jobs" },
  { href: "/app/clients", label: "Clients" },
  { href: "/app/invoices", label: "Invoices" },
  { href: "/app/escrow", label: "Escrow" },
  { href: "/app/team", label: "Team" },
  { href: "/app/settings", label: "Settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <Link href="/app/dashboard" className="text-sm font-semibold tracking-tight">
            TradeHub
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-md px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] p-4">
        {children}
      </main>
    </div>
  );
}
