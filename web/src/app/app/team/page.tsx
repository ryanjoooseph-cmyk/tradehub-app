import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, SearchBar, SimpleTable, StatGrid } from "@/components/app/filled/page";

export default function TeamPage() {
  return (
    <PageWrap>
      <PageHeader
        title="Team"
        subtitle="Crew capacity, certifications, and accountability — without spreadsheets."
        right={
          <>
            <GhostButton>Rosters</GhostButton>
            <PrimaryButton>Add Member</PrimaryButton>
          </>
        }
      />
      <StatGrid
        items={[
          { label: "Active Members", value: "18", hint: "Employees + contractors" },
          { label: "Rope Access", value: "6", hint: "IRATA / equivalent" },
          { label: "Booked This Week", value: "72%", hint: "Capacity used" },
          { label: "Incidents", value: "0", hint: "Last 30 days" },
        ]}
      />
      <SearchBar placeholder="Search by name, role, certification, availability…" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Roster" subtitle="Seed roster list with status + skills">
            <SimpleTable
              cols={["Member", "Role", "Skills", "Status", "Next booking"]}
              rows={[
                [
                  <div key="a">
                    <div className="font-semibold">Ryan J</div>
                    <div className="text-xs text-muted-foreground">Owner / Ops</div>
                  </div>,
                  "Operations",
                  <div key="c" className="text-xs text-muted-foreground">Scheduling, QA, client mgmt</div>,
                  <Pill key="d" tone="good">Active</Pill>,
                  <div key="e">
                    <div className="font-medium">J-1402</div>
                    <div className="text-xs text-muted-foreground">Today 2:00pm</div>
                  </div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">Crew Lead A</div>
                    <div className="text-xs text-muted-foreground">Supervisor</div>
                  </div>,
                  "Supervisor",
                  <div key="c" className="text-xs text-muted-foreground">Rope access, safety docs</div>,
                  <Pill key="d" tone="good">On site</Pill>,
                  <div key="e">
                    <div className="font-medium">J-1402</div>
                    <div className="text-xs text-muted-foreground">Now</div>
                  </div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">Painter B</div>
                    <div className="text-xs text-muted-foreground">Contractor</div>
                  </div>,
                  "Painter",
                  <div key="c" className="text-xs text-muted-foreground">Interiors, patch & repair</div>,
                  <Pill key="d" tone="warn">Available</Pill>,
                  <div key="e">
                    <div className="font-medium">Unassigned</div>
                    <div className="text-xs text-muted-foreground">Ready</div>
                  </div>,
                ],
              ]}
            />
          </Card>

          <Card title="Compliance & Certs" subtitle="Make it impossible to schedule unsafe work">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Cert expiry radar</div>
                <div className="mt-1 text-xs text-muted-foreground">Auto-alert before IRATA / tickets expire.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">SWMS lock</div>
                <div className="mt-1 text-xs text-muted-foreground">Block job start without signed docs.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Incident workflow</div>
                <div className="mt-1 text-xs text-muted-foreground">Report → triage → corrective actions.</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Capacity Planner" subtitle="Instant visibility">
            <div className="space-y-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Today</div>
                  <Pill tone="good">Balanced</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">2 crews on-site, 1 in QA, 1 standby.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">This week</div>
                  <Pill tone="warn">Tight</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Rope access demand peaks Thu–Fri.</div>
              </div>
            </div>
          </Card>

          <Card title="Ops actions" subtitle="One-click ops">
            <div className="grid gap-2">
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Create roster</div>
                <div className="text-xs text-muted-foreground">From calendar load</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Send crew brief</div>
                <div className="text-xs text-muted-foreground">SMS + email pack</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Upload certs</div>
                <div className="text-xs text-muted-foreground">PDF batch import</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
