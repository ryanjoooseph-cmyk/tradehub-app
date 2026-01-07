import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const id = params.id;
  const body = await req.json().catch(() => ({}));
  const updates = { ...body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ job: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const id = params.id;

  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
