// lib/getBaseUrl.ts
export default function getBaseUrl(): string {
  // Prefer Render's canonical URL (or your own base) when present.
  const ext =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    '';

  if (ext) {
    try {
      // Normalize whatever you gave us into a proper origin.
      const asUrl = new URL(ext.startsWith('http') ? ext : `https://${ext}`);
      return asUrl.origin; // e.g., https://tradehub-app.onrender.com
    } catch {
      // Fall back to a best-effort https origin
      const cleaned = ext.replace(/^https?:\/?/, '');
      return `https://${cleaned}`;
    }
  }

  // Local dev fallback
  return 'http://localhost:3000';
}
