export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageHeader from "../../../components/ops/shell/PageHeader";

const settings = [
  { k: "Supabase", v: "Connected" },
  { k: "Render", v: "Auto deploy: On" },
  { k: "GitHub", v: "Auto merge: On" },
  { k: "OpenAI", v: "Ready" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Integrations + environment + security posture." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
          <div className="text-sm font-semibold">Integrations</div>
          <div className="mt-4 space-y-3">
            {settings.map((s) => (
              <div key={s.k} className="flex items-center justify-between rounded-xl border bg-background p-3">
                <div className="text-sm font-semibold">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
          <div className="text-sm font-semibold">Security</div>
          <div className="mt-1 text-xs text-muted-foreground">Hardening comes next: RLS, audit logs, approvals.</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border bg-background p-3">
              <div className="text-sm font-semibold">Role-based access</div>
              <div className="mt-1 text-xs text-muted-foreground">Owner / Admin / Ops / Field</div>
            </div>
            <div className="rounded-xl border bg-background p-3">
              <div className="text-sm font-semibold">Escrow approvals</div>
              <div className="mt-1 text-xs text-muted-foreground">Two-step release workflow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
