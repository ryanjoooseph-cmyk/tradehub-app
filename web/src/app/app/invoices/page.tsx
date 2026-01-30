"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { EmptyState } from "@/components/premium/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Receipt, Plus, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";

type Invoice = {
  id: string;
  client_id?: string | null;
  status?: string | null;
  total_cents?: number | null;
  created_at?: string | null;
};

async function getInvoices(): Promise<Invoice[]> {
  const res = await fetch("/api/invoices", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed to load invoices");
  return (json?.invoices || []) as Invoice[];
}

function money(cents?: number | null) {
  if (!cents) return "$0.00";
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: "AUD" });
}

function statusBadge(status?: string | null) {
  const s = (status || "draft").toLowerCase();
  if (s === "paid") return <Badge className="rounded-full">Paid</Badge>;
  if (s === "sent") return <Badge variant="outline" className="rounded-full">Sent</Badge>;
  if (s === "overdue") return <Badge variant="outline" className="rounded-full border-red-300 bg-red-50 text-red-700">Overdue</Badge>;
  return <Badge variant="outline" className="rounded-full bg-muted/40 text-muted-foreground">Draft</Badge>;
}

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getInvoices();
        if (!mounted) return;
        setInvoices(data);
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
    if (!s) return invoices;
    return invoices.filter((i) =>
      `${i.id} ${i.status || ""} ${i.client_id || ""}`.toLowerCase().includes(s)
    );
  }, [invoices, q]);

  const totalValue = useMemo(() => invoices.reduce((a, i) => a + (i.total_cents || 0), 0), [invoices]);
  const paid = useMemo(() => invoices.filter(i => (i.status || "").toLowerCase() === "paid").length, [invoices]);
  const outstanding = useMemo(() => invoices.filter(i => (i.status || "").toLowerCase() !== "paid").length, [invoices]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle="Professional billing that looks expensive. Fast search, clean status, audit-ready."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Export</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New invoice</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard label="Total invoices" value={String(invoices.length)} icon={<Receipt className="h-4 w-4" />} />
        <StatCard label="Total value" value={money(totalValue)} sub="All time" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Paid" value={String(paid)} sub="Completed" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Outstanding" value={String(outstanding)} sub="Unpaid / in-flight" icon={<Clock className="h-4 w-4" />} />
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-200 bg-background p-6 text-sm text-red-700">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4" /> {err}
          </div>
        </div>
      ) : null}

      <DataTableShell
        title="Billing ledger"
        subtitle="Search invoices by ID, status, or client."
        toolbar={
          <div className="relative w-full md:w-[380px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search invoice ID, status, client…"
              className="h-10 rounded-2xl pl-9"
            />
          </div>
        }
      >
        {loading ? (
          <div className="p-10 text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No invoices yet"
              subtitle="Create invoices from jobs/quotes and keep your cashflow tight."
              icon={<Receipt className="h-5 w-5" />}
              actionLabel="Create invoice"
              onAction={() => {}}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-medium">Invoice</th>
                  <th className="px-6 py-3 text-left font-medium">Client</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                  <th className="px-6 py-3 text-right font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((i) => (
                  <tr key={i.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{i.id}</div>
                      <div className="text-xs text-muted-foreground">Ledger entry</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{i.client_id || "—"}</span>
                    </td>
                    <td className="px-6 py-4">{statusBadge(i.status)}</td>
                    <td className="px-6 py-4 text-right font-medium">{money(i.total_cents)}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {i.created_at ? new Date(i.created_at).toLocaleDateString() : "—"}
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
