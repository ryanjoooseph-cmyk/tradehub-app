"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Briefcase, CalendarDays, Plus, Search, ShieldCheck, AlertTriangle, CheckCircle2, ArrowUpRight } from "lucide-react";

type Job = {
  id: string;
  title?: string | null;
  status?: string | null;
  client_id?: string | null;
  scheduled_start?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  value?: number | null;
};

async function getJobs(): Promise<Job[]> {
  const res = await fetch("/api/jobs", { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any)?.error || "Failed to load jobs");
  return ((json as any)?.jobs || (json as any)?.rows || []) as Job[];
}

function money(n?: number | null) {
  const v = Number(n || 0);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(v);
  } catch {
    return `$${Math.round(v)}`;
  }
}

function when(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

function dayKey(dt: Date) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay(); // 0 Sun
  const diff = (day + 6) % 7; // Monday=0
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function normStatus(s?: string | null) {
  const v = (s || "scheduled").toLowerCase();
  if (v === "in_progress") return "in_progress";
  if (v === "blocked") return "blocked";
  if (v === "completed") return "completed";
  return "scheduled";
}

function statusChip(s?: string | null) {
  const v = normStatus(s);
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (v === "completed") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Completed</span>;
  if (v === "in_progress") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>In progress</span>;
  if (v === "blocked") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Blocked</span>;
  return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Scheduled</span>;
}

function jobName(j: Job) {
  return (j.title && j.title.trim()) ? j.title.trim() : `Job ${j.id}`;
}

export default function JobsPage() {
  const [mode, setMode] = useState<"table" | "pipeline" | "calendar">("calendar");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<Job[]>([]);
  const [q, setQ] = useState("");

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getJobs();
        if (!mounted) return;
        setRows(data);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      `${r.id} ${jobName(r)} ${r.status || ""} ${r.client_id || ""} ${r.value || ""}`.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const kpis = useMemo(() => {
    const total = rows.length;
    const inProgress = rows.filter(r => normStatus(r.status) === "in_progress").length;
    const blocked = rows.filter(r => normStatus(r.status) === "blocked").length;
    const completed = rows.filter(r => normStatus(r.status) === "completed").length;
    const value = rows.reduce((a, r) => a + Number(r.value || 0), 0);
    return { total, inProgress, blocked, completed, value };
  }, [rows]);

  const pipeline = useMemo(() => {
    const b = { scheduled: [] as Job[], in_progress: [] as Job[], blocked: [] as Job[], completed: [] as Job[] };
    for (const r of filtered) b[normStatus(r.status) as keyof typeof b].push(r);
    return b;
  }, [filtered]);

  const calendar = useMemo(() => {
    const map = new Map<string, Job[]>();
    for (let i = 0; i < 7; i++) map.set(dayKey(addDays(weekStart, i)), []);
    for (const r of filtered) {
      const src = r.scheduled_start || r.created_at || r.updated_at;
      if (!src) continue;
      const dt = new Date(src);
      if (Number.isNaN(dt.getTime())) continue;
      const key = dayKey(dt);
      if (map.has(key)) map.get(key)!.push(r);
    }
    return map;
  }, [filtered, weekStart]);

  function updateJob(id: string, patch: Partial<Job>) {
    setRows((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch, updated_at: new Date().toISOString() } : j)));
  }

  function onCardDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function dropToStatus(e: React.DragEvent, status: Job["status"]) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    updateJob(id, { status });
  }

  function dropToDay(e: React.DragEvent, day: Date) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const dt = new Date(day);
    dt.setHours(9, 0, 0, 0);
    updateJob(id, { scheduled_start: dt.toISOString(), status: "scheduled" });
  }

  const days = useMemo(() => {
    const d = [];
    for (let i = 0; i < 7; i++) d.push(addDays(weekStart, i));
    return d;
  }, [weekStart]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="Premium execution UI: calendar, pipeline, and a clean operational ledger."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Import</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New job</Button>
          </>
        }
      />

      {err ? (
        <div className="rounded-2xl border border-red-200 bg-background p-6 text-sm text-red-700">{err}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Jobs" value={String(kpis.total)} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="In progress" value={String(kpis.inProgress)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Completed" value={String(kpis.completed)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Total value" value={money(kpis.value)} icon={<CalendarDays className="h-4 w-4" />} />
      </div>

      <DataTableShell
        title="Operations"
        subtitle="Search jobs by id, title, client, status, or value."
        toolbar={
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[520px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search jobs…"
                className="h-10 rounded-2xl pl-9"
              />
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full md:w-auto">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="calendar" className="rounded-xl">Calendar</TabsTrigger>
                <TabsTrigger value="pipeline" className="rounded-xl">Pipeline</TabsTrigger>
                <TabsTrigger value="table" className="rounded-xl">Table</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      >
        {loading ? (
          <div className="p-10 text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No jobs yet"
              subtitle="Create jobs, schedule them on the calendar, and track progress in the pipeline."
              icon={<Briefcase className="h-5 w-5" />}
              actionLabel="Create job"
              onAction={() => {}}
            />
          </div>
        ) : mode === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-medium">Job</th>
                  <th className="px-6 py-3 text-left font-medium">Client</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Value</th>
                  <th className="px-6 py-3 text-right font-medium">Scheduled</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{jobName(r)}</div>
                      <div className="text-xs text-muted-foreground">{r.id}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{r.client_id || "—"}</td>
                    <td className="px-6 py-4">{statusChip(r.status)}</td>
                    <td className="px-6 py-4 text-right font-medium">{money(r.value)}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{r.scheduled_start ? when(r.scheduled_start) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : mode === "pipeline" ? (
          <div className="p-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {([
                ["Scheduled", "scheduled"] as const,
                ["In progress", "in_progress"] as const,
                ["Blocked", "blocked"] as const,
                ["Completed", "completed"] as const,
              ]).map(([label, key]) => (
                <Card
                  key={key}
                  className="rounded-2xl border bg-background shadow-sm overflow-hidden"
                  onDragOver={allowDrop}
                  onDrop={(e) => dropToStatus(e, key)}
                >
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="text-sm font-semibold">{label}</div>
                    <Badge variant="outline" className="rounded-full">{pipeline[key].length}</Badge>
                  </div>
                  <div className="p-3 space-y-3 min-h-[240px]">
                    {pipeline[key].length === 0 ? (
                      <div className="rounded-2xl border bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                        Drag jobs here
                      </div>
                    ) : (
                      pipeline[key].map((r) => (
                        <div
                          key={r.id}
                          draggable
                          onDragStart={(e) => onCardDragStart(e, r.id)}
                          className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{jobName(r)}</div>
                              <div className="mt-1 text-xs text-muted-foreground">{r.client_id ? `Client: ${r.client_id}` : "Client: —"}</div>
                              <div className="mt-2 text-sm font-medium">{money(r.value)}</div>
                            </div>
                            {statusChip(r.status)}
                          </div>
                          <Separator className="my-3" />
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl">Open</Button>
                            <Button size="sm" className="rounded-xl">Next <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm font-semibold">Week calendar</div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setWeekStart((d) => addDays(d, -7))}>Prev</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setWeekStart((d) => addDays(d, 7))}>Next</Button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-7">
              {days.map((d) => {
                const key = dayKey(d);
                const list = calendar.get(key) || [];
                const label = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
                return (
                  <Card
                    key={key}
                    className="rounded-2xl border bg-background shadow-sm overflow-hidden"
                    onDragOver={allowDrop}
                    onDrop={(e) => dropToDay(e, d)}
                  >
                    <div className="flex items-center justify-between border-b px-3 py-2">
                      <div className="text-xs font-semibold">{label}</div>
                      <Badge variant="outline" className="rounded-full">{list.length}</Badge>
                    </div>
                    <div className="p-3 space-y-3 min-h-[240px]">
                      {list.length === 0 ? (
                        <div className="rounded-2xl border bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                          Drop jobs here
                        </div>
                      ) : (
                        list.map((r) => (
                          <div
                            key={r.id}
                            draggable
                            onDragStart={(e) => onCardDragStart(e, r.id)}
                            className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition cursor-grab active:cursor-grabbing"
                          >
                            <div className="truncate text-sm font-semibold">{jobName(r)}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{r.client_id ? `Client: ${r.client_id}` : "Client: —"}</div>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="text-xs font-medium">{money(r.value)}</div>
                              {statusChip(r.status)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Drag/drop is UI-first (local state). Next step: wire updates to Supabase.
            </div>
          </div>
        )}
      </DataTableShell>
    </div>
  );
}
