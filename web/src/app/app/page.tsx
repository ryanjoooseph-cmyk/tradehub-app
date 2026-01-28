import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Foundation is live. Next: DB + Auth + Jobs + Calendar.
          </p>
        </div>
        <Badge variant="secondary">A++ skeleton</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Create, schedule, track. (Agents will wire to DB)
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Drag/drop scheduling. (Agents will implement events)
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Later module. (Invoices, deposits, escrow)
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
