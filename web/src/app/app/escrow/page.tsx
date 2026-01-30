"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { EmptyState } from "@/components/premium/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, CheckCircle2, Wallet, Plus, Search, ArrowUpRight, Scale } from "lucide-react";

type Escrow = {
  id: string;
  status?: string | null;
  amount?: number | null;
  job_id?: string | null;
  client_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

async function getEscrow(): Promise<Escrow[]> {
  const res = await fetch("/api/escrow", { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any)?.error || "Failed to load escrow");
  return ((json as any)?.escrow || (json as any)?.rows || []) as Escrow[];
}

function money(n?: number | null) {
  const v = Number(n || 0);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(v);
  } catch {
    return `$${Math.round(v)}`;
  }
}

function when(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

function keyStatus(s?: string | null) {
  const v = (s || "created").toLowerCase();
  if (v === "funded") return "funded";
  if (v === "disputed") return "disputed";
  if (v === "released") return "released";
  return "created";
}

function statusChip(s?: string | null) {
  const v = keyStatus(s);
  if (v === "released") return <Badge variant="outline" className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-700">Released</Badge>;
  if (v === "funded") return <Badge variant="outline" className="rounded-full border-sky-300 bg-sky-50 text-sky-800">Funded</Badge>;
  if (v === "disputed") return <Badge variant="outline" className="rounded-full border-amber-300 bg-amber-50 text-amber-800">Disputed</Badge>;
  return <Badge variant="outline" className="rounded-full border-zinc-300 bg-zinc-50 text-zinc-700">Created</Badge>;
}

export default function EscrowPage() {
  const [view, setView] = useState<"table" | "board">("table");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<Escrow[]>([]);
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
      `${r.id} ${r.status || ""} ${r.job_id || ""} ${r.client_id || ""} ${r.amount || ""}`.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const kpis = useMemo(() => {
    const total = rows.reduce((a, r) => a + Number(r.amount || 0), 0);
    const funded = rows.filter(r => keyStatus(r.status) === "funded").length;
    const disputed = rows.filter(r => keyStatus(r.status) === "disputed").length;
    const released = rows.filter(r => keyStatus(r.status) === "released").length;
    return { total, funded, disputed, released, count: rows.length };
  }, [rows]);

  const board = useMemo(() => {
    const b = { created: [] as Escrow[], funded: [] as Escrow[], disputed: [] as Escrow[], released: [] as Escrow[] };
    for (const r of filtered) b[keyStatus(r.status) as keyof typeof b].push(r);
    return b;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow"
        subtitle="TradeHub core. Funds flow, disputes, releases — audit-first UI."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Policy</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New escrow</Button>
          </>
        }
      />

      {err ? <div className="rounded-2xl border border-red-200 bg-background p-6 text-sm text-red-700">{err}</div> : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Escrows" value={String(kpis.count)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Total held" value={money(kpis.total)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Funded" value={String(kpis.funded)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Disputed" value={String(kpis.disputed)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Released" value={String(kpis.released)} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <DataTableShell
        title="Escrow ledger"
        subtitle="Search by escrow ID, job, client, status, amount."
        toolbar={
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[520px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search escrow…" className="h-10 rounded-2xl pl-9" />
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full md:w-auto">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="table" className="rounded-xl">Table</TabsTrigger>
                <TabsTrigger value="board" className="rounded-xl">Board</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      >
        {loading ? (
          <div className="p-10 text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No escrow records" subtitle="Create escrow from a job to hold funds, then release or dispute." icon={<Scale className="h-5 w-5" />} actionLabel="Create escrow" onAction={() => {}} />
          </div>
        ) : view === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-medium">Escrow</th>
                  <th className="px-6 py-3 text-left font-medium">Job</th>
                  <th className="px-6 py-3 text-left font-medium">Client</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Amount</th>
                  <th className="px-6 py-3 text-right font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{r.id}</div>
                      <div className="text-xs text-muted-foreground">Created: {when(r.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{r.job_id || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.client_id || "—"}</td>
                    <td className="px-6 py-4">{statusChip(r.status)}</td>
                    <td className="px-6 py-4 text-right font-medium">{money(r.amount)}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{when(r.updated_at || r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {([
                ["Created", "created"] as const,
                ["Funded", "funded"] as const,
                ["Disputed", "disputed"] as const,
                ["Released", "released"] as const,
              ]).map(([label, key]) => (
                <Card key={key} className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="text-sm font-semibold">{label}</div>
                    <Badge variant="outline" className="rounded-full">{board[key].length}</Badge>
                  </div>
                  <div className="p-3 space-y-3">
                    {board[key].length === 0 ? (
                      <div className="rounded-2xl border bg-muted/10 p-6 text-center text-xs text-muted-foreground">Empty</div>
                    ) : (
                      board[key].map((r) => (
                        <div key={r.id} className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{r.id}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {r.job_id ? `Job: ${r.job_id}` : "Job: —"} · {r.client_id ? `Client: ${r.client_id}` : "Client: —"}
                              </div>
                              <div className="mt-2 text-sm font-medium">{money(r.amount)}</div>
                            </div>
                            {statusChip(r.status)}
                          </div>
                          <Separator className="my-3" />
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl">Review</Button>
                            <Button size="sm" variant="outline" className="rounded-xl">Fund</Button>
                            <Button size="sm" variant="outline" className="rounded-xl">Dispute</Button>
                            <Button size="sm" className="rounded-xl">Release <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DataTableShell>
    </div>
  );
}
