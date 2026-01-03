export const getBaseUrl = (): string => {
  const env =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.VERCEL_URL;

  if (env) {
    const url = env.startsWith('http') ? env : `https://${env}`;
    try {
      const u = new URL(url);
      return `${u.protocol}//${u.host}`;
    } catch {
      // fall through
    }
  }
  return 'http://localhost:3000';
};

export default getBaseUrl;
