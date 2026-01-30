"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { EmptyState } from "@/components/premium/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Plus, Search, Users, Shield, Activity, UserCheck, Sparkles, ArrowUpRight } from "lucide-react";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Ops" | "Finance" | "Crew";
  status: "Active" | "Invited" | "Suspended";
  lastSeen: string;
};

const seed: Member[] = [
  { id: "m1", name: "Ryan Joseph", email: "ryan.joooseph@icloud.com", role: "Owner", status: "Active", lastSeen: "Just now" },
  { id: "m2", name: "Operations Lead", email: "ops@tradehub.com", role: "Ops", status: "Invited", lastSeen: "—" },
  { id: "m3", name: "Accounts", email: "finance@tradehub.com", role: "Finance", status: "Active", lastSeen: "2h ago" },
  { id: "m4", name: "Crew Member", email: "crew@tradehub.com", role: "Crew", status: "Active", lastSeen: "Yesterday" },
];

function chipRole(role: Member["role"]) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (role === "Owner") return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-800")}>Owner</span>;
  if (role === "Admin") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Admin</span>;
  if (role === "Ops") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Ops</span>;
  if (role === "Finance") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Finance</span>;
  return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Crew</span>;
}

function chipStatus(s: Member["status"]) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Active") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Active</span>;
  if (s === "Invited") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Invited</span>;
  return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Suspended</span>;
}

export default function TeamPage() {
  const [q, setQ] = useState("");
  const [view, setView] = useState<"members" | "audit">("members");

  const members = seed;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return members;
    return members.filter(m => `${m.name} ${m.email} ${m.role} ${m.status}`.toLowerCase().includes(s));
  }, [q, members]);

  const kpis = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === "Active").length;
    const invited = members.filter(m => m.status === "Invited").length;
    const privileged = members.filter(m => m.role === "Owner" || m.role === "Admin").length;
    return { total, active, invited, privileged };
  }, [members]);

  const audit = [
    { at: "Just now", who: "Ryan Joseph", what: "Updated permissions policy", sev: "info" },
    { at: "32m ago", who: "Accounts", what: "Exported payout report", sev: "info" },
    { at: "2h ago", who: "System", what: "Blocked suspicious session", sev: "warn" },
    { at: "Yesterday", who: "Ops Lead", what: "Accepted invite", sev: "info" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        subtitle="Enterprise-grade access control, roles, and audit visibility."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Roles</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" />Invite member</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Members" value={String(kpis.total)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active" value={String(kpis.active)} icon={<UserCheck className="h-4 w-4" />} />
        <StatCard label="Invited" value={String(kpis.invited)} icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Privileged" value={String(kpis.privileged)} icon={<Shield className="h-4 w-4" />} />
        <StatCard label="Audit events" value={String(audit.length)} icon={<Activity className="h-4 w-4" />} />
      </div>

      <DataTableShell
        title="Access & control"
        subtitle="Search members or switch to audit mode."
        toolbar={
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[520px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search team…" className="h-10 rounded-2xl pl-9" />
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full md:w-auto">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="members" className="rounded-xl">Members</TabsTrigger>
                <TabsTrigger value="audit" className="rounded-xl">Audit</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      >
        {view === "members" ? (
          filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No members found" subtitle="Try another search or invite your first team member." icon={<Users className="h-5 w-5" />} actionLabel="Invite member" onAction={() => {}} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left font-medium">Member</th>
                    <th className="px-6 py-3 text-left font-medium">Role</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Last seen</th>
                    <th className="px-6 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </td>
                      <td className="px-6 py-4">{chipRole(m.role)}</td>
                      <td className="px-6 py-4">{chipStatus(m.status)}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{m.lastSeen}</td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="outline" className="rounded-xl">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="p-4">
            <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Audit timeline</div>
                <Badge variant="outline" className="rounded-full">{audit.length}</Badge>
              </div>
              <div className="p-3 space-y-3">
                {audit.map((a, i) => (
                  <div key={i} className="rounded-2xl border bg-background p-3 hover:bg-muted/30 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{a.what}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{a.who} · {a.at}</div>
                      </div>
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs",
                        a.sev === "warn" ? "border-amber-300 bg-amber-50 text-amber-800" : "border-zinc-300 bg-zinc-50 text-zinc-700"
                      )}>
                        {a.sev === "warn" ? "Attention" : "Info"}
                      </span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-xl">View</Button>
                      <Button size="sm" className="rounded-xl">Investigate <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </DataTableShell>
    </div>
  );
}
