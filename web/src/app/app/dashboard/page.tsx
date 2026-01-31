export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

import PageHeader from "../../../components/ops/shell/PageHeader";
import KpiCard from "../../../components/ops/shell/KpiCard";
import RevenueMini from "../../../components/ops/charts/RevenueMini";
import DataTable from "../../../components/ops/table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Briefcase, Users, Receipt, ShieldCheck } from "lucide-react";

type Row = { id: string; col1: string; col2: string; col3: string; col4: string };

const revenue = [
  { x: "Mon", y: 12 },
  { x: "Tue", y: 18 },
  { x: "Wed", y: 14 },
  { x: "Thu", y: 22 },
  { x: "Fri", y: 28 },
  { x: "Sat", y: 24 },
  { x: "Sun", y: 31 },
];

const rows: Row[] = [
  { id: "j1", col1: "Tower A repaint", col2: "In progress", col3: "Ryan J", col4: "This week" },
  { id: "j2", col1: "Balcony patch", col2: "Scheduled", col3: "Team A", col4: "Tue" },
  { id: "j3", col1: "Invoice follow-up", col2: "Blocked", col3: "Ops", col4: "Today" },
  { id: "j4", col1: "Escrow release", col2: "Review", col3: "Admin", col4: "Today" },
];

const cols: ColumnDef<Row, unknown>[] = [
  { header: "Work item", accessorKey: "col1" },
  { header: "Status", accessorKey: "col2" },
  { header: "Owner", accessorKey: "col3" },
  { header: "Due", accessorKey: "col4" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Institutional-grade ops console. Fast overview of jobs, cashflow and risk."
        right={
          <div className="inline-flex items-center gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold hover:bg-muted/40"
              href="/app/jobs"
            >
              View jobs
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
              href="/app/calendar"
            >
              Schedule
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard label="Open jobs" value="24" delta="+3 this week" icon={<Briefcase className="h-5 w-5" />} />
        <KpiCard label="Active clients" value="18" delta="+2 this month" icon={<Users className="h-5 w-5" />} />
        <KpiCard label="Invoices due" value="$42.8k" delta="7 overdue" icon={<Receipt className="h-5 w-5" />} />
        <KpiCard label="Escrow protected" value="$96.4k" delta="0 disputes" icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-background/60 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Revenue velocity</div>
              <div className="mt-1 text-xs text-muted-foreground">Trailing 7 days. Visual sanity check.</div>
            </div>
            <div className="rounded-xl border bg-background px-3 py-2 text-xs text-muted-foreground">This week</div>
          </div>
          <RevenueMini data={revenue} />
        </div>

        <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
          <div className="text-sm font-semibold">Today</div>
          <div className="mt-1 text-xs text-muted-foreground">Ops focus and risk.</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border bg-background p-3">
              <div className="text-sm font-semibold">2 jobs need materials</div>
              <div className="mt-1 text-xs text-muted-foreground">Procurement blocked</div>
            </div>
            <div className="rounded-xl border bg-background p-3">
              <div className="text-sm font-semibold">1 invoice overdue</div>
              <div className="mt-1 text-xs text-muted-foreground">Escalate to escrow</div>
            </div>
            <div className="rounded-xl border bg-background p-3">
              <div className="text-sm font-semibold">0 disputes</div>
              <div className="mt-1 text-xs text-muted-foreground">System healthy</div>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={cols}
        data={rows}
        emptyTitle="No activity"
        emptySubtitle="Once jobs flow in, this becomes your command table."
        height={420}
      />
    </div>
  );
}
