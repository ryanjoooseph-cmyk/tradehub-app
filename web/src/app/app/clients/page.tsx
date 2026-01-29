import { demoClients, demoJobs, demoInvoices } from "@/lib/demo-data";

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

export default function ClientsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="text-sm text-muted-foreground">CRM built for trades: history, exposure, and pay behaviour.</p>
      </div>

      <div className="rounded-xl border bg-card overflow-auto">
        <div className="p-4 border-b">
          <div className="font-semibold">Client Register</div>
          <div className="text-xs text-muted-foreground">Next wave adds client detail pages + contacts + files.</div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="text-left py-2 px-4">Client</th>
              <th className="text-left py-2">Tags</th>
              <th className="text-right py-2">Jobs</th>
              <th className="text-right py-2">AR</th>
              <th className="text-left py-2">Contact</th>
              <th className="text-right py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {demoClients.map((c) => {
              const jobs = demoJobs.filter((j) => j.clientId === c.id);
              const ar = demoInvoices.filter((i) => i.clientId === c.id && i.status !== "Paid").reduce((s, i) => s + i.amountCents, 0);
              return (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-muted/40">
                  <td className="py-3 px-4 font-medium">
                    {c.name}
                    <div className="text-xs text-muted-foreground">{c.id}</div>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">{(c.tags ?? []).join(", ") || "—"}</td>
                  <td className="py-3 text-right font-semibold">{jobs.length}</td>
                  <td className="py-3 text-right font-semibold">{money(ar)}</td>
                  <td className="py-3 text-xs text-muted-foreground">{c.email ?? "—"} • {c.phone ?? "—"}</td>
                  <td className="py-3 px-4 text-right">
                    <a className="rounded-md border px-3 py-1 text-xs hover:bg-muted" href="/app/jobs">View jobs</a>
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
