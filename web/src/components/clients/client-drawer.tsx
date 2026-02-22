"use client";

import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type ClientRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "Active" | "On Hold" | "VIP";
  createdAt: string;
  notes?: string;
};

const tone = (status: string): "default" | "success" | "warning" | "danger" => {
  const t = (status || "").toLowerCase();
  if (/(complete|completed|done|paid|success|approved|active)/.test(t)) return "success";
  if (/(dispute|overdue|failed|fail|cancel|cancelled|rejected|error|blocked)/.test(t)) return "danger";
  if (/(await|awaiting|in progress|scheduled|pending|hold|review|processing|draft)/.test(t)) return "warning";
  return "default";
};
export function ClientDrawer({
  client,
  open,
  onClose,
}: {
  client: ClientRow | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!client) {
    return (
      <Dialog open={open} onClose={onClose} title="Client" widthClass="max-w-2xl">
        <div className="text-sm text-neutral-600">No client selected.</div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title={client.name} widthClass="max-w-2xl">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={tone(client.status)}>{client.status}</Badge>
          <Badge variant="default">{client.id}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Email</div>
            <div className="mt-2 text-sm font-semibold">{client.email}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Phone</div>
            <div className="mt-2 text-sm font-semibold">{client.phone || "—"}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:col-span-2">
            <div className="text-xs font-medium text-neutral-600">Created</div>
            <div className="mt-2 text-sm font-semibold">{new Date(client.createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-600">Notes</div>
          <div className="mt-2 text-sm text-neutral-800 whitespace-pre-wrap">{client.notes || "—"}</div>
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
            onClick={() => alert("Next: wire client edit + jobs/invoices relations via Supabase")}
          >
            Actions
          </button>
        </div>
      </div>
    </Dialog>
  );
}
