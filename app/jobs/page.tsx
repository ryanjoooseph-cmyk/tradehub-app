// app/jobs/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function load() {
  const { data, error } = await supabaseAdmin()
    .from('jobs')
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
  const title = String(formData.get('title') || '').trim();
  const client_id = String(formData.get('client_id') || '').trim() || null;
  if (!title) return;
  const { error } = await supabaseAdmin().from('jobs').insert({ title, client_id });
  if (!error) revalidatePath('/jobs');
}

export default async function Page() {
  const { rows, clients } = await load();
  return (
    <main style={{ padding: 24 }}>
      <h1>Jobs</h1>
      <form action={create} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <input name="title" placeholder="Job title" required />
        <select name="client_id" defaultValue="">
          <option value="">No client</option>
          {clients.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit">Add job</button>
      </form>
      <ul style={{ display: 'grid', gap: 6 }}>
        {rows.map((j: any) => (
          <li key={j.id}>
            <strong>{j.title}</strong>{' '}
            {j.clients?.name ? `– ${j.clients.name}` : ''} — {j.status}
          </li>
        ))}
      </ul>
    </main>
  );
}
