import { KPI } from "@/components/app/kpi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkline, Bars, Donut } from "@/components/app/shell/charts";
import { SectionTitle } from "@/components/app/filled/section";

export default function DashboardPage() {
  const rev = [
    { x: "Mon", y: 18 },
    { x: "Tue", y: 24 },
    { x: "Wed", y: 19 },
    { x: "Thu", y: 31 },
    { x: "Fri", y: 28 },
    { x: "Sat", y: 34 },
    { x: "Sun", y: 29 },
  ];
  const util = [62, 71, 55, 79, 68, 73, 66];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="Command Center" subtitle="Graphs + risk + feed. Calendar lives under Jobs now." />
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="success">Deploy: Green</Badge>
          <Badge variant="warn">A/R: $42.9k</Badge>
          <Badge variant="default">Disputes: 0</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPI title="Open Jobs" value="18" delta="+3 today" note="Schedule risk: low" trend="up" href="/app/jobs" />
        <KPI title="Revenue (MTD)" value="$184,200" delta="+12.4%" note="Cashflow improving" trend="up" href="/app/invoices" />
        <KPI title="Outstanding Invoices" value="$42,900" delta="7 pending" note="2 overdue" trend="up" href="/app/invoices" />
        <KPI title="Escrow Holds" value="$61,500" delta="All healthy" note="0 disputes" trend="up" href="/app/escrow" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Graph restored. No calendar hijacking the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="text-foreground">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">Last 7 days performance curve.</div>
              <div className="text-right">
                <div className="text-2xl font-semibold">$31.2k</div>
                <div className="text-xs text-muted-foreground">last 7 days</div>
              </div>
            </div>
            <div className="mt-3 text-foreground">
              <Sparkline data={rev} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crew Utilization</CardTitle>
            <CardDescription>Capacity scan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Weekly average</div>
              <div className="flex items-center gap-2">
                <Donut value={69} />
                <div>
                  <div className="text-2xl font-semibold">69%</div>
                  <div className="text-xs text-muted-foreground">target 75%</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-foreground">
              <Bars values={util} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today’s Focus</CardTitle>
            <CardDescription>Auto-generated priorities (seeded)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Quote approvals</div>
              <Badge variant="warn">3</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Jobs at risk</div>
              <Badge variant="danger">1</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Payments to reconcile</div>
              <Badge variant="success">0</Badge>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">Next: wire to agent_tasks_enriched_v3.</div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Live Feed</CardTitle>
            <CardDescription>Events, updates, agent actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { t: "New job booked", d: "Strata repaint — Tower A", b: "success" as const },
              { t: "Invoice sent", d: "INV-1042 to Acme Body Corp", b: "default" as const },
              { t: "Escrow funded", d: "$8,500 deposit received", b: "success" as const },
              { t: "Schedule change", d: "Crew 2 moved to Thu 10:00", b: "warn" as const },
            ].map((e, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-lg border bg-muted/10 p-3">
                <div>
                  <div className="font-medium">{e.t}</div>
                  <div className="text-xs text-muted-foreground">{e.d}</div>
                </div>
                <Badge variant={e.b}>{e.b}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
