import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

type Ctx = any;
async function resolveId(ctx: Ctx): Promise<string> {
  const p = ctx?.params;
  if (!p) return '';
  if (typeof p?.then === 'function') { const v = await p; return v?.id ?? ''; }
  return p?.id ?? '';
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx); if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const s = getAdminClient();
  const { data, error } = await s.from('invoices').select('*').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ invoice: data }, { status: 200 });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx); if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const s = getAdminClient(); const body = await req.json();
  const { data, error } = await s.from('invoices').update(body).eq('id', id).select('*').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invoice: data }, { status: 200 });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx); if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const s = getAdminClient(); const { error } = await s.from('invoices').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(null, { status: 204 });
}
