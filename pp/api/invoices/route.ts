import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../lib/supabase/admin';

export async function GET() {
  const s = getAdminClient();
  const { data, error } = await s.from('invoices').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invoices: data ?? [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const s = getAdminClient(); const body = await req.json(); // { client_id, total, status, due_on, ... }
  const { data, error } = await s.from('invoices').insert(body).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invoice: data }, { status: 201 });
}
