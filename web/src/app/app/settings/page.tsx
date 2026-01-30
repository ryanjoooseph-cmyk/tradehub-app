"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { DataTableShell } from "@/components/premium/data-table-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Settings as SettingsIcon, KeyRound, CreditCard, Link2, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

export default function SettingsPage() {
  const [tab, setTab] = useState<"general" | "security" | "billing" | "integrations">("general");
  const [org, setOrg] = useState("TradeHub");
  const [tz, setTz] = useState("Australia/Melbourne");
  const [currency, setCurrency] = useState("AUD");

  const kpis = useMemo(() => ({
    plan: "Pro",
    seats: 5,
    integrations: 3,
    security: "Good",
    env: "Production",
  }), []);

  function row(label: string, value: string, action?: string) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border bg-background p-4 hover:bg-muted/30 transition">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{label}</div>
          <div className="mt-1 text-xs text-muted-foreground truncate">{value}</div>
        </div>
        {action ? <Button variant="outline" className="rounded-xl" size="sm">{action}</Button> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Institutional-grade configuration: security, billing, and integrations."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Export</Button>
            <Button className="rounded-xl"><Zap className="mr-2 h-4 w-4" />Apply changes</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Plan" value={kpis.plan} icon={<CreditCard className="h-4 w-4" />} />
        <StatCard label="Seats" value={String(kpis.seats)} icon={<SettingsIcon className="h-4 w-4" />} />
        <StatCard label="Integrations" value={String(kpis.integrations)} icon={<Link2 className="h-4 w-4" />} />
        <StatCard label="Security" value={kpis.security} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Environment" value={kpis.env} icon={<KeyRound className="h-4 w-4" />} />
      </div>

      <DataTableShell
        title="Configuration"
        subtitle="Premium settings panels. UI-first; wiring comes next."
        toolbar={
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="rounded-2xl">
              <TabsTrigger value="general" className="rounded-xl">General</TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl">Security</TabsTrigger>
              <TabsTrigger value="billing" className="rounded-xl">Billing</TabsTrigger>
              <TabsTrigger value="integrations" className="rounded-xl">Integrations</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <div className="p-4">
          {tab === "general" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Organisation</div>
                  <Badge variant="outline" className="rounded-full">Core</Badge>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Organisation name</div>
                    <Input value={org} onChange={(e) => setOrg(e.target.value)} className="h-10 rounded-2xl" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Timezone</div>
                    <Input value={tz} onChange={(e) => setTz(e.target.value)} className="h-10 rounded-2xl" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Currency</div>
                    <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-10 rounded-2xl" />
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Brand & UX</div>
                  <Badge variant="outline" className="rounded-full">Premium</Badge>
                </div>
                <div className="p-4 space-y-3">
                  {row("Sidebar density", "Compact, high-signal navigation", "Configure")}
                  {row("Tables", "Rounded cards, readable spacing, search-first", "Preview")}
                  {row("Dashboard", "KPI cards + operational surfaces", "Open")}
                </div>
              </Card>
            </div>
          ) : tab === "security" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Authentication</div>
                  <Badge variant="outline" className="rounded-full">Recommended</Badge>
                </div>
                <div className="p-4 space-y-3">
                  {row("Password policy", "Length 12+, breach checks, rotation optional", "Edit")}
                  {row("MFA", "TOTP + backup codes", "Enable")}
                  {row("Session control", "Device/session revocation & alerts", "Manage")}
                </div>
              </Card>

              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Audit</div>
                  <Badge variant="outline" className="rounded-full">On</Badge>
                </div>
                <div className="p-4 space-y-3">
                  {row("Immutable logs", "Write-once event stream (UI-first)", "View")}
                  {row("Privileged actions", "Escrow release, payouts, role changes", "Review")}
                  {row("Anomaly signals", "Impossible travel & token reuse", "Configure")}
                </div>
              </Card>
            </div>
          ) : tab === "billing" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Plan</div>
                  <Badge variant="outline" className="rounded-full">{kpis.plan}</Badge>
                </div>
                <div className="p-4 space-y-3">
                  {row("Current plan", "Pro (seat-based)", "Change")}
                  {row("Invoices", "Monthly, net 7 (demo)", "Open")}
                  {row("Usage", "Events, storage, AI tasks (demo)", "View")}
                </div>
              </Card>

              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Payouts</div>
                  <Badge variant="outline" className="rounded-full">Escrow-ready</Badge>
                </div>
                <div className="p-4 space-y-3">
                  {row("Settlement account", "Configure bank details", "Set")}
                  {row("Release controls", "Dual-approval for high value releases", "Enable")}
                  {row("Dispute holds", "Auto-hold on dispute escalation", "Configure")}
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Integrations</div>
                  <Badge variant="outline" className="rounded-full">Premium</Badge>
                </div>
                <div className="p-4 space-y-3">
                  {row("Supabase", "Connected (env)", "View")}
                  {row("Render", "Auto deploys + health checks", "Open")}
                  {row("GitHub", "PR automation + checks", "Manage")}
                </div>
              </Card>

              <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Keys</div>
                  <Badge variant="outline" className="rounded-full">Safe</Badge>
                </div>
                <div className="p-4 space-y-3">
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="text-sm font-semibold">API key vault</div>
                    <div className="mt-1 text-xs text-muted-foreground">UI-first. Next step: wire secure reads + rotation flows.</div>
                    <Separator className="my-3" />
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl" size="sm">Rotate</Button>
                      <Button className="rounded-xl" size="sm">Open <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </DataTableShell>
    </div>
  );
}
