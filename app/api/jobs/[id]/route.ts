import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

type RouteCtx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: RouteCtx) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ job: data }, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: RouteCtx) {
  const supabase = getAdminClient();
  const payload = await req.json(); // partial update ok
  const { data, error } = await supabase
    .from('jobs')
    .update(payload)
    .eq('id', params.id)
    .select('*')
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ job: data }, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: RouteCtx) {
  const supabase = getAdminClient();
  const { error } = await supabase.from('jobs').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(null, { status: 204 });
}
