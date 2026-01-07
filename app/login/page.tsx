'use client';
import { useState } from 'react';
import getSupabase from '../../lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const s = getSupabase(); const r = useRouter();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState<string|undefined>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(undefined);
    const { error } = await s.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message); else r.replace('/');
  };

  return (
    <main style={{padding:24,maxWidth:420}}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit} style={{display:'grid',gap:8}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Sign in</button>
      </form>
      <p>{err}</p>
      <p style={{marginTop:12}}><a href="/register">Create an account</a></p>
    </main>
  );
}
