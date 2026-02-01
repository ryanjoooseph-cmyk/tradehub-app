import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, SearchBar, SimpleTable, StatGrid } from "@/components/app/filled/page";

export default function EscrowPage() {
  return (
    <PageWrap>
      <PageHeader
        title="Escrow"
        subtitle="Milestones, releases, disputes — the TradeHub moat."
        right={
          <>
            <GhostButton>Policies</GhostButton>
            <PrimaryButton>New Escrow</PrimaryButton>
          </>
        }
      />
      <StatGrid
        items={[
          { label: "Funds Held", value: "$28,900", hint: "Across active jobs" },
          { label: "Ready to Release", value: "$6,450", hint: "QA complete" },
          { label: "On Hold", value: "$8,900", hint: "Pending approval" },
          { label: "Disputes", value: "0", hint: "Active cases" },
        ]}
      />
      <SearchBar placeholder="Search by job, client, milestone, reference…" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Active Escrows" subtitle="Seed structure — wire to DB next">
            <SimpleTable
              cols={["Job", "Client", "Milestones", "Status", "Next action", "Held"]}
              rows={[
                [
                  <div key="a">
                    <div className="font-semibold">J-1402</div>
                    <div className="text-xs text-muted-foreground">Tower A repaint</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Acme Body Corp</div>
                    <div className="text-xs text-muted-foreground">12 buildings</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">3</div>
                    <div className="text-xs text-muted-foreground">1 complete</div>
                  </div>,
                  <Pill key="d" tone="warn">Awaiting QA</Pill>,
                  <div key="e">
                    <div className="font-medium">Upload progress photos</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>,
                  <div key="f" className="font-semibold">$18,900</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">J-1405</div>
                    <div className="text-xs text-muted-foreground">QA inspection</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Riverside Mgmt</div>
                    <div className="text-xs text-muted-foreground">Docklands</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">2</div>
                    <div className="text-xs text-muted-foreground">2 complete</div>
                  </div>,
                  <Pill key="d" tone="good">Release ready</Pill>,
                  <div key="e">
                    <div className="font-medium">Release milestone #2</div>
                    <div className="text-xs text-muted-foreground">Now</div>
                  </div>,
                  <div key="f" className="font-semibold">$6,450</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">J-1407</div>
                    <div className="text-xs text-muted-foreground">Balcony sealing</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Bayside Strata</div>
                    <div className="text-xs text-muted-foreground">St Kilda</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">4</div>
                    <div className="text-xs text-muted-foreground">0 complete</div>
                  </div>,
                  <Pill key="d" tone="bad">On hold</Pill>,
                  <div key="e">
                    <div className="font-medium">Scope approval</div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                  </div>,
                  <div key="f" className="font-semibold">$8,900</div>,
                ],
              ]}
            />
          </Card>

          <Card title="Audit Trail" subtitle="Immutable record (seed)">
            <div className="space-y-2">
              <div className="rounded-xl border bg-muted/10 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Milestone created</div>
                  <div className="text-xs text-muted-foreground">Today 10:14</div>
                </div>
                <div className="text-xs text-muted-foreground">J-1402 • Milestone #2 • $9,450</div>
              </div>
              <div className="rounded-xl border bg-muted/10 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">QA evidence uploaded</div>
                  <div className="text-xs text-muted-foreground">Yesterday 16:02</div>
                </div>
                <div className="text-xs text-muted-foreground">J-1405 • 14 photos • report.pdf</div>
              </div>
              <div className="rounded-xl border bg-muted/10 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Milestone released</div>
                  <div className="text-xs text-muted-foreground">Yesterday 16:08</div>
                </div>
                <div className="text-xs text-muted-foreground">J-1405 • $6,450 • payout initiated</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Release Engine" subtitle="Rules that protect both sides" right={<GhostButton>Configure</GhostButton>}>
            <div className="space-y-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="font-semibold">Auto-release when</div>
                <div className="mt-1 text-xs text-muted-foreground">QA evidence + client sign-off present.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="font-semibold">Auto-hold when</div>
                <div className="mt-1 text-xs text-muted-foreground">Scope disputes, failed inspection, overdue approvals.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="font-semibold">Dispute pathway</div>
                <div className="mt-1 text-xs text-muted-foreground">Triage → inspector → resolution → release or refund.</div>
              </div>
            </div>
          </Card>

          <Card title="Quick actions" subtitle="Immediate ops">
            <div className="grid gap-2">
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Create milestone plan</div>
                <div className="text-xs text-muted-foreground">From quote stages</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Request inspection</div>
                <div className="text-xs text-muted-foreground">3rd-party QA</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Start dispute</div>
                <div className="text-xs text-muted-foreground">Lock funds + log evidence</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
