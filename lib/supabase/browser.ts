import { createClient } from '@supabase/supabase-js';

let _c: ReturnType<typeof createClient> | null = null;
export default function getBrowserClient() {
  if (_c) return _c;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL/ANON_KEY');
  _c = createClient(url, key);
  return _c;
}
