import { NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const db = getAdminClient();
  const { error } = await db.from('clients').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
