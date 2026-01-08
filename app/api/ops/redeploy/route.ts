import { NextResponse } from 'next/server';

export async function POST() {
  const hook = process.env.RENDER_DEPLOY_HOOK;
  if (!hook) return NextResponse.json({ error: 'Missing RENDER_DEPLOY_HOOK' }, { status: 500 });

  const r = await fetch(hook, { method: 'POST' });
  const ok = r.ok;
  const text = await r.text().catch(()=> '');
  return NextResponse.json({ ok, status: r.status, text });
}
