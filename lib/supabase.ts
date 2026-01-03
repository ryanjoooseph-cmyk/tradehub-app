import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "";

// named export used by /app/profile/page.tsx
export function getBrowserClient(): SupabaseClient<any, "public", any> {
  return createClient(supabaseUrl, supabaseKey);
}

// optional server helper
export function getServerClient(): SupabaseClient<any, "public", any> {
  return createClient(
    process.env.SUPABASE_URL || supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey
  );
}

// default export too (covers default-import usages)
export default getBrowserClient;
