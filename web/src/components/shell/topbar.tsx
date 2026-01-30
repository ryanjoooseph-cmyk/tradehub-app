"use client";

import { Search, Plus, Menu } from "lucide-react";

export function Topbar({
  title,
  subtitle,
  onOpenMobileNav,
}: {
  title: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <div className="text-xl font-semibold tracking-tight truncate">{title}</div>
          {subtitle ? <div className="mt-0.5 text-sm text-neutral-500 truncate">{subtitle}</div> : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600">
          <Search className="h-4 w-4" />
          <span className="text-neutral-400">Search jobs, clients, invoices…</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>
    </div>
  );
}
