"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { EmptyState } from "@/components/premium/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowUpRight,
  Banknote,
  Briefcase,
  CalendarDays,
  CircleDollarSign,
  ShieldCheck,
  TrendingUp,
  Users,
  Search,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type Row = {
  id: string;
  job: string;
  client: string;
  status: "Scheduled" | "In Progress" | "Blocked" | "Completed";
  value: number;
};

function moneyAUD(n: number) {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n); }
  catch { return `$${Math.round(n)}`; }
}

function chipStatus(s: Row["status"]) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Completed") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Completed</span>;
  if (s === "In Progress") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>In progress</span>;
  if (s === "Blocked") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Blocked</span>;
  return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Scheduled</span>;
}

export default function CommandCenter() {
  const [tab, setTab] = useState<"overview" | "ops" | "finance" | "risk">("overview");
  const [q, setQ] = useState("");

  const rows: Row[] = [
    { id: "J-187", job: "Strata facade repaint", client: "Arcadia Body Corp", status: "In Progress", value: 48500 },
    { id: "J-188", job: "Rope access patch + seal", client: "Northpoint", status: "Scheduled", value: 14600 },
    { id: "J-189", job: "Quote: balcony restoration", client: "Lakeside", status: "Blocked", value: 9200 },
    { id: "J-190", job: "Interior refresh level 12", client: "Meridian", status: "Completed", value: 17800 },
    { id: "J-191", job: "Pressure wash + prep", client: "Beacon", status: "Scheduled", value: 6600 },
  ];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r => `${r.id} ${r.job} ${r.client} ${r.status} ${r.value}`.toLowerCase().includes(s));
  }, [q]);

  const kpis = useMemo(() => {
    const pipeline = rows.reduce((a, r) => a + r.value, 0);
    const escrowExposure = Math.round(pipeline * 0.62);
    const cashHold = Math.round(pipeline * 0.28);
    const released = Math.round(pipeline * 0.34);
    const blocked = rows.filter(r => r.status === "Blocked").length;
    const inProgress = rows.filter(r => r.status === "In Progress").length;
    return { pipeline, escrowExposure, cashHold, released, blocked, inProgress, jobs: rows.length, clients: 18 };
  }, []);

  const risk = useMemo(() => {
    if (kpis.blocked > 0) return { sev: "warn", title: "Blocked jobs require escalation", meta: `${kpis.blocked} job(s) blocked` };
    return { sev: "ok", title: "All systems normal", meta: "No elevated risk signals" };
  }, [kpis.blocked]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        subtitle="Institutional-grade ops + finance cockpit. High-signal, audit-first."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Export</Button>
            <Button className="rounded-xl">New job <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Pipeline value" value={moneyAUD(kpis.pipeline)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Escrow exposure" value={moneyAUD(kpis.escrowExposure)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Cash on hold" value={moneyAUD(kpis.cashHold)} icon={<Banknote className="h-4 w-4" />} />
        <StatCard label="Released" value={moneyAUD(kpis.released)} icon={<CircleDollarSign className="h-4 w-4" />} />
        <StatCard label="Clients" value={String(kpis.clients)} icon={<Users className="h-4 w-4" />} />
      </div>

      <DataTableShell
        title="Executive surfaces"
        subtitle="Overview, Ops, Finance, Risk — UI-first. Wiring comes next."
        toolbar={
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[520px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs…" className="h-10 rounded-2xl pl-9" />
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full md:w-auto">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
                <TabsTrigger value="ops" className="rounded-xl">Ops</TabsTrigger>
                <TabsTrigger value="finance" className="rounded-xl">Finance</TabsTrigger>
                <TabsTrigger value="risk" className="rounded-xl">Risk</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      >
        {tab === "overview" ? (
          <div className="p-4 grid gap-4 lg:grid-cols-3">
            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Operations snapshot</div>
                <Badge variant="outline" className="rounded-full">Live</Badge>
              </div>
              <div className="p-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Jobs</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-2xl font-semibold">{kpis.jobs}</div>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Separator className="my-3" />
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border px-2 py-0.5 text-xs border-sky-300 bg-sky-50 text-sky-800">{kpis.inProgress} in progress</span>
                    <span className="rounded-full border px-2 py-0.5 text-xs border-amber-300 bg-amber-50 text-amber-800">{kpis.blocked} blocked</span>
                    <span className="rounded-full border px-2 py-0.5 text-xs border-emerald-300 bg-emerald-50 text-emerald-700">{rows.filter(r => r.status==="Completed").length} completed</span>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Escrow posture</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-2xl font-semibold">{moneyAUD(kpis.escrowExposure)}</div>
                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Separator className="my-3" />
                  <div className="text-xs text-muted-foreground">Audit-first surface. Next: dual-approval thresholds + release controls.</div>
                </div>
              </div>

              <Separator />

              {filtered.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No results"
                    subtitle="Try a different search."
                    icon={<Briefcase className="h-5 w-5" />}
                    actionLabel="Clear search"
                    onAction={() => setQ("")}
                  />
                </div>
              ) : (
                <div className="p-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-muted/40 text-xs text-muted-foreground">
                      <tr className="border-b">
                        <th className="px-6 py-3 text-left font-medium">Job</th>
                        <th className="px-6 py-3 text-left font-medium">Client</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        <th className="px-6 py-3 text-right font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered.slice(0, 8).map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <div className="font-medium">{r.job}</div>
                            <div className="text-xs text-muted-foreground">{r.id}</div>
                          </td>
                          <td className="px-6 py-4">{r.client}</td>
                          <td className="px-6 py-4">{chipStatus(r.status)}</td>
                          <td className="px-6 py-4 text-right font-medium">{moneyAUD(r.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">System status</div>
                <Badge variant="outline" className="rounded-full">Premium</Badge>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Build</div>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Green checks, auto-merge ready.</div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Risk</div>
                    {risk.sev === "warn" ? <AlertTriangle className="h-4 w-4 text-muted-foreground" /> : <Activity className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{risk.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{risk.meta}</div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Button className="rounded-xl">Open Jobs <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                  <Button variant="outline" className="rounded-xl">Open Escrow</Button>
                </div>
              </div>
            </Card>
          </div>
        ) : tab === "ops" ? (
          <div className="p-6 grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Ops signals</div>
                <Badge variant="outline" className="rounded-full">UI-first</Badge>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">Next: calendar drag/drop + capacity load</div>
                <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">Next: WIP limits + role-based dispatch</div>
              </div>
            </Card>
            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Dispatch readiness</div>
                <Badge variant="outline" className="rounded-full">Premium</Badge>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">Next: live job map + crew status</div>
                <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">Next: SLA timers + escalation routing</div>
              </div>
            </Card>
          </div>
        ) : tab === "finance" ? (
          <div className="p-6 grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Finance surface</div>
                <Badge variant="outline" className="rounded-full">UI-first</Badge>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border bg-muted/10 p-10 text-center text-xs text-muted-foreground">Chart surface (wire invoices/payouts next)</div>
              </div>
            </Card>
            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Controls</div>
                <Badge variant="outline" className="rounded-full">Escrow</Badge>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">Next: dual-approval releases + dispute holds</div>
                <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">Next: immutable audit export</div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="p-6">
            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Risk surface</div>
                <Badge variant="outline" className="rounded-full">Premium</Badge>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">Next: anomaly engine + policy enforcement hooks</div>
              </div>
            </Card>
          </div>
        )}
      </DataTableShell>
    </div>
  );
}
