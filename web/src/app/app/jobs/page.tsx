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
import { cn } from "@/lib/utils";
import { Briefcase, Plus, Search, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

type Job = {
  id: string;
  title?: string | null;
  status?: string | null;
  client_id?: string | null;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  address?: string | null;
  created_at?: string | null;
};

async function getJobs(): Promise<Job[]> {
  const res = await fetch("/api/jobs", { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any)?.error || "Failed to load jobs");
  return ((json as any)?.jobs || (json as any)?.rows || []) as Job[];
}

function prettyStatus(s?: string | null) {
  const v = (s || "scheduled").toLowerCase();
  if (v === "in_progress") return "In progress";
  if (v === "completed") return "Completed";
  if (v === "blocked") return "Blocked";
  if (v === "cancelled") return "Cancelled";
  return "Scheduled";
}

function statusChip(s?: string | null) {
  const v = (s || "scheduled").toLowerCase();
  if (v === "completed") return <Badge variant="outline" className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-700">Completed</Badge>;
  if (v === "in_progress") return <Badge variant="outline" className="rounded-full border-sky-300 bg-sky-50 text-sky-800">In progress</Badge>;
  if (v === "blocked") return <Badge variant="outline" className="rounded-full border-amber-300 bg-amber-50 text-amber-800">Blocked</Badge>;
  if (v === "cancelled") return <Badge variant="outline" className="rounded-full border-zinc-300 bg-zinc-50 text-zinc-700">Cancelled</Badge>;
  return <Badge variant="outline" className="rounded-full border-violet-300 bg-violet-50 text-violet-800">Scheduled</Badge>;
}

function when(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

function safeTitle(j: Job) {
  return j.title?.trim() || `Job ${j.id}`;
}

function groupKey(s?: string | null) {
  const v = (s || "scheduled").toLowerCase();
  if (v === "in_progress") return "in_progress";
  if (v === "completed") return "completed";
  if (v === "blocked") return "blocked";
  if (v === "cancelled") return "cancelled";
  return "scheduled";
}

export default function JobsPage() {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getJobs();
        if (!mounted) return;
        setJobs(data);
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
    if (!s) return jobs;
    return jobs.filter((j) =>
      `${j.id} ${j.title || ""} ${j.status || ""} ${j.client_id || ""} ${j.address || ""}`.toLowerCase().includes(s)
    );
  }, [jobs, q]);

  const kpis = useMemo(() => {
    const total = jobs.length;
    const scheduled = jobs.filter(j => groupKey(j.status) === "scheduled").length;
    const inProgress = jobs.filter(j => groupKey(j.status) === "in_progress").length;
    const blocked = jobs.filter(j => groupKey(j.status) === "blocked").length;
    const completed = jobs.filter(j => groupKey(j.status) === "completed").length;
    return { total, scheduled, inProgress, blocked, completed };
  }, [jobs]);

  const groups = useMemo(() => {
    const base = { scheduled: [] as Job[], in_progress: [] as Job[], blocked: [] as Job[], completed: [] as Job[] };
    for (const j of filtered) {
      const k = groupKey(j.status);
      if (k === "scheduled") base.scheduled.push(j);
      else if (k === "in_progress") base.in_progress.push(j);
      else if (k === "blocked") base.blocked.push(j);
      else if (k === "completed") base.completed.push(j);
    }
    return base;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="The operational core. Track jobs, move work through stages, and trigger invoices/escrow."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Import</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New job</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Total" value={String(kpis.total)} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Scheduled" value={String(kpis.scheduled)} icon={<Clock className="h-4 w-4" />} />
        <StatCard label="In progress" value={String(kpis.inProgress)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Completed" value={String(kpis.completed)} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <DataTableShell
        title="Work pipeline"
        subtitle="Premium table + Kanban. Search jobs by ID, title, client, address, or status."
        toolbar={
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[520px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search job ID, title, client, address, status…"
                className="h-10 rounded-2xl pl-9"
              />
            </div>

            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full md:w-auto">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="table" className="rounded-xl">Table</TabsTrigger>
                <TabsTrigger value="kanban" className="rounded-xl">Kanban</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      >
        {err ? (
          <div className="p-6 text-sm text-red-700">{err}</div>
        ) : loading ? (
          <div className="p-10 text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No jobs yet"
              subtitle="Create a job, assign a crew, then generate invoices and escrow from the workflow."
              icon={<Briefcase className="h-5 w-5" />}
              actionLabel="Create job"
              onAction={() => {}}
            />
          </div>
        ) : view === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-medium">Job</th>
                  <th className="px-6 py-3 text-left font-medium">Client</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Address</th>
                  <th className="px-6 py-3 text-right font-medium">Scheduled</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((j) => (
                  <tr key={j.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{safeTitle(j)}</div>
                      <div className="text-xs text-muted-foreground">{j.id}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{j.client_id || "—"}</td>
                    <td className="px-6 py-4">{statusChip(j.status)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{j.address || "—"}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {j.scheduled_start ? when(j.scheduled_start) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {([
                ["Scheduled", "scheduled"] as const,
                ["In progress", "in_progress"] as const,
                ["Blocked", "blocked"] as const,
                ["Completed", "completed"] as const,
              ]).map(([label, key]) => (
                <Card key={key} className="rounded-2xl border bg-background shadow-sm">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="text-sm font-semibold">{label}</div>
                    <Badge variant="outline" className="rounded-full">{groups[key].length}</Badge>
                  </div>
                  <div className="p-3 space-y-3">
                    {groups[key].length === 0 ? (
                      <div className="rounded-2xl border bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                        No jobs
                      </div>
                    ) : (
                      groups[key].map((j) => (
                        <div
                          key={j.id}
                          className={cn(
                            "rounded-2xl border bg-background p-3 shadow-sm transition hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{safeTitle(j)}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {j.client_id ? `Client: ${j.client_id}` : "Client: —"} · {prettyStatus(j.status)}
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground">
                                {j.address || "—"}
                              </div>
                            </div>
                            <div className="shrink-0">{statusChip(j.status)}</div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl">Open</Button>
                            <Button size="sm" variant="outline" className="rounded-xl">Assign</Button>
                            <Button size="sm" variant="outline" className="rounded-xl">Invoice</Button>
                            <Button size="sm" variant="outline" className="rounded-xl">Escrow</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Drag & drop Kanban comes next (UI-first, then interactions).
            </div>
          </div>
        )}
      </DataTableShell>
    </div>
  );
}
