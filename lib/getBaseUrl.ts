// lib/getBaseUrl.ts
export function getBaseUrl(): string {
  // Prefer Render’s external URL, then NEXT_PUBLIC_BASE_URL, then localhost
  const ext = process.env.RENDER_EXTERNAL_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const origin = ext
    ? (ext.startsWith('http') ? ext : `https://${ext}`)
    : 'http://localhost:3000';
  const u = new URL(origin);
  return u.origin; // "https://tradehub-app.onrender.com"
}

export function api(path: string): string {
  const base = getBaseUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
