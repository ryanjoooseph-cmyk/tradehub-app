export default function Team() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground">Roles, permissions, assignments.</p>
      </div>
      <div className="rounded-2xl border bg-card/40 p-6">
        <div className="text-sm text-muted-foreground">Role-based controls next (ties to RLS).</div>
      </div>
    </div>
  );
}
