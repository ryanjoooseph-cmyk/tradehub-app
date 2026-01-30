"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  ArrowUpRight,
  Lock,
  CheckCircle2,
  Clock,
  Banknote,
  Scale,
  FileCheck2,
  CreditCard,
  Fingerprint,
  Gavel,
  Timer,
  Zap,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

type Stage = "Hold" | "Verify" | "Release";
type Risk = "Low" | "Medium" | "High";
type EscrowStatus = "Open" | "Pending" | "Released" | "Disputed";

type EscrowCase = {
  id: string;
  jobId: string;
  client: string;
  provider: string;
  amount: number;
  stage: Stage;
  risk: Risk;
  status: EscrowStatus;
  slaMins: number;
  ageMins: number;
  flags: string[];
};

const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

const cases: EscrowCase[] = [
  {
    id: "ESC-1042",
    jobId: "JOB-8121",
    client: "Strata Group A",
    provider: "Crew Alpha",
    amount: 6400,
    stage: "Hold",
    risk: "High",
    status: "Pending",
    slaMins: 180,
    ageMins: 152,
    flags: ["New client", "Large amount", "Weekend"],
  },
  {
    id: "ESC-1043",
    jobId: "JOB-8122",
    client: "Retail Fitout Co",
    provider: "Ops Team 3",
    amount: 2100,
    stage: "Verify",
    risk: "Medium",
    status: "Open",
    slaMins: 120,
    ageMins: 44,
    flags: ["Partial docs"],
  },
  {
    id: "ESC-1044",
    jobId: "JOB-8123",
    client: "Body Corporate QLD",
    provider: "Rope Access Unit",
    amount: 9800,
    stage: "Verify",
    risk: "High",
    status: "Disputed",
    slaMins: 240,
    ageMins: 198,
    flags: ["Quality dispute", "Inspection required"],
  },
  {
    id: "ESC-1045",
    jobId: "JOB-8124",
    client: "Office Tower Mgmt",
    provider: "Crew Beta",
    amount: 1550,
    stage: "Release",
    risk: "Low",
    status: "Released",
    slaMins: 60,
    ageMins: 12,
    flags: [],
  },
  {
    id: "ESC-1046",
    jobId: "JOB-8126",
    client: "Facility Services Pty",
    provider: "Ops Team 1",
    amount: 3300,
    stage: "Hold",
    risk: "Medium",
    status: "Open",
    slaMins: 180,
    ageMins: 81,
    flags: ["First job"],
  },
];

function chipRisk(r: Risk) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (r === "High") return <span className={`${base} border-rose-300 bg-rose-50 text-rose-800`}>High risk</span>;
  if (r === "Medium") return <span className={`${base} border-amber-300 bg-amber-50 text-amber-800`}>Medium</span>;
  return <span className={`${base} border-emerald-300 bg-emerald-50 text-emerald-700`}>Low</span>;
}

function chipStatus(s: EscrowStatus) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Released") return <span className={`${base} border-emerald-300 bg-emerald-50 text-emerald-700`}>Released</span>;
  if (s === "Pending") return <span className={`${base} border-sky-300 bg-sky-50 text-sky-800`}>Pending</span>;
  if (s === "Disputed") return <span className={`${base} border-rose-300 bg-rose-50 text-rose-800`}>Disputed</span>;
  return <span className={`${base} border-zinc-300 bg-zinc-50 text-zinc-700`}>Open</span>;
}

function stagePill(stage: Stage) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (stage === "Hold") return <span className={`${base} border-zinc-300 bg-zinc-50 text-zinc-800`}>Hold</span>;
  if (stage === "Verify") return <span className={`${base} border-indigo-300 bg-indigo-50 text-indigo-800`}>Verify</span>;
  return <span className={`${base} border-emerald-300 bg-emerald-50 text-emerald-700`}>Release</span>;
}

function pct(a: number, b: number) {
  if (b <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((a / b) * 100)));
}

export default function EscrowCommandCenter() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "risk" | "disputes" | "released">("all");
  const [selected, setSelected] = useState<string>(cases[0]?.id || "");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    let out = cases;

    if (tab === "risk") out = out.filter((c) => c.risk !== "Low" || c.flags.length > 0);
    if (tab === "disputes") out = out.filter((c) => c.status === "Disputed");
    if (tab === "released") out = out.filter((c) => c.status === "Released");

    if (!s) return out;
    return out.filter((c) => `${c.id} ${c.jobId} ${c.client} ${c.provider} ${c.stage} ${c.status}`.toLowerCase().includes(s));
  }, [q, tab]);

  const focus = useMemo(() => cases.find((c) => c.id === selected) || rows[0] || cases[0], [selected, rows]);

  const totals = useMemo(() => {
    const held = cases.filter((c) => c.stage === "Hold" && c.status !== "Released").reduce((a, c) => a + c.amount, 0);
    const pending = cases.filter((c) => c.status === "Pending" || c.status === "Open").reduce((a, c) => a + c.amount, 0);
    const disputed = cases.filter((c) => c.status === "Disputed").reduce((a, c) => a + c.amount, 0);
    const released = cases.filter((c) => c.status === "Released").reduce((a, c) => a + c.amount, 0);
    const high = cases.filter((c) => c.risk === "High").length;
    return { held, pending, disputed, released, high };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow Command Center"
        subtitle="Control escrow holds, verification, releases, and disputes with risk-grade operations."
        right={
          <>
            <Button variant="outline" className="rounded-xl">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button className="rounded-xl">
              <ShieldCheck className="mr-2 h-4 w-4" /> Run risk scan
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Held" value={money(totals.held)} icon={<Lock className="h-4 w-4" />} />
        <StatCard label="Pending" value={money(totals.pending)} icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Disputed" value={money(totals.disputed)} icon={<Scale className="h-4 w-4" />} />
        <StatCard label="Released" value={money(totals.released)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="High-risk cases" value={String(totals.high)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Queue</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search escrow…" className="h-10 rounded-2xl pl-9" />
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <TabsList className="w-full rounded-2xl grid grid-cols-4">
                <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                <TabsTrigger value="risk" className="rounded-xl">Risk</TabsTrigger>
                <TabsTrigger value="disputes" className="rounded-xl">Disputes</TabsTrigger>
                <TabsTrigger value="released" className="rounded-xl">Released</TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator />

            <div className="space-y-2">
              {rows.map((c) => {
                const active = focus?.id === c.id;
                const slaPct = pct(c.ageMins, c.slaMins);
                const breach = slaPct >= 90 && c.status !== "Released";
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition hover:bg-muted/30 ${active ? "border-zinc-400/70" : "border-border"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold">{c.id}</div>
                          <span className="rounded-full border px-2 py-0.5 text-xs">{c.jobId}</span>
                          {stagePill(c.stage)}
                          {chipStatus(c.status)}
                          {chipRisk(c.risk)}
                          {breach ? (
                            <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-800 inline-flex items-center gap-1">
                              <Timer className="h-3.5 w-3.5" /> SLA risk
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">
                          {c.client} → {c.provider}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold">{money(c.amount)}</div>
                        <div className="text-xs text-muted-foreground">{c.ageMins}m / {c.slaMins}m</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={slaPct} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Case dossier</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">Ops</Badge>
              <Button variant="outline" className="rounded-xl h-9">
                <ArrowUpRight className="mr-2 h-4 w-4" /> Open job
              </Button>
            </div>
          </div>

          {!focus ? (
            <div className="p-8 text-sm text-muted-foreground">Select an escrow case to view details.</div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xl font-semibold">{focus.id}</div>
                    <span className="rounded-full border px-2 py-0.5 text-xs">{focus.jobId}</span>
                    {stagePill(focus.stage)}
                    {chipStatus(focus.status)}
                    {chipRisk(focus.risk)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{focus.client} → {focus.provider}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">
                    <FileCheck2 className="mr-2 h-4 w-4" /> Verify docs
                  </Button>
                  <Button className="rounded-xl">
                    <Banknote className="mr-2 h-4 w-4" /> Release
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="mt-2 text-lg font-semibold">{money(focus.amount)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">SLA</div>
                  <div className="mt-2 text-lg font-semibold">{focus.slaMins}m</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Age</div>
                  <div className="mt-2 text-lg font-semibold">{focus.ageMins}m</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <div className="mt-2 text-lg font-semibold">{focus.risk}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Risk engine
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2"><Fingerprint className="h-4 w-4" /> Identity signal</div>
                      <div className="font-semibold">{focus.risk === "High" ? "Weak" : "Strong"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Funding source</div>
                      <div className="font-semibold">{focus.flags.includes("Large amount") ? "Manual review" : "Normal"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Behaviour</div>
                      <div className="font-semibold">{focus.flags.length ? "Watch" : "Normal"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <Gavel className="h-4 w-4" /> Dispute triage
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2"><Scale className="h-4 w-4" /> Status</div>
                      <div className="font-semibold">{focus.status === "Disputed" ? "Active dispute" : "Clear"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> SLA pressure</div>
                      <div className="font-semibold">{pct(focus.ageMins, focus.slaMins)}%</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Flags</div>
                      <div className="font-semibold">{focus.flags.length ? focus.flags.length : 0}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" className="rounded-xl w-full">Open dispute</Button>
                    <Button className="rounded-xl w-full">Escalate</Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Flags</div>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-2">
                  {focus.flags.length ? (
                    focus.flags.map((f) => (
                      <span key={f} className="rounded-full border px-2 py-0.5 text-xs bg-muted/10">
                        {f}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No flags.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
