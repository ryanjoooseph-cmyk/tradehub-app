import { KpiGrid } from "@/components/app/KpiGrid";
import { SignalPanel } from "@/components/app/SignalPanel";
import { jobs, invoices } from "@/components/app/demoData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function money(n: number) {
  return "$" + n.toLocaleString();
}

export default function DashboardPage() {
  const active = jobs.filter((j) => j.status === "In Progress" || j.status === "Scheduled").length;
  const disputes = jobs.filter((j) => j.status === "Dispute").length;
  const awaiting = jobs.filter((j) => j.status === "Awaiting Payment").length;

  const kpis = [
    { label: "Active jobs", value: String(active), sub: "Work in motion across crews" },
    { label: "Awaiting payment", value: String(awaiting), sub: "Invoices pending settlement" },
    { label: "Disputes", value: String(disputes), sub: "Needs inspector / resolution" },
    { label: "Projected week revenue", value: money(jobs.reduce((a, b) => a + b.value, 0)), sub: "Based on scheduled work" },
  ];

  return (
    <div className="space-y-5">
      <KpiGrid items={kpis} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pipeline</div>
                <div className="mt-1 text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Operational flow</div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">This is the “what happens next” engine.</div>
              </div>
              <Badge tone="info" className="rounded-full px-3 py-1 text-xs font-semibold">Live</Badge>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-3xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Schedule</div>
                <div className="mt-2 text-sm font-extrabold">Assign crew, confirm access</div>
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Auto-check prerequisites and safety.</div>
              </div>
              <div className="rounded-3xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Execution</div>
                <div className="mt-2 text-sm font-extrabold">Daily progress + photos</div>
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Instant client visibility and audit trail.</div>
              </div>
              <div className="rounded-3xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Settlement</div>
                <div className="mt-2 text-sm font-extrabold">Invoice + escrow release</div>
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Stops non-payment and fights.</div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-white/70 p-4 ring-1 ring-zinc-200 dark:bg-zinc-950/40 dark:ring-zinc-800">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Critical queue</div>
              <div className="mt-3 space-y-2">
                {jobs.slice(0, 4).map((j) => (
                  <div key={j.id} className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{j.title}</div>
                      <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{j.client} • {j.site} • {j.assignee}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={j.status === "Dispute" ? "danger" : j.status === "Awaiting Payment" ? "warning" : "info"} className="shrink-0">{j.status}</Badge>
                      <div className="text-sm font-extrabold">{money(j.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <SignalPanel
            title="Cashflow signals"
            items={[
              { k: "Invoice SENT", v: `${invoices[0].client} • ${invoices[0].jobId}`, s: invoices[0].status },
              { k: "Invoice OVERDUE", v: `${invoices[1].client} • ${invoices[1].jobId}`, s: invoices[1].status },
              { k: "Invoice DRAFT", v: `${invoices[2].client} • ${invoices[2].jobId}`, s: invoices[2].status },
            ]}
          />
          <SignalPanel
            title="Escrow posture"
            items={[
              { k: "Deposit pending", v: "2 jobs waiting on deposit", s: "Awaiting" },
              { k: "Milestone release", v: "1 release requires approval", s: "Hold" },
              { k: "Dispute risk", v: "1 job flagged for inspection", s: "Dispute" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
