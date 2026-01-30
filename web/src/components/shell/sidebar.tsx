"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav";
import clsx from "clsx";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] shrink-0 border-r border-neutral-200 bg-white">
      <div className="px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">TradeHub</div>
          <div className="text-xs rounded-full border border-neutral-200 px-2 py-1 text-neutral-600">A++</div>
        </div>
        <div className="mt-3 text-xs text-neutral-500">Ops OS for trade businesses</div>
      </div>

      <nav className="px-3 pb-5">
        {navItems.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mx-5 mt-auto mb-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="text-xs font-medium text-neutral-700">Demo mode</div>
        <div className="mt-1 text-xs text-neutral-500">Auth disabled. Showing seeded jobs.</div>
      </div>
    </aside>
  );
}
