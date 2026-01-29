export default function TeamPage() {
  const team = [
    { id: "T1", name: "Tech One", role: "Rope Access Painter", status: "Available" },
    { id: "T2", name: "Tech Two", role: "Rope Access Painter", status: "Booked" },
    { id: "T3", name: "Supervisor", role: "Supervisor", status: "On Site" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground">Roster, availability, and capacity planning.</p>
      </div>

      <div className="rounded-xl border bg-card overflow-auto">
        <div className="p-4 border-b">
          <div className="font-semibold">Roster</div>
          <div className="text-xs text-muted-foreground">Next wave: availability blocks + dispatch conflicts.</div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="text-left py-2 px-4">Member</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Status</th>
              <th className="text-right py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {team.map((t) => (
              <tr key={t.id} className="border-b last:border-b-0 hover:bg-muted/40">
                <td className="py-3 px-4 font-medium">{t.name}<div className="text-xs text-muted-foreground">{t.id}</div></td>
                <td className="py-3">{t.role}</td>
                <td className="py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs">{t.status}</span></td>
                <td className="py-3 px-4 text-right"><button className="rounded-md border px-3 py-1 text-xs hover:bg-muted">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
