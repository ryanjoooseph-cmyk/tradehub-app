import { NextResponse } from "next/server";

function getSha(): string | null {
  return (
    process.env.RENDER_GIT_COMMIT ||
    process.env.GITHUB_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.COMMIT_SHA ||
    null
  );
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    env: process.env.NODE_ENV ?? "unknown",
    sha: getSha(),
  });
}
