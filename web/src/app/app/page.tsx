"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { moneyAUD } from "@/lib/types/money";

type ApiOk<T> = { ok: true } & T;

type Client = { id: string; name?: string; email?: string; created_at?: string };
type Invoice = { id: string; number: string; client: string; status: "Draft" | "Sent" | "Paid" | "Overdue"; amountCents: number; createdAt: string; dueAt: string };
type Escrow = { id: string; jobId: string; jobTitle: string; client: string; status: string; totalCents: number; heldCents: number; releasedCents: number; createdAt: string };
type Job = any;

function toneInvoice(s: Invoice["status"]) {
  if (s === "Paid") return "good";
  if (s === "Overdue") return "bad";
  if (s === "Sent") return "info";
  return "neutral";
}

function toneEscrow(s: string) {
  if (s === "Released") return "good";
  if (s === "Funded") return "info";
  if (s === "On Hold") return "bad";
  if (s === "Partially Released") return "warn";
  return "neutral";
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
  return json as T;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [c, i, e, j] = await Promise.all([
          getJSON<ApiOk<{ clients: Client[] }>>("/api/clients"),
          getJSON<ApiOk<{ invoices: Invoice[] }>>("/api/invoices"),
          getJSON<ApiOk<{ escrows: Escrow[] }>>("/api/escrow"),
          getJSON<any>("/api/jobs"),
        ]);

        const jobsArr = Array.isArray((j as any)?.jobs) ? (j as any).jobs : Array.isArray(j) ? (j as any) : [];

        if (!mounted) return;
        setClients(c.clients || []);
        setInvoices(i.invoices || []);
        setEscrows(e.escrows || []);
        setJobs(jobsArr);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const kpis = useMemo(() => {
    const totalClients = clients.length;

    const totalInvoices = invoices.length;
    const overdueCents = invoices.filter((x) => x.status === "Overdue").reduce((a, x) => a + (x.amountCents || 0), 0);
    const receivableCents = invoices
      .filter((x) => x.status === "Sent" || x.status === "Overdue")
      .reduce((a, x) => a + (x.amountCents || 0), 0);

    const escrowHeld = escrows.reduce((a, x) => a + (x.heldCents || 0), 0);
    const escrowOnHold = escrows.filter((x) => x.status === "On Hold").reduce((a, x) => a + (x.heldCents || 0), 0);

    const totalJobs = jobs.length;
    const jobsByStatus: Record<string, number> = {};
    for (const j of jobs) {
      const s = String((j as any)?.status || "unknown");
      jobsByStatus[s] = (jobsByStatus[s] || 0) + 1;
    }

    return {
      totalClients,
      totalInvoices,
      overdueCents,
      receivableCents,
      escrowHeld,
      escrowOnHold,
      totalJobs,
      jobsByStatus,
    };
  }, [clients, invoices, escrows, jobs]);

  const recentInvoices = useMemo(() => {
    return invoices.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  }, [invoices]);

  const hotEscrows = useMemo(() => {
    return escrows
      .slice()
      .sort((a, b) => (b.heldCents || 0) - (a.heldCents || 0))
      .slice(0, 8);
  }, [escrows]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="text-2xl font-semibold tracking-tight">Dashboard</div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-sm text-neutral-600">Loading…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="space-y-5">
        <div className="text-2xl font-semibold tracking-tight">Dashboard</div>
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-sm text-red-700">{err}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Dashboard</div>
        <div className="mt-1 text-sm text-neutral-600">Live KPIs from your Supabase-backed APIs.</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Clients</div>
          <div className="mt-2 text-2xl font-semibold">{kpis.totalClients}</div>
          <div className="mt-2 text-xs text-neutral-500">Total active records</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Jobs</div>
          <div className="mt-2 text-2xl font-semibold">{kpis.totalJobs}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(kpis.jobsByStatus)
              .slice(0, 4)
              .map(([s, n]) => (
                <Badge key={s} tone="neutral">
                  {s}: {n}
                </Badge>
              ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Receivables</div>
          <div className="mt-2 text-2xl font-semibold">{moneyAUD(kpis.receivableCents)}</div>
          <div className="mt-2 text-xs text-neutral-500">Sent + overdue</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Overdue</div>
          <div className="mt-2 text-2xl font-semibold">{moneyAUD(kpis.overdueCents)}</div>
          <div className="mt-2 text-xs text-neutral-500">Immediate follow-up</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Escrow held</div>
          <div className="mt-2 text-2xl font-semibold">{moneyAUD(kpis.escrowHeld)}</div>
          <div className="mt-2 text-xs text-neutral-500">Funds in-flight</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Escrow on hold</div>
          <div className="mt-2 text-2xl font-semibold">{moneyAUD(kpis.escrowOnHold)}</div>
          <div className="mt-2 text-xs text-neutral-500">Risk / disputes</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:col-span-2">
          <div className="text-xs font-medium text-neutral-600">System health</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="good">API: OK</Badge>
            <Badge tone="good">DB: OK</Badge>
            <Badge tone="neutral">Build: OK</Badge>
          </div>
          <div className="mt-3 text-xs text-neutral-500">Next: alerts + anomaly detection on escrow and receivables.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="border-b border-neutral-200 px-4 py-3">
            <div className="text-sm font-semibold">Recent invoices</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-neutral-500 bg-neutral-50">
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left font-medium">Invoice</th>
                  <th className="px-4 py-3 text-left font-medium">Client</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentInvoices.map((i) => (
                  <tr key={i.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium">{i.number}</td>
                    <td className="px-4 py-3">{i.client}</td>
                    <td className="px-4 py-3">
                      <Badge tone={toneInvoice(i.status)}>{i.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{moneyAUD(i.amountCents)}</td>
                  </tr>
                ))}
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-sm text-neutral-500" colSpan={4}>
                      No invoices yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="border-b border-neutral-200 px-4 py-3">
            <div className="text-sm font-semibold">Largest escrows</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-neutral-500 bg-neutral-50">
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left font-medium">Escrow</th>
                  <th className="px-4 py-3 text-left font-medium">Job</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Held</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {hotEscrows.map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium">{e.id}</td>
                    <td className="px-4 py-3">{e.jobTitle}</td>
                    <td className="px-4 py-3">
                      <Badge tone={toneEscrow(e.status)}>{e.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{moneyAUD(e.heldCents)}</td>
                  </tr>
                ))}
                {hotEscrows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-sm text-neutral-500" colSpan={4}>
                      No escrow records yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
