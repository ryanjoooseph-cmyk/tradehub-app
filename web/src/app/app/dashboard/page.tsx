export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardPage() {
  return (
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
          <div className="mt-1 text-xs text-muted-foreground">
            6 scheduled · 4 in progress · 2 blocked
          </div>
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

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border bg-background/60 p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Live Workload</div>
            <div className="text-xs text-muted-foreground">Next 14 days</div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border bg-background p-4">
              <div className="text-xs font-semibold text-muted-foreground">Upcoming Jobs</div>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Strata repaint · Tower A</div>
                  <div className="text-xs text-muted-foreground">Mon 9:00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Rope access patch</div>
                  <div className="text-xs text-muted-foreground">Tue 7:00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Client walkthrough</div>
                  <div className="text-xs text-muted-foreground">Thu 15:00</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <div className="text-xs font-semibold text-muted-foreground">Cashflow Alerts</div>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Invoice #1042 overdue</div>
                  <div className="text-xs text-muted-foreground">$1,240</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Milestone release pending</div>
                  <div className="text-xs text-muted-foreground">$6,500</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Quote accepted</div>
                  <div className="text-xs text-muted-foreground">$3,780</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
          <div className="text-sm font-semibold">Escrow Console</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Milestones, releases, disputes.
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Tower A · Milestone 2</div>
                <div className="text-xs text-muted-foreground">$8,000</div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Awaiting client approval
              </div>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Patch · Scope change</div>
                <div className="text-xs text-muted-foreground">$1,200</div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Inspector recommended: release 70%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
