export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageHeader from "../../../components/ops/shell/PageHeader";

const people = [
  { name: "Ryan J", role: "Owner / Ops", status: "Online" },
  { name: "Team A", role: "Rope Access", status: "On site" },
  { name: "Admin", role: "Billing", status: "Online" },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Team" subtitle="Roster + availability + accountability." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {people.map((p) => (
          <div key={p.name} className="rounded-2xl border bg-background/60 p-5 shadow-sm">
            <div className="text-lg font-bold">{p.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{p.role}</div>
            <div className="mt-4 inline-flex items-center rounded-full border bg-background px-2 py-1 text-xs text-muted-foreground">
              {p.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
