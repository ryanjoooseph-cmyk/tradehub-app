"use client";

import * as React from "react";
import { jobs as demoJobs} from "./demoData";

import { Card} from "@/components/ui/card";
import { Badge} from "@/components/ui/badge";
import { Button} from "@/components/ui/button";
import { Input} from "@/components/ui/input";
import { cn} from "@/lib/utils";

const toneFor = (status: string): "default" | "success" | "warning" | "danger" => {
  const t = (status || "").toLowerCase();
  if (/(complete|completed|done|paid|success)/.test(t)) return "success";
  if (/(dispute|overdue|failed|cancel|cancelled|rejected|error)/.test(t)) return "danger";
  if (/(await|awaiting|in progress|scheduled|pending|hold|review)/.test(t)) return "warning";
  return "default";
};
export function JobsTable(props: { className?: string }) {
  const [q, setQ] = React.useState("");
  const rows = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return demoJobs;
    return demoJobs.filter((j) => (`${j.id} ${j.title} ${j.client} ${j.site} ${j.status} ${j.assignee} ${j.tags.join(" ")} ${j.milestone}`).toLowerCase().includes(s));
  }, [q]);

  return (
    <div className={cn("relative", props.className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs, clients, sites, status…" />
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-2xl">New job</Button>
          <Button variant="default" className="rounded-2xl">Filters</Button>
        </div>
      </div>

      <Card className="mt-4 overflow-hidden rounded-3xl">
        <div className="grid grid-cols-12 gap-0 border-b border-zinc-200 bg-white/70 px-5 py-3 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
          <div className="col-span-4">Job</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Due</div>
          <div className="col-span-2 text-right">Value</div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((j) => (
            <div key={j.id} className="grid grid-cols-12 gap-0 px-5 py-4 hover:bg-zinc-900/5 dark:hover:bg-zinc-50/5">
              <div className="col-span-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">{j.title}</div>
                  <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">{j.id}</div>
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{j.site} • Milestone: {j.milestone}</div>
              </div>
              <div className="col-span-3">
                <div className="text-sm font-semibold">{j.client}</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Assignee: {j.assignee}</div>
              </div>
              <div className="col-span-2 flex items-center">
                <Badge variant={toneFor(j.status)} className="rounded-full px-3 py-1 text-xs font-semibold">{j.status}</Badge>
              </div>
              <div className="col-span-1 flex items-center text-sm font-semibold">{j.due}</div>
              <div className="col-span-2 flex items-center justify-end text-sm font-extrabold tracking-tight">${j.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
