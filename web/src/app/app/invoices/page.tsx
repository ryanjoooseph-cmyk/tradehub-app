import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/app/filled/section";

const invoices = [
  { id: "INV-1042", client: "Acme Body Corp", amount: 9200, status: "Pending", due: "3 days" },
  { id: "INV-1041", client: "Bayside Strata", amount: 14800, status: "Sent", due: "7 days" },
  { id: "INV-1039", client: "Northpoint OC", amount: 4200, status: "Overdue", due: "4 days" },
];

const v = (s: string): "default" | "success" | "warn" | "danger" => {
  const t = s.toLowerCase();
  if (t.includes("paid")) return "success";
  if (t.includes("overdue")) return "danger";
  if (t.includes("pending") || t.includes("sent")) return "warn";
  return "default";
};

export default function InvoicesPage() {
  const total = invoices.reduce((a, i) => a + i.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="Invoices" subtitle="Cashflow-grade list + status lanes + recon surface." />
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="default">Open: {invoices.length}</Badge>
          <Badge variant="warn">Total: ${total.toLocaleString()}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Center</CardTitle>
          <CardDescription>Status lanes, payment links, reconciliation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Invoice</th>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Due</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="px-3 py-2 font-medium">{i.id}</td>
                    <td className="px-3 py-2">{i.client}</td>
                    <td className="px-3 py-2">
                      <Badge variant={v(i.status)}>{i.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{i.due}</td>
                    <td className="px-3 py-2 text-right">${i.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Next action</div>
              <div className="mt-1 font-semibold">Auto-remind overdue</div>
              <div className="text-xs text-muted-foreground">Agents can send reminders + update status.</div>
            </div>
            <div className="rounded-xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Reconciliation</div>
              <div className="mt-1 font-semibold">Match payments</div>
              <div className="text-xs text-muted-foreground">Wire to ledger + escrow releases.</div>
            </div>
            <div className="rounded-xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Exports</div>
              <div className="mt-1 font-semibold">BAS-ready CSV</div>
              <div className="text-xs text-muted-foreground">Monthly export pipeline.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
