import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;

let _admin: SupabaseClient | null = null;

export default function getAdminClient(): SupabaseClient {
  if (_admin) return _admin;
  _admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _admin;
}
