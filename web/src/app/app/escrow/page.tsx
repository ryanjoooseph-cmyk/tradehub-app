import {
  Card,
  GhostButton,
  PageHeader,
  PageWrap,
  Pill,
  PrimaryButton,
  SearchBar,
  SimpleTable,
  StatGrid,
} from "@/components/app/filled/page";

type EscrowRow = {
  job: string;
  client: string;
  milestone: string;
  status: "Awaiting QA" | "Release ready" | "On hold" | "Dispute";
  next: string;
  amount: string;
};

const rows: EscrowRow[] = [
  {
    job: "J-1402 Tower A repaint",
    client: "Acme Body Corp",
    milestone: "3 complete",
    status: "Awaiting QA",
    next: "Upload progress photos (Today)",
    amount: "$6,450",
  },
  {
    job: "J-1405 QA inspection",
    client: "Riverside Mgmt",
    milestone: "2 complete",
    status: "Release ready",
    next: "Release milestone #2 (Now)",
    amount: "$2,980",
  },
  {
    job: "J-1407 Balcony sealing",
    client: "Bayside Strata",
    milestone: "0 complete",
    status: "On hold",
    next: "Scope approval (Client)",
    amount: "$8,900",
  },
  {
    job: "J-1411 Roof touch-ups",
    client: "Southbank Commercial",
    milestone: "1 complete",
    status: "Dispute",
    next: "Inspector booking (48h)",
    amount: "$1,860",
  },
];

function statusPill(s: EscrowRow["status"]) {
  switch (s) {
    case "Release ready":
      return <Pill tone="good">Release ready</Pill>;
    case "Awaiting QA":
      return <Pill tone="warn">Awaiting QA</Pill>;
    case "On hold":
      return <Pill tone="neutral">On hold</Pill>;
    case "Dispute":
      return <Pill tone="bad">Dispute</Pill>;
  }
}

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
          { label: "Disputes", value: "1", hint: "Needs review" },
        ]}
      />

      <Card title="Search">
        <SearchBar placeholder="Search by job, client, milestone, reference…" />
      </Card>

      <Card title="Escrow Activity" subtitle="Hold/release pipeline across jobs and milestones.">
        <SimpleTable
          cols={["Job","Client","Milestones","Status","Next action","Amount"]}
          rows={rows.map((r) => [
            r.job,
            r.client,
            r.milestone,
            statusPill(r.status),
            r.next,
            r.amount,
          ])}
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Release Engine"
          subtitle="Rules that protect trades + clients without slowing cashflow."
          right={<GhostButton>Rules</GhostButton>}>
          <div className="grid gap-3">
            <Card title="Evidence gates" subtitle="Proof + acknowledgement before release.">
              <div className="text-sm opacity-80">
                Photo proof + client acknowledgement before milestone release.
              </div>
            </Card>
            <Card title="Dispute window" subtitle="Configurable hold before escalation.">
              <div className="text-sm opacity-80">
                24–72h configurable hold before dispute escalation.
              </div>
            </Card>
            <Card title="Audit trail" subtitle="Immutable event stream.">
              <div className="text-sm opacity-80">
                created → held → released → disputed (timestamped).
              </div>
            </Card>
          </div>
        </Card>

        <Card title="Actions" subtitle="Fast ops moves (UI now, DB wiring next).">
          <div className="grid gap-3">
            <PrimaryButton>Release next milestone</PrimaryButton>
            <GhostButton>Put escrow on hold</GhostButton>
            <GhostButton>Open dispute</GhostButton>
            <GhostButton>Book inspector</GhostButton>
          </div>
        </Card>
      </div>
    </PageWrap>
  );
}
