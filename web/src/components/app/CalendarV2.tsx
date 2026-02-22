"use client";

import * as React from "react";
import { jobs } from "./demoData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Day = { label: string; key: "Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun" };

const days: Day[] = [
  { label: "Mon", key: "Mon" },
  { label: "Tue", key: "Tue" },
  { label: "Wed", key: "Wed" },
  { label: "Thu", key: "Thu" },
  { label: "Fri", key: "Fri" },
  { label: "Sat", key: "Sat" },
  { label: "Sun", key: "Sun" },
];

const tone = (status: string): "default" | "success" | "warning" | "danger" => {
  const t = (status || "").toLowerCase();
  if (/(complete|completed|done|paid|success|approved|active)/.test(t)) return "success";
  if (/(dispute|overdue|failed|fail|cancel|cancelled|rejected|error|blocked)/.test(t)) return "danger";
  if (/(await|awaiting|in progress|scheduled|pending|hold|review|processing|draft)/.test(t)) return "warning";
  return "default";
};
export function CalendarV2() {
  const [hoverId, setHoverId] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(jobs[0]?.id || null);

  const byDay = React.useMemo(() => {
    const m = new Map<string, typeof jobs>();
    for (const d of days) m.set(d.key, []);
    for (const j of jobs) {
      const arr = m.get(j.due) || [];
      arr.push(j);
      m.set(j.due, arr);
    }
    return m;
  }, []);

  const selected = React.useMemo(() => jobs.find((j) => j.id === selectedId) || null, [selectedId]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Operations Timeline</div>
            <div className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Calendar</div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">A week view that actually shows jobs and status.</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" className="rounded-2xl">Today</Button>
            <Button variant="default" className="rounded-2xl">Week</Button>
            <Button variant="default" className="rounded-2xl">Month</Button>
            <Button className="rounded-2xl">New booking</Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-7">
          {days.map((d) => (
            <Card key={d.key} className="overflow-hidden rounded-3xl">
              <div className="border-b border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{d.label}</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{(byDay.get(d.key) || []).length} jobs</div>
              </div>
              <CardContent className="p-3 space-y-2">
                {(byDay.get(d.key) || []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">No jobs</div>
                ) : (
                  (byDay.get(d.key) || []).map((j) => (
                    <button
                      key={j.id}
                      onMouseEnter={() => setHoverId(j.id)}
                      onMouseLeave={() => setHoverId(null)}
                      onClick={() => setSelectedId(j.id)}
                      className={cn(
                        "w-full rounded-2xl p-3 text-left ring-1 transition",
                        selectedId === j.id
                          ? "bg-emerald-500/10 ring-emerald-500/25 dark:bg-emerald-400/10"
                          : "bg-zinc-900/5 ring-zinc-200 hover:bg-zinc-900/10 dark:bg-zinc-50/5 dark:ring-zinc-800 dark:hover:bg-zinc-50/10"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100">{j.title}</div>
                        <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">{j.id}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <Badge variant={tone(j.status) as "default" | "success" | "warning" | "danger"} className="rounded-full px-3 py-1 text-xs font-semibold">{j.status}</Badge>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{j.assignee}</div>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={cn("mt-4 rounded-3xl bg-white/70 p-4 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/40 dark:ring-zinc-800", hoverId ? "opacity-100" : "opacity-70")}>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Hover preview</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {hoverId ? (jobs.find((j) => j.id === hoverId)?.title || "") : "Hover a job chip to preview."}
          </div>
        </div>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-5">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Inspector</div>
          <div className="mt-2 text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{selected?.title || "Select a job"}</div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{selected ? `${selected.client} • ${selected.site}` : "Click a job to view details."}</div>

          {selected ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Status</div>
                <Badge variant={tone(selected.status)}>{selected.status}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Milestone</div>
                <div className="text-sm font-extrabold">{selected.milestone}</div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Value</div>
                <div className="text-sm font-extrabold">${selected.value.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="rounded-2xl">Open job</Button>
                <Button variant="default" className="rounded-2xl">Message</Button>
                <Button variant="default" className="rounded-2xl">Invoice</Button>
                <Button variant="default" className="rounded-2xl">Escrow</Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
