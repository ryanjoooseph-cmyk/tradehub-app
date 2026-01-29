import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = process.env.NODE_ENV === "production" ? "production" : (process.env.RENDER ? "production" : (process.env.NODE_ENV || "development"));
  const sha = process.env.RENDER_GIT_COMMIT || process.env.GIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  return NextResponse.json({ env, sha, version: sha, ts: new Date().toISOString() });
}
