/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ShieldCheck,
  Users,
  UserPlus,
  Search,
  KeyRound,
  Lock,
  Globe,
  BadgeCheck,
  AlertTriangle,
  ArrowUpRight,
  ClipboardList,
  CalendarDays,
  Receipt,
} from "lucide-react";

type Role = "Owner" | "Admin" | "Ops Lead" | "Dispatcher" | "Finance" | "Crew";
type Status = "Active" | "Invited" | "Suspended";
type Scope = "All" | "Ops" | "Finance" | "Crew" | "Admins";

type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastActive: string;
  jobsAssigned: number;
  jobsCompleted: number;
  permissions: {
    jobs: boolean;
    clients: boolean;
    invoices: boolean;
    calendar: boolean;
    escrow: boolean;
    settings: boolean;
  };
};

const seed: Member[] = [
  {
    id: "U-001",
    name: "Ryan Joseph",
    email: "ryan.joooseph@icloud.com",
    role: "Owner",
    status: "Active",
    lastActive: "Now",
    jobsAssigned: 12,
    jobsCompleted: 114,
    permissions: { jobs: true, clients: true, invoices: true, calendar: true, escrow: true, settings: true },
  },
  {
    id: "U-014",
    name: "Dispatch Lead",
    email: "dispatch@tradehub.com.au",
    role: "Dispatcher",
    status: "Active",
    lastActive: "8m",
    jobsAssigned: 9,
    jobsCompleted: 62,
    permissions: { jobs: true, clients: true, invoices: false, calendar: true, escrow: false, settings: false },
  },
  {
    id: "U-022",
    name: "Accounts",
    email: "accounts@tradehub.com.au",
    role: "Finance",
    status: "Active",
    lastActive: "1h",
    jobsAssigned: 0,
    jobsCompleted: 0,
    permissions: { jobs: false, clients: true, invoices: true, calendar: false, escrow: true, settings: false },
  },
  {
    id: "U-031",
    name: "Crew Supervisor",
    email: "crew.lead@tradehub.com.au",
    role: "Ops Lead",
    status: "Invited",
    lastActive: "—",
    jobsAssigned: 0,
    jobsCompleted: 0,
    permissions: { jobs: true, clients: false, invoices: false, calendar: true, escrow: false, settings: false },
  },
  {
    id: "U-045",
    name: "Rope Access Tech",
    email: "tech1@tradehub.com.au",
    role: "Crew",
    status: "Active",
    lastActive: "3h",
    jobsAssigned: 4,
    jobsCompleted: 41,
    permissions: { jobs: true, clients: false, invoices: false, calendar: true, escrow: false, settings: false },
  },
];

function chipRole(r: Role) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (r === "Owner") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>Owner</span>;
  if (r === "Admin") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Admin</span>;
  if (r === "Ops Lead") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-800")}>Ops Lead</span>;
  if (r === "Dispatcher") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Dispatcher</span>;
  if (r === "Finance") return <span className={cn(base, "border-indigo-300 bg-indigo-50 text-indigo-800")}>Finance</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Crew</span>;
}

function chipStatus(s: Status) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Active") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Active</span>;
  if (s === "Invited") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Invited</span>;
  return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Suspended</span>;
}

function permPill(label: string, on: boolean) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  return <span className={cn(base, on ? "border-zinc-300 bg-zinc-50 text-zinc-800" : "border-zinc-200 bg-muted/20 text-zinc-400")}>{label}</span>;
}

export default function TeamPage() {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<Scope>("All");
  const [selectedId, setSelectedId] = useState<string>(seed[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = seed;

    if (scope === "Admins") rows = rows.filter((m) => m.role === "Owner" || m.role === "Admin");
    if (scope === "Ops") rows = rows.filter((m) => m.role === "Ops Lead" || m.role === "Dispatcher");
    if (scope === "Finance") rows = rows.filter((m) => m.role === "Finance");
    if (scope === "Crew") rows = rows.filter((m) => m.role === "Crew");

    if (!s) return rows;
    return rows.filter((m) => `${m.id} ${m.name} ${m.email} ${m.role} ${m.status}`.toLowerCase().includes(s));
  }, [q, scope]);

  const selected = useMemo(() => seed.find((m) => m.id === selectedId) || filtered[0] || seed[0], [selectedId, filtered]);

  const kpis = useMemo(() => {
    const total = seed.length;
    const active = seed.filter((m) => m.status === "Active").length;
    const invited = seed.filter((m) => m.status === "Invited").length;
    const admins = seed.filter((m) => m.role === "Owner" || m.role === "Admin").length;
    const highPrivilege = seed.filter((m) => m.permissions.settings || m.permissions.escrow).length;
    return { total, active, invited, admins, highPrivilege };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        subtitle="Institutional access control: roles, permissions, and operational accountability."
        right={
          <>
            <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Security</Button>
            <Button className="rounded-xl"><UserPlus className="mr-2 h-4 w-4" />Invite member</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Members" value={String(kpis.total)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active" value={String(kpis.active)} icon={<BadgeCheck className="h-4 w-4" />} />
        <StatCard label="Invited" value={String(kpis.invited)} icon={<Globe className="h-4 w-4" />} />
        <StatCard label="Admins" value={String(kpis.admins)} icon={<KeyRound className="h-4 w-4" />} />
        <StatCard label="High privilege" value={String(kpis.highPrivilege)} icon={<Lock className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DataTableShell
          title="Roster"
          subtitle="Search + segment. Drill into permissions + performance."
          toolbar={
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-[520px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search team…" className="h-10 rounded-2xl pl-9" />
              </div>

              <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full md:w-auto">
                <TabsList className="rounded-2xl">
                  <TabsTrigger value="All" className="rounded-xl">All</TabsTrigger>
                  <TabsTrigger value="Admins" className="rounded-xl">Admins</TabsTrigger>
                  <TabsTrigger value="Ops" className="rounded-xl">Ops</TabsTrigger>
                  <TabsTrigger value="Finance" className="rounded-xl">Finance</TabsTrigger>
                  <TabsTrigger value="Crew" className="rounded-xl">Crew</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No team members found"
                subtitle="Try another filter or invite someone."
                icon={<Users className="h-5 w-5" />}
                actionLabel="Invite member"
                onAction={() => {}}
              />
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filtered.map((m) => {
                const active = selected?.id === m.id;
                const risk = m.permissions.settings || m.permissions.escrow;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border bg-background p-4 transition hover:bg-muted/30",
                      active ? "border-zinc-400/70" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold truncate">{m.name}</div>
                          <span className="rounded-full border px-2 py-0.5 text-xs">{m.id}</span>
                          {chipRole(m.role)}
                          {chipStatus(m.status)}
                          {risk ? (
                            <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-800 inline-flex items-center gap-1">
                              <AlertTriangle className="h-3.5 w-3.5" /> Privileged
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{m.email}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="text-sm font-semibold">{m.lastActive}</div>
                        <div className="text-xs text-muted-foreground">Last active</div>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-xl border bg-muted/10 p-2">
                        <div className="text-muted-foreground">Assigned</div>
                        <div className="mt-1 font-semibold">{m.jobsAssigned}</div>
                      </div>
                      <div className="rounded-xl border bg-muted/10 p-2">
                        <div className="text-muted-foreground">Completed</div>
                        <div className="mt-1 font-semibold">{m.jobsCompleted}</div>
                      </div>
                      <div className="rounded-xl border bg-muted/10 p-2">
                        <div className="text-muted-foreground">Role</div>
                        <div className="mt-1 font-semibold">{m.role}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DataTableShell>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Access dossier</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          {!selected ? (
            <div className="p-8 text-sm text-muted-foreground">Select a member to view details.</div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xl font-semibold truncate">{selected.name}</div>
                    <span className="rounded-full border px-2 py-0.5 text-xs">{selected.id}</span>
                    {chipRole(selected.role)}
                    {chipStatus(selected.status)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{selected.email}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl">Reset access</Button>
                  <Button className="rounded-xl">Manage <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Last active</div>
                  <div className="mt-2 text-lg font-semibold">{selected.lastActive}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Assigned jobs</div>
                  <div className="mt-2 text-lg font-semibold">{selected.jobsAssigned}</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Completed</div>
                  <div className="mt-2 text-lg font-semibold">{selected.jobsCompleted}</div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-sm font-semibold">Permissions</div>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-2">
                  {permPill("Jobs", selected.permissions.jobs)}
                  {permPill("Clients", selected.permissions.clients)}
                  {permPill("Invoices", selected.permissions.invoices)}
                  {permPill("Calendar", selected.permissions.calendar)}
                  {permPill("Escrow", selected.permissions.escrow)}
                  {permPill("Settings", selected.permissions.settings)}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Operational footprint</div>
                  <Separator className="my-3" />
                  <div className="grid gap-2">
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><ClipboardList className="h-4 w-4" />Jobs</div>
                      <div className="font-semibold">{selected.permissions.jobs ? "Enabled" : "None"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4" />Calendar</div>
                      <div className="font-semibold">{selected.permissions.calendar ? "Enabled" : "None"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><Receipt className="h-4 w-4" />Billing</div>
                      <div className="font-semibold">{selected.permissions.invoices ? "Enabled" : "None"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-sm font-semibold">Risk posture</div>
                  <Separator className="my-3" />
                  <div className="grid gap-2">
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4" />Escrow access</div>
                      <div className="font-semibold">{selected.permissions.escrow ? "Yes" : "No"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4" />Settings access</div>
                      <div className="font-semibold">{selected.permissions.settings ? "Yes" : "No"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4" />Privileged</div>
                      <div className="font-semibold">{selected.permissions.settings || selected.permissions.escrow ? "Flagged" : "Normal"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <Button variant="outline" className="rounded-xl"><KeyRound className="mr-2 h-4 w-4" />Rotate keys</Button>
                <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Audit log</Button>
                <Button className="rounded-xl"><UserPlus className="mr-2 h-4 w-4" />Invite member</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
