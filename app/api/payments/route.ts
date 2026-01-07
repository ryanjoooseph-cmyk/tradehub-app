import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../lib/supabase/admin';

export async function GET() {
  const s = getAdminClient();
  const { data, error } = await s.from('payments').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payments: data ?? [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const s = getAdminClient(); const body = await req.json(); // { invoice_id, amount, method, status }
  const { data, error } = await s.from('payments').insert(body).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payment: data }, { status: 201 });
}
