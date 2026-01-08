import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const hook = process.env.RENDER_DEPLOY_HOOK;
    if (!hook) return NextResponse.json({ ok: false, error: 'Missing RENDER_DEPLOY_HOOK' }, { status: 500 });
    const r = await fetch(hook, { method: 'POST' });
    return NextResponse.json({ ok: r.ok });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
