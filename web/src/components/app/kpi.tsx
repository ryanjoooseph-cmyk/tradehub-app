import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KPI({ title, value, delta, note }: { title: string; value: string; delta: string; note: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(600px_circle_at_20%_0%,hsl(var(--foreground))/0.2,transparent_40%)]" />
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
          <div className="rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium">{delta}</div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">{note}</div>
      </CardContent>
    </Card>
  );
}
