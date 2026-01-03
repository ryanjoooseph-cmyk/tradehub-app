export function getBaseUrl(): string {
  const fromEnv =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL;

  const origin = fromEnv
    ? (fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`)
    : "http://localhost:3000";

  return origin.replace(/\/+$/, "");
}

/** Helper for server-side fetch paths */
export function api(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${p}`;
}

export default getBaseUrl; // provide both default + named to avoid import mismatches
