// lib/supabase/admin.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
