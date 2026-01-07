import { NextResponse } from 'next/server';
import getAdminClient from '../../../lib/supabase/admin';

export async function GET() {
  const s = getAdminClient();
  const { data, error } = await s.from('tenants').select('*').order('created_at',{ascending:false});
  // If table doesn’t exist yet, return empty list instead of 500
  if (error) return NextResponse.json({ tenants: [] }, { status: 200 });
  return NextResponse.json({ tenants: data ?? [] }, { status: 200 });
}
