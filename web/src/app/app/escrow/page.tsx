"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EscrowDrawer, type EscrowRow } from "@/components/escrow/escrow-drawer";

const now = Date.now();

const demo: EscrowRow[] = [
  {
    id: "esc_001",
    jobId: "job_1001",
    jobTitle: "Strata repaint • Tower A",
    client: "ACME Body Corporate",
    status: "Funded",
    totalCents: 1850000,
    heldCents: 1850000,
    releasedCents: 0,
    createdAt: new Date(now - 86400000 * 12).toISOString(),
    milestones: [
      { id: "m1", name: "Mobilisation / access setup", amountCents: 250000, status: "Locked" },
      { id: "m2", name: "Level 1–10 completion", amountCents: 650000, status: "Locked" },
      { id: "m3", name: "Final QA + handover", amountCents: 950000, status: "Locked" },
    ],
    ledger: [
      { id: "l1", ts: new Date(now - 86400000 * 12).toISOString(), type: "Fund", amountCents: 1850000, note: "Funds received into escrow." },
      { id: "l2", ts: new Date(now - 86400000 * 11).toISOString(), type: "Note", note: "Milestones agreed and locked." },
    ],
  },
  {
    id: "esc_002",
    jobId: "job_1002",
    jobTitle: "Roof restoration • 24 units",
    client: "Brightline Constructions",
    status: "On Hold",
    totalCents: 980000,
    heldCents: 980000,
    releasedCents: 0,
    createdAt: new Date(now - 86400000 * 20).toISOString(),
    milestones: [{ id: "m1", name: "Inspection + prep", amountCents: 200000, status: "Disputed" }],
    ledger: [
      { id: "l1", ts: new Date(now - 86400000 * 20).toISOString(), type: "Fund", amountCents: 980000, note: "Funds received into escrow." },
      { id: "l2", ts: new Date(now - 86400000 * 18).toISOString(), type: "Hold", note: "Payment held pending dispute resolution." },
      { id: "l3", ts: new Date(now - 86400000 * 17).toISOString(), type: "Dispute", note: "Client raised quality dispute. Inspector required." },
    ],
  },
  {
    id: "esc_003",
    jobId: "job_1003",
    jobTitle: "Bathroom refresh",
    client: "Ryan Joseph",
    status: "Partially Released",
    totalCents: 420000,
    heldCents: 120000,
    releasedCents: 300000,
    createdAt: new Date(now - 86400000 * 5).toISOString(),
    milestones: [
      { id: "m1", name: "Demo + rough-in", amountCents: 180000, status: "Released" },
      { id: "m2", name: "Fit-off", amountCents: 120000, status: "Released" },
      { id: "m3", name: "Final sign-off", amountCents: 120000, status: "Locked" },
    ],
    ledger: [
      { id: "l1", ts: new Date(now - 86400000 * 5).toISOString(), type: "Fund", amountCents: 420000, note: "Escrow funded." },
      { id: "l2", ts: new Date(now - 86400000 * 4).toISOString(), type: "Release", amountCents: 180000, note: "Milestone 1 released." },
      { id: "l3", ts: new Date(now - 86400000 * 2).toISOString(), type: "Release", amountCents: 120000, note: "Milestone 2 released." },
    ],
  },
];

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

function tone(status: EscrowRow["status"]) {
  if (status === "Released") return "good";
  if (status === "Funded") return "info";
  if (status === "On Hold") return "bad";
  if (status === "Partially Released") return "warn";
  return "neutral";
}

export default function EscrowPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<EscrowRow["status"] | "All">("All");
  const [selected, setSelected] = useState<EscrowRow | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return demo
      .filter((e) => (status === "All" ? true : e.status === status))
      .filter((e) => {
        if (!needle) return true;
        return (
          e.jobTitle.toLowerCase().includes(needle) ||
          e.client.toLowerCase().includes(needle) ||
          e.jobId.toLowerCase().includes(needle) ||
          e.id.toLowerCase().includes(needle)
        );
      })
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [q, status]);

  const totals = useMemo(() => {
    const total = rows.reduce((a, r) => a + r.totalCents, 0);
    const held = rows.reduce((a, r) => a + r.heldCents, 0);
    const released = rows.reduce((a, r) => a + r.releasedCents, 0);
    return { total, held, released };
  }, [rows]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Escrow</div>
          <div className="mt-1 text-sm text-neutral-600">Milestones, ledger, holds, releases, disputes — all in one control plane.</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Visible total</div>
            <div className="text-sm font-semibold">{money(totals.total)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Held</div>
            <div className="text-sm font-semibold">{money(totals.held)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Released</div>
            <div className="text-sm font-semibold">{money(totals.released)}</div>
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
              placeholder="Search escrow..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm">
              <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
              <select className="bg-transparent outline-none" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option>All</option>
                <option>Pending</option>
                <option>Funded</option>
                <option>Partially Released</option>
                <option>On Hold</option>
                <option>Released</option>
              </select>
            </div>

            <button
              type="button"
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              onClick={() => alert("Next: create escrow from job quote (persist)")}
            >
              New escrow
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500 bg-neutral-50">
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-medium">Escrow</th>
                <th className="px-4 py-3 text-left font-medium">Job</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Held</th>
                <th className="px-4 py-3 text-right font-medium">Released</th>
                <th className="px-4 py-3 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((e) => (
                <tr
                  key={e.id}
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => {
                    setSelected(e);
                    setOpen(true);
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{e.id}</div>
                    <div className="mt-1 text-xs text-neutral-500">{e.jobId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{e.jobTitle}</div>
                  </td>
                  <td className="px-4 py-3">{e.client}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(e.status)}>{e.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{money(e.heldCents)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(e.releasedCents)}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-sm text-neutral-500" colSpan={7}>
                    No escrow records match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <EscrowDrawer escrow={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
