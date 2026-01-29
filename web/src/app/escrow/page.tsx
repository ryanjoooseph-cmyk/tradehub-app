import { demoClients, demoEscrowHolds, demoJobs, demoLedger } from "@/lib/demo-data";

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}
function clientName(id: string) {
  return demoClients.find((c) => c.id === id)?.name ?? "Unknown Client";
}
function jobTitle(id: string) {
  return demoJobs.find((j) => j.id === id)?.title ?? "Unknown Job";
}

export default function EscrowPage() {
  const held = demoEscrowHolds.filter((h) => h.status === "Held").reduce((a, b) => a + b.amountCents, 0);
  const disputed = demoEscrowHolds.filter((h) => h.status === "Disputed").reduce((a, b) => a + b.amountCents, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Escrow</h1>
          <p className="text-sm text-muted-foreground">Holds, releases, disputes, refunds — with an audit trail.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full border px-3 py-1">Held: {money(held)}</span>
          <span className="rounded-full border px-3 py-1">Disputed: {money(disputed)}</span>
          <span className="rounded-full border px-3 py-1">Holds: {demoEscrowHolds.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <div className="font-semibold">Active Holds</div>
              <div className="text-xs text-muted-foreground">Next: Supabase wiring + state machine + approvals.</div>
            </div>
            <div className="p-4 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b">
                    <th className="text-left py-2">Hold</th>
                    <th className="text-left py-2">Client</th>
                    <th className="text-left py-2">Job</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-right py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demoEscrowHolds.map((h) => (
                    <tr key={h.id} className="border-b last:border-b-0">
                      <td className="py-3 font-medium">{h.id}</td>
                      <td className="py-3">{clientName(h.clientId)}</td>
                      <td className="py-3">{jobTitle(h.jobId)}</td>
                      <td className="py-3 text-right font-medium">{money(h.amountCents)}</td>
                      <td className="py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs">{h.status}</span></td>
                      <td className="py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button className="rounded-md border px-3 py-1 text-xs hover:bg-muted">Release</button>
                          <button className="rounded-md border px-3 py-1 text-xs hover:bg-muted">Dispute</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b">
              <div className="font-semibold">Audit Ledger</div>
              <div className="text-xs text-muted-foreground">Every move logged. No mystery money.</div>
            </div>
            <div className="p-4 space-y-3">
              {demoLedger.map((e) => (
                <div key={e.id} className="rounded-lg border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium">{e.type}</div>
                      <div className="text-xs text-muted-foreground truncate">Hold {e.holdId} • {new Date(e.createdAt).toLocaleString()}</div>
                      {e.note ? <div className="text-xs mt-1">{e.note}</div> : null}
                    </div>
                    <div className="text-sm font-semibold">{e.amountCents ? money(e.amountCents) : "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
