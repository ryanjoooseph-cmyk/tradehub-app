"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  HardHat,
  ShieldCheck,
  AlertTriangle,
  MapPin,
} from "lucide-react";

type JobStatus = "New" | "Scheduled" | "In Progress" | "Blocked" | "Complete";
type Job = {
  id: string;
  title: string;
  client: string;
  site: string;
  status: JobStatus;
  start: string;
  end: string;
  escrowHold: number;
};

const seed: Job[] = [
  { id: "J-187", title: "High-rise repaint — Stage 1", client: "Arcadia Body Corporate", site: "Brisbane CBD — Tower A", status: "In Progress", start: "2026-01-31 07:00", end: "2026-01-31 15:00", escrowHold: 16800 },
  { id: "J-188", title: "Strata touch-ups + sealing", client: "Northpoint Facilities", site: "Newstead — Lot 14", status: "Scheduled", start: "2026-02-01 08:00", end: "2026-02-01 12:00", escrowHold: 5200 },
  { id: "J-189", title: "Exterior washdown", client: "Lakeside Owners Assoc", site: "Southbank — Building C", status: "Blocked", start: "2026-01-31 09:00", end: "2026-01-31 13:00", escrowHold: 0 },
  { id: "J-190", title: "Balcony restoration closeout", client: "Meridian Property Group", site: "Hamilton — Riverfront", status: "Complete", start: "2026-01-29 08:00", end: "2026-01-29 16:00", escrowHold: 0 },
  { id: "J-191", title: "Quote + site measure", client: "New Client Intake", site: "TBD", status: "New", start: "2026-02-02 10:00", end: "2026-02-02 11:00", escrowHold: 0 },
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

function toMinutes(t: string) {
  const m = t.trim().split(" ").pop() || "00:00";
  const [hh, mm] = m.split(":").map((x) => parseInt(x, 10));
  return (isNaN(hh) ? 0 : hh) * 60 + (isNaN(mm) ? 0 : mm);
}

function dayKey(dt: string) {
  return dt.trim().split(" ")[0] || "";
}

export default function CalendarPage() {
  const [mode, setMode] = useState<"week" | "day">("week");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");
  const selected = useMemo(() => seed.find((j) => j.id === selectedId) || seed[0], [selectedId]);

  const days = useMemo(() => {
    const uniq = Array.from(new Set(seed.map((j) => dayKey(j.start)))).sort();
    const start = uniq[0] || "2026-01-31";
    const base = new Date(start + "T00:00:00");
    const out: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      out.push(iso);
    }
    return out;
  }, []);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => 6 + i), []);

  const byDay = useMemo(() => {
    const map: Record<string, Job[]> = {};
    for (const d of days) map[d] = [];
    for (const j of seed) {
      const dk = dayKey(j.start);
      if (!map[dk]) map[dk] = [];
      map[dk].push(j);
    }
    for (const d of Object.keys(map)) map[d].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    return map;
  }, [days]);

  const kpis = useMemo(() => {
    const scheduled = seed.filter((j) => j.status === "Scheduled" || j.status === "In Progress").length;
    const blocked = seed.filter((j) => j.status === "Blocked").length;
    const held = seed.reduce((a, j) => a + j.escrowHold, 0);
    const total = seed.length;
    return { scheduled, blocked, held, total };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="Jobs are first-class events. Dispatch-grade visibility."
        right={
          <>
            <Button variant="outline" className="rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" className="rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
            <Button className="rounded-xl"><ClipboardList className="mr-2 h-4 w-4" />New job</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Scheduled" value={String(kpis.scheduled)} icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Escrow held" value={moneyAUD(kpis.held)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Jobs" value={String(kpis.total)} icon={<HardHat className="h-4 w-4" />} />
        <StatCard label="View" value={mode === "week" ? "Week" : "Day"} icon={<CalendarDays className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Schedule</div>
            <div className="flex items-center gap-2">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="week" className="rounded-xl">Week</TabsTrigger>
                  <TabsTrigger value="day" className="rounded-xl">Day</TabsTrigger>
                </TabsList>
              </Tabs>
              <Badge variant="outline" className="rounded-full">Premium</Badge>
            </div>
          </div>

          <div className="p-4">
            <div className={cn("grid gap-3", mode === "week" ? "grid-cols-1 xl:grid-cols-7" : "grid-cols-1")}>
              {(mode === "week" ? days : [days[0]]).map((d) => (
                <div key={d} className="rounded-2xl border bg-background overflow-hidden">
                  <div className="px-3 py-2 border-b flex items-center justify-between">
                    <div className="text-xs font-semibold">{d}</div>
                    <Badge variant="outline" className="rounded-full">{(byDay[d] || []).length}</Badge>
                  </div>

                  <div className="p-3 space-y-2">
                    {(byDay[d] || []).length === 0 ? (
                      <div className="text-xs text-muted-foreground p-3 rounded-xl border bg-muted/20">No jobs</div>
                    ) : (
                      (byDay[d] || []).map((j) => (
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
                              <div className="text-sm font-semibold truncate">{j.title}</div>
                              <div className="mt-1 text-xs text-muted-foreground truncate">{j.client}</div>
                            </div>
                            <div className="text-xs rounded-full border px-2 py-0.5 shrink-0">{j.id}</div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {chipStatus(j.status)}
                            <span className="rounded-full border px-2 py-0.5 text-xs">{j.start.split(" ")[1]}–{j.end.split(" ")[1]}</span>
                            {j.escrowHold > 0 ? <span className="rounded-full border px-2 py-0.5 text-xs">Escrow</span> : null}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border overflow-hidden">
              <div className="px-4 py-3 border-b text-sm font-semibold">Day timeline (visual)</div>
              <div className="p-4">
                <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground">
                  {hours.map((h) => (
                    <div key={h} className="col-span-1 text-center">{String(h).padStart(2, "0")}:00</div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="relative h-16 rounded-2xl border bg-muted/15 overflow-hidden">
                  {seed
                    .filter((j) => dayKey(j.start) === days[0])
                    .map((j) => {
                      const s = toMinutes(j.start) - 360;
                      const e = toMinutes(j.end) - 360;
                      const leftPct = Math.max(0, Math.min(100, (s / (12 * 60)) * 100));
                      const widthPct = Math.max(4, Math.min(100 - leftPct, ((e - s) / (12 * 60)) * 100));
                      return (
                        <button
                          key={j.id}
                          onClick={() => setSelectedId(j.id)}
                          className={cn(
                            "absolute top-2 bottom-2 rounded-2xl border bg-background px-3 py-2 text-left shadow-sm hover:bg-muted/30 transition",
                            selected?.id === j.id ? "border-zinc-400/70" : "border-border"
                          )}
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        >
                          <div className="text-xs font-semibold truncate">{j.id} · {j.title}</div>
                          <div className="mt-1 text-[11px] text-muted-foreground truncate">{j.start.split(" ")[1]}–{j.end.split(" ")[1]}</div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Job details</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          {!selected ? (
            <div className="p-8 text-sm text-muted-foreground">Select a job to view details.</div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-lg font-semibold truncate">{selected.title}</div>
                  <span className="rounded-full border px-2 py-0.5 text-xs">{selected.id}</span>
                  {chipStatus(selected.status)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{selected.client}</div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4" />Schedule</div>
                <div className="mt-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Start</span>
                    <span className="font-semibold">{selected.start}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground">End</span>
                    <span className="font-semibold">{selected.end}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />Site</div>
                <div className="mt-2 text-sm font-semibold">{selected.site}</div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Escrow</div>
                <div className="mt-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hold</span>
                    <span className="font-semibold">{moneyAUD(selected.escrowHold)}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Button variant="outline" className="rounded-xl">Dispatch</Button>
                <Button className="rounded-xl">Open <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
