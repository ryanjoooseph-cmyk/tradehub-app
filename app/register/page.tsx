'use client';
import { useState } from 'react';
import getSupabase from '../../lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const s = getSupabase(); const r = useRouter();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState<string|undefined>(); const [ok,setOk]=useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(undefined);
    const { error } = await s.auth.signUp({ email, password });
    if (error) setErr(error.message); else { setOk(true); r.replace('/'); }
  };

  return (
    <main style={{padding:24,maxWidth:420}}>
      <h1>Create account</h1>
      <form onSubmit={onSubmit} style={{display:'grid',gap:8}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      {ok && <p>Check your email (if confirmations are enabled).</p>}
      <p>{err}</p>
      <p style={{marginTop:12}}><a href="/login">Back to login</a></p>
    </main>
  );
}
