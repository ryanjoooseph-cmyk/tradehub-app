// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    r.push('/dashboard'); // or wherever your app starts
  }

  async function magicLink() {
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: 'https://tradehub-app.onrender.com' }});
    setBusy(false);
    if (error) setErr(error.message);
    else alert('Check your email for a sign-in link.');
  }

  return (
    <main style={{ maxWidth: 380, margin: '4rem auto' }}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={busy}>{busy ? 'Signing in…' : 'Continue'}</button>
      </form>
      <button onClick={magicLink} disabled={busy} style={{ marginTop: 12 }}>
        Send magic link
      </button>
      {err && <p style={{ color:'red' }}>{err}</p>}
      <p style={{ marginTop: 16 }}>
        No account? <a href="/register">Create one</a>
      </p>
    </main>
  );
}
