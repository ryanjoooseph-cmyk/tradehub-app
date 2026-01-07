'use client';
import { useEffect, useState } from 'react';

type Tenant = { id: string; name?: string };

export default function TenantsPage() {
  const [items,setItems]=useState<Tenant[]>([]);
  const [chosen,setChosen]=useState<string|undefined>(undefined);

  useEffect(()=>{ (async()=>{
    const r = await fetch('/api/tenants',{cache:'no-store'}); const j = await r.json();
    setItems(j.tenants ?? []);
    const remember = localStorage.getItem('tenantId') || undefined;
    setChosen(remember);
  })(); }, []);

  const choose = (id: string) => { localStorage.setItem('tenantId', id); setChosen(id); };

  return (
    <div style={{padding:24}}>
      <h1>Tenants</h1>
      {items.length===0 && <p>No tenants yet. (UI works—DB not created.)</p>}
      <ul>
        {items.map(t=>(
          <li key={t.id}>
            <button onClick={()=>choose(t.id)}>{t.name || t.id}</button>
            {chosen===t.id && <span>  ← active</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
