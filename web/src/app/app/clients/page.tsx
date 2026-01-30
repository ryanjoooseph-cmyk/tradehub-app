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
  Search,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Receipt,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

type Risk = "Low" | "Medium" | "High";
type Tier = "Standard" | "Preferred" | "Enterprise";

type Client = {
  id: string;
  name: string;
  tier: Tier;
  risk: Risk;
  email: string;
  phone: string;
  address: string;
  jobsActive: number;
  jobsTotal: number;
  invoicesOpen: number;
  overdueAmount: number;
  escrowHeld: number;
  lifetimeValue: number;
  notes: string;
};

const seed: Client[] = [
  {
    id: "C-042",
    name: "Arcadia Body Corporate",
    tier: "Enterprise",
    risk: "Low",
    email: "ops@arcadiabc.com",
    phone: "+61 4xx xxx xxx",
    address: "Brisbane CBD — Tower A",
    jobsActive: 2,
    jobsTotal: 14,
    invoicesOpen: 2,
    overdueAmount: 0,
    escrowHeld: 16800,
    lifetimeValue: 242000,
    notes: "High frequency. Requires photo evidence + milestone signoff. Strong payer.",
  },
  {
    id: "C-061",
    name: "Northpoint Facilities",
    tier: "Preferred",
    risk: "Medium",
    email: "accounts@northpoint.com.au",
    phone: "+61 4xx xxx xxx",
    address: "Newstead — Lot 14",
    jobsActive: 1,
    jobsTotal: 6,
    invoicesOpen: 1,
    overdueAmount: 5200,
    escrowHeld: 5200,
    lifetimeValue: 78000,
    notes: "Needs faster comms + automatic reminders. Watch overdue.",
  },
  {
    id: "C-018",
    name: "Lakeside Owners Assoc",
    tier: "Standard",
    risk: "High",
    email: "manager@lakesideoa.org",
    phone: "+61 4xx xxx xxx",
    address: "Southbank — Building C",
    jobsActive: 1,
    jobsTotal: 3,
    invoicesOpen: 1,
    overdueAmount: 9200,
    escrowHeld: 0,
    lifetimeValue: 29500,
    notes: "Dispute-prone. Require deposit in escrow before commencement.",
  },
  {
    id: "C-074",
    name: "Meridian Property Group",
    tier: "Preferred",
    risk: "Low",
    email: "admin@meridianpg.com",
    phone: "+61 4xx xxx xxx",
    address: "Hamilton — Riverfront",
    jobsActive: 0,
    jobsTotal: 9,
    invoicesOpen: 0,
    overdueAmount: 0,
    escrowHeld: 0,
    lifetimeValue: 131000,
    notes: "Clean history. Good referral channel.",
  },
];

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipTier(t: Tier) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (t === "Enterprise") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Enterprise</span>;
  if (t === "Preferred") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Preferred</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Standard</span>;
}

function chipRisk(r: Risk) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (r === "High") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>High risk</span>;
  if (r === "Medium") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Medium risk</span>;
  return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Low risk</span>;
}

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "enterprise" | "preferred" | "standard" | "risk">("all");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "enterprise") rows = rows.filter((c) => c.tier === "Enterprise");
    if (scope === "preferred") rows = rows.filter((c) => c.tier === "Preferred");
    if (scope === "standard") rows = rows.filter((c) => c.tier === "Standard");
    if (scope === "risk") rows = rows.filter((c) => c.risk !== "Low");

    if (!s) return rows;
    return rows.filter((c) => `${c.id} ${c.name} ${c.email} ${c.phone} ${c.address} ${c.tier} ${c.risk}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((c) => c.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const total = seed.length;
    const enterprise = seed.filter((c) => c.tier === "Enterprise").length;
    const atRisk = seed.filter((c) => c.risk !== "Low").length;
    const overdue = seed.reduce((a, c) => a + c.overdueAmount, 0);
    const escrow = seed.reduce((a, c) => a + c.escrowHeld, 0);
    return { total, enterprise, atRisk, overdue, escrow };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="CRM-grade client intelligence: revenue, risk, escrow, jobs, and collections—one view."
        right={
          <>
            <Button variant="outline" className="rounded-xl"><Receipt className="mr-2 h-4 w-4" />Statements</Button>
            <Button className="rounded-xl"><Users className="mr-2 h-4 w-4" />New client</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Clients" value={String(kpis.total)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Enterprise" value={String(kpis.enterprise)} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="At-risk" value={String(kpis.atRisk)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Overdue" value={moneyAUD(kpis.overdue)} icon={<Receipt className="h-4 w-4" />} />
        <StatCard label="Escrow held" value={moneyAUD(kpis.escrow)} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Client portfolio"
          subtitle="Search, segment, and drill in. Built for real ops + collections."
          toolbar={
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[520px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients…" className="h-10 rounded-2xl pl-9" />
              </div>

              <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                  <TabsTrigger value="enterprise" className="rounded-xl">Enterprise</TabsTrigger>
                  <TabsTrigger value="preferred" className="rounded-xl">Preferred</TabsTrigger>
                  <TabsTrigger value="standard" className="rounded-xl">Standard</TabsTrigger>
                  <TabsTrigger value="risk" className="rounded-xl">Risk</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No clients found"
                subtitle="Try another filter or create a new client."
                icon={<Users className="h-5 w-5" />}
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
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold truncate">{c.name}</div>
                          <span className="rounded-full border px-2 py-0.5 text-xs">{c.id}</span>
                          {chipTier(c.tier)}
                          {chipRisk(c.risk)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{c.address}</div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="text-sm font-semibold">{moneyAUD(c.lifetimeValue)}</div>
                        <div className="text-xs text-muted-foreground">LTV</div>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-xl border bg-muted/10 p-2">
                        <div className="text-muted-foreground">Active jobs</div>
                        <div className="mt-1 font-semibold">{c.jobsActive}</div>
                      </div>
                      <div className="rounded-xl border bg-muted/10 p-2">
                        <div className="text-muted-foreground">Open invoices</div>
                        <div className="mt-1 font-semibold">{c.invoicesOpen}</div>
                      </div>
                      <div className="rounded-xl border bg-muted/10 p-2">
                        <div className="text-muted-foreground">Overdue</div>
                        <div className="mt-1 font-semibold">{moneyAUD(c.overdueAmount)}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DataTableShell>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Client dossier</div>
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
                    <span className="rounded-full border px-2 py-0.5 text-xs">{selected.id}</span>
                    {chipTier(selected.tier)}
                    {chipRisk(selected.risk)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.address}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">Open jobs</Button>
                  <Button className="rounded-xl">Open <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Lifetime value</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.lifetimeValue)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Escrow held</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.escrowHeld)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Open invoices</div>
                  <div className="mt-2 text-lg font-semibold">{selected.invoicesOpen}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Active jobs</div>
                  <div className="mt-2 text-lg font-semibold">{selected.jobsActive}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Contacts</div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" />Email</span>
                      <span className="font-semibold">{selected.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" />Phone</span>
                      <span className="font-semibold">{selected.phone}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4 mt-0.5" />Address</span>
                      <span className="font-semibold text-right">{selected.address}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Ops posture</div>
                  <Separator className="my-3" />
                  <div className="grid gap-2">
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><ClipboardList className="h-4 w-4" />Jobs total</div>
                      <div className="font-semibold">{selected.jobsTotal}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><Receipt className="h-4 w-4" />Overdue</div>
                      <div className="font-semibold">{moneyAUD(selected.overdueAmount)}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4" />LTV</div>
                      <div className="font-semibold">{moneyAUD(selected.lifetimeValue)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Notes</div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.notes}</div>
              </div>

              <div className="grid gap-2 md:grid-cols-4">
                <Button variant="outline" className="rounded-xl"><Receipt className="mr-2 h-4 w-4" />Invoices</Button>
                <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Escrow</Button>
                <Button variant="outline" className="rounded-xl"><ClipboardList className="mr-2 h-4 w-4" />Jobs</Button>
                <Button className="rounded-xl"><Users className="mr-2 h-4 w-4" />Invite portal</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
