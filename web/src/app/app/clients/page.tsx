import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/app/filled/section";

const clients = [
  { name: "Acme Body Corp", tier: "A", jobs: 12, ar: 14800, health: "Good" },
  { name: "Bayside Strata", tier: "A", jobs: 8, ar: 7600, health: "Good" },
  { name: "Northpoint OC", tier: "B", jobs: 5, ar: 4200, health: "Watch" },
  { name: "Riverside Mgmt", tier: "B", jobs: 4, ar: 6100, health: "Good" },
];

const tone = (h: string): "default" | "success" | "warn" | "danger" => {
  const t = h.toLowerCase();
  if (t.includes("good")) return "success";
  if (t.includes("watch")) return "warn";
  if (t.includes("bad")) return "danger";
  return "default";
};

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="Clients" subtitle="CRM-grade directory + profile surface." />
        <Badge variant="default">Active: {clients.length}</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
            <CardDescription>Segmented list + activity + jobs + invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">Client</th>
                    <th className="px-3 py-2 text-left">Tier</th>
                    <th className="px-3 py-2 text-right">Jobs</th>
                    <th className="px-3 py-2 text-right">A/R</th>
                    <th className="px-3 py-2 text-left">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.name} className="border-t">
                      <td className="px-3 py-2 font-medium">{c.name}</td>
                      <td className="px-3 py-2">
                        <Badge variant="default">{c.tier}</Badge>
                      </td>
                      <td className="px-3 py-2 text-right">{c.jobs}</td>
                      <td className="px-3 py-2 text-right">${c.ar.toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <Badge variant={tone(c.health)}>{c.health}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Profile</CardTitle>
            <CardDescription>Selected: {clients[0].name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border bg-muted/10 p-3">
              <div className="text-xs text-muted-foreground">Credit / Risk</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="font-semibold">Healthy</div>
                <Badge variant="success">Approved</Badge>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/10 p-3">
              <div className="text-xs text-muted-foreground">Next action</div>
              <div className="mt-1 font-medium">Follow up on INV-1042</div>
              <div className="text-xs text-muted-foreground">Due in 3 days</div>
            </div>
            <div className="rounded-lg border bg-muted/10 p-3">
              <div className="text-xs text-muted-foreground">Notes</div>
              <div className="mt-1 text-muted-foreground">Preferred crew: Crew 2. QA requires photo evidence.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
