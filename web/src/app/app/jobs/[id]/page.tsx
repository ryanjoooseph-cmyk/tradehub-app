import Link from "next/link";
import { demoJobs, demoClients, demoInvoices, demoEscrowHolds } from "@/lib/demo-data";

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = demoJobs.find((j) => j.id === id);
  if (!job) return <div className="p-6">Job not found.</div>;

  const client = demoClients.find((c) => c.name === job.client);
  const invoice = demoInvoices.find((i) => i.jobId === job.id);
  const hold = demoEscrowHolds.find((h) => h.jobId === job.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Job ID {job.id}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-muted px-2 py-1">{job.status}</span>
            {hold ? <span className="rounded-full bg-muted px-2 py-1">Escrow: {hold.status}</span> : <span className="rounded-full bg-muted px-2 py-1">Escrow: none</span>}
          </div>
        </div>
        <div className="flex gap-2 text-xs">
          <Link className="rounded-md border px-3 py-2 hover:bg-muted" href="/app/jobs">Back to Jobs</Link>
          <Link className="rounded-md border px-3 py-2 hover:bg-muted" href="/dispatch">Dispatch</Link>
          <Link className="rounded-md border px-3 py-2 hover:bg-muted" href="/escrow">Escrow</Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b font-semibold">Job Record</div>
            <div className="p-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Client</div>
                <div className="font-medium">{client?.name ?? "Unknown"}</div>
                <div className="text-xs text-muted-foreground">{client?.email ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Value</div>
                <div className="font-semibold text-lg">{money(job.valueCents)}</div>
                <div className="text-xs text-muted-foreground">Location: {job.site ?? "—"}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Schedule</div>
                <div className="font-medium">
                  {job.start && job.end ? `${new Date(job.start).toLocaleString()} → ${new Date(job.end).toLocaleString()}` : "Unscheduled"}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Notes</div>
                <div className="whitespace-pre-wrap">{job.site ?? "—"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b font-semibold">Financial Linkage</div>
            <div className="p-4 grid gap-3 text-sm">
              <div className="rounded-lg border bg-background p-3">
                <div className="text-xs text-muted-foreground">Invoice</div>
                <div className="font-medium">{invoice ? `${invoice.id} • ${invoice.status} • ${money(invoice.amountCents)}` : "No invoice linked"}</div>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <div className="text-xs text-muted-foreground">Escrow</div>
                <div className="font-medium">{hold ? `${hold.id} • ${hold.status} • ${money(hold.amountCents)}` : "No escrow hold"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-6">
          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b font-semibold">Execution</div>
            <div className="p-4 grid gap-2 text-sm">
              <button className="rounded-lg border bg-background p-3 hover:bg-muted text-left">Start job</button>
              <button className="rounded-lg border bg-background p-3 hover:bg-muted text-left">Mark blocked</button>
              <button className="rounded-lg border bg-background p-3 hover:bg-muted text-left">Complete job</button>
            </div>
            <div className="p-4 pt-0 text-xs text-muted-foreground">Next wave wires these actions to Supabase.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
