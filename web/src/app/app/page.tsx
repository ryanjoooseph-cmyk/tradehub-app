export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Operational control for your trade business.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow hover:opacity-95">New Job</button>
          <button className="px-4 py-2 rounded-xl border bg-card/50 hover:bg-accent/50">Import</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Jobs Today", "12"],
          ["Scheduled", "38"],
          ["Overdue", "3"],
          ["Revenue (MTD)", "$84,120"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border bg-card/40 p-4">
            <div className="text-sm text-muted-foreground">{k}</div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
            <div className="text-xs text-muted-foreground mt-2">+6% vs last week</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border bg-card/40 p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Workload</div>
            <div className="text-xs text-muted-foreground">Next 14 days</div>
          </div>
          <div className="mt-4 h-64 rounded-xl bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10 border" />
          <div className="text-xs text-muted-foreground mt-3">Chart placeholder (we wire real metrics after data layer lock).</div>
        </div>

        <div className="rounded-2xl border bg-card/40 p-4">
          <div className="font-medium">Today</div>
          <div className="mt-4 space-y-3">
            {[
              ["8:00", "Site inspection — Southbank"],
              ["10:30", "Recoat balcony rails — Docklands"],
              ["1:00", "Client quote review — Richmond"],
              ["3:30", "Job closeout — CBD"],
            ].map(([t, s]) => (
              <div key={t} className="flex gap-3 rounded-xl border bg-background/40 p-3">
                <div className="text-xs font-mono text-muted-foreground">{t}</div>
                <div className="text-sm">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
