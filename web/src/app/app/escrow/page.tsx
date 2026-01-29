"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EscrowTxn } from "@/lib/demo";

function money(n:number){return n.toLocaleString(undefined,{style:"currency",currency:"AUD",maximumFractionDigits:0});}

export default function EscrowPage(){
  const [rows,setRows]=React.useState<EscrowTxn[]>([]);
  React.useEffect(()=>{fetch("/api/escrow",{cache:"no-store"}).then(r=>r.json()).then(setRows).catch(()=>setRows([]));},[]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Escrow</h1>
        <p className="text-sm text-muted-foreground">Fund → hold → dispute → release. (UI first; logic next.)</p>
      </div>
      <Card className="rounded-2xl border bg-card/40 p-0 overflow-hidden">
        <div className="grid grid-cols-12 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
          <div className="col-span-4">Escrow</div>
          <div className="col-span-4">Client</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        {rows.map(e=>(
          <div key={e.id} className="grid grid-cols-12 px-4 py-3 hover:bg-accent/30">
            <div className="col-span-4 text-sm font-semibold">{e.id} <span className="text-xs text-muted-foreground">• Job {e.jobId}</span></div>
            <div className="col-span-4 text-sm">{e.clientName}</div>
            <div className="col-span-2 flex gap-2">
              <Badge variant="outline" className="rounded-full text-[11px]">{e.status}</Badge>
              {e.releaseAt ? <Badge variant="outline" className="rounded-full text-[11px]">Release {e.releaseAt.slice(0,10)}</Badge> : null}
            </div>
            <div className="col-span-2 text-right text-sm font-semibold">{money(e.amount)}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
