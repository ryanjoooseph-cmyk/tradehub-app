import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  try {
    const r = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
    return NextResponse.json({ ok: r.ok, status: r.status }, { status: r.ok ? 200 : 500 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
