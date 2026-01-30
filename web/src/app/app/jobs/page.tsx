"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/demo-data";
import { demoJobs, money } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { JobDrawer } from "@/components/jobs/job-drawer";
import { Search, SlidersHorizontal } from "lucide-react";

function toneForStatus(s: Job["status"]) {
  if (s === "Completed") return "good";
  if (s === "In Progress") return "info";
  if (s === "Scheduled") return "neutral";
  if (s === "Disputed") return "bad";
  return "warn";
}

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Job["status"] | "All">("All");
  const [priority, setPriority] = useState<Job["priority"] | "All">("All");
  const [selected, setSelected] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);

  const jobs = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return demoJobs
      .filter((j) => (status === "All" ? true : j.status === status))
      .filter((j) => (priority === "All" ? true : j.priority === priority))
      .filter((j) => {
        if (!needle) return true;
        return (
          j.title.toLowerCase().includes(needle) ||
          j.client.toLowerCase().includes(needle) ||
          j.site.toLowerCase().includes(needle) ||
          (j.location || "").toLowerCase().includes(needle)
        );
      })
      .slice()
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [q, status, priority]);

  const totals = useMemo(() => {
    const value = jobs.reduce((a, j) => a + j.valueCents, 0);
    const escrow = jobs.reduce((a, j) => a + j.escrowCents, 0);
    return { value, escrow };
  }, [jobs]);

  function openJob(j: Job) {
    setSelected(j);
    setOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Jobs</div>
          <div className="mt-1 text-sm text-neutral-600">Operational control surface: filter, inspect, and act.</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Visible value</div>
            <div className="text-sm font-semibold">{money(totals.value)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Visible escrow</div>
            <div className="text-sm font-semibold">{money(totals.escrow)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jobs, clients, sites..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm">
              <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
              <select className="bg-transparent outline-none" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option>All</option>
                <option>Draft</option>
                <option>Scheduled</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Disputed</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm">
              <select className="bg-transparent outline-none" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <button
              type="button"
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              onClick={() => alert("Next: create job flow backed by Supabase")}
            >
              New job
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500 bg-neutral-50">
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-medium">Job</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Site</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Priority</th>
                <th className="px-4 py-3 text-right font-medium">Value</th>
                <th className="px-4 py-3 text-right font-medium">Escrow</th>
                <th className="px-4 py-3 text-right font-medium">Start</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {jobs.map((j) => (
                <tr
                  key={j.id}
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => openJob(j)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{j.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">{j.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{j.client}</div>
                    <div className="mt-1 text-xs text-neutral-500">{j.clientId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{j.site}</div>
                    <div className="mt-1 text-xs text-neutral-500">{j.location || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={toneForStatus(j.status)}>{j.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={j.priority === "High" ? "bad" : j.priority === "Medium" ? "warn" : "neutral"}>{j.priority}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{money(j.valueCents)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(j.escrowCents)}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">{new Date(j.start).toLocaleString()}</td>
                </tr>
              ))}
              {jobs.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-sm text-neutral-500" colSpan={8}>
                    No jobs match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <JobDrawer job={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
