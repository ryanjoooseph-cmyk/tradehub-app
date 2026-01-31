import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-tight ring-1",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900/5 text-zinc-700 ring-zinc-200 dark:bg-zinc-50/5 dark:text-zinc-200 dark:ring-zinc-800",
        outline:
          "bg-transparent text-zinc-700 ring-zinc-200 dark:text-zinc-200 dark:ring-zinc-800",
        secondary:
          "bg-zinc-900/5 text-zinc-900 ring-zinc-200 dark:bg-zinc-50/5 dark:text-zinc-100 dark:ring-zinc-800",
        success:
          "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-200 dark:bg-emerald-400/10",
        warning:
          "bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:text-amber-200 dark:bg-amber-400/10",
        destructive:
          "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-200 dark:bg-rose-400/10",
        info:
          "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-200 dark:bg-sky-400/10",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function toneToVariant(tone?: string): string | undefined {
  const t = (tone || "").toLowerCase();
  if (!t) return undefined;

  if (["success", "good", "active", "paid", "complete", "completed"].includes(t)) return "success";
  if (["warning", "warn", "onhold", "on_hold", "pending", "awaiting", "awaiting_payment"].includes(t)) return "warning";
  if (["danger", "bad", "error", "failed", "dispute", "overdue"].includes(t)) return "destructive";
  if (["info", "vip", "new", "in_progress", "inprogress"].includes(t)) return "info";
  if (["outline"].includes(t)) return "outline";
  if (["secondary"].includes(t)) return "secondary";
  if (["default", "neutral"].includes(t)) return "default";

  return "default";
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  tone?: string;
}

export function Badge({ className, variant, tone, ...props }: BadgeProps) {
  const v = toneToVariant(tone) || variant || "default";
  return <div className={cn(badgeVariants({ variant: v as any }), className)} {...props} />;
}
