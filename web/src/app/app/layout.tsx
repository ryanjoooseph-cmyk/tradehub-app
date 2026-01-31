import Link from 'next/link'
import Topbar from '@/components/ui/Topbar'
import CommandPalette from '@/components/ui/CommandPalette'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <CommandPalette />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 py-6">
            <div className="rounded-3xl bg-slate-950/35 ring-1 ring-slate-800/80 backdrop-blur p-4 sticky top-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/25 flex items-center justify-center font-semibold">
                  TH
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">TradeHub</div>
                  <div className="text-xs text-slate-400 leading-tight">Ops Suite</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Nav href="/app/dashboard" label="Dashboard" />
                <Nav href="/app/jobs" label="Jobs" />
                <Nav href="/app/calendar" label="Calendar" />
                <Nav href="/app/clients" label="Clients" />
                <Nav href="/app/invoices" label="Invoices" />
                <Nav href="/app/escrow" label="Escrow" />
                <Nav href="/app/team" label="Team" />
                <Nav href="/app/settings" label="Settings" />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-950/60 ring-1 ring-slate-800 p-4">
                <div className="text-sm font-semibold">Command Palette</div>
                <div className="mt-2 text-xs text-slate-400">Press ⌘K anytime</div>
              </div>
            </div>
          </aside>

          <main className="col-span-12 md:col-span-9 lg:col-span-10 py-6">
            <div className="rounded-3xl bg-slate-950/25 ring-1 ring-slate-800/60 overflow-hidden">
              <Topbar />
              <div className="p-4 md:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function Nav({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-slate-900/40 px-4 py-3 text-sm ring-1 ring-slate-800 hover:bg-slate-900/60 transition"
    >
      {label}
    </Link>
  )
}
