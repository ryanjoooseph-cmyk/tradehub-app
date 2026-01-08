'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password: pw
    });
    if (error) { setMsg(error.message); setBusy(false); return; }
    r.push('/dashboard'); // success → go see the app
  }

  async function sendMagicLink() {
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMsg(error.message); else setMsg('Check your inbox for a magic link.');
    setBusy(false);
  }

  return (
    <main style={{ maxWidth: 420, margin: '64px auto', lineHeight: 1.6 }}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)} required
          style={{ display:'block', width:'100%', margin:'8px 0' }}
        />
        <input
          type="password" placeholder="Password" value={pw}
          onChange={e => setPw(e.target.value)} required
          style={{ display:'block', width:'100%', margin:'8px 0' }}
        />
        <button disabled={busy} type="submit">Continue</button>
      </form>

      <p style={{ marginTop: 12 }}>
        <button disabled={busy} onClick={sendMagicLink}>Send magic link</button>
      </p>

      <p style={{ color: 'crimson' }}>{msg}</p>

      <p style={{ marginTop: 20 }}>
        No account? <a href="/register">Create one</a>
      </p>
    </main>
  );
}
