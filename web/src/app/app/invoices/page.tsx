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
  Banknote,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

type Invoice = {
  id: string;
  client: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  escrowHold: number;
  reference?: string | null;
};

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function chipStatus(s: InvoiceStatus) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Paid") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Paid</span>;
  if (s === "Sent") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Sent</span>;
  if (s === "Overdue") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Overdue</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Draft</span>;
}

const seed: Invoice[] = [
  { id: "INV-2401", client: "Arcadia Body Corporate", issueDate: "2026-01-12", dueDate: "2026-01-19", status: "Sent", subtotal: 22000, tax: 2200, total: 24200, escrowHold: 7800, reference: "Stage 1 - Prep + access" },
  { id: "INV-2402", client: "Northpoint Facilities", issueDate: "2026-01-14", dueDate: "2026-01-21", status: "Paid", subtotal: 14600, tax: 1460, total: 16060, escrowHold: 0, reference: "Rope access patch + seal" },
  { id: "INV-2403", client: "Lakeside Owners Assoc", issueDate: "2026-01-06", dueDate: "2026-01-13", status: "Overdue", subtotal: 9200, tax: 920, total: 10120, escrowHold: 0, reference: "Quote deposit" },
  { id: "INV-2404", client: "Meridian Property Group", issueDate: "2026-01-18", dueDate: "2026-01-25", status: "Draft", subtotal: 17800, tax: 1780, total: 19580, escrowHold: 6200, reference: "Interior refresh L12" },
  { id: "INV-2405", client: "Arcadia Body Corporate", issueDate: "2026-01-20", dueDate: "2026-01-27", status: "Sent", subtotal: 26500, tax: 2650, total: 29150, escrowHold: 9800, reference: "Stage 2 - Prime + coat 1" },
];

export default function InvoicesPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "draft" | "sent" | "paid" | "overdue">("all");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "draft") rows = rows.filter((i) => i.status === "Draft");
    if (scope === "sent") rows = rows.filter((i) => i.status === "Sent");
    if (scope === "paid") rows = rows.filter((i) => i.status === "Paid");
    if (scope === "overdue") rows = rows.filter((i) => i.status === "Overdue");

    if (!s) return rows;
    return rows.filter((i) => `${i.id} ${i.client} ${i.status} ${i.issueDate} ${i.dueDate} ${i.reference || ""}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((i) => i.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const total = seed.reduce((a, i) => a + i.total, 0);
    const outstanding = seed.filter((i) => i.status === "Sent" || i.status === "Overdue").reduce((a, i) => a + i.total, 0);
    const paid = seed.filter((i) => i.status === "Paid").reduce((a, i) => a + i.total, 0);
    const escrowHold = seed.reduce((a, i) => a + i.escrowHold, 0);
    const overdue = seed.filter((i) => i.status === "Overdue").length;
    return { total, outstanding, paid, escrowHold, overdue };
  }, []);

  const risk = useMemo(() => {
    if (kpis.overdue > 0) return { sev: "warn", title: "Overdue invoices require action", meta: `${kpis.overdue} invoice(s) overdue` };
    return { sev: "ok", title: "Collections healthy", meta: "No overdue invoices" };
  }, [kpis.overdue]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle="Finance-grade invoicing with escrow-aware controls and clear collections posture."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Export</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />New invoice</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Billed" value={moneyAUD(kpis.total)} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Outstanding" value={moneyAUD(kpis.outstanding)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Paid" value={moneyAUD(kpis.paid)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Escrow held" value={moneyAUD(kpis.escrowHold)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Collections" value={risk.sev === "warn" ? "Attention" : "OK"} icon={<CreditCard className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Invoice register"
          subtitle="Search and filter invoices. Open a record for a finance-grade summary."
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
                  <TabsTrigger value="paid" className="rounded-xl">Paid</TabsTrigger>
                  <TabsTrigger value="overdue" className="rounded-xl">Overdue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No invoices found"
                subtitle="Try a different search or create a new invoice."
                icon={<FileText className="h-5 w-5" />}
                actionLabel="New invoice"
                onAction={() => {}}
              />
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
                        <div className="mt-1 text-xs text-muted-foreground truncate">{i.client}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="text-sm font-semibold">{moneyAUD(i.total)}</div>
                        <div className="text-xs text-muted-foreground">Due {i.dueDate}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border px-2 py-0.5">Issued {i.issueDate}</span>
                      <span className="rounded-full border px-2 py-0.5">Tax {moneyAUD(i.tax)}</span>
                      <span className="rounded-full border px-2 py-0.5">Escrow {moneyAUD(i.escrowHold)}</span>
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
                  <div className="mt-1 text-xs text-muted-foreground">{selected.client}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">PDF</Button>
                  <Button className="rounded-xl">Open invoice <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
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
                  <div className="mt-2">{chipStatus(selected.status)}</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Dates</div>
                    <Badge variant="outline" className="rounded-full">Schedule</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4" />Issued</span>
                      <span className="font-semibold">{selected.issueDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4" />Due</span>
                      <span className="font-semibold">{selected.dueDate}</span>
                    </div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">Next: automated reminders + overdue escalation rules.</div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Breakdown</div>
                    <Badge variant="outline" className="rounded-full">Finance</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Banknote className="h-4 w-4" />Subtotal</span>
                      <span className="font-semibold">{moneyAUD(selected.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><CircleDollarSign className="h-4 w-4" />Tax</span>
                      <span className="font-semibold">{moneyAUD(selected.tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><CreditCard className="h-4 w-4" />Total</span>
                      <span className="font-semibold">{moneyAUD(selected.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Reference</div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.reference || "—"}</div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
