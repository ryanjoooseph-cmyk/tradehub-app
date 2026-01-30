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
  ShieldCheck,
  CircleDollarSign,
  AlertTriangle,
  Search,
  Scale,
  Lock,
  Unlock,
  FileWarning,
  History,
} from "lucide-react";

type EscrowState = "Held" | "Releasing" | "Released" | "Disputed";

type Escrow = {
  id: string;
  jobId: string;
  client: string;
  state: EscrowState;
  amount: number;
  lastEvent: string;
  risk: "Low" | "Medium" | "High";
  notes: string;
};

const seed: Escrow[] = [
  { id: "ESC-9001", jobId: "J-187", client: "Arcadia Body Corporate", state: "Held", amount: 16800, lastEvent: "Evidence requested (milestone 1)", risk: "Medium", notes: "Release requires photo pack + signoff." },
  { id: "ESC-9002", jobId: "J-188", client: "Northpoint Facilities", state: "Held", amount: 5200, lastEvent: "Invoice drafted", risk: "Low", notes: "Auto-release on completion signoff." },
  { id: "ESC-8997", jobId: "J-190", client: "Meridian Property Group", state: "Released", amount: 0, lastEvent: "Closeout complete", risk: "Low", notes: "Archived." },
  { id: "ESC-8999", jobId: "J-189", client: "Lakeside Owners Assoc", state: "Disputed", amount: 9200, lastEvent: "Deposit disputed / unpaid", risk: "High", notes: "Blocked. Requires ops intervention + communication log." },
];

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipState(s: EscrowState) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Held") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Held</span>;
  if (s === "Releasing") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Releasing</span>;
  if (s === "Released") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Released</span>;
  return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Disputed</span>;
}

function chipRisk(r: Escrow["risk"]) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (r === "High") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>High risk</span>;
  if (r === "Medium") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Medium risk</span>;
  return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Low risk</span>;
}

export default function EscrowPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "held" | "disputed" | "released">("all");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "held") rows = rows.filter((e) => e.state === "Held" || e.state === "Releasing");
    if (scope === "disputed") rows = rows.filter((e) => e.state === "Disputed");
    if (scope === "released") rows = rows.filter((e) => e.state === "Released");

    if (!s) return rows;
    return rows.filter((e) => `${e.id} ${e.jobId} ${e.client} ${e.state} ${e.risk} ${e.lastEvent}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((e) => e.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const held = seed.filter((e) => e.state === "Held" || e.state === "Releasing").reduce((a, e) => a + e.amount, 0);
    const disputed = seed.filter((e) => e.state === "Disputed").reduce((a, e) => a + e.amount, 0);
    const total = seed.reduce((a, e) => a + e.amount, 0);
    const riskHigh = seed.filter((e) => e.risk === "High").length;
    return { held, disputed, total, riskHigh };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow"
        subtitle="Funds control tower: holds, releases, disputes, and audit-grade traceability."
        right={
          <>
            <Button variant="outline" className="rounded-xl"><History className="mr-2 h-4 w-4" />Audit</Button>
            <Button className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />New hold</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Total escrow" value={moneyAUD(kpis.total)} icon={<CircleDollarSign className="h-4 w-4" />} />
        <StatCard label="Held" value={moneyAUD(kpis.held)} icon={<Lock className="h-4 w-4" />} />
        <StatCard label="Disputed" value={moneyAUD(kpis.disputed)} icon={<Scale className="h-4 w-4" />} />
        <StatCard label="High risk" value={String(kpis.riskHigh)} icon={<FileWarning className="h-4 w-4" />} />
        <StatCard label="Cases" value={String(seed.length)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Escrow cases"
          subtitle="Search, filter, open a case, and execute releases."
          toolbar={
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[520px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search escrow…" className="h-10 rounded-2xl pl-9" />
              </div>
              <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                  <TabsTrigger value="held" className="rounded-xl">Held</TabsTrigger>
                  <TabsTrigger value="disputed" className="rounded-xl">Disputed</TabsTrigger>
                  <TabsTrigger value="released" className="rounded-xl">Released</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No escrow cases" subtitle="Try another filter or create a new hold." icon={<ShieldCheck className="h-5 w-5" />} actionLabel="New hold" onAction={() => {}} />
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filtered.map((e) => {
                const active = selected?.id === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border bg-background p-4 transition hover:bg-muted/30",
                      active ? "border-zinc-400/70" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold truncate">{e.id}</div>
                          {chipState(e.state)}
                          {chipRisk(e.risk)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{e.client} · {e.jobId}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="text-sm font-semibold">{moneyAUD(e.amount)}</div>
                        <div className="text-xs text-muted-foreground">{e.state === "Released" ? "Released" : "On hold"}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="text-xs text-muted-foreground truncate">{e.lastEvent}</div>
                  </button>
                );
              })}
            </div>
          )}
        </DataTableShell>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Escrow record</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          {!selected ? (
            <div className="p-8 text-sm text-muted-foreground">Select a case to view details.</div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xl font-semibold truncate">{selected.id}</div>
                    {chipState(selected.state)}
                    {chipRisk(selected.risk)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.client} · {selected.jobId}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl"><Unlock className="mr-2 h-4 w-4" />Release</Button>
                  <Button className="rounded-xl">Open <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.amount)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">State</div>
                  <div className="mt-2 text-lg font-semibold">{selected.state}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <div className="mt-2 text-lg font-semibold">{selected.risk}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Last event</div>
                  <Separator className="my-3" />
                  <div className="text-sm text-muted-foreground">{selected.lastEvent}</div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Controls</div>
                  <Separator className="my-3" />
                  <div className="grid gap-2">
                    <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Require evidence</Button>
                    <Button variant="outline" className="rounded-xl"><Scale className="mr-2 h-4 w-4" />Open dispute</Button>
                    <Button className="rounded-xl"><Unlock className="mr-2 h-4 w-4" />Execute release</Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Notes</div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.notes}</div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
