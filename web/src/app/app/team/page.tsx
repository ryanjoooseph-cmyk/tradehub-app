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
import {
  Shield,
  UserPlus,
  Search,
  Users,
  Star,
  HardHat,
  KeyRound,
  Activity,
  BadgeCheck,
  Clock,
  ArrowUpRight,
} from "lucide-react";

type Role = "Owner" | "Admin" | "Ops" | "Crew" | "Finance";
type Status = "Active" | "Invited" | "Suspended";

type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastActive: string;
  jobsThisWeek: number;
  permissions: ("Escrow" | "Invoices" | "Dispatch" | "Admin")[];
};

const seed: Member[] = [
  { id: "U-001", name: "Ryan Joseph", email: "ryan.joooseph@icloud.com", role: "Owner", status: "Active", lastActive: "Just now", jobsThisWeek: 6, permissions: ["Admin","Escrow","Invoices","Dispatch"] },
  { id: "U-002", name: "Site Ops Lead", email: "ops@tradehub.au", role: "Ops", status: "Active", lastActive: "12m ago", jobsThisWeek: 12, permissions: ["Dispatch"] },
  { id: "U-003", name: "Finance Controller", email: "finance@tradehub.au", role: "Finance", status: "Active", lastActive: "1h ago", jobsThisWeek: 0, permissions: ["Invoices","Escrow"] },
  { id: "U-004", name: "Rope Access Tech", email: "ra.tech@tradehub.au", role: "Crew", status: "Invited", lastActive: "—", jobsThisWeek: 0, permissions: ["Dispatch"] },
  { id: "U-005", name: "Admin Assistant", email: "admin@tradehub.au", role: "Admin", status: "Suspended", lastActive: "9d ago", jobsThisWeek: 0, permissions: ["Invoices"] },
];

function chipRole(r: Role) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (r === "Owner") return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-800")}>Owner</span>;
  if (r === "Admin") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Admin</span>;
  if (r === "Ops") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Ops</span>;
  if (r === "Finance") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Finance</span>;
  return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Crew</span>;
}

function chipStatus(s: Status) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Active") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Active</span>;
  if (s === "Invited") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Invited</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Suspended</span>;
}

export default function TeamPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "active" | "invited" | "suspended">("all");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;
    if (scope === "active") rows = rows.filter((m) => m.status === "Active");
    if (scope === "invited") rows = rows.filter((m) => m.status === "Invited");
    if (scope === "suspended") rows = rows.filter((m) => m.status === "Suspended");
    if (!s) return rows;
    return rows.filter((m) => `${m.id} ${m.name} ${m.email} ${m.role} ${m.status}`.toLowerCase().includes(s));
  }, [q, scope]);

  const kpis = useMemo(() => {
    const total = seed.length;
    const active = seed.filter((m) => m.status === "Active").length;
    const invited = seed.filter((m) => m.status === "Invited").length;
    const admins = seed.filter((m) => m.role === "Owner" || m.role === "Admin").length;
    const ops = seed.filter((m) => m.role === "Ops" || m.role === "Crew").length;
    return { total, active, invited, admins, ops };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        subtitle="Institutional team controls: roles, permissions, and operational accountability."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Audit log</Button>
            <Button className="rounded-xl"><UserPlus className="mr-2 h-4 w-4" />Invite member</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Members" value={String(kpis.total)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active" value={String(kpis.active)} icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Invited" value={String(kpis.invited)} icon={<Star className="h-4 w-4" />} />
        <StatCard label="Admins" value={String(kpis.admins)} icon={<KeyRound className="h-4 w-4" />} />
        <StatCard label="Ops + Crew" value={String(kpis.ops)} icon={<HardHat className="h-4 w-4" />} />
      </div>

      <DataTableShell
        title="Members"
        subtitle="Search and manage your team. Permissions are explicit, not implied."
        toolbar={
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[520px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search team…" className="h-10 rounded-2xl pl-9" />
            </div>
            <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                <TabsTrigger value="active" className="rounded-xl">Active</TabsTrigger>
                <TabsTrigger value="invited" className="rounded-xl">Invited</TabsTrigger>
                <TabsTrigger value="suspended" className="rounded-xl">Suspended</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No team members found"
              subtitle="Try a different filter or invite a new member."
              icon={<Users className="h-5 w-5" />}
              actionLabel="Invite member"
              onAction={() => {}}
            />
          </div>
        ) : (
          <div className="p-3 grid gap-2">
            {filtered.map((m) => (
              <Card key={m.id} className="rounded-2xl border bg-background p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold truncate">{m.name}</div>
                      {chipRole(m.role)}
                      {chipStatus(m.status)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground truncate">{m.email} · {m.id}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl">Permissions</Button>
                    <Button className="rounded-xl">Open <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />Last active</div>
                    <div className="mt-1 font-semibold">{m.lastActive}</div>
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-2"><HardHat className="h-4 w-4" />Jobs this week</div>
                    <div className="mt-1 font-semibold">{m.jobsThisWeek}</div>
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-2"><BadgeCheck className="h-4 w-4" />Permissions</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.permissions.map((p) => (
                        <span key={p} className="rounded-full border px-2 py-0.5 text-xs">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" className="rounded-xl"><Shield className="mr-2 h-4 w-4" />2FA</Button>
                  <Button variant="outline" className="rounded-xl">Suspend</Button>
                  <Button className="rounded-xl">Edit role</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DataTableShell>
    </div>
  );
}
