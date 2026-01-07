// app/clients/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function load() {
  const { data, error } = await supabaseAdmin()
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

async function create(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  if (!name) return;
  const { error } = await supabaseAdmin().from('clients').insert({ name, email, phone });
  if (!error) revalidatePath('/clients');
}

export default async function Page() {
  const rows = await load();
  return (
    <main style={{ padding: 24 }}>
      <h1>Clients</h1>
      <form action={create} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" />
        <input name="phone" placeholder="Phone" />
        <button type="submit">Add client</button>
      </form>
      <ul style={{ display: 'grid', gap: 6 }}>
        {rows.map((c: any) => (
          <li key={c.id}>
            <strong>{c.name}</strong>{' '}
            {c.email ? `– ${c.email}` : ''}{c.phone ? ` – ${c.phone}` : ''}
          </li>
        ))}
      </ul>
    </main>
  );
}
