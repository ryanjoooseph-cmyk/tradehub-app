import { demoInvoices, demoClients, demoJobs } from "@/lib/demo-data";

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}
function clientName(id: string) {
  return demoClients.find((c) => c.id === id)?.name ?? "Unknown Client";
}
function jobTitle(id?: string) {
  return id ? (demoJobs.find((j) => j.id === id)?.title ?? "Unknown Job") : "—";
}
function daysOverdue(dueIso: string) {
  const due = new Date(dueIso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function InvoicesPage() {
  const ar = demoInvoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amountCents, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">Accounts receivable: status, due dates, and pressure.</p>
        </div>
        <div className="text-xs rounded-full border px-3 py-1">AR: {money(ar)}</div>
      </div>

      <div className="rounded-xl border bg-card overflow-auto">
        <div className="p-4 border-b">
          <div className="font-semibold">Invoice Register</div>
          <div className="text-xs text-muted-foreground">Next wave: payments, partials, escrow-linking, PDF generation.</div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="text-left py-2 px-4">Invoice</th>
              <th className="text-left py-2">Client</th>
              <th className="text-left py-2">Job</th>
              <th className="text-left py-2">Status</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-left py-2">Due</th>
              <th className="text-right py-2 px-4">Aging</th>
            </tr>
          </thead>
          <tbody>
            {demoInvoices.map((i) => {
              const aging = daysOverdue(i.dueDate);
              return (
                <tr key={i.id} className="border-b last:border-b-0 hover:bg-muted/40">
                  <td className="py-3 px-4 font-medium">{i.id}</td>
                  <td className="py-3">{clientName(i.clientId)}</td>
                  <td className="py-3 text-xs text-muted-foreground">{jobTitle(i.jobId)}</td>
                  <td className="py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs">{i.status}</span></td>
                  <td className="py-3 text-right font-semibold">{money(i.amountCents)}</td>
                  <td className="py-3 text-xs text-muted-foreground">{new Date(i.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right text-xs">
                    {aging <= 0 ? <span className="rounded-full bg-muted px-2 py-1">{Math.abs(aging)}d until due</span> : <span className="rounded-full bg-muted px-2 py-1">{aging}d overdue</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
