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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Users, Plus, Search, Mail, Phone, MapPin, Clock, Star } from "lucide-react";

type Client = {
  id: string;
  name?: string | null;
  full_name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
};

async function getClients(): Promise<Client[]> {
  const res = await fetch("/api/clients", { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as any)?.error || "Failed to load clients");
  return ((json as any)?.clients || (json as any)?.rows || []) as Client[];
}

function displayName(c: Client) {
  return (
    c.name?.trim() ||
    c.full_name?.trim() ||
    c.company?.trim() ||
    (c.email ? c.email.split("@")[0] : "") ||
    `Client ${c.id}`
  );
}

function when(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

function safeTags(c: Client): string[] {
  const t = c.tags || [];
  if (Array.isArray(t) && t.length) return t.slice(0, 3).filter(Boolean);
  return [];
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getClients();
        if (!mounted) return;
        setClients(data);
        setSelected(data[0] || null);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter((c) =>
      `${c.id} ${displayName(c)} ${c.email || ""} ${c.phone || ""} ${c.address || ""} ${(c.tags || []).join(" ")}`.toLowerCase().includes(s)
    );
  }, [clients, q]);

  const kpis = useMemo(() => {
    const total = clients.length;
    const withEmail = clients.filter((c) => !!c.email).length;
    const withPhone = clients.filter((c) => !!c.phone).length;
    const withAddress = clients.filter((c) => !!c.address).length;
    return { total, withEmail, withPhone, withAddress };
  }, [clients]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="CRM-grade client management. Fast search, rich profiles, and clean operations."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Import</Button>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              New client
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard label="Total clients" value={String(kpis.total)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="With email" value={String(kpis.withEmail)} icon={<Mail className="h-4 w-4" />} />
        <StatCard label="With phone" value={String(kpis.withPhone)} icon={<Phone className="h-4 w-4" />} />
        <StatCard label="With address" value={String(kpis.withAddress)} icon={<MapPin className="h-4 w-4" />} />
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-200 bg-background p-6 text-sm text-red-700">{err}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <DataTableShell
          title="Client directory"
          subtitle="Search clients by name, email, phone, address, or tags."
          toolbar={
            <div className="relative w-full md:w-[520px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search clients…"
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
                title="No clients found"
                subtitle="Create your first client to attach jobs, quotes, invoices, and escrow."
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
                    <th className="px-6 py-3 text-left font-medium">Contact</th>
                    <th className="px-6 py-3 text-left font-medium">Address</th>
                    <th className="px-6 py-3 text-right font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((c) => {
                    const active = selected?.id === c.id;
                    const tags = safeTags(c);
                    return (
                      <tr
                        key={c.id}
                        className={cn("cursor-pointer hover:bg-muted/30", active ? "bg-muted/20" : "")}
                        onClick={() => setSelected(c)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-medium">{displayName(c)}</div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {tags.length ? (
                                  tags.map((t) => (
                                    <Badge key={t} variant="outline" className="rounded-full bg-muted/30 text-muted-foreground">
                                      {t}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="rounded-full">
                              {c.id}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="space-y-1">
                            <div className="truncate">{c.email || "—"}</div>
                            <div className="truncate">{c.phone || "—"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{c.address || "—"}</td>
                        <td className="px-6 py-4 text-right text-muted-foreground">{when(c.updated_at || c.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DataTableShell>

        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b bg-background px-4 py-4">
            <div className="text-sm font-semibold tracking-tight">Client profile</div>
            <div className="mt-1 text-xs text-muted-foreground">Select a client to view details and actions.</div>
          </div>

          {selected ? (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{displayName(selected)}</div>
                <div className="text-xs text-muted-foreground">{selected.id}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full"><Star className="mr-1 h-3.5 w-3.5" />Priority</Badge>
                {safeTags(selected).map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full bg-muted/30 text-muted-foreground">{t}</Badge>
                ))}
              </div>

              <Separator />

              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-muted-foreground inline-flex items-center gap-2"><Mail className="h-4 w-4" />Email</div>
                  <div className="font-medium truncate">{selected.email || "—"}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-muted-foreground inline-flex items-center gap-2"><Phone className="h-4 w-4" />Phone</div>
                  <div className="font-medium truncate">{selected.phone || "—"}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-muted-foreground inline-flex items-center gap-2"><MapPin className="h-4 w-4" />Address</div>
                  <div className="font-medium truncate">{selected.address || "—"}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-muted-foreground inline-flex items-center gap-2"><Clock className="h-4 w-4" />Created</div>
                  <div className="font-medium truncate">{when(selected.created_at)}</div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Button className="rounded-xl">Create job</Button>
                <Button variant="outline" className="rounded-xl">Create quote</Button>
                <Button variant="outline" className="rounded-xl">Create invoice</Button>
                <Button variant="outline" className="rounded-xl">Open escrow</Button>
              </div>

              <div className="rounded-2xl border bg-muted/10 p-3 text-xs text-muted-foreground">
                Notes: {selected.notes ? selected.notes : "—"}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="rounded-2xl border bg-background p-8 text-center text-sm text-muted-foreground">
                Select a client to view details.
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
