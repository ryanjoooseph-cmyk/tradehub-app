import { jobs } from "@/components/app/demoData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function tone(s: string) {
  if (s === "Released") return "success";
  if (s === "Hold") return "warning";
  if (s === "Dispute") return "destructive";
  return "info";
}

export default function EscrowPage() {
  const rows = jobs.map((j) => {
    const state =
      j.status === "Dispute" ? "Dispute" :
      j.status === "Awaiting Payment" ? "Hold" :
      j.status === "Complete" ? "Released" :
      "In escrow";
    return { id: j.id, title: j.title, client: j.client, milestone: j.milestone, amount: Math.round(j.value * (j.milestone === "Deposit" ? 0.3 : j.milestone === "Mid" ? 0.4 : 0.3)), state };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Settlement</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Escrow</div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Milestone holds + releases + disputes (front-end first).</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-2xl">Rules</Button>
          <Button className="rounded-2xl">Create escrow</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-12 border-b border-zinc-200 bg-white/70 px-5 py-3 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
              <div className="col-span-5">Job</div>
              <div className="col-span-3">Milestone</div>
              <div className="col-span-2">State</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.map((r) => (
                <div key={r.id} className="grid grid-cols-12 px-5 py-4 hover:bg-zinc-900/5 dark:hover:bg-zinc-50/5">
                  <div className="col-span-5">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{r.title}</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{r.id} • {r.client}</div>
                  </div>
                  <div className="col-span-3 flex items-center text-sm font-semibold">{r.milestone}</div>
                  <div className="col-span-2 flex items-center">
                    <Badge tone={tone(r.state)} className="rounded-full px-3 py-1 text-xs font-semibold">{r.state}</Badge>
                  </div>
                  <div className="col-span-2 flex items-center justify-end text-sm font-extrabold">${r.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Escrow engine</div>
            <div className="mt-2 text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Institutional rules</div>
            <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Deposit → Mid → Final. Releases gated by completion evidence and dispute window.
            </div>

            <div className="mt-4 space-y-2">
              <div className="rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Release gate</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Photo proof + client approval OR inspector report.</div>
              </div>
              <div className="rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Dispute window</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">24–72h configurable before funds release.</div>
              </div>
              <div className="rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
                <div className="text-sm font-semibold">Audit trail</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Immutable events: created, funded, released, disputed.</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button className="rounded-2xl">Simulate</Button>
              <Button variant="secondary" className="rounded-2xl">Policies</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
