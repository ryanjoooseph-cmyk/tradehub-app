"use client";


const s = (status: string) => String(status || "").toLowerCase();
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type EscrowRow = {
  id: string;
  jobId: string;
  jobTitle: string;
  client: string;
  status: "Pending" | "Funded" | "Partially Released" | "On Hold" | "Released";
  totalCents: number;
  heldCents: number;
  releasedCents: number;
  createdAt: string;
  milestones: { id: string; name: string; amountCents: number; status: "Locked" | "Released" | "Disputed" }[];
  ledger: { id: string; ts: string; type: "Fund" | "Release" | "Hold" | "Dispute" | "Note"; amountCents?: number; note?: string }[];
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
const toneM = (s: EscrowRow["milestones"][number]["status"]): "default" | "warn" | "success" | "danger" => {
  const t = String(status || "").toLowerCase();
  if (/(released|paid|complete|completed|success|approved)/.test(t)) return "success";
  if (/(failed|fail|blocked|dispute|cancel|cancelled|rejected|error|bad)/.test(t)) return "danger";
  if (/(pending|await|awaiting|hold|review|processing|in progress)/.test(t)) return "warn";
  return "default";
};
export function EscrowDrawer({
  escrow,
  open,
  onClose,
}: {
  escrow: EscrowRow | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!escrow) {
    return (
      <Dialog open={open} onClose={onClose} title="Escrow" widthClass="max-w-4xl">
        <div className="text-sm text-neutral-600">No escrow selected.</div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Escrow • ${escrow.jobTitle}`} widthClass="max-w-4xl">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={tone(escrow.status)}>{escrow.status}</Badge>
          <Badge variant="default">{escrow.id}</Badge>
          <Badge variant="default">{escrow.jobId}</Badge>
          <Badge variant="default">{escrow.client}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Total</div>
            <div className="mt-2 text-lg font-semibold">{money(escrow.totalCents)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Held</div>
            <div className="mt-2 text-lg font-semibold">{money(escrow.heldCents)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Released</div>
            <div className="mt-2 text-lg font-semibold">{money(escrow.releasedCents)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Milestones</div>
              <button
                type="button"
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                onClick={() => alert("Next: create milestone + persist to Supabase")}
              >
                Add milestone
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {escrow.milestones.map((m) => (
                <div key={m.id} className="rounded-2xl border border-neutral-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{m.name}</div>
                    <Badge variant={toneM(m.status)}>{m.status}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-neutral-600">{money(m.amountCents)}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                      onClick={() => alert("Next: release flow (permissioned)")}
                    >
                      Release
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                      onClick={() => alert("Next: put on hold / dispute")}
                    >
                      Hold
                    </button>
                  </div>
                </div>
              ))}
              {escrow.milestones.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 px-3 py-8 text-sm text-neutral-500">
                  No milestones yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Ledger</div>
              <button
                type="button"
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                onClick={() => alert("Next: add note + persist")}
              >
                Add note
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {escrow.ledger.map((l) => (
                <div key={l.id} className="rounded-2xl border border-neutral-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">{l.type}</div>
                    <div className="text-xs text-neutral-500">{new Date(l.ts).toLocaleString()}</div>
                  </div>
                  <div className="mt-1 text-sm text-neutral-700">
                    {typeof l.amountCents === "number" ? money(l.amountCents) : null}
                    {l.note ? <div className="mt-1 text-neutral-600">{l.note}</div> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            onClick={() => alert("Next: wire to /api/escrow + Supabase jobs/disputes")}
          >
            Wire API
          </button>
        </div>
      </div>
    </Dialog>
  );
}
