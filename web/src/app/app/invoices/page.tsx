"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/lib/demo";

function money(n:number){return n.toLocaleString(undefined,{style:"currency",currency:"AUD",maximumFractionDigits:0});}

export default function InvoicesPage(){
  const [invoices,setInvoices]=React.useState<Invoice[]>([]);
  React.useEffect(()=>{fetch("/api/invoices",{cache:"no-store"}).then(r=>r.json()).then(setInvoices).catch(()=>setInvoices([]));},[]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-sm text-muted-foreground">A/R control: draft → sent → paid (with overdue flagging).</p>
      </div>
      <Card className="rounded-2xl border bg-card/40 p-0 overflow-hidden">
        <div className="grid grid-cols-12 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
          <div className="col-span-3">Invoice</div>
          <div className="col-span-5">Client</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        {invoices.map(i=>(
          <div key={i.id} className="grid grid-cols-12 px-4 py-3 hover:bg-accent/30">
            <div className="col-span-3 text-sm font-semibold">{i.id}</div>
            <div className="col-span-5 text-sm">{i.clientName}</div>
            <div className="col-span-2 flex gap-2">
              <Badge variant="outline" className="rounded-full text-[11px]">{i.status}</Badge>
              <Badge variant="outline" className="rounded-full text-[11px]">Due {i.dueAt.slice(0,10)}</Badge>
            </div>
            <div className="col-span-2 text-right text-sm font-semibold">{money(i.amount)}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
