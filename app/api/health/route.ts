// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    sha:
      process.env.GITHUB_SHA ||
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.NEXT_PUBLIC_COMMIT_SHA ||
      null,
  });
}
