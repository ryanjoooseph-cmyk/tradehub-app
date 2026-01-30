import { kpis, money, demoJobs, demoInvoices } from "@/lib/demo-data";
import { KpiCard } from "@/components/ui/kpi-card";

export default function DashboardPage() {
  const { totalValue, escrowHeld, disputed, active } = kpis();

  const overdue = demoInvoices.filter((i) => i.status === "Overdue").length;
  const paid = demoInvoices.filter((i) => i.status === "Paid").length;

  const activeJobs = demoJobs
    .filter((j) => j.status === "Scheduled" || j.status === "In Progress")
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Operations Overview</div>
          <div className="mt-1 text-sm text-neutral-600">
            KPI-grade snapshot across jobs, invoices, and escrow.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total job value" value={money(totalValue)} sub="Pipeline + active + completed" />
        <KpiCard label="Escrow held" value={money(escrowHeld)} tone={escrowHeld > 0 ? "good" : "default"} sub="Funds currently held" />
        <KpiCard label="Active jobs" value={`${active}`} sub="Scheduled + in progress" />
        <KpiCard label="Disputes" value={`${disputed}`} tone={disputed > 0 ? "warn" : "good"} sub="Jobs in dispute state" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Next jobs</div>
            <div className="text-xs text-neutral-500">Top 6 by start time</div>
          </div>
          <div className="mt-4 divide-y divide-neutral-100">
            {activeJobs.map((j) => (
              <div key={j.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{j.title}</div>
                  <div className="mt-1 text-xs text-neutral-600 truncate">
                    {j.client} • {j.site}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs rounded-full border border-neutral-200 px-2 py-1 text-neutral-700 inline-block">
                    {j.status}
                  </div>
                  <div className="mt-1 text-xs text-neutral-500">{new Date(j.start).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {activeJobs.length === 0 ? (
              <div className="py-10 text-sm text-neutral-500">No active jobs in demo data.</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-sm font-semibold">Invoices</div>
          <div className="mt-1 text-xs text-neutral-500">Collections + health</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-xs text-neutral-600">Paid</div>
              <div className="mt-2 text-xl font-semibold">{paid}</div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-xs text-neutral-600">Overdue</div>
              <div className="mt-2 text-xl font-semibold">{overdue}</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-neutral-600">
            Next step: wire this into Supabase invoices + Stripe, then show aging buckets.
          </div>
        </div>
      </div>
    </div>
  );
}
