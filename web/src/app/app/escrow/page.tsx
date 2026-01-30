"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { EmptyState } from "@/components/premium/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Plus, Search, Lock, Unlock, AlertTriangle, Scale } from "lucide-react";

type EscrowRow = {
  id: string;
  job_id?: string | null;
  client_id?: string | null;
  status?: string | null; // holding | released | disputed | cancelled
  amount_cents?: number | null;
  created_at?: string | null;
};

async function getEscrow(): Promise<EscrowRow[]> {
  const res = await fetch("/api/escrow", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed to load escrow");
  return (json?.escrow || json?.rows || []) as EscrowRow[];
}

function money(cents?: number | null) {
  if (!cents) return "$0.00";
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: "AUD" });
}

function chip(status?: string | null) {
  const s = (status || "holding").toLowerCase();
  if (s === "released")
    return <Badge variant="outline" className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-700">Released</Badge>;
  if (s === "disputed")
    return <Badge variant="outline" className="rounded-full border-amber-300 bg-amber-50 text-amber-800">Disputed</Badge>;
  if (s === "cancelled")
    return <Badge variant="outline" className="rounded-full border-zinc-300 bg-zinc-50 text-zinc-700">Cancelled</Badge>;
  return <Badge variant="outline" className="rounded-full border-sky-300 bg-sky-50 text-sky-800">Holding</Badge>;
}

export default function EscrowPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<EscrowRow[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getEscrow();
        if (!mounted) return;
        setRows(data);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      `${r.id} ${r.status || ""} ${r.job_id || ""} ${r.client_id || ""}`.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const totalHeld = useMemo(() => rows.reduce((a, r) => a + ((r.status || "holding").toLowerCase() === "holding" ? (r.amount_cents || 0) : 0), 0), [rows]);
  const totalReleased = useMemo(() => rows.reduce((a, r) => a + ((r.status || "").toLowerCase() === "released" ? (r.amount_cents || 0) : 0), 0), [rows]);
  const disputes = useMemo(() => rows.filter(r => (r.status || "").toLowerCase() === "disputed").length, [rows]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow"
        subtitle="High-trust transaction control. Hold, release, or dispute with full audit trail."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Export</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New escrow</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard label="Total records" value={String(rows.length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Held" value={money(totalHeld)} sub="Currently in escrow" icon={<Lock className="h-4 w-4" />} />
        <StatCard label="Released" value={money(totalReleased)} sub="Completed payouts" icon={<Unlock className="h-4 w-4" />} />
        <StatCard label="Disputes" value={String(disputes)} sub="Needs resolution" icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-200 bg-background p-6 text-sm text-red-700">{err}</div>
      ) : null}

      <DataTableShell
        title="Escrow ledger"
        subtitle="Search by record ID, job, client, or status."
        toolbar={
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <div className="relative w-full md:w-[420px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search escrow ID, job, client, status…"
                className="h-10 rounded-2xl pl-9"
              />
            </div>
            <Button variant="outline" className="rounded-xl"><Scale className="mr-2 h-4 w-4" />Resolve</Button>
          </div>
        }
      >
        {loading ? (
          <div className="p-10 text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No escrow records yet"
              subtitle="Create escrow from an accepted quote/invoice to hold funds safely."
              icon={<ShieldCheck className="h-5 w-5" />}
              actionLabel="Create escrow"
              onAction={() => {}}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-medium">Record</th>
                  <th className="px-6 py-3 text-left font-medium">Job</th>
                  <th className="px-6 py-3 text-left font-medium">Client</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Amount</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{r.id}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{r.job_id || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.client_id || "—"}</td>
                    <td className="px-6 py-4">{chip(r.status)}</td>
                    <td className="px-6 py-4 text-right font-medium">{money(r.amount_cents)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl">Hold</Button>
                        <Button variant="outline" size="sm" className="rounded-xl">Release</Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100">
                          Dispute
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataTableShell>
    </div>
  );
}
