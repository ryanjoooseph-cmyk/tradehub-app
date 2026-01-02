// lib/getBaseUrl.ts
export function getBaseUrl(): string {
  const render = process.env.RENDER_EXTERNAL_URL; // e.g. tradehub-app.onrender.com
  if (render) return `https://${render}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
