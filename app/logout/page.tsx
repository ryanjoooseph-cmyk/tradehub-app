'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Logout() {
  const r = useRouter();
  useEffect(() => { supabase.auth.signOut().then(() => r.push('/login')); }, [r]);
  return <main style={{ padding: 24 }}>Signing out…</main>;
}
