export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Company, permissions, billing, integrations. Built for scale.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-6 rounded-xl border bg-card">
          <div className="p-4 border-b font-semibold">Company</div>
          <div className="p-4 space-y-2 text-sm">
            <div className="rounded-lg border bg-background p-3">Trading name: TradeHub</div>
            <div className="rounded-lg border bg-background p-3">Default timezone: Australia/Melbourne</div>
            <div className="rounded-lg border bg-background p-3">Invoice numbering: inv_9xxx</div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6 rounded-xl border bg-card">
          <div className="p-4 border-b font-semibold">Integrations</div>
          <div className="p-4 space-y-2 text-sm">
            <div className="rounded-lg border bg-background p-3">Supabase: connected (next wave: real auth + RLS)</div>
            <div className="rounded-lg border bg-background p-3">Render: deployments active</div>
            <div className="rounded-lg border bg-background p-3">OpenAI: agent tools (next wave: job notes → summaries)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
