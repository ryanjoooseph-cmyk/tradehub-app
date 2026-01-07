// lib/supabase/admin.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;

if (!url || !serviceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
}

let client: SupabaseClient | undefined;

export function getAdminSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false },
      global: { headers: { 'X-Client-Info': 'tradehub-admin' } },
    });
  }
  return client;
}

export type { SupabaseClient };
