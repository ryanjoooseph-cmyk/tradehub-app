// lib/getBaseUrl.ts
export function getBaseUrl(): string {
  // Browser: relative paths are fine
  if (typeof window !== "undefined") return "";
  // Server: use an absolute base
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||   // optional explicit
    process.env.RENDER_EXTERNAL_URL ||    // Render sets this automatically
    "http://localhost:3000"               // dev fallback
  );
}
