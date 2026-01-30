"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/premium/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  Receipt,
  Users,
  Activity,
  TrendingUp,
  Timer,
  CheckCircle2,
  Sparkles,
  MapPin,
} from "lucide-react";

type Severity = "info" | "warn" | "critical";
type JobStatus = "New" | "Scheduled" | "In Progress" | "Blocked" | "Complete";

type Alert = {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  time: string;
};

type Job = {
  id: string;
  title: string;
  client: string;
  site: string;
  status: JobStatus;
  when: string;
  value: number;
  escrowHold: number;
};

type Invoice = {
  id: string;
  client: string;
  due: string;
  amount: number;
  status: "Draft" | "Sent" | "Overdue" | "Paid";
};

const alertsSeed: Alert[] = [
  { id: "A-09", title: "Escrow hold missing", detail: "J-189 is blocked but has $0 hold. Investigate deposit state.", severity: "critical", time: "Now" },
  { id: "A-07", title: "Crew capacity tight", detail: "Tomorrow scheduled jobs exceed crew capacity by 1 tech.", severity: "warn", time: "12m" },
  { id: "A-04", title: "Client portal invite pending", detail: "Northpoint Facilities hasn’t accepted the invite.", severity: "info", time: "2h" },
];

const jobsSeed: Job[] = [
  { id: "J-187", title: "High-rise repaint — Stage 1", client: "Arcadia Body Corporate", site: "Brisbane CBD — Tower A", status: "In Progress", when: "Today 07:00–15:00", value: 16800, escrowHold: 16800 },
  { id: "J-188", title: "Strata touch-ups + sealing", client: "Northpoint Facilities", site: "Newstead — Lot 14", status: "Scheduled", when: "Tomorrow 08:00–12:00", value: 5200, escrowHold: 5200 },
  { id: "J-189", title: "Exterior washdown", client: "Lakeside Owners Assoc", site: "Southbank — Building C", status: "Blocked", when: "Today 09:00–13:00", value: 9200, escrowHold: 0 },
  { id: "J-191", title: "Quote + site measure", client: "New Client Intake", site: "TBD", status: "New", when: "Mon 10:00–11:00", value: 0, escrowHold: 0 },
];

const invoicesSeed: Invoice[] = [
  { id: "INV-3041", client: "Arcadia Body Corporate", due: "Feb 02", amount: 16800, status: "Sent" },
  { id: "INV-3042", client: "Northpoint Facilities", due: "Feb 01", amount: 5200, status: "Overdue" },
  { id: "INV-3040", client: "Meridian Property Group", due: "Jan 30", amount: 17800, status: "Paid" },
];

function moneyAUD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function pill(sev: Severity) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (sev === "critical") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Critical</span>;
  if (sev === "warn") return <span className={cn(base, "border-amber-300 bg-amber-50 text-amber-800")}>Warning</span>;
  return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Info</span>;
}

function chipJob(s: JobStatus) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Complete") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Complete</span>;
  if (s === "In Progress") return <span className={cn(base, "border-violet-300 bg-violet-50 text-violet-800")}>In progress</span>;
  if (s === "Scheduled") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Scheduled</span>;
  if (s === "Blocked") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Blocked</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>New</span>;
}

function chipInvoice(s: Invoice["status"]) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  if (s === "Paid") return <span className={cn(base, "border-emerald-300 bg-emerald-50 text-emerald-700")}>Paid</span>;
  if (s === "Overdue") return <span className={cn(base, "border-rose-300 bg-rose-50 text-rose-800")}>Overdue</span>;
  if (s === "Sent") return <span className={cn(base, "border-sky-300 bg-sky-50 text-sky-800")}>Sent</span>;
  return <span className={cn(base, "border-zinc-300 bg-zinc-50 text-zinc-700")}>Draft</span>;
}

export default function AppDashboard() {
  const [lens, setLens] = useState<"today" | "week" | "month">("today");

  const kpis = useMemo(() => {
    const active = jobsSeed.filter((j) => j.status === "Scheduled" || j.status === "In Progress").length;
    const blocked = jobsSeed.filter((j) => j.status === "Blocked").length;
    const escrowHeld = jobsSeed.reduce((a, j) => a + j.escrowHold, 0);
    const pipeline = jobsSeed.reduce((a, j) => a + j.value, 0);
    const overdue = invoicesSeed.filter((i) => i.status === "Overdue").reduce((a, i) => a + i.amount, 0);
    return { active, blocked, escrowHeld, pipeline, overdue };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        subtitle="Institutional ops view: jobs, cash, risk, escrow, and execution—at a glance."
        right={
          <>
            <Button variant="outline" className="rounded-xl"><Sparkles className="mr-2 h-4 w-4" />AI brief</Button>
            <Button variant="outline" className="rounded-xl"><CalendarDays className="mr-2 h-4 w-4" />Schedule</Button>
            <Button className="rounded-xl"><ClipboardList className="mr-2 h-4 w-4" />New job</Button>
          </>
        }
      />

      <div className="flex items-center justify-between gap-3">
        <Tabs value={lens} onValueChange={(v) => setLens(v as any)}>
          <TabsList className="rounded-2xl">
            <TabsTrigger value="today" className="rounded-xl">Today</TabsTrigger>
            <TabsTrigger value="week" className="rounded-xl">Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-xl">Month</TabsTrigger>
          </TabsList>
        </Tabs>
        <Badge variant="outline" className="rounded-full">Premium</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Active" value={String(kpis.active)} icon={<Timer className="h-4 w-4" />} />
        <StatCard label="Blocked" value={String(kpis.blocked)} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Escrow held" value={moneyAUD(kpis.escrowHeld)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Pipeline" value={moneyAUD(kpis.pipeline)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Overdue" value={moneyAUD(kpis.overdue)} icon={<Receipt className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4" />Live ops</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl h-9">Dispatch</Button>
              <Button className="rounded-xl h-9">Open jobs <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-background p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-2"><ClipboardList className="h-4 w-4" />Jobs requiring attention</div>
                <Separator className="my-3" />
                <div className="space-y-2">
                  {jobsSeed
                    .filter((j) => j.status === "Blocked" || j.status === "In Progress" || j.status === "Scheduled")
                    .slice(0, 3)
                    .map((j) => (
                      <div key={j.id} className="rounded-2xl border p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{j.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground truncate">{j.client}</div>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {chipJob(j.status)}
                            <span className="text-xs rounded-full border px-2 py-0.5">{j.id}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full border px-2 py-0.5 flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{j.when}</span>
                          <span className="rounded-full border px-2 py-0.5 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.site}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Escrow</div>
                          <div className="font-semibold">{moneyAUD(j.escrowHold)}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Risk & alerts</div>
                <Separator className="my-3" />
                <div className="space-y-2">
                  {alertsSeed.map((a) => (
                    <div key={a.id} className="rounded-2xl border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{a.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{a.detail}</div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          {pill(a.severity)}
                          <span className="text-[11px] text-muted-foreground">{a.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Escrow review</Button>
                  <Button className="rounded-xl"><CheckCircle2 className="mr-2 h-4 w-4" />Resolve blockers</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4" />Cashflow & execution</div>
            <Badge variant="outline" className="rounded-full">Premium</Badge>
          </div>

          <div className="p-5 space-y-4">
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-muted-foreground">Invoices</div>
              <Separator className="my-3" />
              <div className="space-y-2">
                {invoicesSeed.map((i) => (
                  <div key={i.id} className="rounded-2xl border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{i.id}</div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{i.client}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {chipInvoice(i.status)}
                        <span className="text-[11px] text-muted-foreground">Due {i.due}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">Amount</div>
                      <div className="text-sm font-semibold">{moneyAUD(i.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-2">
                <Button variant="outline" className="rounded-xl"><Receipt className="mr-2 h-4 w-4" />Open invoices</Button>
                <Button className="rounded-xl"><ArrowUpRight className="mr-2 h-4 w-4" />Send statement</Button>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="text-xs text-muted-foreground">Quick actions</div>
              <Separator className="my-3" />
              <div className="grid gap-2">
                <Button variant="outline" className="rounded-xl"><CalendarDays className="mr-2 h-4 w-4" />Plan tomorrow</Button>
                <Button variant="outline" className="rounded-xl"><ShieldCheck className="mr-2 h-4 w-4" />Escrow holds</Button>
                <Button className="rounded-xl"><ClipboardList className="mr-2 h-4 w-4" />Create job</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
