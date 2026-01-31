import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | TradeHub",
};

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/40 dark:ring-zinc-800">
      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{title}</div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{value}</div>
      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{sub}</div>
    </div>
  );
}

function Pill({ text, tone }: { text: string; tone: "live" | "warn" | "bad" | "default" }) {
  const cls =
    tone === "live"
      ? "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-200 dark:bg-sky-400/10"
      : tone === "warn"
      ? "bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:text-amber-200 dark:bg-amber-400/10"
      : tone === "bad"
      ? "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-200 dark:bg-rose-400/10"
      : "bg-zinc-900/5 text-zinc-700 ring-zinc-200 dark:bg-zinc-50/5 dark:text-zinc-200 dark:ring-zinc-800";
  return <div className={"inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-tight ring-1 " + cls}>{text}</div>;
}

function Row({
  title,
  meta,
  pill,
  amount,
}: {
  title: string;
  meta: string;
  pill: React.ReactNode;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</div>
        <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{meta}</div>
      </div>
      <div className="flex items-center gap-2">
        {pill}
        <div className="text-sm font-extrabold tracking-tight">{amount}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">Command Center</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Jobs, cashflow, compliance and escrow posture in one place.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 rounded-md border px-3 text-sm font-semibold hover:bg-muted">Generate report</button>
          <button className="h-9 rounded-md border px-3 text-sm font-semibold hover:bg-muted">Create job</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Active jobs" value="12" sub="Work in motion across crews" />
        <Card title="Scheduled (7 days)" value="18" sub="Locked into calendar slots" />
        <Card title="Awaiting payment" value="$46,210" sub="Invoices pending settlement" />
        <Card title="Escrow protected" value="$128,900" sub="Held safely for milestone release" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/40 dark:ring-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pipeline</div>
              <div className="mt-1 text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Operational flow</div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">The “what happens next” engine. No dead ends.</div>
            </div>
            <Pill text="Live" tone="live" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-3xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Schedule</div>
              <div className="mt-2 text-sm font-extrabold">Assign crew, confirm access</div>
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Auto-check prerequisites and safety.</div>
            </div>
            <div className="rounded-3xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Execution</div>
              <div className="mt-2 text-sm font-extrabold">Daily progress + photos</div>
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Client visibility + audit trail.</div>
            </div>
            <div className="rounded-3xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Settlement</div>
              <div className="mt-2 text-sm font-extrabold">Invoice + escrow release</div>
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Stops non-payment and fights.</div>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-white/70 p-4 ring-1 ring-zinc-200 dark:bg-zinc-950/40 dark:ring-zinc-800">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Critical queue</div>
            <div className="mt-3 space-y-2">
              <Row
                title="High-rise washdown + repaint"
                meta="Strata Group A • Southbank Tower • Crew 2"
                pill={<Pill text="In Progress" tone="live" />}
                amount="$18,400"
              />
              <Row
                title="Balcony leak remediation"
                meta="Homeowner • Carlton • Crew 1"
                pill={<Pill text="Awaiting Payment" tone="warn" />}
                amount="$6,200"
              />
              <Row
                title="Common area repaint"
                meta="Body Corp • Docklands • Crew 3"
                pill={<Pill text="Scheduled" tone="default" />}
                amount="$9,100"
              />
              <Row
                title="Render repairs + seal"
                meta="Builder Co • Fitzroy • Crew 2"
                pill={<Pill text="Dispute" tone="bad" />}
                amount="$5,400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/40 dark:ring-zinc-800">
            <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Today</div>
            <div className="mt-3 space-y-2">
              <div className="rounded-2xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">08:00</div>
                <div className="mt-1 text-sm font-extrabold">Crew 1 • Balcony remediation</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Access confirmed • PPE checklist complete</div>
              </div>
              <div className="rounded-2xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">12:30</div>
                <div className="mt-1 text-sm font-extrabold">Inspection • Southbank Tower</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Photo evidence required for escrow release</div>
              </div>
              <div className="rounded-2xl bg-zinc-900/5 p-4 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">16:00</div>
                <div className="mt-1 text-sm font-extrabold">Client review call</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Progress + variations approval</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/40 dark:ring-zinc-800">
            <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Escrow posture</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Deposit pending</div>
                <Pill text="2 jobs" tone="warn" />
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Milestone release approvals</div>
                <Pill text="1 hold" tone="warn" />
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Dispute risk</div>
                <Pill text="1 flagged" tone="bad" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
