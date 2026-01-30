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
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Users,
  FileText,
  ShieldCheck,
  Search,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  client: string;
  status: "Scheduled" | "In Progress" | "Complete" | "Blocked";
  value: number;
  dueInDays: number;
};

const money = (n: number) => n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function statusChip(s: Job["status"]) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Complete") return <span className={`${base} border-emerald-300 bg-emerald-50 text-emerald-700`}>Complete</span>;
  if (s === "In Progress") return <span className={`${base} border-sky-300 bg-sky-50 text-sky-800`}>In progress</span>;
  if (s === "Scheduled") return <span className={`${base} border-indigo-300 bg-indigo-50 text-indigo-800`}>Scheduled</span>;
  return <span className={`${base} border-rose-300 bg-rose-50 text-rose-800`}>Blocked</span>;
}

export default function AppDashboard() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"overview" | "ops" | "finance">("overview");

  const jobs: Job[] = useMemo(
    () => [
      { id: "JOB-8126", title: "High-rise repaint (Stage 1)", client: "Body Corporate QLD", status: "In Progress", value: 9800, dueInDays: 2 },
      { id: "JOB-8127", title: "Lobby touch-ups + seal", client: "Office Tower Mgmt", status: "Scheduled", value: 3200, dueInDays: 5 },
      { id: "JOB-8128", title: "Balcony remediation check", client: "Strata Group A", status: "Blocked", value: 6400, dueInDays: 1 },
      { id: "JOB-8122", title: "Retail fitout paint", client: "Retail Fitout Co", status: "Complete", value: 2100, dueInDays: 0 },
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return jobs;
    return jobs.filter((j) => `${j.id} ${j.title} ${j.client} ${j.status}`.toLowerCase().includes(s));
  }, [q, jobs]);

  const kpis = useMemo(() => {
    const active = jobs.filter((j) => j.status === "In Progress" || j.status === "Scheduled").length;
    const blocked = jobs.filter((j) => j.status === "Blocked").length;
    const revenue = jobs.reduce((a, j) => a + j.value, 0);
    const completion = Math.round((jobs.filter((j) => j.status === "Complete").length / jobs.length) * 100);
    return { active, blocked, revenue, completion };
  }, [jobs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="TradeHub"
        subtitle="Institutional ops dashboard. Built for high-volume jobs, cashflow discipline, and escrow-grade control."
        right={
          <>
            <Button variant="outline" className="rounded-xl">
              <Sparkles className="mr-2 h-4 w-4" />
              Quick actions
            </Button>
            <Button className="rounded-xl">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Run checks
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Active jobs" value={String(kpis.active)} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Pipeline value" value={money(kpis.revenue)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Completion" value={`${kpis.completion}%`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Next deadline" value="48h" icon={<Clock className="h-4 w-4" />} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
            <TabsTrigger value="ops" className="rounded-xl">Ops</TabsTrigger>
            <TabsTrigger value="finance" className="rounded-xl">Finance</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full max-w-[360px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs, clients…" className="h-10 rounded-2xl pl-9" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Command feed</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border p-4 bg-background">
                <div className="text-xs text-muted-foreground">Ops health</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-semibold">Stable</div>
                  <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Green</span>
                </div>
                <div className="mt-3">
                  <Progress value={86} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">86% on-time this week</div>
              </div>

              <div className="rounded-2xl border p-4 bg-background">
                <div className="text-xs text-muted-foreground">Calendar pressure</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-semibold">Medium</div>
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">Watch</span>
                </div>
                <div className="mt-3">
                  <Progress value={62} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">2 jobs &lt; 72h</div>
              </div>

              <div className="rounded-2xl border p-4 bg-background">
                <div className="text-xs text-muted-foreground">Cashflow</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-semibold">{money(12400)}</div>
                  <span className="rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-xs text-sky-800">Pending</span>
                </div>
                <div className="mt-3">
                  <Progress value={48} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">48% invoices paid</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              {filtered.map((j) => (
                <div key={j.id} className="rounded-2xl border p-4 bg-background hover:bg-muted/20 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold">{j.id}</div>
                        {statusChip(j.status)}
                        <span className="rounded-full border px-2 py-0.5 text-xs">{j.client}</span>
                        <span className="rounded-full border px-2 py-0.5 text-xs inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {j.dueInDays === 0 ? "Today" : `Due in ${j.dueInDays}d`}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground truncate">{j.title}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold">{money(j.value)}</div>
                      <Button variant="outline" className="mt-2 h-9 rounded-xl">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Card className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold inline-flex items-center gap-2"><Briefcase className="h-4 w-4" /> Jobs</div>
                  <Button variant="outline" className="h-9 rounded-xl">Open</Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Run your entire operation from one console.</div>
              </Card>
              <Card className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold inline-flex items-center gap-2"><Users className="h-4 w-4" /> Clients</div>
                  <Button variant="outline" className="h-9 rounded-xl">Open</Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Client profiles, history, quotes, trust signals.</div>
              </Card>
              <Card className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold inline-flex items-center gap-2"><FileText className="h-4 w-4" /> Invoices</div>
                  <Button variant="outline" className="h-9 rounded-xl">Open</Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Cashflow discipline and clean receivables.</div>
              </Card>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Today</div>
            <Badge variant="outline" className="rounded-full">Ops</Badge>
          </div>
          <div className="p-5 space-y-3">
            <div className="rounded-2xl border p-4 bg-background">
              <div className="text-xs text-muted-foreground">Morning</div>
              <div className="mt-2 text-sm font-semibold">Crew Alpha — Site prep</div>
              <div className="mt-1 text-xs text-muted-foreground">09:00 • Tower A • JOB-8126</div>
            </div>
            <div className="rounded-2xl border p-4 bg-background">
              <div className="text-xs text-muted-foreground">Midday</div>
              <div className="mt-2 text-sm font-semibold">Inspection window</div>
              <div className="mt-1 text-xs text-muted-foreground">12:30 • Balcony • JOB-8128</div>
            </div>
            <div className="rounded-2xl border p-4 bg-background">
              <div className="text-xs text-muted-foreground">Afternoon</div>
              <div className="mt-2 text-sm font-semibold">Invoice review</div>
              <div className="mt-1 text-xs text-muted-foreground">16:00 • Finance • 3 pending</div>
            </div>
            <Separator />
            <Button className="w-full rounded-xl">
              <CalendarDays className="mr-2 h-4 w-4" />
              Open calendar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
