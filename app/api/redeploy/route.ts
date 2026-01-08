// app/api/redeploy/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const hook = process.env.RENDER_DEPLOY_HOOK;
  if (!hook) {
    return NextResponse.json(
      { ok: false, error: 'RENDER_DEPLOY_HOOK not set' },
      { status: 500 },
    );
  }
  const res = await fetch(hook, { method: 'POST' });
  const text = await res.text();
  return NextResponse.json({ ok: res.ok, status: res.status, text });
}
