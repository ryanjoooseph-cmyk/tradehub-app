'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>TradeHub Dashboard</h1>
      <p>Scaffolded: ui_shell_dashboard_001</p>
      <p>Signed in as: <strong>{email ?? '...'}</strong></p>
      <p><Link href="/logout">Sign out</Link></p>
    </main>
  );
}
