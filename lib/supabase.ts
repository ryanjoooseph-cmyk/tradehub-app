// FILE: lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side admin client (never expose this in client bundles)
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
