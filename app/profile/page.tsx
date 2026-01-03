// app/profile/page.tsx
'use client';

import getBrowserClient from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // this will throw immediately if envs are not present
    const supabase = getBrowserClient();
    if (supabase) setReady(true);
  }, []);

  return <main>Profile {ready ? 'ready' : ''}</main>;
}
