import { demoJobs, demoClients, demoInvoices, demoEscrowHolds } from "@/lib/demo-data";

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

export default function Dashboard() {
  const backlog = demoJobs.filter((j) => j.status === "Backlog").length;
  const scheduled = demoJobs.filter((j) => j.status === "Scheduled").length;
  const inProgress = demoJobs.filter((j) => j.status === "In Progress").length;

  const ar = demoInvoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amountCents, 0);
  const escrowHeld = demoEscrowHolds.filter((h) => h.status === "Held").reduce((s, h) => s + h.amountCents, 0);
  const escrowDisputed = demoEscrowHolds.filter((h) => h.status === "Disputed").reduce((s, h) => s + h.amountCents, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Command Center</h1>
          <p className="text-sm text-muted-foreground">Dispatch, cash, workload, risk — one screen.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <a className="rounded-md border px-3 py-1 hover:bg-muted" href="/dispatch">Open Dispatch</a>
          <a className="rounded-md border px-3 py-1 hover:bg-muted" href="/escrow">Open Escrow</a>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {[
          { label: "Backlog", value: String(backlog), sub: "Jobs waiting to schedule" },
          { label: "Scheduled", value: String(scheduled), sub: "Next 7 days" },
          { label: "In Progress", value: String(inProgress), sub: "Active work" },
          { label: "Accounts Receivable", value: money(ar), sub: "Unpaid invoices" },
          { label: "Escrow Held", value: money(escrowHeld), sub: "Funds locked" },
          { label: "Escrow Disputed", value: money(escrowDisputed), sub: "Risk exposure" },
          { label: "Clients", value: String(demoClients.length), sub: "Active" },
          { label: "Jobs", value: String(demoJobs.length), sub: "Total" },
        ].map((k) => (
          <div key={k.label} className="col-span-12 sm:col-span-6 xl:col-span-3 rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{k.value}</div>
            <div className="mt-2 text-xs text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7 rounded-xl border bg-card">
          <div className="p-4 border-b">
            <div className="font-semibold">Operational Focus</div>
            <div className="text-xs text-muted-foreground">What matters today. No noise.</div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="rounded-lg border bg-background p-3">
              <div className="font-medium">Dispatch Discipline</div>
              <div className="text-xs text-muted-foreground">Keep backlog near-zero. Everything scheduled has owners.</div>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="font-medium">Cash Control</div>
              <div className="text-xs text-muted-foreground">Escrow reduces non-payment risk. AR shows reality.</div>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="font-medium">Risk Radar</div>
              <div className="text-xs text-muted-foreground">Disputes surface instantly. Audit trail prevents he-said/she-said.</div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 rounded-xl border bg-card">
          <div className="p-4 border-b">
            <div className="font-semibold">Next Actions</div>
            <div className="text-xs text-muted-foreground">Operator moves.</div>
          </div>
          <div className="p-4 grid gap-2 text-sm">
            <a className="rounded-lg border bg-background p-3 hover:bg-muted" href="/dispatch">Schedule backlog → calendar</a>
            <a className="rounded-lg border bg-background p-3 hover:bg-muted" href="/escrow">Review holds + disputes</a>
            <a className="rounded-lg border bg-background p-3 hover:bg-muted" href="/app/invoices">Chase overdue invoices</a>
            <a className="rounded-lg border bg-background p-3 hover:bg-muted" href="/app/clients">Review client health</a>
          </div>
        </div>
      </div>
    </div>
  );
}
