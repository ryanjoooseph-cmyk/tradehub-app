"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InvoiceDrawer, type InvoiceRow } from "@/components/invoices/invoice-drawer";

const now = Date.now();
const demoInvoices: InvoiceRow[] = [
  { id: "inv_001", number: "INV-0001", client: "ACME Body Corporate", status: "Paid", amountCents: 184500, createdAt: new Date(now - 86400000 * 18).toISOString(), dueAt: new Date(now - 86400000 * 6).toISOString(), note: "Paid via bank transfer." },
  { id: "inv_002", number: "INV-0002", client: "Brightline Constructions", status: "Overdue", amountCents: 975000, createdAt: new Date(now - 86400000 * 20).toISOString(), dueAt: new Date(now - 86400000 * 3).toISOString(), note: "Overdue. Require escrow for next job." },
  { id: "inv_003", number: "INV-0003", client: "Ryan Joseph", status: "Sent", amountCents: 262500, createdAt: new Date(now - 86400000 * 3).toISOString(), dueAt: new Date(now + 86400000 * 10).toISOString() },
];

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

function tone(status: InvoiceRow["status"]) {
  if (status === "Paid") return "good";
  if (status === "Overdue") return "bad";
  if (status === "Sent") return "info";
  return "neutral";
}

export default function InvoicesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<InvoiceRow["status"] | "All">("All");
  const [selected, setSelected] = useState<InvoiceRow | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return demoInvoices
      .filter((i) => (status === "All" ? true : i.status === status))
      .filter((i) => {
        if (!needle) return true;
        return i.number.toLowerCase().includes(needle) || i.client.toLowerCase().includes(needle);
      })
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [q, status]);

  const totals = useMemo(() => {
    const total = rows.reduce((a, r) => a + r.amountCents, 0);
    const overdue = rows.filter((r) => r.status === "Overdue").reduce((a, r) => a + r.amountCents, 0);
    return { total, overdue };
  }, [rows]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Invoices</div>
          <div className="mt-1 text-sm text-neutral-600">Collections control: aging, status, and actions.</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Visible total</div>
            <div className="text-sm font-semibold">{money(totals.total)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <div className="text-[11px] text-neutral-500">Visible overdue</div>
            <div className="text-sm font-semibold">{money(totals.overdue)}</div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={() => alert("Next: create invoice flow backed by Supabase + Stripe")}
          >
            New invoice
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search invoices..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm">
              <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
              <select className="bg-transparent outline-none" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option>All</option>
                <option>Draft</option>
                <option>Sent</option>
                <option>Paid</option>
                <option>Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500 bg-neutral-50">
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-medium">Invoice</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Due</th>
                <th className="px-4 py-3 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((i) => (
                <tr
                  key={i.id}
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => {
                    setSelected(i);
                    setOpen(true);
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{i.number}</div>
                    <div className="mt-1 text-xs text-neutral-500">{i.id}</div>
                  </td>
                  <td className="px-4 py-3">{i.client}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(i.status)}>{i.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{money(i.amountCents)}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">{new Date(i.dueAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">{new Date(i.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-sm text-neutral-500" colSpan={6}>
                    No invoices match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceDrawer invoice={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
