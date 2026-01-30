"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { EmptyState } from "@/components/premium/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search } from "lucide-react";

type Client = { id: string; name?: string | null; email?: string | null; created_at?: string | null };

async function getClients(): Promise<Client[]> {
  const res = await fetch("/api/clients", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed to load clients");
  return (json?.clients || []) as Client[];
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getClients();
        if (!mounted) return;
        setClients(data);
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
    if (!s) return clients;
    return clients.filter((c) =>
      `${c.name || ""} ${c.email || ""}`.toLowerCase().includes(s)
    );
  }, [clients, q]);

  const newest = useMemo(() => {
    return clients
      .slice()
      .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")))
      .slice(0, 1)[0];
  }, [clients]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="High-trust client CRM. Searchable, fast, and built for trade ops."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Import</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New client</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard label="Total clients" value={String(clients.length)} sub="Active records" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Newest client" value={newest?.name || newest?.email || "—"} sub={newest?.created_at ? new Date(newest.created_at).toLocaleString() : "—"} />
        <StatCard label="Data source" value="Supabase" sub="Live via API" />
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-200 bg-background p-6 text-sm text-red-700">{err}</div>
      ) : null}

      <DataTableShell
        title="Directory"
        subtitle="Search, sort, and drill into client history."
        toolbar={
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="h-10 rounded-2xl pl-9" />
          </div>
        }
      >
        {loading ? (
          <div className="p-10 text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No clients yet"
              subtitle="Create your first client and TradeHub will start building a clean operational history."
              icon={<Users className="h-5 w-5" />}
              actionLabel="Create client"
              onAction={() => {}}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-medium">Client</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{c.name || "Unnamed client"}</div>
                      <div className="text-xs text-muted-foreground">{c.id}</div>
                    </td>
                    <td className="px-6 py-4">{c.email || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="rounded-full">Active</Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
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
