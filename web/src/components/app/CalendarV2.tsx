"use client";

import * as React from "react";
import { jobs } from "./demoData";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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

function tone(s: string) {
  if (s === "Complete") return "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-200 dark:bg-emerald-400/10";
  if (s === "In Progress") return "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-200 dark:bg-sky-400/10";
  if (s === "Awaiting Payment") return "bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/20 dark:text-amber-200 dark:bg-amber-400/10";
  if (s === "Dispute") return "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-200 dark:bg-rose-400/10";
  return "bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:text-zinc-200 dark:ring-zinc-800";
}

export function CalendarV2() {
  const [hoverId, setHoverId] = React.useState<string | null>(null);
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
  const hovered = React.useMemo(() => jobs.find((j) => j.id === hoverId) || null, [hoverId]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Week view</div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-2xl">Today</Button>
          <Button variant="secondary" className="rounded-2xl">Week</Button>
          <Button variant="secondary" className="rounded-2xl">Month</Button>
          <Button className="rounded-2xl">New booking</Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-7">
        {days.map((d) => (
          <Card key={d.key} className="overflow-hidden">
            <div className="border-b border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{d.label}</div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Jobs</div>
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
                    className="w-full rounded-2xl bg-zinc-900/5 p-3 text-left ring-1 ring-zinc-200 transition hover:bg-zinc-900/10 dark:bg-zinc-50/5 dark:ring-zinc-800 dark:hover:bg-zinc-50/10"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100">{j.title}</div>
                      <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">{j.id}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", tone(j.status))}>{j.status}</Badge>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{j.assignee}</div>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={cn("pointer-events-none fixed right-6 top-24 hidden w-[360px] rounded-3xl bg-white/80 p-5 shadow-2xl ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-950/60 dark:ring-zinc-800 lg:block", hovered ? "opacity-100" : "opacity-0")}>
        {hovered ? (
          <div>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Preview</div>
            <div className="mt-2 text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{hovered.title}</div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{hovered.client} • {hovered.site}</div>
            <div className="mt-4 flex items-center justify-between">
              <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", tone(hovered.status))}>{hovered.status}</Badge>
              <div className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">${hovered.value.toLocaleString()}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
