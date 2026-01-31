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

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-zinc-50/10"
      )}
    >
      <span className="truncate">{label}</span>
      <span className="h-1.5 w-1.5 rounded-full bg-transparent group-hover:bg-emerald-500/60" />
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[1020px] -translate-x-1/2 rounded-full bg-emerald-400/12 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute top-20 left-1/2 h-[460px] w-[900px] -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/10" />
        <div className="absolute top-[520px] left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-fuchsia-400/8 blur-3xl dark:bg-fuchsia-400/8" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[32px] bg-white/70 p-4 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/45 dark:ring-zinc-800">
            <Link href="/app" className="flex items-center gap-3 rounded-3xl p-3 hover:bg-zinc-900/5 dark:hover:bg-zinc-50/10">
              <div className="h-11 w-11 rounded-3xl bg-emerald-500/15 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10" />
              <div className="leading-tight">
                <div className="text-sm font-extrabold tracking-tight">TradeHub</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Institutional Ops</div>
              </div>
            </Link>

            <div className="mt-3 space-y-1">
              {nav.map((i) => (
                <NavLink key={i.href} href={i.href} label={i.label} />
              ))}
            </div>

            <div className="mt-4 rounded-3xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Today</div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                5
                <span className="ml-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">active jobs</span>
              </div>
              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Keep pipeline moving. Escrow reduces disputes and guarantees cashflow.
              </div>
            </div>
          </aside>

          <main className="rounded-[32px] bg-white/70 p-4 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/40 dark:ring-zinc-800 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">TradeHub Console</div>
                <div className="mt-1 truncate text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Command Center
                </div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Jobs, clients, invoices, team and escrow — unified into one operational timeline.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="secondary" className="rounded-2xl">Search</Button>
                <Button className="rounded-2xl">New</Button>
              </div>
            </div>

            <div className="mt-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
