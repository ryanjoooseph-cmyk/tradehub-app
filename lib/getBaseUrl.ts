export function getBaseUrl(): string {
  const fromEnv =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";

  if (fromEnv) {
    const full = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
    return full.replace(/\/+$/, "");
  }

  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}

export function api(path = "/"): string {
  const base = getBaseUrl();
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

export default getBaseUrl;
