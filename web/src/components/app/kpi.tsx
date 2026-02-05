import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KPIProps = {
  title: string;
  value: string;
  delta: string;
  note: string;
  href?: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
  error?: boolean;
};

export function KPI({ title, value, delta, note, href, trend = "neutral", loading, error }: KPIProps) {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "";
  const trendColor = trend === "up" ? "text-green-600 bg-green-50 dark:bg-green-950" : trend === "down" ? "text-red-600 bg-red-50 dark:bg-red-950" : "bg-muted/60";

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(600px_circle_at_20%_0%,hsl(var(--foreground))/0.2,transparent_40%)]" />
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3">
            <div className="h-9 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-12 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600 dark:text-red-400">Failed to load</div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(600px_circle_at_20%_0%,hsl(var(--foreground))/0.2,transparent_40%)]" />
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
          <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${trendColor}`}>
            {trendIcon} {delta}
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">{note}</div>
      </CardContent>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-transform hover:scale-[1.02]">
        <Card className="relative overflow-hidden cursor-pointer hover:border-foreground/20">
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {content}
    </Card>
  );
}
