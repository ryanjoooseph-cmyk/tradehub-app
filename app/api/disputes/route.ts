import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../lib/supabase/admin';

export async function GET() {
  const s = getAdminClient();
  const { data, error } = await s.from('disputes').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ disputes: data ?? [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const s = getAdminClient(); const body = await req.json(); // { job_id | invoice_id, reason, status }
  const { data, error } = await s.from('disputes').insert(body).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispute: data }, { status: 201 });
}
