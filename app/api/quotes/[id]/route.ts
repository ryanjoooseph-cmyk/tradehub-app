import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

// Handle both plain-object and Promise params that some Next types produce
type Ctx = any;
async function resolveId(ctx: Ctx): Promise<string> {
  const p = ctx?.params;
  if (!p) return '';
  if (typeof p?.then === 'function') {
    const v = await p;
    return v?.id ?? '';
  }
  return p?.id ?? '';
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx);
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ quote: data }, { status: 200 });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx);
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('quotes')
    .update(body)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quote: data }, { status: 200 });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx);
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getAdminClient();
  const { error } = await supabase.from('quotes').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(null, { status: 204 });
}
