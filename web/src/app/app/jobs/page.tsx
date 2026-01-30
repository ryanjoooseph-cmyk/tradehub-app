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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  Timer,
  Users,
} from "lucide-react";

type JobStatus = "Scheduled" | "In Progress" | "Blocked" | "Completed";

type Job = {
  id: string;
  title: string;
  client: string;
  status: JobStatus;
  site: string;
  start: string;
  end: string;
  value: number;
  escrowHeld: number;
  crew: string[];
  priority: "Low" | "Normal" | "High";
  notes: string;
};

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipStatus(s: JobStatus) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Completed") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Completed</span>;
  if (s === "In Progress") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>In progress</span>;
  if (s === "Blocked") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Blocked</span>;
  return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Scheduled</span>;
}

function chipPriority(p: Job["priority"]) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (p === "High") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>High</span>;
  if (p === "Low") return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Low</span>;
  return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Normal</span>;
}

const seed: Job[] = [
  {
    id: "J-187",
    title: "Strata facade repaint",
    client: "Arcadia Body Corporate",
    status: "In Progress",
    site: "Brisbane CBD",
    start: "2026-02-03 07:00",
    end: "2026-02-07 16:00",
    value: 48500,
    escrowHeld: 16800,
    crew: ["Crew A", "RA-2", "RA-5"],
    priority: "High",
    notes: "Stage-based releases. Photo evidence required. Access protocol strict.",
  },
  {
    id: "J-188",
    title: "Rope access patch + seal",
    client: "Northpoint Facilities",
    status: "Scheduled",
    site: "Southport",
    start: "2026-02-04 06:30",
    end: "2026-02-04 15:30",
    value: 14600,
    escrowHeld: 5200,
    crew: ["Crew B", "RA-1"],
    priority: "Normal",
    notes: "Weather-dependent. Ensure rope logs + SWMS updated before start.",
  },
  {
    id: "J-189",
    title: "Quote deposit: balcony restoration",
    client: "Lakeside Owners Assoc",
    status: "Blocked",
    site: "Sunshine Coast",
    start: "2026-02-01 09:00",
    end: "2026-02-01 10:00",
    value: 9200,
    escrowHeld: 0,
    crew: ["Ops"],
    priority: "Normal",
    notes: "Blocked until payment clears. Do not schedule crew.",
  },
  {
    id: "J-190",
    title: "Interior refresh level 12",
    client: "Meridian Property Group",
    status: "Completed",
    site: "Newstead",
    start: "2026-01-22 07:00",
    end: "2026-01-24 16:00",
    value: 17800,
    escrowHeld: 0,
    crew: ["Crew C"],
    priority: "Low",
    notes: "Closed out. Upload closeout pack + signoff to release remaining escrow (if any).",
  },
  {
    id: "J-191",
    title: "Pressure wash + prep",
    client: "Beacon Commercial",
    status: "Scheduled",
    site: "Fortitude Valley",
    start: "2026-02-05 07:00",
    end: "2026-02-05 12:00",
    value: 6600,
    escrowHeld: 1800,
    crew: ["Crew A"],
    priority: "Low",
    notes: "Prep for follow-on coating job. Confirm water access + containment.",
  },
];

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "scheduled" | "progress" | "blocked" | "completed">("all");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "scheduled") rows = rows.filter((j) => j.status === "Scheduled");
    if (scope === "progress") rows = rows.filter((j) => j.status === "In Progress");
    if (scope === "blocked") rows = rows.filter((j) => j.status === "Blocked");
    if (scope === "completed") rows = rows.filter((j) => j.status === "Completed");

    if (!s) return rows;
    return rows.filter((j) => `${j.id} ${j.title} ${j.client} ${j.status} ${j.site} ${j.start} ${j.end} ${j.priority}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((j) => j.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const pipeline = seed.reduce((a, j) => a + j.value, 0);
    const held = seed.reduce((a, j) => a + j.escrowHeld, 0);
    const inProg = seed.filter((j) => j.status === "In Progress").length;
    const blocked = seed.filter((j) => j.status === "Blocked").length;
    const crews = new Set(seed.flatMap((j) => j.crew));
    return { pipeline, held, inProg, blocked, crews: crews.size };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="Ops-grade job control: dispatch posture, evidence, escrow hold, and clean handoffs."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Export</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New job</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Pipeline value" value={moneyAUD(kpis.pipeline)} icon={<CircleDollarSign className="h-4 w-4" />} />
        <StatCard label="Escrow held" value={moneyAUD(kpis.held)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="In progress" value={String(kpis.inProg)} icon={<Timer className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Active crews" value={String(kpis.crews)} icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Job registry"
          subtitle="Search, filter, open a job, and act fast."
          toolbar={
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[520px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs…" className="h-10 rounded-2xl pl-9" />
              </div>
              <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                  <TabsTrigger value="scheduled" className="rounded-xl">Scheduled</TabsTrigger>
                  <TabsTrigger value="progress" className="rounded-xl">In progress</TabsTrigger>
                  <TabsTrigger value="blocked" className="rounded-xl">Blocked</TabsTrigger>
                  <TabsTrigger value="completed" className="rounded-xl">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No jobs found"
                subtitle="Try another filter or create a new job."
                icon={<Briefcase className="h-5 w-5" />}
                actionLabel="New job"
                onAction={() => {}}
              />
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filtered.map((j) => {
                const active = selected?.id === j.id;
                return (
                  <button
                    key={j.id}
                    onClick={() => setSelectedId(j.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border bg-background p-4 transition hover:bg-muted/30",
                      active ? "border-zinc-400/70" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold truncate">{j.title}</div>
                          {chipStatus(j.status)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{j.id} · {j.client}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {chipPriority(j.priority)}
                        <div className="text-xs text-muted-foreground">{moneyAUD(j.value)}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border px-2 py-0.5">{j.start}</span>
                      <span className="rounded-full border px-2 py-0.5">Hold {moneyAUD(j.escrowHeld)}</span>
                      <span className="rounded-full border px-2 py-0.5">{j.site}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DataTableShell>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Job record</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          {!selected ? (
            <div className="p-8 text-sm text-muted-foreground">Select a job to view details.</div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xl font-semibold truncate">{selected.title}</div>
                    {chipStatus(selected.status)}
                    {chipPriority(selected.priority)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.id} · {selected.client}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">Evidence</Button>
                  <Button className="rounded-xl">Open job <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Value</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.value)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Escrow held</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.escrowHeld)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Crew</div>
                  <div className="mt-2 text-lg font-semibold">{selected.crew.length}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Schedule</div>
                    <Badge variant="outline" className="rounded-full">Dispatch</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4" />Start</span>
                      <span className="font-semibold">{selected.start}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4" />End</span>
                      <span className="font-semibold">{selected.end}</span>
                    </div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">Next: drag/drop dispatch + capacity planner.</div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Site</div>
                    <Badge variant="outline" className="rounded-full">Access</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span className="text-foreground">{selected.site}</span></div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">Next: map view + gate access checklist.</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Ops notes</div>
                  <Badge variant="outline" className="rounded-full">Audit-first</Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.notes}</div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <Button variant="outline" className="rounded-xl"><ClipboardList className="mr-2 h-4 w-4" />Checklist</Button>
                <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Escrow</Button>
                <Button className="rounded-xl"><CheckCircle2 className="mr-2 h-4 w-4" />Close out</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
