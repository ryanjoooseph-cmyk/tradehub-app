import AppShell from "../../../components/app/AppShell";

export default function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/60 p-6 shadow-sm">
          <div className="text-3xl font-extrabold tracking-tight">Command Center</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Live ops overview: jobs, revenue, cashflow, team capacity, disputes, and escrow.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Open Jobs</div>
            <div className="mt-2 text-3xl font-extrabold">12</div>
            <div className="mt-1 text-xs text-muted-foreground">6 scheduled · 4 in progress · 2 blocked</div>
          </div>
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Escrow Balance</div>
            <div className="mt-2 text-3xl font-extrabold">$18,420</div>
            <div className="mt-1 text-xs text-muted-foreground">Funds held across active milestones</div>
          </div>
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Invoices Due</div>
            <div className="mt-2 text-3xl font-extrabold">$7,950</div>
            <div className="mt-1 text-xs text-muted-foreground">3 overdue · 5 pending approval</div>
          </div>
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Disputes</div>
            <div className="mt-2 text-3xl font-extrabold">1</div>
            <div className="mt-1 text-xs text-muted-foreground">Awaiting inspector confirmation</div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border bg-background/60 p-6 shadow-sm">
            <div className="text-sm font-semibold">Pipeline</div>
            <div className="mt-2 text-xs text-muted-foreground">This is UI scaffolding only — data hooks come next.</div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border p-4">
                <div className="text-xs font-semibold text-muted-foreground">Quoted</div>
                <div className="mt-2 text-2xl font-extrabold">6</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-xs font-semibold text-muted-foreground">Booked</div>
                <div className="mt-2 text-2xl font-extrabold">4</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-xs font-semibold text-muted-foreground">In Progress</div>
                <div className="mt-2 text-2xl font-extrabold">4</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-background/60 p-6 shadow-sm">
            <div className="text-sm font-semibold">Today</div>
            <div className="mt-2 space-y-3 text-sm">
              <div className="rounded-xl border p-4">
                <div className="font-semibold">08:00 — Site prep</div>
                <div className="text-xs text-muted-foreground">Job #1021 · Client: ACME Strata</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="font-semibold">11:30 — Inspection</div>
                <div className="text-xs text-muted-foreground">Escrow milestone release · Inspector booked</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="font-semibold">15:00 — Invoice review</div>
                <div className="text-xs text-muted-foreground">3 approvals pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
