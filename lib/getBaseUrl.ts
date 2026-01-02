// lib/getBaseUrl.ts
export function getBaseUrl(): string {
  const ext =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  if (ext) {
    const url = ext.startsWith("http") ? ext : `https://${ext}`;
    const u = new URL(url);
    return u.origin; // always "https://host"
  }
  // local dev
  return "http://localhost:3000";
}
