import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, SearchBar, SimpleTable, StatGrid } from "@/components/app/filled/page";

export default function InvoicesPage() {
  return (
    <PageWrap>
      <PageHeader
        title="Invoices"
        subtitle="Progress claims, staged payments, and accounts receivable — no chaos."
        right={
          <>
            <GhostButton>Reminders</GhostButton>
            <PrimaryButton>New Invoice</PrimaryButton>
          </>
        }
      />
      <StatGrid
        items={[
          { label: "Outstanding", value: "$42,180", hint: "A/R total" },
          { label: "Overdue", value: "$8,900", hint: "Needs follow-up" },
          { label: "Paid (30d)", value: "$97,240", hint: "Collections" },
          { label: "Avg. Days to Pay", value: "12.4", hint: "Trend improving" },
        ]}
      />
      <SearchBar placeholder="Search invoices by client, job, number…" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Accounts Receivable" subtitle="Structured list ready for DB wiring">
            <SimpleTable
              cols={["Invoice", "Client", "Job", "Status", "Due", "Amount"]}
              rows={[
                [
                  <div key="a">
                    <div className="font-semibold">INV-22018</div>
                    <div className="text-xs text-muted-foreground">Progress claim #2</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Acme Body Corp</div>
                    <div className="text-xs text-muted-foreground">lchen@acme.com</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">J-1402</div>
                    <div className="text-xs text-muted-foreground">Tower A</div>
                  </div>,
                  <Pill key="d" tone="warn">Sent</Pill>,
                  <div key="e">
                    <div className="font-medium">Feb 06</div>
                    <div className="text-xs text-muted-foreground">5 days</div>
                  </div>,
                  <div key="f" className="font-semibold">$9,450</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">INV-22011</div>
                    <div className="text-xs text-muted-foreground">Final claim</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Riverside Mgmt</div>
                    <div className="text-xs text-muted-foreground">apatel@riverside.com</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">J-1405</div>
                    <div className="text-xs text-muted-foreground">QA inspection</div>
                  </div>,
                  <Pill key="d" tone="good">Paid</Pill>,
                  <div key="e">
                    <div className="font-medium">Jan 30</div>
                    <div className="text-xs text-muted-foreground">On time</div>
                  </div>,
                  <div key="f" className="font-semibold">$6,450</div>,
                ],
                [
                  <div key="a">
                    <div className="font-semibold">INV-22007</div>
                    <div className="text-xs text-muted-foreground">Variation</div>
                  </div>,
                  <div key="b">
                    <div className="font-medium">Bayside Strata</div>
                    <div className="text-xs text-muted-foreground">ops@bayside.com</div>
                  </div>,
                  <div key="c">
                    <div className="font-medium">J-1407</div>
                    <div className="text-xs text-muted-foreground">Balcony sealing</div>
                  </div>,
                  <Pill key="d" tone="bad">Overdue</Pill>,
                  <div key="e">
                    <div className="font-medium">Jan 24</div>
                    <div className="text-xs text-muted-foreground">8 days late</div>
                  </div>,
                  <div key="f" className="font-semibold">$8,900</div>,
                ],
              ]}
            />
          </Card>

          <Card title="Automation Rules" subtitle="This is where TradeHub becomes lethal" right={<GhostButton>New Rule</GhostButton>}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Escrow-linked releases</div>
                <div className="mt-1 text-xs text-muted-foreground">Invoices unlock automatically when QA evidence is present.</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-sm font-semibold">Overdue escalation</div>
                <div className="mt-1 text-xs text-muted-foreground">Nudges → reminders → fee triggers → dispute pathway.</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Cashflow Snapshot" subtitle="Short-term controls">
            <div className="space-y-3">
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-xs text-muted-foreground">Next 7 days</div>
                <div className="mt-1 text-lg font-semibold">$14,320</div>
                <div className="mt-1 text-xs text-muted-foreground">Expected collections</div>
              </div>
              <div className="rounded-2xl border bg-muted/10 p-4">
                <div className="text-xs text-muted-foreground">High risk</div>
                <div className="mt-1 text-lg font-semibold">$8,900</div>
                <div className="mt-1 text-xs text-muted-foreground">Escalate now</div>
              </div>
            </div>
          </Card>

          <Card title="One-click actions" subtitle="Move money faster">
            <div className="grid gap-2">
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Send reminders</div>
                <div className="text-xs text-muted-foreground">Batch 3 overdue invoices</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Generate progress claim</div>
                <div className="text-xs text-muted-foreground">From job milestones</div>
              </button>
              <button className="rounded-xl border bg-background px-3 py-3 text-left hover:bg-accent/40">
                <div className="text-sm font-semibold">Link to escrow</div>
                <div className="text-xs text-muted-foreground">Release rules & audit trail</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
