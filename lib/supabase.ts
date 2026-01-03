import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env vars are missing");
}

export function getBrowserClient() {
  return createClient(supabaseUrl, supabaseKey);
}

export function getServerClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
}

export default { getBrowserClient, getServerClient };
