import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';
type Ctx = any;
const idOf = async (c: Ctx) => (typeof c?.params?.then === 'function' ? (await c.params)?.id : c?.params?.id) ?? '';

export async function GET(_req: NextRequest, c: Ctx) {
  const id = await idOf(c); if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const s = getAdminClient(); const { data, error } = await s.from('payments').select('*').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ payment: data }, { status: 200 });
}
export async function PUT(req: NextRequest, c: Ctx) {
  const id = await idOf(c); if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const s = getAdminClient(); const body = await req.json();
  const { data, error } = await s.from('payments').update(body).eq('id', id).select('*').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payment: data }, { status: 200 });
}
export async function DELETE(_req: NextRequest, c: Ctx) {
  const id = await idOf(c); if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const s = getAdminClient(); const { error } = await s.from('payments').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(null, { status: 204 });
}
