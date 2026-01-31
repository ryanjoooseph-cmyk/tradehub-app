import AppShell from "../../../components/app/AppShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-2xl border bg-background/60 p-6 shadow-sm">
          <div className="text-3xl font-extrabold tracking-tight">Command Center</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Jobs, cashflow, escrow, disputes — live operational view.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Open Jobs</div>
            <div className="mt-2 text-3xl font-extrabold">12</div>
            <div className="mt-1 text-xs text-muted-foreground">6 scheduled · 4 in progress · 2 blocked</div>
          </div>
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Escrow Held</div>
            <div className="mt-2 text-3xl font-extrabold">$18,420</div>
            <div className="mt-1 text-xs text-muted-foreground">Active milestones</div>
          </div>
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Invoices Due</div>
            <div className="mt-2 text-3xl font-extrabold">$7,950</div>
            <div className="mt-1 text-xs text-muted-foreground">3 overdue · 5 pending</div>
          </div>
          <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-xs font-semibold text-muted-foreground">Disputes</div>
            <div className="mt-2 text-3xl font-extrabold">1</div>
            <div className="mt-1 text-xs text-muted-foreground">Awaiting inspector</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
