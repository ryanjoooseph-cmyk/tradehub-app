"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/demo";

function money(n:number){return n.toLocaleString(undefined,{style:"currency",currency:"AUD",maximumFractionDigits:0});}

export default function JobsPage(){
  const router=useRouter();
  const [jobs,setJobs]=React.useState<Job[]>([]);
  const [q,setQ]=React.useState("");
  React.useEffect(()=>{fetch("/api/jobs",{cache:"no-store"}).then(r=>r.json()).then(setJobs).catch(()=>setJobs([]));},[]);
  const filtered=jobs.filter(j=>(`${j.id} ${j.title} ${j.clientName} ${j.site}`).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">Pipeline table, drill-down, status/priority control.</p>
        </div>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search jobs, clients, sites, ID…" className="h-10 w-[420px] max-w-full rounded-xl border bg-background/60 px-3 text-sm outline-none"/>
      </div>
      <Card className="rounded-2xl border bg-card/40 p-0 overflow-hidden">
        <div className="grid grid-cols-12 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
          <div className="col-span-2">ID</div>
          <div className="col-span-5">Job</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Value</div>
        </div>
        {filtered.map(j=>(
          <button key={j.id} type="button" onClick={()=>router.push(`/app/jobs/${j.id}`)} className="grid grid-cols-12 items-center px-4 py-3 text-left hover:bg-accent/30">
            <div className="col-span-2 text-sm font-semibold">#{j.id}</div>
            <div className="col-span-5">
              <div className="text-sm font-semibold">{j.title}</div>
              <div className="text-xs text-muted-foreground">{j.site}</div>
            </div>
            <div className="col-span-2 text-sm">{j.clientName}</div>
            <div className="col-span-2 flex gap-2">
              <Badge variant="outline" className="rounded-full text-[11px]">{j.status}</Badge>
              <Badge variant="outline" className="rounded-full text-[11px]">{j.priority}</Badge>
            </div>
            <div className="col-span-1 text-right text-sm font-semibold">{money(j.value)}</div>
          </button>
        ))}
      </Card>
    </div>
  );
}
