// app/quotes/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function load() {
  const { data, error } = await supabaseAdmin()
    .from('quotes')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  const { data: clients } = await supabaseAdmin()
    .from('clients')
    .select('id,name')
    .order('name');
  return { rows: data ?? [], clients: clients ?? [] };
}

async function create(formData: FormData) {
  'use server';
  const client_id = String(formData.get('client_id') || '').trim() || null;
  const total = Number(formData.get('total') || 0);
  const notes = String(formData.get('notes') || '').trim();
  const { error } = await supabaseAdmin().from('quotes').insert({ client_id, total, notes });
  if (!error) revalidatePath('/quotes');
}

export default async function Page() {
  const { rows, clients } = await load();
  return (
    <main style={{ padding: 24 }}>
      <h1>Quotes</h1>
      <form action={create} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <select name="client_id" defaultValue="">
          <option value="">No client</option>
          {clients.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input name="total" type="number" step="0.01" placeholder="Total" />
        <input name="notes" placeholder="Notes" />
        <button type="submit">Add quote</button>
      </form>
      <ul style={{ display: 'grid', gap: 6 }}>
        {rows.map((q: any) => (
          <li key={q.id}>
            <strong>${Number(q.total || 0).toFixed(2)}</strong>{' '}
            {q.clients?.name ? `– ${q.clients.name}` : ''}{' '}
            {q.notes ? `— ${q.notes}` : ''}
          </li>
        ))}
      </ul>
    </main>
  );
}
