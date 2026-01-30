"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { EmptyState } from "@/components/premium/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Building2,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  Briefcase,
  Receipt,
  MapPin,
} from "lucide-react";

type ClientTier = "Standard" | "Priority" | "Enterprise";
type ClientStatus = "Active" | "On hold" | "Inactive";

type Client = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  tier: ClientTier;
  status: ClientStatus;
  address?: string | null;
  createdAt: string;
  lifetimeValue: number;
  openJobs: number;
  unpaidInvoices: number;
  escrowExposure: number;
  notes?: string | null;
};

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipTier(t: ClientTier) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (t === "Enterprise") return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-800")}>Enterprise</span>;
  if (t === "Priority") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Priority</span>;
  return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Standard</span>;
}

function chipStatus(s: ClientStatus) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Active") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Active</span>;
  if (s === "On hold") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>On hold</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Inactive</span>;
}

const seed: Client[] = [
  {
    id: "C-001",
    name: "Arcadia Body Corporate",
    email: "admin@arcadia.com.au",
    phone: "+61 4 1111 2222",
    tier: "Enterprise",
    status: "Active",
    address: "Brisbane, QLD",
    createdAt: "2025-11-18",
    lifetimeValue: 214000,
    openJobs: 4,
    unpaidInvoices: 2,
    escrowExposure: 68400,
    notes: "Multi-site strata. Prefers staged releases on milestones. Requires COI before access.",
  },
  {
    id: "C-002",
    name: "Northpoint Facilities",
    email: "ops@northpoint.au",
    phone: "+61 4 3333 4444",
    tier: "Priority",
    status: "Active",
    address: "Gold Coast, QLD",
    createdAt: "2025-12-02",
    lifetimeValue: 78000,
    openJobs: 2,
    unpaidInvoices: 1,
    escrowExposure: 19200,
    notes: "Fast approval. Wants photo evidence in job closeout pack.",
  },
  {
    id: "C-003",
    name: "Lakeside Owners Assoc",
    email: "committee@lakeside.org.au",
    phone: null,
    tier: "Standard",
    status: "On hold",
    address: "Sunshine Coast, QLD",
    createdAt: "2026-01-05",
    lifetimeValue: 19000,
    openJobs: 1,
    unpaidInvoices: 3,
    escrowExposure: 0,
    notes: "Hold: awaiting payment clearance. Do not schedule new work until resolved.",
  },
  {
    id: "C-004",
    name: "Meridian Property Group",
    email: "accounts@meridian.com.au",
    phone: "+61 4 5555 6666",
    tier: "Priority",
    status: "Active",
    address: "Brisbane, QLD",
    createdAt: "2025-09-22",
    lifetimeValue: 126000,
    openJobs: 3,
    unpaidInvoices: 0,
    escrowExposure: 35400,
    notes: "Pays on time. Prefers consolidated monthly invoicing.",
  },
  {
    id: "C-005",
    name: "Beacon Commercial",
    email: "admin@beaconcommercial.au",
    phone: "+61 4 7777 8888",
    tier: "Standard",
    status: "Inactive",
    address: "Brisbane, QLD",
    createdAt: "2024-12-10",
    lifetimeValue: 42000,
    openJobs: 0,
    unpaidInvoices: 0,
    escrowExposure: 0,
    notes: "Dormant account. Re-engage quarterly.",
  },
];

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "active" | "hold" | "inactive">("all");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "active") rows = rows.filter((c) => c.status === "Active");
    if (scope === "hold") rows = rows.filter((c) => c.status === "On hold");
    if (scope === "inactive") rows = rows.filter((c) => c.status === "Inactive");

    if (!s) return rows;
    return rows.filter((c) => `${c.id} ${c.name} ${c.email || ""} ${c.phone || ""} ${c.tier} ${c.status} ${c.address || ""}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((c) => c.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const total = seed.length;
    const active = seed.filter((c) => c.status === "Active").length;
    const exposure = seed.reduce((a, c) => a + c.escrowExposure, 0);
    const ltv = seed.reduce((a, c) => a + c.lifetimeValue, 0);
    const jobs = seed.reduce((a, c) => a + c.openJobs, 0);
    return { total, active, exposure, ltv, jobs };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="CRM-grade client control: trust tiering, exposure, and operational context."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Import</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New client</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Clients" value={String(kpis.total)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active" value={String(kpis.active)} icon={<Star className="h-4 w-4" />} />
        <StatCard label="Open jobs" value={String(kpis.jobs)} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Escrow exposure" value={moneyAUD(kpis.exposure)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Lifetime value" value={moneyAUD(kpis.ltv)} icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Client directory"
          subtitle="Search, filter, and open a client record instantly."
          toolbar={
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[520px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients…" className="h-10 rounded-2xl pl-9" />
              </div>
              <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                  <TabsTrigger value="active" className="rounded-xl">Active</TabsTrigger>
                  <TabsTrigger value="hold" className="rounded-xl">On hold</TabsTrigger>
                  <TabsTrigger value="inactive" className="rounded-xl">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No clients found"
                subtitle="Try a different search or create a new client."
                icon={<Building2 className="h-5 w-5" />}
                actionLabel="New client"
                onAction={() => {}}
              />
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filtered.map((c) => {
                const active = selected?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border bg-background p-4 transition hover:bg-muted/30",
                      active ? "border-zinc-400/70" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold truncate">{c.name}</div>
                          {chipTier(c.tier)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{c.id} · {c.address || "—"}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {chipStatus(c.status)}
                        <div className="text-xs text-muted-foreground">{moneyAUD(c.lifetimeValue)}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border px-2 py-0.5">{c.openJobs} jobs</span>
                      <span className="rounded-full border px-2 py-0.5">{c.unpaidInvoices} unpaid</span>
                      <span className="rounded-full border px-2 py-0.5">Exposure {moneyAUD(c.escrowExposure)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DataTableShell>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Client record</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          {!selected ? (
            <div className="p-8 text-sm text-muted-foreground">Select a client to view details.</div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xl font-semibold truncate">{selected.name}</div>
                    {chipTier(selected.tier)}
                    {chipStatus(selected.status)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.id} · Created {selected.createdAt}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">Edit</Button>
                  <Button className="rounded-xl">Open profile <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Lifetime value</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.lifetimeValue)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Escrow exposure</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.escrowExposure)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Unpaid invoices</div>
                  <div className="mt-2 text-lg font-semibold">{selected.unpaidInvoices}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Contacts</div>
                    <Badge variant="outline" className="rounded-full">Primary</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><span className="text-foreground">{selected.email || "—"}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><span className="text-foreground">{selected.phone || "—"}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span className="text-foreground">{selected.address || "—"}</span></div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Operational context</div>
                    <Badge variant="outline" className="rounded-full">Live</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Open jobs</span>
                      <span className="font-semibold">{selected.openJobs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Unpaid invoices</span>
                      <span className="font-semibold">{selected.unpaidInvoices}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Escrow exposure</span>
                      <span className="font-semibold">{moneyAUD(selected.escrowExposure)}</span>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl w-full"><Receipt className="mr-2 h-4 w-4" />Invoices</Button>
                      <Button className="rounded-xl w-full"><Briefcase className="mr-2 h-4 w-4" />Jobs</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Notes</div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.notes || "—"}</div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
