"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Webhook,
  Bell,
  Globe,
  CreditCard,
  Database,
  Wrench,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

type Panel = "security" | "integrations" | "notifications" | "billing" | "system";

function SettingRow(props: { title: string; desc: string; right: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${props.danger ? "border-rose-200 bg-rose-50/30" : "bg-background"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{props.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{props.desc}</div>
        </div>
        <div className="shrink-0">{props.right}</div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [panel, setPanel] = useState<Panel>("security");
  const [mfa, setMfa] = useState(true);
  const [sessionLock, setSessionLock] = useState(true);
  const [audit, setAudit] = useState(true);
  const [webhooks, setWebhooks] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [timezone, setTimezone] = useState("Australia/Sydney");
  const [orgName, setOrgName] = useState("TradeHub Ops");

  const kpis = useMemo(
    () => ({ posture: "Hardened", uptime: "99.9%", env: "Prod", version: "v0.1" }),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Institutional admin console: security posture, integrations, notifications, billing, and system control."
        right={
          <>
            <Button variant="outline" className="rounded-xl">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync
            </Button>
            <Button className="rounded-xl">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Security check
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Security posture" value={kpis.posture} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Audit logging" value={audit ? "On" : "Off"} icon={<Lock className="h-4 w-4" />} />
        <StatCard label="Webhooks" value={webhooks ? "On" : "Off"} icon={<Webhook className="h-4 w-4" />} />
        <StatCard label="Environment" value={kpis.env} icon={<Database className="h-4 w-4" />} />
        <StatCard label="Uptime" value={kpis.uptime} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Tabs value={panel} onValueChange={(v) => setPanel(v as Panel)}>
          <TabsList className="rounded-2xl">
            <TabsTrigger value="security" className="rounded-xl">Security</TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-xl">Integrations</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl">Notifications</TabsTrigger>
            <TabsTrigger value="billing" className="rounded-xl">Billing</TabsTrigger>
            <TabsTrigger value="system" className="rounded-xl">System</TabsTrigger>
          </TabsList>
        </Tabs>
        <Badge variant="outline" className="rounded-full">Premium</Badge>
      </div>

      {panel === "security" ? (
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Security controls
            </div>
            <Button variant="outline" className="rounded-xl h-9">
              <ArrowUpRight className="mr-2 h-4 w-4" /> View audit
            </Button>
          </div>
          <div className="p-5 space-y-3">
            <SettingRow title="Require MFA for admins" desc="Enforces multi-factor authentication for privileged roles." right={<Switch checked={mfa} onCheckedChange={setMfa} />} />
            <SettingRow title="Session lock + re-auth for high-risk actions" desc="Re-auth required for escrow release, payout changes, and key rotation." right={<Switch checked={sessionLock} onCheckedChange={setSessionLock} />} />
            <SettingRow title="Audit logging" desc="Immutable operational logs for compliance and incident response." right={<Switch checked={audit} onCheckedChange={setAudit} />} />
            <SettingRow title="API keys" desc="Rotate, scope, and revoke keys. Separate prod vs staging." right={<Button className="rounded-xl"><KeyRound className="mr-2 h-4 w-4" />Manage</Button>} />
            <SettingRow title="IP allowlist" desc="Restrict admin console access to approved office/VPN ranges." right={<Button variant="outline" className="rounded-xl">Configure</Button>} />
          </div>
        </Card>
      ) : null}

      {panel === "integrations" ? (
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Webhook className="h-4 w-4" /> Integrations
            </div>
            <Badge variant="outline" className="rounded-full">Prod</Badge>
          </div>
          <div className="p-5 space-y-3">
            <SettingRow title="Webhooks" desc="Stream events: job status, invoice state, escrow holds/release, disputes." right={<Switch checked={webhooks} onCheckedChange={setWebhooks} />} />
            <SettingRow title="Supabase connection" desc="Database + auth services. View project refs + rotate service keys." right={<Button variant="outline" className="rounded-xl"><Database className="mr-2 h-4 w-4" />View</Button>} />
            <SettingRow title="Render deployment" desc="Deploy status + environment variables + build health." right={<Button variant="outline" className="rounded-xl"><Globe className="mr-2 h-4 w-4" />Open</Button>} />
          </div>
        </Card>
      ) : null}

      {panel === "notifications" ? (
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </div>
            <Badge variant="outline" className="rounded-full">Ops</Badge>
          </div>
          <div className="p-5 space-y-3">
            <SettingRow title="High-risk alerts" desc="Escrow anomalies, dispute escalations, overdue threshold breaches." right={<Switch checked={alerts} onCheckedChange={setAlerts} />} />
            <SettingRow title="Escalation policy" desc="Who gets paged when SLA is breached." right={<Button variant="outline" className="rounded-xl">Configure</Button>} />
          </div>
        </Card>
      ) : null}

      {panel === "billing" ? (
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Billing
            </div>
            <Badge variant="outline" className="rounded-full">Preview</Badge>
          </div>
          <div className="p-5 space-y-3">
            <SettingRow title="Plan" desc="Usage-based pricing with audit-grade features." right={<Button className="rounded-xl">Upgrade</Button>} />
            <SettingRow title="Invoices" desc="Statements, tax invoices, and receipts." right={<Button variant="outline" className="rounded-xl">View</Button>} />
          </div>
        </Card>
      ) : null}

      {panel === "system" ? (
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Wrench className="h-4 w-4" /> System
            </div>
            <Badge variant="outline" className="rounded-full">{kpis.version}</Badge>
          </div>
          <div className="p-5 space-y-3">
            <SettingRow title="Organisation name" desc="Displayed in console, statements, and client portal." right={<Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="h-10 w-[280px] rounded-2xl" />} />
            <SettingRow title="Timezone" desc="Used for calendars, SLAs, and invoice scheduling." right={<Input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="h-10 w-[280px] rounded-2xl" />} />
            <SettingRow title="Danger zone: reset demo data" desc="Clears local/demo tables. Not recommended in production." danger right={<Button variant="destructive" className="rounded-xl"><AlertTriangle className="mr-2 h-4 w-4" />Reset</Button>} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
