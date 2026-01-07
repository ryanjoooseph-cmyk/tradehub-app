import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../lib/supabase/admin';

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quotes: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient();
  const body = await req.json().catch(() => ({}));
  const { client_id, title, total = 0, status = 'draft' } = body ?? {};

  if (!client_id || !title) {
    return NextResponse.json({ error: 'client_id and title are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('quotes')
    .insert([{ client_id, title, total, status }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quote: data }, { status: 201 });
}
