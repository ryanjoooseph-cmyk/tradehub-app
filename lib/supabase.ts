import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _browser: SupabaseClient | null = null;

/**
 * Browser anon client (import-safe):
 * - Returns null if env is missing (prevents build/prerender crashes).
 */
export function getBrowserClient(): SupabaseClient | null {
  if (_browser) return _browser;

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    '';

  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';

  if (!url || !anon) return null;

  _browser = createClient(url, anon, { auth: { persistSession: true } });
  return _browser;
}

/**
 * Strict client: throws if env missing.
 * Use only in client components where env MUST exist.
 */
export function requireBrowserClient(): SupabaseClient {
  const c = getBrowserClient();
  if (!c) {
    throw new Error(
      'Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
  return c;
}

/**
 * Backwards-compatible named export:
 * Supports: import { supabase } from '@/lib/supabase'
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = requireBrowserClient();
    // @ts-expect-error - dynamic proxy access
    return client[prop];
  },
}) as SupabaseClient;

/**
 * Backwards-compatible default export:
 * Supports: import supabase from '@/lib/supabase'
 */
export default function supabaseDefault(): SupabaseClient {
  return requireBrowserClient();
}
