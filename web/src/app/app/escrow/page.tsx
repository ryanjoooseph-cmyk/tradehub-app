"use client";

import { useMemo, useState } from "react";
import { demoEscrowHolds, demoLedger, money, demoJobs } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";

type Action = "Release" | "Refund" | "Open dispute";

export default function EscrowPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<Action>("Release");

  const jobTitle = (jobId: string) => demoJobs.find((j) => j.id === jobId)?.title || jobId;

  const heldTotal = useMemo(
    () => demoEscrowHolds.filter((h) => h.status === "Held").reduce((a, h) => a + h.amountCents, 0),
    []
  );

  const disputedTotal = useMemo(
    () => demoEscrowHolds.filter((h) => h.status === "Disputed").reduce((a, h) => a + h.amountCents, 0),
    []
  );

  const holds = useMemo(() => demoEscrowHolds.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)), []);

  function openAction(jobId: string, nextAction: Action) {
    setSelectedJobId(jobId);
    setAction(nextAction);
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Escrow</div>
        <div className="mt-1 text-sm text-neutral-600">
          Institutional-grade escrow visibility: holds, actions, and ledger traceability.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium text-neutral-600">Held</div>
          <div className="mt-2 text-2xl font-semibold">{money(heldTotal)}</div>
          <div className="mt-2 text-xs text-neutral-500">Funds locked pending completion</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium text-neutral-600">Disputed</div>
          <div className="mt-2 text-2xl font-semibold">{money(disputedTotal)}</div>
          <div className="mt-2 text-xs text-neutral-500">Held while dispute is resolved</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium text-neutral-600">Holds</div>
          <div className="mt-2 text-2xl font-semibold">{holds.length}</div>
          <div className="mt-2 text-xs text-neutral-500">Active escrow records</div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Holds</div>
          <div className="text-xs text-neutral-500">Demo mode</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500">
              <tr className="border-b border-neutral-100">
                <th className="py-2 text-left font-medium">Job</th>
                <th className="py-2 text-left font-medium">Status</th>
                <th className="py-2 text-right font-medium">Amount</th>
                <th className="py-2 text-right font-medium">Created</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {holds.map((h) => (
                <tr key={h.id}>
                  <td className="py-3 pr-6">
                    <div className="font-medium">{jobTitle(h.jobId)}</div>
                    <div className="mt-1 text-xs text-neutral-500">{h.jobId}</div>
                  </td>
                  <td className="py-3">
                    <Badge tone={h.status === "Held" ? "good" : h.status === "Disputed" ? "bad" : "neutral"}>
                      {h.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-semibold">{money(h.amountCents)}</td>
                  <td className="py-3 text-right text-neutral-600">{new Date(h.createdAt).toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium hover:bg-neutral-50"
                        onClick={() => openAction(h.jobId, "Release")}
                      >
                        Release
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium hover:bg-neutral-50"
                        onClick={() => openAction(h.jobId, "Refund")}
                      >
                        Refund
                      </button>
                      <button
                        type="button"
                        className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
                        onClick={() => openAction(h.jobId, "Open dispute")}
                      >
                        Dispute
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {holds.length === 0 ? (
                <tr>
                  <td className="py-8 text-neutral-500" colSpan={5}>No escrow holds.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Ledger timeline</div>
          <div className="text-xs text-neutral-500">Traceability</div>
        </div>

        <div className="mt-4 space-y-3">
          {demoLedger
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((e) => (
              <div key={e.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone={e.type === "Hold" ? "good" : e.type === "Fee" ? "warn" : "neutral"}>{e.type}</Badge>
                    <div className="text-sm font-semibold">{jobTitle(e.jobId)}</div>
                  </div>
                  <div className="text-sm font-semibold">{money(e.amountCents)}</div>
                </div>
                <div className="mt-2 text-xs text-neutral-600">{new Date(e.createdAt).toLocaleString()}</div>
                {e.note ? <div className="mt-2 text-sm text-neutral-800">{e.note}</div> : null}
              </div>
            ))}
          {demoLedger.length === 0 ? (
            <div className="text-sm text-neutral-500">No ledger entries.</div>
          ) : null}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`${action}${selectedJobId ? ` • ${jobTitle(selectedJobId)}` : ""}`}
        widthClass="max-w-xl"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800">
            This is demo mode. Next step: wire these actions to Supabase + escrow contract state machine.
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              onClick={() => setOpen(false)}
            >
              Confirm (demo)
            </button>
            <button
              type="button"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
