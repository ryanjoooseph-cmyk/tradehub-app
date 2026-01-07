import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient();
  const body = await req.json().catch(() => ({} as any));
  const payload = {
    title: String(body.title ?? '').trim(),
    status: String(body.status ?? 'pending'),
    client_id: body.client_id ?? null,
  };

  if (!payload.title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const { data, error } = await supabase.from('jobs').insert(payload).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
