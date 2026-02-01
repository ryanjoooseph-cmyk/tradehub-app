import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, StatGrid } from "@/components/app/filled/page";

export default function SettingsPage() {
  return (
    <PageWrap>
      <PageHeader
        title="Settings"
        subtitle="Controls, permissions, integrations — production-ready defaults."
        right={
          <>
            <GhostButton>Audit log</GhostButton>
            <PrimaryButton>Save</PrimaryButton>
          </>
        }
      />

      <StatGrid
        items={[
          { label: "Environment", value: "Production", hint: "Render + Supabase" },
          { label: "Auth", value: "Enabled", hint: "Supabase auth" },
          { label: "Escrow Mode", value: "Milestones", hint: "Release rules active" },
          { label: "Webhooks", value: "3", hint: "Events wired" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Company" subtitle="Brand + operational defaults" right={<Pill>Seed</Pill>}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Company name</div>
              <div className="mt-1 font-semibold">TradeHub</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Timezone</div>
              <div className="mt-1 font-semibold">Australia/Melbourne</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Default invoice terms</div>
              <div className="mt-1 font-semibold">Net 14</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Progress claim style</div>
              <div className="mt-1 font-semibold">Milestone-based</div>
            </div>
          </div>
        </Card>

        <Card title="Integrations" subtitle="Render, GitHub, Supabase, OpenAI" right={<GhostButton>Manage</GhostButton>}>
          <div className="space-y-3">
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Supabase</div>
                <Pill tone="good">Connected</Pill>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">DB + Auth + Realtime ready.</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Render</div>
                <Pill tone="good">Connected</Pill>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Auto-deploy enabled.</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">GitHub</div>
                <Pill tone="good">PAT set</Pill>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Auto-merge workflow ready.</div>
            </div>
          </div>
        </Card>

        <Card title="Permissions" subtitle="Role-based access" right={<GhostButton>Invite</GhostButton>}>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="font-semibold">Owner</div>
              <div className="mt-1 text-xs text-muted-foreground">All access</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="font-semibold">Ops</div>
              <div className="mt-1 text-xs text-muted-foreground">Jobs + calendar + invoices</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="font-semibold">Crew</div>
              <div className="mt-1 text-xs text-muted-foreground">Assigned jobs only</div>
            </div>
          </div>
        </Card>

        <Card title="System" subtitle="Safety rails" right={<Pill tone="warn">Review</Pill>}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="font-semibold">Force escrow for high-value</div>
              <div className="mt-1 text-xs text-muted-foreground">Auto-enable milestones above threshold.</div>
            </div>
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="font-semibold">Dispute trigger rules</div>
              <div className="mt-1 text-xs text-muted-foreground">Late approvals, failed QA, payment friction.</div>
            </div>
          </div>
        </Card>
      </div>
    </PageWrap>
  );
}
