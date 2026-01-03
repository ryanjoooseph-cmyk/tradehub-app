// lib/getBaseUrl.ts

/** Returns a valid absolute origin for server/client */
export function getBaseUrl(): string {
  const env =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  const origin = env.replace(/\/+$/, "");
  if (origin) return origin; // production/staging

  // dev fallback
  return "http://localhost:3000";
}

/** Builds an absolute URL for API calls, e.g. api('/api/jobs') */
export function api(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${p}`;
}

// keep default export for any legacy default imports
export default getBaseUrl;
