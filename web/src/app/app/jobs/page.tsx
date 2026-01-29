"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoJobs, demoClients } from "@/lib/demo-data";
import type { Job } from "@/lib/domain";

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}
function clientName(id: string) {
  return demoClients.find((c) => c.id === id)?.name ?? "Unknown Client";
}

const STATUSES: Job["status"][] = ["Backlog", "Quoted", "Scheduled", "In Progress", "Blocked", "Completed"];

export default function JobsPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Job["status"] | "All">("All");

  const jobs = useMemo(() => {
    return demoJobs
      .filter((j) => (status === "All" ? true : j.status === status))
      .filter((j) => {
        const t = (j.title + " " + clientName(j.clientId) + " " + (j.location ?? "")).toLowerCase();
        return t.includes(q.toLowerCase());
      })
      .slice()
      .sort((a, b) => (b.priority.localeCompare(a.priority)) || (b.valueCents - a.valueCents));
  }, [q, status]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">Operator view: status, priority, money, schedule. No fluff.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button onClick={() => setView("list")} className={`rounded-md border px-3 py-1 hover:bg-muted ${view==="list"?"bg-muted":""}`}>List</button>
          <button onClick={() => setView("kanban")} className={`rounded-md border px-3 py-1 hover:bg-muted ${view==="kanban"?"bg-muted":""}`}>Kanban</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs / clients / location" className="w-full md:max-w-md rounded-md border bg-background px-3 py-2 text-sm" />
        <div className="flex gap-2 text-xs">
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-md border bg-background px-3 py-2">
            <option value="All">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Link className="rounded-md border px-3 py-2 hover:bg-muted" href="/dispatch">Open Dispatch</Link>
        </div>
      </div>

      {view === "list" ? (
        <div className="rounded-xl border bg-card overflow-auto">
          <div className="p-4 border-b">
            <div className="font-semibold">Job Register</div>
            <div className="text-xs text-muted-foreground">Click a job for the detail record.</div>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="text-left py-2 px-4">Job</th>
                <th className="text-left py-2">Client</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Priority</th>
                <th className="text-left py-2">Schedule</th>
                <th className="text-right py-2 px-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b last:border-b-0 hover:bg-muted/40">
                  <td className="py-3 px-4 font-medium">
                    <Link className="hover:underline" href={`/app/jobs/${j.id}`}>{j.title}</Link>
                    <div className="text-xs text-muted-foreground">{j.location ?? "—"}</div>
                  </td>
                  <td className="py-3">{clientName(j.clientId)}</td>
                  <td className="py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs">{j.status}</span></td>
                  <td className="py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs">{j.priority}</span></td>
                  <td className="py-3 text-xs text-muted-foreground">
                    {j.start && j.end ? `${new Date(j.start).toLocaleString()} → ${new Date(j.end).toLocaleTimeString()}` : "Unscheduled"}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">{money(j.valueCents)}</td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td className="py-8 px-4 text-muted-foreground" colSpan={6}>No matching jobs.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {STATUSES.map((s) => (
            <div key={s} className="col-span-12 md:col-span-6 xl:col-span-2 rounded-xl border bg-card">
              <div className="p-3 border-b">
                <div className="font-semibold text-sm">{s}</div>
                <div className="text-xs text-muted-foreground">{demoJobs.filter(j=>j.status===s).length} jobs</div>
              </div>
              <div className="p-3 space-y-2">
                {demoJobs.filter((j) => j.status === s).map((j) => (
                  <Link key={j.id} href={`/app/jobs/${j.id}`} className="block rounded-lg border bg-background p-3 hover:bg-muted">
                    <div className="font-medium text-sm truncate">{j.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{clientName(j.clientId)} • {j.location ?? "—"}</div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="rounded-full bg-muted px-2 py-0.5">{j.priority}</span>
                      <span className="font-semibold">{money(j.valueCents)}</span>
                    </div>
                  </Link>
                ))}
                {demoJobs.filter((j) => j.status === s).length === 0 && (
                  <div className="text-xs text-muted-foreground">Empty</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
