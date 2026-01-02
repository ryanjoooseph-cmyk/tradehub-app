// lib/getBaseUrl.ts
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";        // client: keep relative fetch
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||                // optional override
    process.env.RENDER_EXTERNAL_URL ||                 // Render injects this
    "http://localhost:3000"                            // dev fallback
  );
}
