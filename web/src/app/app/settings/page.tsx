"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("TradeHub");
  const [timezone, setTimezone] = useState("Australia/Melbourne");
  const [currency, setCurrency] = useState("AUD");

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Settings</div>
        <div className="mt-1 text-sm text-neutral-600">Configuration surface for operations, security, and integrations.</div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Organisation</div>
          <Badge tone="info">Core</Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Organisation name</div>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </label>

          <label className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Timezone</div>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </label>

          <label className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-medium text-neutral-600">Currency</div>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          onClick={() => alert("Next: persist settings to Supabase + audit trail")}
        >
          Save (demo)
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Security</div>
          <Badge tone="warn">Pending</Badge>
        </div>

        <div className="text-sm text-neutral-700">
          Next: role-based access control (RLS), session management, audit logs, MFA, and API key rotation.
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Integrations</div>
          <Badge tone="neutral">Staged</Badge>
        </div>

        <div className="text-sm text-neutral-700">
          Next: Stripe, Xero/MYOB, Google Calendar sync, and escrow payment rails.
        </div>
      </div>
    </div>
  );
}
