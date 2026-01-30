"use client";

import clsx from "clsx";

export function Badge({
  children,
  tone = "neutral",
  variant = "solid",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "info";
  variant?: "solid" | "outline";
  className?: string;
}) {
  const solid =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : tone === "bad"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : tone === "info"
      ? "border-sky-200 bg-sky-50 text-sky-800"
      : "border-neutral-200 bg-neutral-50 text-neutral-700";

  const outline =
    tone === "good"
      ? "border-emerald-200 bg-transparent text-emerald-800"
      : tone === "warn"
      ? "border-amber-200 bg-transparent text-amber-800"
      : tone === "bad"
      ? "border-rose-200 bg-transparent text-rose-800"
      : tone === "info"
      ? "border-sky-200 bg-transparent text-sky-800"
      : "border-neutral-200 bg-transparent text-neutral-700";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variant === "outline" ? outline : solid,
        className
      )}
    >
      {children}
    </span>
  );
}
