"use client";

import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type InvoiceRow = {
  id: string;
  number: string;
  client: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  amountCents: number;
  createdAt: string;
  dueAt: string;
  note?: string;
};

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

const tone = (status: string): "default" | "success" | "warn" | "danger" => {
  const t = (status || "").toLowerCase();
  if (/(complete|completed|done|paid|success|approved|active)/.test(t)) return "success";
  if (/(dispute|overdue|failed|fail|cancel|cancelled|rejected|error|blocked)/.test(t)) return "danger";
  if (/(await|awaiting|in progress|scheduled|pending|hold|review|processing|draft)/.test(t)) return "warn";
  return "default";
};
export function InvoiceDrawer({
  invoice,
  open,
  onClose,
}: {
  invoice: InvoiceRow | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!invoice) {
    return (
      <Dialog open={open} onClose={onClose} title="Invoice" widthClass="max-w-2xl">
        <div className="text-sm text-neutral-600">No invoice selected.</div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Invoice ${invoice.number}`} widthClass="max-w-2xl">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={tone(invoice.status)}>{invoice.status}</Badge>
          <Badge variant="default">{invoice.id}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Client</div>
            <div className="mt-2 text-sm font-semibold">{invoice.client}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Amount</div>
            <div className="mt-2 text-sm font-semibold">{money(invoice.amountCents)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Created</div>
            <div className="mt-2 text-sm font-semibold">{new Date(invoice.createdAt).toLocaleString()}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Due</div>
            <div className="mt-2 text-sm font-semibold">{new Date(invoice.dueAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Note</div>
          <div className="mt-2 text-sm text-neutral-800 whitespace-pre-wrap">{invoice.note || "—"}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            onClick={() => alert("Next: Stripe + Supabase invoices + PDF generation + escrow-linked payment flows")}
          >
            Actions
          </button>
        </div>
      </div>
    </Dialog>
  );
}
