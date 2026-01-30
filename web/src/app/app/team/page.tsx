"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Supervisor" | "Tech";
  status: "Active" | "Invited" | "Suspended";
  createdAt: string;
};

const demoTeam: Member[] = [
  { id: "mem_001", name: "Ryan Joseph", email: "ryan.joooseph@icloud.com", role: "Owner", status: "Active", createdAt: new Date().toISOString() },
  { id: "mem_002", name: "Ryan (Partner)", email: "ryan@example.com", role: "Admin", status: "Invited", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "mem_003", name: "Site Supervisor", email: "supervisor@example.com", role: "Supervisor", status: "Active", createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
];

function toneStatus(s: Member["status"]) {
  if (s === "Active") return "good";
  if (s === "Suspended") return "bad";
  return "warn";
}

function toneRole(r: Member["role"]) {
  if (r === "Owner") return "info";
  if (r === "Admin") return "neutral";
  return "neutral";
}

export default function TeamPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return demoTeam
      .filter((m) => {
        if (!needle) return true;
        return m.name.toLowerCase().includes(needle) || m.email.toLowerCase().includes(needle) || m.role.toLowerCase().includes(needle);
      })
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Team</div>
          <div className="mt-1 text-sm text-neutral-600">Roles, access, and operational permissions.</div>
        </div>
        <button
          type="button"
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          onClick={() => setOpen(true)}
        >
          Invite member
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-neutral-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search team..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500 bg-neutral-50">
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-medium">Member</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{m.name}</div>
                    <div className="mt-1 text-xs text-neutral-500">{m.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={toneRole(m.role)}>{m.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={toneStatus(m.status)}>{m.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-600">{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-sm text-neutral-500" colSpan={4}>
                    No team members match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-xl"><DialogHeader><DialogTitle>Invite team member</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800">
            Demo mode. Next step: invite flow via Supabase + RLS, role assignment, and audit logs.
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              onClick={() => setOpen(false)}
            >
              Confirm (demo)
            </button>
            <button
              type="button"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent></Dialog>

    </div>
  );
}
