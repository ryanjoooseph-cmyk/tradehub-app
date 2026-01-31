import Link from "next/link";
import Topbar from "../../components/ui/Topbar";
import { ThemeProvider } from "../../components/ui/ThemeProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Topbar />
        <div className="mx-auto flex w-full">
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 flex-none border-r border-zinc-200 bg-white/70 px-4 py-6 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/40 md:block">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                Navigation
              </div>
              <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                A++
              </span>
            </div>

            <nav className="space-y-1">
              <Nav href="/app" label="Dashboard" />
              <Nav href="/app/jobs" label="Jobs" />
              <Nav href="/app/calendar" label="Calendar" />
              <Nav href="/app/clients" label="Clients" />
              <Nav href="/app/invoices" label="Invoices" />
              <Nav href="/app/team" label="Team" />
              <Nav href="/app/escrow" label="Escrow" />
              <Nav href="/app/settings" label="Settings" />
            </nav>

            <div className="mt-8 rounded-xl border border-zinc-200 bg-white/60 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-400">
              <div className="font-semibold text-zinc-700 dark:text-zinc-200">
                Demo mode
              </div>
              <div className="mt-1">
                Auth disabled. Showing seeded jobs.
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

function Nav({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-100"
    >
      <span className="font-medium">{label}</span>
      <span className="text-xs text-zinc-400 opacity-0 transition group-hover:opacity-100 dark:text-zinc-500">
        →
      </span>
    </Link>
  );
}
