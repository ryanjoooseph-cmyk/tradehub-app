"use client";

import * as React from "react";
import type { Job } from "./demoData";
import { jobs as demoJobs } from "./demoData";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

function toneFor(status: Job["status"]) {
  if (status === "Complete") return "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-200 dark:bg-emerald-400/10";
  if (status === "In Progress") return "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-200 dark:bg-sky-400/10";
  if (status === "Awaiting Payment") return "bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/20 dark:text-amber-200 dark:bg-amber-400/10";
  if (status === "Dispute") return "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-200 dark:bg-rose-400/10";
  return "bg-zinc-900/5 text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:text-zinc-200 dark:ring-zinc-800";
}

export function JobsTable(props: { className?: string }) {
  const [q, setQ] = React.useState("");
  const rows = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return demoJobs;
    return demoJobs.filter((j) => (`${j.id} ${j.title} ${j.client} ${j.site} ${j.status} ${j.assignee} ${j.tags.join(" ")}`).toLowerCase().includes(s));
  }, [q]);

  return (
    <div className={cn("relative", props.className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs, clients, sites, status…" />
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-2xl">New job</Button>
          <Button variant="secondary" className="rounded-2xl">Filters</Button>
        </div>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="grid grid-cols-12 gap-0 border-b border-zinc-200 bg-white/70 px-5 py-3 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
          <div className="col-span-3">Job</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Due</div>
          <div className="col-span-2 text-right">Value</div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((j) => (
            <div key={j.id} className="grid grid-cols-12 gap-0 px-5 py-4 hover:bg-zinc-900/5 dark:hover:bg-zinc-50/5">
              <div className="col-span-3">
                <div className="text-sm font-semibold">{j.title}</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{j.id} • {j.site}</div>
              </div>
              <div className="col-span-3">
                <div className="text-sm font-semibold">{j.client}</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Assignee: {j.assignee}</div>
              </div>
              <div className="col-span-2 flex items-center">
                <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", toneFor(j.status))}>{j.status}</Badge>
              </div>
              <div className="col-span-2 flex items-center text-sm font-semibold">{j.due}</div>
              <div className="col-span-2 flex items-center justify-end text-sm font-extrabold tracking-tight">${j.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
