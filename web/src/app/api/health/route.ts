import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sha =
    process.env.RENDER_GIT_COMMIT ||
    process.env.GIT_COMMIT ||
    process.env.NEXT_PUBLIC_GIT_SHA ||
    "unknown";

  const res = NextResponse.json({
    ok: true,
    sha,
    serviceId: process.env.RENDER_SERVICE_ID || null,
    externalUrl: process.env.RENDER_EXTERNAL_URL || null,
    ts: new Date().toISOString(),
  });

  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");

  return res;
}
