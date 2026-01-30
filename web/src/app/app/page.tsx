"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Briefcase, CalendarDays, CreditCard, ShieldCheck, AlertTriangle, Users, TrendingUp } from "lucide-react";

type Job = {
  id: string;
  title?: string | null;
  status?: string | null;
  scheduled_start?: string | null;
  created_at?: string | null;
};
type Client = { id: string; name?: string | null; full_name?: string | null; email?: string | null; created_at?: string | null; };
type Invoice = { id: string; status?: string | null; total?: number | null; created_at?: string | null; };
type Escrow = { id: string; status?: string | null; amount?: number | null; created_at?: string | null; };

async function jget(path: string) {
  const r = await fetch(path, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as any)?.error || `Failed ${path}`);
  return j as any;
}

function money(n?: number | null) {
  if (!n) return "$0";
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n); }
  catch { return `$${Math.round(n || 0)}`; }
}

function statusPill(kind: "job" | "invoice" | "escrow", s?: string | null) {
  const v = (s || "").toLowerCase();
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (kind === "job") {
    if (v === "completed") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Completed</span>;
    if (v === "in_progress") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>In progress</span>;
    if (v === "blocked") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Blocked</span>;
    return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Scheduled</span>;
  }
  if (kind === "invoice") {
    if (v === "paid") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Paid</span>;
    if (v === "overdue") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-700")}>Overdue</span>;
    if (v === "sent") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Sent</span>;
    return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Draft</span>;
  }
  if (v === "released") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Released</span>;
  if (v === "disputed") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Disputed</span>;
  if (v === "funded") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Funded</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Created</span>;
}

function safeName(c: Client) {
  return c.name?.trim() || c.full_name?.trim() || (c.email ? c.email.split("@")[0] : "") || `Client ${c.id}`;
}

function t(d?: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [escrow, setEscrow] = useState<Escrow[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const [j, c, i, e] = await Promise.all([
          jget("/api/jobs"),
          jget("/api/clients"),
          jget("/api/invoices"),
          jget("/api/escrow"),
        ]);
        if (!mounted) return;
        setJobs((j.jobs || j.rows || []) as Job[]);
        setClients((c.clients || c.rows || []) as Client[]);
        setInvoices((i.invoices || i.rows || []) as Invoice[]);
        setEscrow((e.escrow || e.rows || []) as Escrow[]);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const kpis = useMemo(() => {
    const totalJobs = jobs.length;
    const inProgress = jobs.filter(x => (x.status || "").toLowerCase() === "in_progress").length;
    const blocked = jobs.filter(x => (x.status || "").toLowerCase() === "blocked").length;

    const totalClients = clients.length;

    const invoiceTotal = invoices.reduce((a, x) => a + (Number(x.total) || 0), 0);
    const overdue = invoices.filter(x => (x.status || "").toLowerCase() === "overdue").length;

    const escrowTotal = escrow.reduce((a, x) => a + (Number(x.amount) || 0), 0);
    const disputed = escrow.filter(x => (x.status || "").toLowerCase() === "disputed").length;

    return { totalJobs, inProgress, blocked, totalClients, invoiceTotal, overdue, escrowTotal, disputed };
  }, [jobs, clients, invoices, escrow]);

  const topJobs = useMemo(() => jobs.slice().sort((a,b) => (new Date(b.created_at||0).getTime()) - (new Date(a.created_at||0).getTime())).slice(0, 6), [jobs]);
  const topClients = useMemo(() => clients.slice().sort((a,b) => (new Date(b.created_at||0).getTime()) - (new Date(a.created_at||0).getTime())).slice(0, 6), [clients]);
  const topInvoices = useMemo(() => invoices.slice().sort((a,b) => (new Date(b.created_at||0).getTime()) - (new Date(a.created_at||0).getTime())).slice(0, 6), [invoices]);
  const topEscrow = useMemo(() => escrow.slice().sort((a,b) => (new Date(b.created_at||0).getTime()) - (new Date(a.created_at||0).getTime())).slice(0, 6), [escrow]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Executive cockpit: work-in-flight, cashflow, escrow risk, and team throughput."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Download report</Button>
            <Button className="rounded-xl"><TrendingUp className="mr-2 h-4 w-4" />Insights</Button>
          </>
        }
      />

      {err ? (
        <div className="rounded-2xl border border-red-200 bg-background p-6 text-sm text-red-700">{err}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard label="Jobs" value={String(kpis.totalJobs)} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="In progress" value={String(kpis.inProgress)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Clients" value={String(kpis.totalClients)} icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard label="Invoiced" value={money(kpis.invoiceTotal)} icon={<CreditCard className="h-4 w-4" />} />
        <StatCard label="Overdue invoices" value={String(kpis.overdue)} />
        <StatCard label="Escrow balance" value={money(kpis.escrowTotal)} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Escrow disputes" value={String(kpis.disputed)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b bg-background px-4 py-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Work in flight</div>
              <div className="text-xs text-muted-foreground">Newest jobs, operational status, next action.</div>
            </div>
            <Button variant="outline" className="rounded-xl">Open Jobs <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </div>
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : topJobs.length === 0 ? (
              <div className="rounded-2xl border bg-muted/10 p-8 text-center text-sm text-muted-foreground">No jobs yet.</div>
            ) : (
              topJobs.map((j) => (
                <div key={j.id} className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{j.title?.trim() || `Job ${j.id}`}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Created: {t(j.created_at)}{j.scheduled_start ? ` · Scheduled: ${t(j.scheduled_start)}` : ""}</div>
                    </div>
                    {statusPill("job", j.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b bg-background px-4 py-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Cashflow & escrow</div>
              <div className="text-xs text-muted-foreground">Invoices and escrow snapshots. Risk first.</div>
            </div>
            <Button variant="outline" className="rounded-xl">Open Escrow <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-background p-3">
                <div className="text-xs text-muted-foreground">Invoices</div>
                <div className="mt-1 text-lg font-semibold">{money(kpis.invoiceTotal)}</div>
                <div className="mt-1 text-xs text-muted-foreground">{kpis.overdue} overdue</div>
              </div>
              <div className="rounded-2xl border bg-background p-3">
                <div className="text-xs text-muted-foreground">Escrow</div>
                <div className="mt-1 text-lg font-semibold">{money(kpis.escrowTotal)}</div>
                <div className="mt-1 text-xs text-muted-foreground">{kpis.disputed} disputes</div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Latest invoices</div>
                {topInvoices.length === 0 ? (
                  <div className="rounded-2xl border bg-muted/10 p-6 text-center text-xs text-muted-foreground">No invoices yet.</div>
                ) : (
                  topInvoices.map((i) => (
                    <div key={i.id} className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{i.id}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{t(i.created_at)}</div>
                        </div>
                        {statusPill("invoice", i.status)}
                      </div>
                      <div className="mt-2 text-sm">{money(i.total)}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Latest escrow</div>
                {topEscrow.length === 0 ? (
                  <div className="rounded-2xl border bg-muted/10 p-6 text-center text-xs text-muted-foreground">No escrow yet.</div>
                ) : (
                  topEscrow.map((e) => (
                    <div key={e.id} className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{e.id}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{t(e.created_at)}</div>
                        </div>
                        {statusPill("escrow", e.status)}
                      </div>
                      <div className="mt-2 text-sm">{money(e.amount)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b bg-background px-4 py-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Recent clients</div>
              <div className="text-xs text-muted-foreground">New clients added recently.</div>
            </div>
            <Button variant="outline" className="rounded-xl">Open Clients <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </div>
          <div className="p-4 grid gap-3 md:grid-cols-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : topClients.length === 0 ? (
              <div className="rounded-2xl border bg-muted/10 p-8 text-center text-sm text-muted-foreground md:col-span-3">No clients yet.</div>
            ) : (
              topClients.map((c) => (
                <div key={c.id} className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{safeName(c)}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{c.email || "—"}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Created: {t(c.created_at)}</div>
                    </div>
                    <Badge variant="outline" className="rounded-full">{c.id}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
