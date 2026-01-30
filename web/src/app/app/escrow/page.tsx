"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EscrowDrawer, type EscrowRow } from "@/components/escrow/escrow-drawer";
import { moneyAUD } from "@/lib/types/money";

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

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [escrows, setEscrows] = useState<EscrowRow[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/escrow", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load escrows");
        if (mounted) setEscrows(json.escrows || []);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load escrows");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (escrows || [])
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
  }, [escrows, q, status]);

  const totals = useMemo(() => {
    const total = rows.reduce((a, r) => a + (r.totalCents || 0), 0);
    const held = rows.reduce((a, r) => a + (r.heldCents || 0), 0);
    const released = rows.reduce((a, r) => a + (r.releasedCents || 0), 0);
    return { total, held, released };
  }, [rows]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Escrow</div>
          <div className="mt-1 text-sm text-neutral-600">Real data (derived from jobs + disputes until escrow table exists).</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Visible total</div>
            <div className="text-sm font-semibold">{moneyAUD(totals.total)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Held</div>
            <div className="text-sm font-semibold">{moneyAUD(totals.held)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Released</div>
            <div className="text-sm font-semibold">{moneyAUD(totals.released)}</div>
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

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-sm text-neutral-600">Loading…</div>
      ) : err ? (
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-sm text-red-700">{err}</div>
      ) : (
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
                    <td className="px-4 py-3 text-right font-semibold">{moneyAUD(e.heldCents)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{moneyAUD(e.releasedCents)}</td>
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
      )}

      <EscrowDrawer escrow={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
