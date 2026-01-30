import { demoEscrowHolds, demoLedger, money, demoJobs } from "@/lib/demo-data";

export default function EscrowPage() {
  const held = demoEscrowHolds.filter((h) => h.status === "Held").reduce((a, h) => a + h.amountCents, 0);
  const disputed = demoEscrowHolds.filter((h) => h.status === "Disputed").reduce((a, h) => a + h.amountCents, 0);

  const jobTitle = (jobId: string) => demoJobs.find((j) => j.id === jobId)?.title || jobId;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Escrow</div>
        <div className="mt-1 text-sm text-neutral-600">
          Holds + ledger timeline. Next: release/refund actions + disputes workflow.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium text-neutral-600">Held</div>
          <div className="mt-2 text-2xl font-semibold">{money(held)}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium text-neutral-600">Disputed</div>
          <div className="mt-2 text-2xl font-semibold">{money(disputed)}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium text-neutral-600">Holds</div>
          <div className="mt-2 text-2xl font-semibold">{demoEscrowHolds.length}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Escrow holds</div>
          <div className="text-xs text-neutral-500">Demo data</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500">
              <tr className="border-b border-neutral-100">
                <th className="py-2 text-left font-medium">Job</th>
                <th className="py-2 text-left font-medium">Status</th>
                <th className="py-2 text-right font-medium">Amount</th>
                <th className="py-2 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {demoEscrowHolds.map((h) => (
                <tr key={h.id}>
                  <td className="py-3 pr-6">
                    <div className="font-medium">{jobTitle(h.jobId)}</div>
                  </td>
                  <td className="py-3">
                    <span className="rounded-full border border-neutral-200 px-2 py-1 text-xs text-neutral-700">
                      {h.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium">{money(h.amountCents)}</td>
                  <td className="py-3 text-right text-neutral-600">{new Date(h.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {demoEscrowHolds.length === 0 ? (
                <tr>
                  <td className="py-8 text-neutral-500" colSpan={4}>No escrow holds in demo data.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Ledger</div>
          <div className="text-xs text-neutral-500">Holds + fees</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500">
              <tr className="border-b border-neutral-100">
                <th className="py-2 text-left font-medium">Type</th>
                <th className="py-2 text-left font-medium">Job</th>
                <th className="py-2 text-right font-medium">Amount</th>
                <th className="py-2 text-right font-medium">Time</th>
                <th className="py-2 text-left font-medium">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {demoLedger.map((e) => (
                <tr key={e.id}>
                  <td className="py-3 pr-6">
                    <span className="rounded-full border border-neutral-200 px-2 py-1 text-xs text-neutral-700">
                      {e.type}
                    </span>
                  </td>
                  <td className="py-3 pr-6">
                    <div className="font-medium">{jobTitle(e.jobId)}</div>
                  </td>
                  <td className="py-3 text-right font-medium">{money(e.amountCents)}</td>
                  <td className="py-3 text-right text-neutral-600">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="py-3 text-neutral-600">{e.note || ""}</td>
                </tr>
              ))}
              {demoLedger.length === 0 ? (
                <tr>
                  <td className="py-8 text-neutral-500" colSpan={5}>No ledger entries.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
