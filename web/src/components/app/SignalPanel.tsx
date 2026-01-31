import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function toneFor(s: string) {
  const x = s.toLowerCase();
  if (x.includes("paid") || x.includes("released")) return "success";
  if (x.includes("dispute") || x.includes("overdue")) return "destructive";
  if (x.includes("await") || x.includes("hold")) return "warning";
  return "info";
}

export function SignalPanel(props: { title: string; items: Array<{ k: string; v: string; s: string }>; className?: string }) {
  return (
    <Card className={cn("rounded-3xl", props.className)}>
      <CardContent className="p-5">
        <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{props.title}</div>
        <div className="mt-3 space-y-2">
          {props.items.map((i) => (
            <div key={i.k} className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-900/5 px-3 py-2 ring-1 ring-zinc-200 dark:bg-zinc-50/5 dark:ring-zinc-800">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{i.k}</div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{i.v}</div>
              </div>
              <Badge tone={toneFor(i.s)} className="shrink-0">{i.s}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
