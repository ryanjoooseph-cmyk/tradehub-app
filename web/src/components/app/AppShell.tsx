import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/calendar", label: "Calendar" },
  { href: "/app/jobs", label: "Jobs" },
  { href: "/app/clients", label: "Clients" },
  { href: "/app/invoices", label: "Invoices" },
  { href: "/app/escrow", label: "Escrow" },
  { href: "/app/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex items-center justify-between gap-3 rounded-3xl bg-white/70 p-3 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/50 dark:ring-zinc-800">
          <div className="flex items-center gap-3">
            <Link href="/app" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-zinc-900/5 dark:hover:bg-zinc-50/10">
              <div className="h-9 w-9 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10" />
              <div className="leading-tight">
                <div className="text-sm font-extrabold tracking-tight">TradeHub</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Ops Console</div>
              </div>
            </Link>
            <div className="hidden items-center gap-1 lg:flex">
              {nav.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-zinc-50/10"
                  )}
                >
                  {i.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button className="rounded-2xl">New</Button>
          </div>
        </div>

        <div className="mt-5 rounded-[32px] bg-white/70 p-4 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/40 dark:ring-zinc-800 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
