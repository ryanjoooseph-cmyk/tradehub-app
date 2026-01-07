'use client';
import { useEffect, useState } from 'react';

export default function AdminHome() {
  const [cards, setCards] = useState<{label:string;count:number}[]>([]);
  useEffect(() => {
    (async () => {
      const [jobs, quotes, invoices, payments, disputes] = await Promise.all([
        fetch('/api/jobs',{cache:'no-store'}).then(r=>r.json()).catch(()=>({jobs:[]})),
        fetch('/api/quotes',{cache:'no-store'}).then(r=>r.json()).catch(()=>({quotes:[]})),
        fetch('/api/invoices',{cache:'no-store'}).then(r=>r.json()).catch(()=>({invoices:[]})),
        fetch('/api/payments',{cache:'no-store'}).then(r=>r.json()).catch(()=>({payments:[]})),
        fetch('/api/disputes',{cache:'no-store'}).then(r=>r.json()).catch(()=>({disputes:[]})),
      ]);
      setCards([
        { label: 'Jobs', count: (jobs.jobs || []).length },
        { label: 'Quotes', count: (quotes.quotes || []).length },
        { label: 'Invoices', count: (invoices.invoices || []).length },
        { label: 'Payments', count: (payments.payments || []).length },
        { label: 'Disputes', count: (disputes.disputes || []).length },
      ]);
    })();
  }, []);

  return (
    <main style={{padding:24}}>
      <h1>Admin</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
        {cards.map(c=>(
          <div key={c.label} style={{border:'1px solid #eee',borderRadius:8,padding:16}}>
            <div style={{fontSize:12,opacity:.7}}>{c.label}</div>
            <div style={{fontSize:28,fontWeight:600}}>{c.count}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
