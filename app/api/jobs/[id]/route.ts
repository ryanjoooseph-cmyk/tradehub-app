// app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

// Accept either plain params or Promise<params> (and any odd typing Next throws)
type Ctx = any;

async function resolveId(ctx: Ctx): Promise<string> {
  const p = ctx?.params;
  if (!p) return '';
  // If params is a Promise (some Next versions/types do this), await it
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
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ job: data }, { status: 200 });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx);
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('jobs')
    .update(body)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ job: data }, { status: 200 });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const id = await resolveId(ctx);
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getAdminClient();
  const { error } = await supabase.from('jobs').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(null, { status: 204 });
}
