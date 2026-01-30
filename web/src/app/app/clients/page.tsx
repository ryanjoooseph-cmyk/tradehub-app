"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClientDrawer, type ClientRow } from "@/components/clients/client-drawer";

const demoClients: ClientRow[] = [
  { id: "cli_001", name: "Ryan Joseph", email: "ryan.joooseph@icloud.com", phone: "+61 4xx xxx xxx", status: "VIP", createdAt: new Date().toISOString(), notes: "High-value client. Priority scheduling." },
  { id: "cli_002", name: "ACME Body Corporate", email: "ops@acme.com", status: "Active", createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: "cli_003", name: "Brightline Constructions", email: "admin@brightline.com", status: "On Hold", createdAt: new Date(Date.now() - 86400000 * 23).toISOString(), notes: "Payment history flagged. Require escrow on all jobs." },
];

function tone(status: ClientRow["status"]) {
  if (status === "VIP") return "info";
  if (status === "On Hold") return "warn";
  return "good";
}

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ClientRow["status"] | "All">("All");
  const [selected, setSelected] = useState<ClientRow | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return demoClients
      .filter((c) => (status === "All" ? true : c.status === status))
      .filter((c) => {
        if (!needle) return true;
        return c.name.toLowerCase().includes(needle) || c.email.toLowerCase().includes(needle) || (c.phone || "").toLowerCase().includes(needle);
      })
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [q, status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Clients</div>
          <div className="mt-1 text-sm text-neutral-600">Institutional-grade CRM surface: search, segment, act.</div>
        </div>
        <button
          type="button"
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          onClick={() => alert("Next: create client flow backed by Supabase")}
        >
          New client
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search clients..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm">
              <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
              <select className="bg-transparent outline-none" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option>All</option>
                <option>Active</option>
                <option>On Hold</option>
                <option>VIP</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500 bg-neutral-50">
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-neutral-50 cursor-pointer"
                  onClick={() => {
                    setSelected(c);
                    setOpen(true);
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{c.name}</div>
                    <div className="mt-1 text-xs text-neutral-500">{c.id}</div>
                  </td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(c.status)}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-sm text-neutral-500" colSpan={5}>
                    No clients match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <ClientDrawer client={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
