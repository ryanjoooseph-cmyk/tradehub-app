import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const stats = [
    ["Jobs Today", "12", "+6% vs last week"],
    ["Scheduled", "38", "+3 new"],
    ["Overdue", "3", "-2 resolved"],
    ["Revenue (MTD)", "$84,120", "+8% MoM"],
  ];

  const today = [
    ["08:00", "Site inspection — Southbank"],
    ["10:30", "Recoat balcony rails — Docklands"],
    ["13:00", "Client quote review — Richmond"],
    ["15:30", "Job closeout — CBD"],
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Operational control for your trade business.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl" type="button">New Job</Button>
          <Button variant="outline" className="rounded-xl" type="button">Import</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([k, v, delta]) => (
          <Card key={k} className="rounded-2xl border bg-card/40 p-4">
            <div className="text-sm text-muted-foreground">{k}</div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
            <div className="text-xs text-muted-foreground mt-2">{delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 rounded-2xl border bg-card/40 p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Workload</div>
            <div className="text-xs text-muted-foreground">Next 14 days</div>
          </div>
          <div className="mt-4 h-64 rounded-xl border bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10" />
          <div className="text-xs text-muted-foreground mt-3">Chart placeholder (wire real metrics after data layer lock).</div>
        </Card>

        <Card className="rounded-2xl border bg-card/40 p-4">
          <div className="font-medium">Today</div>
          <div className="mt-4 space-y-3">
            {today.map(([t, s]) => (
              <div key={t} className="flex gap-3 rounded-xl border bg-background/40 p-3">
                <div className="text-xs font-mono text-muted-foreground">{t}</div>
                <div className="text-sm">{s}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
