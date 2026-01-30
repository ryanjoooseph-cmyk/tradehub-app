import { Topbar } from "@/components/shell/topbar";
import { demoJobs, demoInvoices, kpis, money } from "@/lib/demo-data";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="text-xs font-medium text-neutral-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-2 text-xs text-neutral-500">{sub}</div> : null}
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
      {text}
    </span>
  );
}

export default function Page() {
  const { totalValue, escrowHeld, disputed, active } = kpis();
  const upcoming = [...demoJobs]
    .filter((j) => j.status === "Scheduled" || j.status === "In Progress")
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 5);

  const attention = demoJobs.filter((j) => j.status === "Disputed").slice(0, 3);
  const latestInvoices = [...demoInvoices].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)).slice(0, 4);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Real-time ops overview (demo data)" />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Stat label="Active jobs" value={String(active)} sub="Scheduled + in progress" />
          <Stat label="Escrow held" value={money(escrowHeld)} sub="Funds currently locked" />
          <Stat label="Total job value" value={money(totalValue)} sub="All jobs (demo)" />
          <Stat label="Disputes" value={String(disputed)} sub="Requires action" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <div className="text-sm font-semibold">Upcoming work</div>
              <Chip text="Next 7 days" />
            </div>
            <div className="divide-y divide-neutral-200">
              {upcoming.map((j) => (
                <div key={j.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-neutral-900 truncate">{j.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">{j.client} • {j.site}</div>
                    <div className="mt-2 text-xs text-neutral-600">{new Date(j.start).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{money(j.valueCents)}</div>
                    <div className="mt-1 text-xs text-neutral-500">Escrow {money(j.escrowCents)}</div>
                    <div className="mt-2">
                      <Chip text={j.status} />
                    </div>
                  </div>
                </div>
              ))}
              {upcoming.length === 0 ? <div className="px-5 py-10 text-sm text-neutral-500">No upcoming jobs.</div> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white">
            <div className="px-5 py-4 border-b border-neutral-200">
              <div className="text-sm font-semibold">Attention</div>
              <div className="mt-1 text-xs text-neutral-500">Disputes and overdue invoices</div>
            </div>

            <div className="px-5 py-4">
              <div className="text-xs font-medium text-neutral-600">Disputes</div>
              <div className="mt-3 space-y-3">
                {attention.map((j) => (
                  <div key={j.id} className="rounded-xl border border-neutral-200 p-3">
                    <div className="text-sm font-medium text-neutral-900">{j.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">{j.client}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <Chip text="Disputed" />
                      <div className="text-xs font-semibold">{money(j.valueCents)}</div>
                    </div>
                  </div>
                ))}
                {attention.length === 0 ? <div className="text-sm text-neutral-500">No disputes.</div> : null}
              </div>

              <div className="mt-6 text-xs font-medium text-neutral-600">Latest invoices</div>
              <div className="mt-3 space-y-2">
                {latestInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
                    <div>
                      <div className="text-sm font-medium">{inv.id}</div>
                      <div className="mt-1 text-xs text-neutral-500">{inv.client}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{money(inv.amountCents)}</div>
                      <div className="mt-1 text-xs text-neutral-500">{inv.status}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
