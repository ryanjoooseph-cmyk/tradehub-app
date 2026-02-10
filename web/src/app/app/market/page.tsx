"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, MessageSquare, Shield, Star, TrendingUp, Clock, CheckCircle } from "lucide-react";

// Seeded KPI data
const kpis = [
  { label: "Active Jobs", value: "12", change: "+3 this week", icon: Briefcase, color: "text-blue-600 bg-blue-100 dark:bg-blue-950" },
  { label: "Quotes Received", value: "47", change: "+8 pending review", icon: MessageSquare, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950" },
  { label: "Escrow In Progress", value: "$24,850", change: "4 milestones pending", icon: Shield, color: "text-violet-600 bg-violet-100 dark:bg-violet-950" },
];

// Seeded recommended providers
const providers = [
  { id: "PROV-001", name: "Elite Painting Co", category: "Painting", rating: 4.8, jobs: 89, verified: true },
  { id: "PROV-002", name: "Premier Strata Services", category: "Strata", rating: 4.9, jobs: 156, verified: true },
  { id: "PROV-005", name: "Heritage Restoration", category: "Restoration", rating: 4.9, jobs: 112, verified: true },
  { id: "PROV-007", name: "Trust Building Group", category: "Building", rating: 4.8, jobs: 98, verified: true },
];

// Seeded activity timeline
const activity = [
  { id: 1, type: "quote", message: "New quote received for Tower A repaint", provider: "Elite Painting Co", time: "2 hours ago" },
  { id: 2, type: "escrow", message: "Milestone 2 payment released", job: "Balcony sealing - St Kilda", time: "5 hours ago" },
  { id: 3, type: "job", message: "Job posted: Heritage restoration - South Yarra", time: "1 day ago" },
  { id: 4, type: "quote", message: "3 quotes received for facade inspection", time: "2 days ago" },
  { id: 5, type: "escrow", message: "Escrow funded for high-rise touch-up", amount: "$8,500", time: "3 days ago" },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "quote":
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    case "escrow":
      return <Shield className="h-4 w-4 text-violet-600" />;
    case "job":
      return <Briefcase className="h-4 w-4 text-emerald-600" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function AppMarketPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find providers, manage quotes, and track escrow payments
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/market/post-job"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Post a Job
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/market/jobs/MJ-001"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Browse Jobs
          </Link>
          <Link
            href="/app/jobs"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            View My Jobs
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border/50 bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{kpi.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.change}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommended Providers */}
        <div className="rounded-xl border border-border/50 bg-card shadow-sm">
          <div className="border-b border-border/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recommended Providers</h2>
              <Link
                href="/market"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{provider.name}</span>
                      {provider.verified && (
                        <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{provider.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{provider.jobs} jobs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border/50 bg-card shadow-sm">
          <div className="border-b border-border/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent Marketplace Activity</h2>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {activity.map((item) => (
              <div key={item.id} className="flex gap-3 px-5 py-3.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.message}</p>
                  {item.provider && (
                    <p className="text-xs text-muted-foreground">from {item.provider}</p>
                  )}
                  {item.job && (
                    <p className="text-xs text-muted-foreground">{item.job}</p>
                  )}
                  {item.amount && (
                    <p className="text-xs font-medium text-emerald-600">{item.amount}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works - Compact */}
      <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="font-semibold">How It Works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-950">
              1
            </div>
            <div>
              <p className="font-medium">Post Your Job</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Describe your project and set your budget
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600 dark:bg-emerald-950">
              2
            </div>
            <div>
              <p className="font-medium">Get Quotes</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Receive quotes from verified providers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-600 dark:bg-violet-950">
              3
            </div>
            <div>
              <p className="font-medium">Pay with Escrow</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Secure payment released on completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
