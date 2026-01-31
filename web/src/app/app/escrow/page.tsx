import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/app/filled/section";

const milestones = [
  { name: "Deposit funded", status: "Complete", amt: 8500 },
  { name: "Work in progress", status: "Active", amt: 0 },
  { name: "QA inspection", status: "Pending", amt: 0 },
  { name: "Release funds", status: "Locked", amt: 12000 },
];

const vt = (s: string): "default" | "success" | "warn" | "danger" => {
  const t = s.toLowerCase();
  if (t.includes("complete")) return "success";
  if (t.includes("active") || t.includes("pending")) return "warn";
  if (t.includes("dispute") || t.includes("failed")) return "danger";
  return "default";
};

export default function EscrowPage() {
  const held = 61500;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="Escrow" subtitle="Milestones, holds, releases, dispute shield." />
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="success">Mode: Safe</Badge>
          <Badge variant="warn">Held: ${held.toLocaleString()}</Badge>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Milestone Timeline</CardTitle>
            <CardDescription>Deposit → Work → QA → Release</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
                <div>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.amt ? "$" + m.amt.toLocaleString() : "—"}</div>
                </div>
                <Badge variant={vt(m.status)}>{m.status}</Badge>
              </div>
            ))}
            <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
              Next: wire to escrow ledger + inspector evidence flow.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispute Shield</CardTitle>
            <CardDescription>Evidence, inspection, decision log.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border bg-muted/10 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Open disputes</div>
                <Badge variant="success">0</Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">If opened: lock funds + request inspector + log outcome.</div>
            </div>
            <div className="rounded-lg border bg-muted/10 p-3">
              <div className="font-medium">Inspector workflow</div>
              <div className="text-xs text-muted-foreground">Assign inspector, capture findings, attach media, approve release.</div>
            </div>
            <div className="rounded-lg border bg-muted/10 p-3">
              <div className="font-medium">Audit log</div>
              <div className="text-xs text-muted-foreground">Immutable actions log for compliance and trust.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Release Ledger</CardTitle>
          <CardDescription>Track escrow movements (deposit/hold/release).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Ref</th>
                  <th className="px-3 py-2 text-left">Event</th>
                  <th className="px-3 py-2 text-left">Job</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ref: "ESC-2201", ev: "Deposit", job: "J-1402", amt: 8500, st: "Complete" },
                  { ref: "ESC-2202", ev: "Hold", job: "J-1405", amt: 12000, st: "Locked" },
                ].map((r) => (
                  <tr key={r.ref} className="border-t">
                    <td className="px-3 py-2 font-medium">{r.ref}</td>
                    <td className="px-3 py-2">{r.ev}</td>
                    <td className="px-3 py-2">{r.job}</td>
                    <td className="px-3 py-2 text-right">${r.amt.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <Badge variant={vt(r.st)}>{r.st}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
