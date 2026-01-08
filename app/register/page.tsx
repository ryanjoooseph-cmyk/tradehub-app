// app/register/page.tsx
'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : 'Check your email to confirm your account.');
  }

  return (
    <main style={{ maxWidth: 380, margin: '4rem auto' }}>
      <h1>Create account</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Create</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}
