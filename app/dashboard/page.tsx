// app/dashboard/page.tsx
"use client";
import { useState } from "react";
import { KPI } from "@/components/app/kpi";
import { SectionTitle } from "@/components/app/filled/section";
import { Sparkline, Bars, Donut } from "@/components/app/shell/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Seeded data
const seededData = {
  kpis: {
    openJobs: { current: 18, change: 3, trend: "up" as const },
    revenue: { current: 184200, change: 12.4, trend: "up" as const },
    invoices: { current: 42900, overdue: 2, pending: 7, change: -5.2, trend: "down" as const },
    escrow: { current: 61500, disputes: 0, change: 8.1, trend: "up" as const },
  },
  revenueTrend: [
    { x: "Jan 26", y: 28500 },
    { x: "Jan 27", y: 31200 },
    { x: "Jan 28", y: 29800 },
    { x: "Jan 29", y: 26400 },
    { x: "Jan 30", y: 30100 },
    { x: "Jan 31", y: 28900 },
    { x: "Feb 1", y: 31200 },
  ],
  crewUtilization: [
    { day: "Mon", util: 0.82 },
    { day: "Tue", util: 0.67 },
    { day: "Wed", util: 0.71 },
    { day: "Thu", util: 0.64 },
    { day: "Fri", util: 0.58 },
    { day: "Sat", util: 0.73 },
    { day: "Sun", util: 0.69 },
  ],
  priorities: [
    { type: "quote_approvals", label: "Quote approvals", count: 3, severity: "medium" as const, href: "/app/quotes" },
    { type: "jobs_at_risk", label: "Jobs at risk", count: 1, severity: "high" as const, href: "/app/jobs?filter=risk" },
    { type: "payments", label: "Payments to reconcile", count: 0, severity: "low" as const, href: "/app/invoices" },
  ],
  liveFeed: [
    { type: "job_booked", message: "New job booked", time: "5m ago", status: "success" as const },
    { type: "invoice_sent", message: "Invoice sent", time: "12m ago", status: "default" as const },
    { type: "quote_approved", message: "Quote approved", time: "28m ago", status: "success" as const },
    { type: "milestone_funded", message: "Milestone funded", time: "1h ago", status: "default" as const },
    { type: "crew_assigned", message: "Crew assigned", time: "2h ago", status: "default" as const },
  ],
};

const avgUtilization = Math.round(
  (seededData.crewUtilization.reduce((sum, d) => sum + d.util, 0) / seededData.crewUtilization.length) * 100
);

export default function Dashboard() {
  const [loading] = useState(false);
  const [error] = useState(false);

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPI
          title="Open Jobs"
          value={seededData.kpis.openJobs.current.toString()}
          delta={`+${seededData.kpis.openJobs.change}`}
          note="Active projects"
          href="/app/jobs?filter=open"
          trend="up"
          loading={loading}
          error={error}
        />
        <KPI
          title="Revenue (MTD)"
          value={`$${(seededData.kpis.revenue.current / 1000).toFixed(1)}k`}
          delta={`+${seededData.kpis.revenue.change}%`}
          note="This month"
          href="/app/invoices"
          trend="up"
          loading={loading}
          error={error}
        />
        <KPI
          title="Outstanding Invoices"
          value={`$${(seededData.kpis.invoices.current / 1000).toFixed(1)}k`}
          delta={`${seededData.kpis.invoices.change}%`}
          note={`${seededData.kpis.invoices.overdue} overdue`}
          href="/app/invoices?filter=overdue"
          trend="down"
          loading={loading}
          error={error}
        />
        <KPI
          title="Escrow Holds"
          value={`$${(seededData.kpis.escrow.current / 1000).toFixed(1)}k`}
          delta={`+${seededData.kpis.escrow.change}%`}
          note={`${seededData.kpis.escrow.disputes} disputes`}
          href="/app/escrow"
          trend="up"
          loading={loading}
          error={error}
        />
      </div>

      {/* Revenue Trend + Crew Utilization */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <div className="text-sm text-muted-foreground">Last 7 days performance curve</div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-3xl font-semibold tracking-tight">
              $31.2k
            </div>
            <Sparkline data={seededData.revenueTrend} height={80} />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>{seededData.revenueTrend[0].x}</span>
              <span>{seededData.revenueTrend[seededData.revenueTrend.length - 1].x}</span>
            </div>
          </CardContent>
        </Card>

        {/* Crew Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Crew Utilization</CardTitle>
            <div className="text-sm text-muted-foreground">Weekly capacity vs. target 75%</div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-4">
              <Donut value={avgUtilization} />
              <div>
                <div className="text-3xl font-semibold tracking-tight">{avgUtilization}%</div>
                <div className="text-sm text-muted-foreground">Average this week</div>
              </div>
            </div>
            <Bars
              values={seededData.crewUtilization.map((d) => d.util)}
              colors={seededData.crewUtilization.map((d) =>
                d.util >= 0.75 ? "#22c55e" : d.util >= 0.65 ? "#eab308" : "#ef4444"
              )}
              targetLine={0.75}
            />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              {seededData.crewUtilization.map((d, i) => (
                <span key={i}>{d.day}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus + Live Feed */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Focus */}
        <Card>
          <CardHeader>
            <SectionTitle title="Today's Focus" subtitle="Auto-generated priorities" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {seededData.priorities.map((priority, i) => {
                const severityColor =
                  priority.severity === "high"
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    : priority.severity === "medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

                return (
                  <Link
                    key={i}
                    href={priority.href}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${severityColor}`}>
                        {priority.count}
                      </div>
                      <div className="text-sm font-medium">{priority.label}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">→</div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Live Feed */}
        <Card>
          <CardHeader>
            <SectionTitle title="Live Feed" subtitle="Events, updates, agent actions" />
          </CardHeader>
          <CardContent>
            <div className="max-h-[240px] space-y-3 overflow-y-auto">
              {seededData.liveFeed.slice(0, 5).map((event, i) => {
                const statusColor =
                  event.status === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

                return (
                  <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${statusColor}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{event.message}</div>
                      <div className="text-xs text-muted-foreground">{event.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
