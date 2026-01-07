import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../lib/supabase/admin';

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ jobs: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient();
  const body = await req.json().catch(() => ({}));
  const { client_id, title, status = 'new', scheduled_on, amount = 0 } = body ?? {};

  if (!client_id || !title) {
    return NextResponse.json({ error: 'client_id and title are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert([{ client_id, title, status, scheduled_on, amount }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ job: data }, { status: 201 });
}
