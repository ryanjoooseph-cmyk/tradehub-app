import { invoices } from "@/components/app/demoData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function tone(s: string) {
  if (s === "Paid") return "success";
  if (s === "Overdue") return "destructive";
  if (s === "Sent") return "warning";
  return "info";
}

export default function InvoicesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Finance</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Invoices</div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Institutional cashflow visibility.</div>
        </div>
        <Button className="rounded-2xl">New invoice</Button>
      </div>

      <Card className="rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-12 border-b border-zinc-200 bg-white/70 px-5 py-3 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
            <div className="col-span-3">Invoice</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-2">Job</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {invoices.map((i) => (
              <div key={i.id} className="grid grid-cols-12 px-5 py-4 hover:bg-zinc-900/5 dark:hover:bg-zinc-50/5">
                <div className="col-span-3">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{i.id}</div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Due: {i.dueIn}</div>
                </div>
                <div className="col-span-3 flex items-center text-sm font-semibold">{i.client}</div>
                <div className="col-span-2 flex items-center text-sm font-semibold">{i.jobId}</div>
                <div className="col-span-2 flex items-center">
                  <Badge tone={tone(i.status)} className="rounded-full px-3 py-1 text-xs font-semibold">{i.status}</Badge>
                </div>
                <div className="col-span-2 flex items-center justify-end text-sm font-extrabold">${i.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
