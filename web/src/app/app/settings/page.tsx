import { Card } from "@/components/ui/card";

export default function SettingsPage(){
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Organisation, security, integrations.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-card/40 p-4"><div className="font-medium">Organisation</div><div className="mt-2 text-sm text-muted-foreground">Branding, default terms, business details.</div></Card>
        <Card className="rounded-2xl border bg-card/40 p-4"><div className="font-medium">Security</div><div className="mt-2 text-sm text-muted-foreground">RBAC, audit log, SSO (future).</div></Card>
        <Card className="rounded-2xl border bg-card/40 p-4"><div className="font-medium">Integrations</div><div className="mt-2 text-sm text-muted-foreground">Supabase, payments, webhooks.</div></Card>
      </div>
    </div>
  );
}
