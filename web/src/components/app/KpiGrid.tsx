import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

export function KpiGrid(props: {
  items: Array<{ label: string; value: string; sub: string }>;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4", props.className)}>
      {props.items.map((k) => (
        <Card key={k.label} className="rounded-3xl">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{k.label}</div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{k.value}</div>
            <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{k.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
