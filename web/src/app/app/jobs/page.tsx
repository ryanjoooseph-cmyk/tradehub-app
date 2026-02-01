import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, SearchBar, SimpleTable, StatGrid } from "@/components/app/filled/page";

export default function JobsPage() {
  return (
    <PageWrap>
      <PageHeader
        title="Jobs"
        subtitle="Pipeline, scheduling, and execution — built for high-volume ops."
        right={
          <>
            <GhostButton>Import</GhostButton>
            <PrimaryButton>New Job</PrimaryButton>
          </>
        }
      />
      <StatGrid
        items={[
          { label: "Active Jobs", value: "18", hint: "On-site or scheduled" },
          { label: "Quotes Pending", value: "6", hint: "Awaiting approval" },
          { label: "At Risk", value: "2", hint: "Overdue or blocked" },
          { label: "This Week Revenue", value: "$42,180", hint: "Projected" },
        ]}
      />
      <SearchBar placeholder="Search by job, site, client, strata plan, address…" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Live Pipeline" subtitle="Your current workstack (seed UI)">
            <SimpleTable
              cols={["Job", "Site", "Client", "Status", "Next", "Value"]}
              rows={[
                [
                  <div key="a">
                    <div className="font-semibold">J-1402</div>
                    <div className="text-xs text-muted-foreground">Strata repaint — Tower A</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Southbank</div>
                    <div className="text-xs text-muted-foreground">Level 12–32</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">Acme Body Corp</div>
                    <div className="text-xs text-muted-foreground">Manager: L. Chen</div>
                  </div>,
                  <Pill key="d" tone="good">On Track</Pill>,
                  <div key="e">
                    <div className="font-medium">Crew Allocation</div>
                    <div className="text-xs text-muted-foreground">Today 2:00pm</div>
                  </div>,
                  <div key="f" className="font-semibold">$18,900</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">J-1405</div>
                    <div className="text-xs text-muted-foreground">QA inspection — Roof deck</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Docklands</div>
                    <div className="text-xs text-muted-foreground">Roof / plant room</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">Riverside Mgmt</div>
                    <div className="text-xs text-muted-foreground">Manager: A. Patel</div>
                  </div>,
                  <Pill key="d" tone="warn">Waiting</Pill>,
                  <div key="e">
                    <div className="font-medium">Client approval</div>
                    <div className="text-xs text-muted-foreground">Tomorrow 9:00am</div>
                  </div>,
                  <div key="f" className="font-semibold">$6,450</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">J-1407</div>
                    <div className="text-xs text-muted-foreground">Balcony sealing package</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">St Kilda Rd</div>
                    <div className="text-xs text-muted-foreground">Blocks B/C</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">Bayside Strata</div>
                    <div className="text-xs text-muted-foreground">Manager: K. West</div>
                  </div>,
                  <Pill key="d" tone="bad">At Risk</Pill>,
                  <div key="e">
                    <div className="font-medium">Scope clarification</div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                  </div>,
                  <div key="f" className="font-semibold">$11,300</div>,
                ],
              ]}
            />
          </Card>

          <Card title="Operational Notes" subtitle="High-signal notes to keep crews moving" right={<GhostButton>New Note</GhostButton>}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Access & permits</div>
                <div className="mt-1 text-xs text-muted-foreground">Auto-check SWMS, permits, and hoist bookings against job dates.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Material staging</div>
                <div className="mt-1 text-xs text-muted-foreground">Track paint batches, sealant lots, and delivery ETAs per site.</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Today’s Priorities" subtitle="What moves the needle right now">
            <div className="space-y-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Crew dispatch</div>
                  <Pill tone="warn">Due</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Confirm rope access availability for J-1402.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Quote follow-up</div>
                  <Pill tone="neutral">Queue</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Send revision for balcony package with inclusions list.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Escrow milestone</div>
                  <Pill tone="good">Ready</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Release milestone #2 after QA sign-off (J-1405).</div>
              </div>
            </div>
          </Card>

          <Card title="Templates" subtitle="One-click job creation (seed)">
            <div className="grid gap-2">
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">High-rise repaint</div>
                <div className="text-xs text-muted-foreground">Stages + QA + progress claims</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Rope access package</div>
                <div className="text-xs text-muted-foreground">Crew lanes + safety docs</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Remedial & sealing</div>
                <div className="text-xs text-muted-foreground">Defects + scope photos</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
