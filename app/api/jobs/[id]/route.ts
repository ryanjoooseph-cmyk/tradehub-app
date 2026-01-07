import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const updates = await req.json().catch(() => ({} as any));

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', params.id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient();
  const { error } = await supabase.from('jobs').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
