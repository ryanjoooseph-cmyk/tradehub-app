// lib/getBaseUrl.ts

/**
 * Returns a normalized absolute origin for the current deployment.
 * Guarantees protocol and a trailing slash so URL(...) can safely join paths.
 */
export function getBaseUrl(): string {
  const ext =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "";

  if (ext) {
    const origin = ext.startsWith("http") ? ext : `https://${ext}`;
    return origin.endsWith("/") ? origin : `${origin}/`;
  }

  // Local dev fallback
  return "http://localhost:3000/";
}

/**
 * Build a fully-qualified URL to an API path.
 * Usage: fetch(api('/api/jobs'))
 */
export function api(path: string): string {
  // new URL safely joins base + path regardless of leading/trailing slashes
  return new URL(path, getBaseUrl()).toString();
}
