import { clients } from "@/components/app/demoData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function tone(risk: string) {
  if (risk === "High") return "destructive";
  if (risk === "Medium") return "warning";
  return "success";
}

export default function ClientsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">CRM</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Clients</div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Risk-aware client view for high trust settlement.</div>
        </div>
        <Button className="rounded-2xl">New client</Button>
      </div>

      <Card className="rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-12 border-b border-zinc-200 bg-white/70 px-5 py-3 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
            <div className="col-span-4">Client</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-3 text-right">Risk</div>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {clients.map((c) => (
              <div key={c.id} className="grid grid-cols-12 px-5 py-4 hover:bg-zinc-900/5 dark:hover:bg-zinc-50/5">
                <div className="col-span-4">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{c.id}</div>
                </div>
                <div className="col-span-2 flex items-center text-sm font-semibold">{c.type}</div>
                <div className="col-span-3">
                  <div className="text-sm font-semibold">{c.email}</div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{c.phone}</div>
                </div>
                <div className="col-span-3 flex items-center justify-end">
                  <Badge tone={tone(c.risk)} className="rounded-full px-3 py-1 text-xs font-semibold">{c.risk}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
