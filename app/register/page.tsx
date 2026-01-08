'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase.auth.signUp({ email, password: pw });
    if (error) { setMsg(error.message); return; }
    // If email confirmation is ON in Supabase, check inbox.
    // If OFF, user is already logged in:
    r.push('/dashboard');
  }

  return (
    <main style={{ maxWidth: 420, margin: '64px auto' }}>
      <h1>Create account</h1>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="you@example.com"
               value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password"
               value={pw} onChange={e=>setPw(e.target.value)} required />
        <button type="submit">Create</button>
      </form>
      <p style={{ color:'crimson' }}>{msg}</p>
    </main>
  );
}
