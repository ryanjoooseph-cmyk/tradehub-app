import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, SearchBar, SimpleTable, StatGrid } from "@/components/app/filled/page";

export default function ClientsPage() {
  return (
    <PageWrap>
      <PageHeader
        title="Clients"
        subtitle="Owners, strata managers, builders — all relationships, one view."
        right={
          <>
            <GhostButton>Segments</GhostButton>
            <PrimaryButton>New Client</PrimaryButton>
          </>
        }
      />
      <StatGrid
        items={[
          { label: "Total Clients", value: "124", hint: "Active + archived" },
          { label: "High Value", value: "19", hint: ">$50k lifetime" },
          { label: "New This Month", value: "7", hint: "Inbound + referrals" },
          { label: "Avg. Response", value: "2h 14m", hint: "Email + calls" },
        ]}
      />
      <SearchBar placeholder="Search clients by name, email, company, building…" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Client Directory" subtitle="Seed UI with structure ready for Supabase wiring">
            <SimpleTable
              cols={["Client", "Type", "Portfolio", "Status", "Notes"]}
              rows={[
                [
                  <div key="a">
                    <div className="font-semibold">Acme Body Corp</div>
                    <div className="text-xs text-muted-foreground">lchen@acme.com</div>
                  </div>,
                  <Pill key="b">Strata</Pill>,
                  <div key="c">
                    <div className="font-medium">12 buildings</div>
                    <div className="text-xs text-muted-foreground">Southbank / Docklands</div>
                  </div>,
                  <Pill key="d" tone="good">Active</Pill>,
                  <div key="e" className="text-sm">Prefers staged invoicing + progress photos.</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">Bayside Strata</div>
                    <div className="text-xs text-muted-foreground">ops@bayside.com</div>
                  </div>,
                  <Pill key="b">Strata</Pill>,
                  <div key="c">
                    <div className="font-medium">6 buildings</div>
                    <div className="text-xs text-muted-foreground">St Kilda / Elwood</div>
                  </div>,
                  <Pill key="d" tone="warn">Warm</Pill>,
                  <div key="e" className="text-sm">Awaiting scope clarification on balcony package.</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">Riverside Mgmt</div>
                    <div className="text-xs text-muted-foreground">apatel@riverside.com</div>
                  </div>,
                  <Pill key="b">Management</Pill>,
                  <div key="c">
                    <div className="font-medium">3 sites</div>
                    <div className="text-xs text-muted-foreground">Docklands</div>
                  </div>,
                  <Pill key="d" tone="good">Active</Pill>,
                  <div key="e" className="text-sm">Fast approvals when QA evidence is attached.</div>,
                ],
              ]}
            />
          </Card>

          <Card title="Relationship Intelligence" subtitle="The stuff that makes you money (seed)">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Portfolio heatmap</div>
                <div className="mt-1 text-xs text-muted-foreground">Which buildings are due for repaint cycles.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Referral engine</div>
                <div className="mt-1 text-xs text-muted-foreground">Auto-identify managers connected across buildings.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Risk flags</div>
                <div className="mt-1 text-xs text-muted-foreground">Payment friction, scope creep, dispute frequency.</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Client Health" subtitle="Operational signals">
            <div className="space-y-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Payment reliability</div>
                  <Pill tone="good">High</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Track average days to pay and claim disputes.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Approval speed</div>
                  <Pill tone="warn">Medium</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Measure quote acceptance time by manager.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Scope volatility</div>
                  <Pill tone="neutral">Low</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Detect variations & change requests.</div>
              </div>
            </div>
          </Card>

          <Card title="Quick Actions" subtitle="Make it move" right={<GhostButton>Configure</GhostButton>}>
            <div className="grid gap-2">
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Send proposal pack</div>
                <div className="text-xs text-muted-foreground">Scope, inclusions, timeline</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Request site access</div>
                <div className="text-xs text-muted-foreground">Permits, keys, hoist bookings</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Create escrow plan</div>
                <div className="text-xs text-muted-foreground">Milestones + release rules</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
