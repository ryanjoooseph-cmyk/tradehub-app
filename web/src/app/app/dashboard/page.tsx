import { KPI } from "@/components/app/kpi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OpsCalendar } from "@/components/app/calendar";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Command Center</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Real-time ops view: jobs, cashflow, team utilization, disputes and escrow health.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPI title="Open Jobs" value="18" delta="+3 today" note="Schedule risk: low" />
        <KPI title="Revenue (MTD)" value="$184,200" delta="+12.4%" note="Cashflow improving" />
        <KPI title="Outstanding Invoices" value="$42,900" delta="7 pending" note="2 overdue" />
        <KPI title="Escrow Holds" value="$61,500" delta="All healthy" note="0 disputes" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Operational Schedule</CardTitle>
              <CardDescription>Drag & drop events to reschedule jobs and crew.</CardDescription>
            </CardHeader>
            <CardContent>
              <OpsCalendar />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today’s Focus</CardTitle>
            <CardDescription>Auto-generated priorities (placeholder data)</CardDescription>
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
            <div className="pt-2 text-xs text-muted-foreground">
              Next: wire these to Supabase views + agent tasks.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
