'use client';
import { useEffect } from 'react';
import getSupabase from '../../lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const s = getSupabase(); const r = useRouter();
  useEffect(() => { s.auth.signOut().finally(()=>r.replace('/login')); }, []);
  return <main style={{padding:24}}>Signing out…</main>;
}
