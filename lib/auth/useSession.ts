'use client';
import { useEffect, useState } from 'react';
import getSupabase from '../supabase/browser';

export type Sess = { user: { id: string; email?: string|null } } | null;

export default function useSession() {
  const s = getSupabase();
  const [sess, setSess] = useState<Sess>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await s.auth.getSession();
      if (mounted) { setSess(data.session ? { user: data.session.user } : null); setReady(true); }
    })();
    const { data: sub } = s.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      setSess(session ? { user: session.user } : null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [s]);

  return { session: sess, ready };
}
