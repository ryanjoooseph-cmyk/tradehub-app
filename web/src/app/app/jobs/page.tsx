export default function Jobs() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">Track everything from lead → invoice → closeout.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow hover:opacity-95">Create Job</button>
      </div>

      <div className="flex gap-2">
        {["Leads", "Scheduled", "In Progress", "Invoiced", "Closed"].map((t) => (
          <button key={t} className="px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">{t}</button>
        ))}
        <div className="ml-auto flex gap-2">
          <input className="px-3 py-2 rounded-xl border bg-card/40 text-sm w-64" placeholder="Filter by client, address, tag…" />
          <button className="px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">Filters</button>
          <button className="px-3 py-2 rounded-xl border bg-card/40 hover:bg-accent/50 text-sm">Export</button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/40 overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 text-xs text-muted-foreground border-b bg-background/30">
          <div className="col-span-3">Job</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Scheduled</div>
          <div className="col-span-2 text-right">Value</div>
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 hover:bg-accent/20 transition">
            <div className="col-span-3">
              <div className="font-medium">JB-{1042 + i}</div>
              <div className="text-xs text-muted-foreground">Rope access repaint — Tower {i + 1}</div>
            </div>
            <div className="col-span-3">
              <div className="font-medium">ACME Strata</div>
              <div className="text-xs text-muted-foreground">Southbank VIC</div>
            </div>
            <div className="col-span-2">
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs border bg-background/40">Scheduled</span>
            </div>
            <div className="col-span-2 text-sm">Tomorrow 10:30</div>
            <div className="col-span-2 text-right font-medium">$4,200</div>
          </div>
        ))}
      </div>
    </div>
  );
}
