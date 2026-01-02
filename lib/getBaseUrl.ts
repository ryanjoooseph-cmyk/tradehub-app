// lib/getBaseUrl.ts
export default function getBaseUrl() {
  const ext = process.env.RENDER_EXTERNAL_URL;
  if (ext) return `https://${ext}`;
  const explicit = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicit) return explicit;
  return "http://localhost:3000";
}
