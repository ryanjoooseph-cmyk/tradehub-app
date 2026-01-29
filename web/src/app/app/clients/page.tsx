"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { Client } from "@/lib/demo";

export default function ClientsPage(){
  const [clients,setClients]=React.useState<Client[]>([]);
  React.useEffect(()=>{fetch("/api/clients",{cache:"no-store"}).then(r=>r.json()).then(setClients).catch(()=>setClients([]));},[]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="text-sm text-muted-foreground">CRM-grade client registry.</p>
      </div>
      <Card className="rounded-2xl border bg-card/40 p-0 overflow-hidden">
        <div className="grid grid-cols-12 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
          <div className="col-span-3">Client</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-3">Address</div>
        </div>
        {clients.map(c=>(
          <div key={c.id} className="grid grid-cols-12 px-4 py-3 hover:bg-accent/30">
            <div className="col-span-3 text-sm font-semibold">{c.name}</div>
            <div className="col-span-3 text-sm">{c.contact}</div>
            <div className="col-span-3 text-sm text-muted-foreground">{c.email}</div>
            <div className="col-span-3 text-sm">{c.address}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
