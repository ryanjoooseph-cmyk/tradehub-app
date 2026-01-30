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
  CircleDollarSign,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Search,
  FileText,
  CheckCircle2,
  Timer,
  Receipt,
} from "lucide-react";

type InvStatus = "Draft" | "Sent" | "Overdue" | "Paid";

type Invoice = {
  id: string;
  jobId: string;
  client: string;
  status: InvStatus;
  issued: string;
  due: string;
  total: number;
  escrowHold: number;
  notes: string;
};

const seed: Invoice[] = [
  { id: "INV-2201", jobId: "J-187", client: "Arcadia Body Corporate", status: "Sent", issued: "2026-01-29", due: "2026-02-05", total: 16800, escrowHold: 16800, notes: "Milestone 1 — evidence required before release." },
  { id: "INV-2202", jobId: "J-188", client: "Northpoint Facilities", status: "Draft", issued: "2026-01-30", due: "2026-02-06", total: 5200, escrowHold: 5200, notes: "Pending client approval." },
  { id: "INV-2197", jobId: "J-190", client: "Meridian Property Group", status: "Paid", issued: "2026-01-20", due: "2026-01-27", total: 17800, escrowHold: 0, notes: "Closed out." },
  { id: "INV-2199", jobId: "J-189", client: "Lakeside Owners Assoc", status: "Overdue", issued: "2026-01-22", due: "2026-01-26", total: 9200, escrowHold: 0, notes: "Deposit overdue — job blocked." },
];

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipStatus(s: InvStatus) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Paid") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Paid</span>;
  if (s === "Overdue") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Overdue</span>;
  if (s === "Sent") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Sent</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Draft</span>;
}

export default function InvoicesPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "draft" | "sent" | "overdue" | "paid">("all");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "draft") rows = rows.filter((i) => i.status === "Draft");
    if (scope === "sent") rows = rows.filter((i) => i.status === "Sent");
    if (scope === "overdue") rows = rows.filter((i) => i.status === "Overdue");
    if (scope === "paid") rows = rows.filter((i) => i.status === "Paid");

    if (!s) return rows;
    return rows.filter((i) => `${i.id} ${i.jobId} ${i.client} ${i.status} ${i.issued} ${i.due}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((i) => i.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const total = seed.reduce((a, i) => a + i.total, 0);
    const held = seed.reduce((a, i) => a + i.escrowHold, 0);
    const overdue = seed.filter((i) => i.status === "Overdue").reduce((a, i) => a + i.total, 0);
    const dso = "18d";
    return { total, held, overdue, dso };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle="Billing control: issuance, aging, escrow holds, and rapid closeout."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Export</Button>
            <Button className="rounded-xl"><Receipt className="mr-2 h-4 w-4" />New invoice</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Billed" value={moneyAUD(kpis.total)} icon={<CircleDollarSign className="h-4 w-4" />} />
        <StatCard label="Escrow held" value={moneyAUD(kpis.held)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Overdue" value={moneyAUD(kpis.overdue)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="DSO" value={kpis.dso} icon={<Timer className="h-4 w-4" />} />
        <StatCard label="Invoices" value={String(seed.length)} icon={<FileText className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Invoice registry"
          subtitle="Search, filter, open an invoice, and act."
          toolbar={
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[520px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoices…" className="h-10 rounded-2xl pl-9" />
              </div>
              <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                  <TabsTrigger value="draft" className="rounded-xl">Draft</TabsTrigger>
                  <TabsTrigger value="sent" className="rounded-xl">Sent</TabsTrigger>
                  <TabsTrigger value="overdue" className="rounded-xl">Overdue</TabsTrigger>
                  <TabsTrigger value="paid" className="rounded-xl">Paid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No invoices found" subtitle="Try another filter or create a new invoice." icon={<FileText className="h-5 w-5" />} actionLabel="New invoice" onAction={() => {}} />
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filtered.map((i) => {
                const active = selected?.id === i.id;
                return (
                  <button
                    key={i.id}
                    onClick={() => setSelectedId(i.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border bg-background p-4 transition hover:bg-muted/30",
                      active ? "border-zinc-400/70" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold truncate">{i.id}</div>
                          {chipStatus(i.status)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{i.client} · {i.jobId}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="text-sm font-semibold">{moneyAUD(i.total)}</div>
                        <div className="text-xs text-muted-foreground">Hold {moneyAUD(i.escrowHold)}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border px-2 py-0.5 flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Issued {i.issued}</span>
                      <span className="rounded-full border px-2 py-0.5 flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Due {i.due}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DataTableShell>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Invoice record</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          {!selected ? (
            <div className="p-8 text-sm text-muted-foreground">Select an invoice to view details.</div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xl font-semibold truncate">{selected.id}</div>
                    {chipStatus(selected.status)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.client} · {selected.jobId}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">Send</Button>
                  <Button className="rounded-xl">Open <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.total)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Escrow hold</div>
                  <div className="mt-2 text-lg font-semibold">{moneyAUD(selected.escrowHold)}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="mt-2 text-lg font-semibold">{selected.status}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Dates</div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />Issued</span>
                      <span className="font-semibold">{selected.issued}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />Due</span>
                      <span className="font-semibold">{selected.due}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Controls</div>
                  <Separator className="my-3" />
                  <div className="grid gap-2">
                    <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Escrow actions</Button>
                    <Button variant="outline" className="rounded-xl"><AlertTriangle className="mr-2 h-4 w-4" />Dispute</Button>
                    <Button className="rounded-xl"><CheckCircle2 className="mr-2 h-4 w-4" />Mark paid</Button>
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
