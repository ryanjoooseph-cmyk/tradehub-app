"use client";

import * as React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/60">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-200 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-800" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                TradeHub
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Ops OS for trade businesses
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
            <span>Command</span>
            <span className="rounded-md border border-zinc-200 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">⌘</span>
            <span className="rounded-md border border-zinc-200 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">K</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
