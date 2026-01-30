"use client";

import clsx from "clsx";

export function KpiCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneCls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "warn"
      ? "border-amber-200 bg-amber-50"
      : tone === "bad"
      ? "border-rose-200 bg-rose-50"
      : "border-neutral-200 bg-white";

  return (
    <div className={clsx("rounded-2xl border p-5", toneCls)}>
      <div className="text-xs font-medium text-neutral-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{value}</div>
      {sub ? <div className="mt-2 text-xs text-neutral-600">{sub}</div> : null}
    </div>
  );
}
