"use client";

import { Topbar } from "@/components/shell/topbar";
import { demoJobs, money, type Job } from "@/lib/demo-data";
import { useMemo, useState } from "react";

function Chip({ status }: { status: Job["status"] }) {
  const map: Record<Job["status"], string> = {
    Draft: "bg-neutral-100 text-neutral-800 border-neutral-200",
    Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-amber-50 text-amber-800 border-amber-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Disputed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${map[status]}`}>{status}</span>;
}

export default function Page() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return demoJobs;
    return demoJobs.filter((j) =>
      [j.title, j.client, j.site, j.status, j.id].some((v) => v.toLowerCase().includes(s))
    );
  }, [q]);

  return (
    <>
      <Topbar title="Jobs" subtitle="Pipeline, scheduling, escrow status (demo data)" />
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs…"
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
          />
          <div className="text-xs text-neutral-500">{rows.length} jobs</div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Job</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Site</th>
                <th className="px-4 py-3 text-left font-medium">When</th>
                <th className="px-4 py-3 text-left font-medium">Value</th>
                <th className="px-4 py-3 text-left font-medium">Escrow</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {rows.map((j) => (
                <tr key={j.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{j.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">{j.id}</div>
                  </td>
                  <td className="px-4 py-3">{j.client}</td>
                  <td className="px-4 py-3">{j.site}</td>
                  <td className="px-4 py-3">
                    <div className="text-neutral-900">{new Date(j.start).toLocaleString()}</div>
                    <div className="mt-1 text-xs text-neutral-500">{new Date(j.end).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{money(j.valueCents)}</td>
                  <td className="px-4 py-3">{money(j.escrowCents)}</td>
                  <td className="px-4 py-3"><Chip status={j.status} /></td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-neutral-500">No jobs found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
