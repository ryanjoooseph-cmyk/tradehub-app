"use client";

import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  ArrowUpRight,
  Bell,
  Database,
  KeyRound,
  Link2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Webhook,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Enterprise controls: security, integrations, and operational governance."
        right={
          <>
            <Button variant="outline" className="rounded-xl">Download config</Button>
            <Button className="rounded-xl">Save changes <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Security posture" value="Good" icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Integrations" value="4" icon={<Link2 className="h-4 w-4" />} />
        <StatCard label="Webhooks" value="2" icon={<Webhook className="h-4 w-4" />} />
        <StatCard label="Keys" value="Managed" icon={<KeyRound className="h-4 w-4" />} />
        <StatCard label="Data" value="Healthy" icon={<Database className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Security</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          <div className="p-5 space-y-4">
            <div className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Two-factor authentication</div>
                  <div className="mt-1 text-sm text-muted-foreground">Require 2FA for admins and finance roles.</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2"><KeyRound className="h-4 w-4" />Key rotation policy</div>
                  <div className="mt-1 text-sm text-muted-foreground">Rotate platform keys on a fixed cadence (recommended).</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2"><Bell className="h-4 w-4" />Security alerts</div>
                  <div className="mt-1 text-sm text-muted-foreground">Notify on suspicious logins, permission escalations, and payout events.</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-xl">View audit log</Button>
              <Button className="rounded-xl">Run security check</Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Integrations</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          <div className="p-5 space-y-3">
            <div className="rounded-2xl border p-4">
              <div className="font-semibold flex items-center gap-2"><Database className="h-4 w-4" />Supabase</div>
              <div className="mt-1 text-sm text-muted-foreground">Database + Auth + Storage</div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" className="rounded-xl w-full">Test</Button>
                <Button className="rounded-xl w-full">Open</Button>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold flex items-center gap-2"><Webhook className="h-4 w-4" />Render</div>
              <div className="mt-1 text-sm text-muted-foreground">Deploy pipeline + workers</div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" className="rounded-xl w-full">Test</Button>
                <Button className="rounded-xl w-full">Open</Button>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4" />OpenAI</div>
              <div className="mt-1 text-sm text-muted-foreground">Agent orchestration + extraction</div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" className="rounded-xl w-full">Test</Button>
                <Button className="rounded-xl w-full">Open</Button>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" />Automation</div>
              <div className="mt-1 text-sm text-muted-foreground">Merge rules, labels, and agent guardrails</div>
              <div className="mt-3">
                <Button className="rounded-xl w-full">Configure</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Governance</div>
          <Badge variant="outline" className="rounded-full">Enterprise</Badge>
        </div>
        <div className="p-5 space-y-3">
          <div className="rounded-2xl border p-4">
            <div className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4" />AI change control</div>
            <div className="mt-1 text-sm text-muted-foreground">Require PR descriptions to include impact, rollback, and risk rating.</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="font-semibold flex items-center gap-2"><KeyRound className="h-4 w-4" />Secrets policy</div>
            <div className="mt-1 text-sm text-muted-foreground">No secrets in code. Environment-only with rotation + audit.</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">Policy docs</Button>
            <Button className="rounded-xl">Apply defaults</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
