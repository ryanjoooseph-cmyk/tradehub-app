import { Topbar } from "@/components/shell/topbar";
import { demoJobs, money } from "@/lib/demo-data";

export default function Page() {
  const held = demoJobs.reduce((a, j) => a + j.escrowCents, 0);
  const funded = demoJobs.filter((j) => j.escrowCents > 0).length;
  const disputed = demoJobs.filter((j) => j.status === "Disputed").length;

  return (
    <>
      <Topbar title="Escrow" subtitle="Funds held, releases, disputes (demo)" />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="text-xs font-medium text-neutral-500">Escrow held</div>
            <div className="mt-2 text-2xl font-semibold">{money(held)}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="text-xs font-medium text-neutral-500">Funded jobs</div>
            <div className="mt-2 text-2xl font-semibold">{funded}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="text-xs font-medium text-neutral-500">Disputes</div>
            <div className="mt-2 text-2xl font-semibold">{disputed}</div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 text-sm font-semibold">Escrow by job</div>
          <div className="divide-y divide-neutral-200">
            {demoJobs.map((j) => (
              <div key={j.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-neutral-900">{j.title}</div>
                  <div className="mt-1 text-xs text-neutral-500">{j.client} • {j.site}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{money(j.escrowCents)}</div>
                  <div className="mt-1 text-xs text-neutral-500">{j.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
