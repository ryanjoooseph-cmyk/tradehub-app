import { NextResponse } from 'next/server';
import getAdminClient from '../../../lib/supabase/admin';

export async function GET() {
  const db = getAdminClient();
  const { data, error } = await db
    .from('clients')
    .select('id,name,email,phone,created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = (body?.name ?? '').toString().trim();
  const email = (body?.email ?? '').toString().trim() || null;
  const phone = (body?.phone ?? '').toString().trim() || null;

  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const db = getAdminClient();
  const { data, error } = await db
    .from('clients')
    .insert([{ name, email, phone }])
    .select('id,name,email,phone,created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
