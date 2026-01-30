import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border bg-background p-10 text-center shadow-sm", className)}>
      {icon ? <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted">{icon}</div> : null}
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      {subtitle ? <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</div> : null}
      {actionLabel ? (
        <div className="mt-6">
          <Button className="rounded-xl" onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
