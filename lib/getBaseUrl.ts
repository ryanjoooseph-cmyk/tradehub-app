// lib/getBaseUrl.ts
// Returns an origin when running on the server; empty string in the browser.
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return ""; // client: keep relative fetch
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||    // optional: you can set this in Render
    process.env.RENDER_EXTERNAL_URL ||     // Render provides this automatically
    "http://localhost:3000"                // dev fallback
  );
}
