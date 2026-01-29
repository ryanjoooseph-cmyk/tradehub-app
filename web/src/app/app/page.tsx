"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job, Invoice } from "@/lib/demo";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);

  React.useEffect(() => {
    fetch("/api/jobs", { cache: "no-store" }).then(r => r.json()).then(setJobs).catch(() => setJobs([]));
    fetch("/api/invoices", { cache: "no-store" }).then(r => r.json()).then(setInvoices).catch(() => setInvoices([]));
  }, []);

  const paid = invoices.filter(i => i.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const outstanding = invoices.filter(i => i.status !== "Paid").reduce((a, b) => a + b.amount, 0);
  const atRisk = jobs.filter(j => j.status === "Blocked" || j.priority === "High").slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Operational command centre. Dense signal. Zero fluff.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-xl" type="button">New job</Button>
          <Button variant="outline" className="rounded-xl" type="button">New invoice</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl border bg-card/40 p-4">
            <div className="text-xs text-muted-foreground">Revenue (paid)</div>
            <div className="mt-2 text-2xl font-semibold">{money(paid)}</div>
            <div className="mt-2 text-xs text-muted-foreground">Rolling</div>
          </Card>
          <Card className="rounded-2xl border bg-card/40 p-4">
            <div className="text-xs text-muted-foreground">Outstanding</div>
            <div className="mt-2 text-2xl font-semibold">{money(outstanding)}</div>
            <div className="mt-2 text-xs text-muted-foreground">Sent + overdue</div>
          </Card>
          <Card className="rounded-2xl border bg-card/40 p-4">
            <div className="text-xs text-muted-foreground">Active jobs</div>
            <div className="mt-2 text-2xl font-semibold">{jobs.filter(j => j.status === "In Progress").length}</div>
            <div className="mt-2 text-xs text-muted-foreground">In progress</div>
          </Card>
          <Card className="rounded-2xl border bg-card/40 p-4">
            <div className="text-xs text-muted-foreground">Blocked</div>
            <div className="mt-2 text-2xl font-semibold">{jobs.filter(j => j.status === "Blocked").length}</div>
            <div className="mt-2 text-xs text-muted-foreground">Needs action</div>
          </Card>

          <Card className="md:col-span-4 rounded-2xl border bg-card/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">At risk</div>
                <div className="text-xs text-muted-foreground">High priority / blocked items requiring action</div>
              </div>
              <Badge variant="outline" className="rounded-full text-[11px]">Action</Badge>
            </div>
            <div className="mt-4 grid gap-3">
              {atRisk.map((j) => (
                <div key={j.id} className="rounded-2xl border bg-background/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold">#{j.id} {j.title}</div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="rounded-full text-[11px]">{j.status}</Badge>
                      <Badge variant="outline" className="rounded-full text-[11px]">{j.priority}</Badge>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{j.clientName} • {j.site}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 grid gap-4">
          <Card className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">Next on deck</div>
            <div className="mt-3 space-y-2">
              {jobs.filter(j => j.startAt && j.endAt).slice(0, 5).map((j) => (
                <div key={j.id} className="rounded-xl border bg-background/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">#{j.id} {j.clientName}</div>
                    <Badge variant="outline" className="rounded-full text-[11px]">{j.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{j.title}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border bg-card/40 p-4">
            <div className="font-medium">System</div>
            <div className="mt-2 text-xs text-muted-foreground">APIs online. Data pipeline ready for Supabase swap.</div>
            <div className="mt-3 grid gap-2">
              <div className="rounded-xl border bg-background/60 p-3 text-sm">/api/jobs</div>
              <div className="rounded-xl border bg-background/60 p-3 text-sm">/api/invoices</div>
              <div className="rounded-xl border bg-background/60 p-3 text-sm">/api/escrow</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
