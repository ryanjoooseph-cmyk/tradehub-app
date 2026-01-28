export default function Calendar() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">Drag/drop scheduling (week view coming next).</p>
      </div>
      <div className="rounded-2xl border bg-card/40 p-4">
        <div className="h-[560px] rounded-xl border bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-indigo-500/10" />
        <div className="text-xs text-muted-foreground mt-3">Calendar UI shell is live. Next we wire real events + drag/drop rules.</div>
      </div>
    </div>
  );
}
