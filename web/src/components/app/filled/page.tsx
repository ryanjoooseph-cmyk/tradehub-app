"use client";

import React from "react";
import { Search, Filter, Plus } from "lucide-react";

export function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

export function PageWrap({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-xl font-semibold tracking-tight">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div> : null}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm hover:bg-accent/40"
    >
      {children}
    </button>
  );
}

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border bg-muted/10 px-3 py-2">
      <Search className="h-4 w-4 opacity-60" />
      <input
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        placeholder={placeholder}
      />
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-xs hover:bg-accent/40"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>
    </div>
  );
}

export function StatGrid({ items }: { items: Array<{ label: string; value: string; hint?: string }> }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-2xl border bg-card/50 p-4">
          <div className="text-xs text-muted-foreground">{it.label}</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{it.value}</div>
          {it.hint ? <div className="mt-1 text-xs text-muted-foreground">{it.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card/50">
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function SimpleTable({
  cols,
  rows,
}: {
  cols: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/20 text-xs text-muted-foreground">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-left font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t hover:bg-muted/10">
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const cls =
    tone === "good"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : tone === "warn"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : tone === "bad"
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      : "bg-muted/20 text-muted-foreground border-foreground/10";
  return <span className={cx("inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium", cls)}>{children}</span>;
}
