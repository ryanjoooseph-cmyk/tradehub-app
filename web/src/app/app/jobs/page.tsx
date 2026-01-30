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
  Search,
  CalendarDays,
  ClipboardList,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Timer,
  HardHat,
} from "lucide-react";

type JobStatus = "New" | "Scheduled" | "In Progress" | "Blocked" | "Complete";
type Priority = "Low" | "Normal" | "High" | "Critical";

type Job = {
  id: string;
  title: string;
  client: string;
  site: string;
  status: JobStatus;
  priority: Priority;
  start: string;
  end: string;
  team: string[];
  value: number;
  escrowHold: number;
  notes: string;
};

const seed: Job[] = [
  {
    id: "J-187",
    title: "High-rise repaint — Stage 1",
    client: "Arcadia Body Corporate",
    site: "Brisbane CBD — Tower A",
    status: "In Progress",
    priority: "High",
    start: "2026-01-31 07:00",
    end: "2026-01-31 15:00",
    team: ["Ops Lead", "RA Tech 1", "RA Tech 2"],
    value: 16800,
    escrowHold: 16800,
    notes: "Milestone 1: photo evidence required. Rope access risk controls active.",
  },
  {
    id: "J-188",
    title: "Strata touch-ups + sealing",
    client: "Northpoint Facilities",
    site: "Newstead — Lot 14",
    status: "Scheduled",
    priority: "Normal",
    start: "2026-02-01 08:00",
    end: "2026-02-01 12:00",
    team: ["Crew 1", "Crew 2"],
    value: 5200,
    escrowHold: 5200,
    notes: "Client prefers early start. Ensure permit on arrival.",
  },
  {
    id: "J-189",
    title: "Exterior washdown",
    client: "Lakeside Owners Assoc",
    site: "Southbank — Building C",
    status: "Blocked",
    priority: "Critical",
    start: "2026-01-31 09:00",
    end: "2026-01-31 13:00",
    team: ["Crew 3"],
    value: 9200,
    escrowHold: 0,
    notes: "Deposit dispute. Do not commence until resolved.",
  },
  {
    id: "J-190",
    title: "Balcony restoration closeout",
    client: "Meridian Property Group",
    site: "Hamilton — Riverfront",
    status: "Complete",
    priority: "Low",
    start: "2026-01-29 08:00",
    end: "2026-01-29 16:00",
    team: ["Ops Lead", "Crew 4"],
    value: 17800,
    escrowHold: 0,
    notes: "Closed out. Archive photos + handover docs.",
  },
  {
    id: "J-191",
    title: "Quote + site measure",
    client: "New Client Intake",
    site: "TBD",
    status: "New",
    priority: "Normal",
    start: "2026-02-02 10:00",
    end: "2026-02-02 11:00",
    team: ["Ops Lead"],
    value: 0,
    escrowHold: 0,
    notes: "Create client profile. Collect photos and access notes.",
  },
];

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipStatus(s: JobStatus) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Complete") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Complete</span>;
  if (s === "In Progress") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>In progress</span>;
  if (s === "Scheduled") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Scheduled</span>;
  if (s === "Blocked") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Blocked</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>New</span>;
}

function chipPriority(p: Priority) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (p === "Critical") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Critical</span>;
  if (p === "High") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>High</span>;
  if (p === "Low") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Low</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Normal</span>;
}

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "new" | "scheduled" | "progress" | "blocked" | "complete">("all");
  const [view, setView] = useState<"list" | "board">("list");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "new") rows = rows.filter((j) => j.status === "New");
    if (scope === "scheduled") rows = rows.filter((j) => j.status === "Scheduled");
    if (scope === "progress") rows = rows.filter((j) => j.status === "In Progress");
    if (scope === "blocked") rows = rows.filter((j) => j.status === "Blocked");
    if (scope === "complete") rows = rows.filter((j) => j.status === "Complete");

    if (!s) return rows;
    return rows.filter((j) => `${j.id} ${j.title} ${j.client} ${j.site} ${j.status} ${j.priority} ${j.start} ${j.end}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((j) => j.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const active = seed.filter((j) => j.status === "Scheduled" || j.status === "In Progress").length;
    const blocked = seed.filter((j) => j.status === "Blocked").length;
    const held = seed.reduce((a, j) => a + j.escrowHold, 0);
    const weekValue = seed.filter((j) => j.status !== "Complete").reduce((a, j) => a + j.value, 0);
    return { active, blocked, held, weekValue };
  }, []);

  const columns = useMemo(() => {
    const groups: Record<JobStatus, Job[]> = {
      "New": [],
      "Scheduled": [],
      "In Progress": [],
      "Blocked": [],
      "Complete": [],
    };
    for (const j of filtered) groups[j.status].push(j);
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="Operational command: dispatch, schedule, blockers, and escrow-aware execution."
        right={
          <>
            <Button variant="outline" className="rounded-xl"><CalendarDays className="mr-2 h-4 w-4" />Open calendar</Button>
            <Button className="rounded-xl"><ClipboardList className="mr-2 h-4 w-4" />New job</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Active" value={String(kpis.active)} icon={<Timer className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Escrow held" value={moneyAUD(kpis.held)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Pipeline value" value={moneyAUD(kpis.weekValue)} icon={<HardHat className="h-4 w-4" />} />
        <StatCard label="Jobs" value={String(seed.length)} icon={<ClipboardList className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Job pipeline"
          subtitle="Search, filter, and drill in. Built for real dispatch."
          toolbar={
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[520px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs…" className="h-10 rounded-2xl pl-9" />
              </div>

              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
                  <TabsList className="rounded-2xl">
                    <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                    <TabsTrigger value="new" className="rounded-xl">New</TabsTrigger>
                    <TabsTrigger value="scheduled" className="rounded-xl">Scheduled</TabsTrigger>
                    <TabsTrigger value="progress" className="rounded-xl">In progress</TabsTrigger>
                    <TabsTrigger value="blocked" className="rounded-xl">Blocked</TabsTrigger>
                    <TabsTrigger value="complete" className="rounded-xl">Complete</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full md:w-auto">
                  <TabsList className="rounded-2xl">
                    <TabsTrigger value="list" className="rounded-xl">List</TabsTrigger>
                    <TabsTrigger value="board" className="rounded-xl">Board</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No jobs found"
                subtitle="Try another filter or create a new job."
                icon={<ClipboardList className="h-5 w-5" />}
                actionLabel="New job"
                onAction={() => {}}
              />
            </div>
          ) : view === "list" ? (
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
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold truncate">{j.title}</div>
                          <span className="rounded-full border px-2 py-0.5 text-xs">{j.id}</span>
                          {chipStatus(j.status)}
                          {chipPriority(j.priority)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{j.client} · {j.site}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="text-sm font-semibold">{j.value ? moneyAUD(j.value) : "—"}</div>
                        <div className="text-xs text-muted-foreground">Hold {moneyAUD(j.escrowHold)}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border px-2 py-0.5 flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{j.start}</span>
                      <span className="rounded-full border px-2 py-0.5 flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{j.end}</span>
                      <span className="rounded-full border px-2 py-0.5 flex items-center gap-1"><Users className="h-3.5 w-3.5" />{j.team.length} crew</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 grid gap-3">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {(["New","Scheduled","In Progress","Blocked","Complete"] as JobStatus[]).map((s) => (
                  <div key={s} className="rounded-2xl border bg-background overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                      <div className="text-sm font-semibold">{s}</div>
                      <Badge variant="outline" className="rounded-full">{columns[s].length}</Badge>
                    </div>
                    <div className="p-3 space-y-2">
                      {columns[s].length === 0 ? (
                        <div className="text-xs text-muted-foreground p-3 rounded-xl border bg-muted/20">No items</div>
                      ) : (
                        columns[s].map((j) => (
                          <button
                            key={j.id}
                            onClick={() => setSelectedId(j.id)}
                            className={cn(
                              "w-full text-left rounded-2xl border bg-background p-3 transition hover:bg-muted/30",
                              selected?.id === j.id ? "border-zinc-400/70" : "border-border"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="font-semibold text-sm truncate">{j.title}</div>
                                <div className="mt-1 text-xs text-muted-foreground truncate">{j.client}</div>
                              </div>
                              <div className="text-xs rounded-full border px-2 py-0.5 shrink-0">{j.id}</div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {chipPriority(j.priority)}
                              {j.escrowHold > 0 ? <span className="rounded-full border px-2 py-0.5 text-xs">Escrow</span> : null}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                    <span className="rounded-full border px-2 py-0.5 text-xs">{selected.id}</span>
                    {chipStatus(selected.status)}
                    {chipPriority(selected.priority)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.client} · {selected.site}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">Dispatch</Button>
                  <Button className="rounded-xl">Open <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Value</div>
                  <div className="mt-2 text-lg font-semibold">{selected.value ? moneyAUD(selected.value) : "—"}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Escrow hold</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.escrowHold)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Crew</div>
                  <div className="mt-2 text-lg font-semibold">{selected.team.length}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Schedule</div>
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
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Site</div>
                  <Separator className="my-3" />
                  <div className="text-sm text-muted-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">{selected.site}</div>
                      <div className="mt-1">Client: {selected.client}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Crew</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.team.map((t) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-xs flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Notes</div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.notes}</div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Escrow actions</Button>
                <Button variant="outline" className="rounded-xl"><AlertTriangle className="mr-2 h-4 w-4" />Block / dispute</Button>
                <Button className="rounded-xl"><CheckCircle2 className="mr-2 h-4 w-4" />Mark complete</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
