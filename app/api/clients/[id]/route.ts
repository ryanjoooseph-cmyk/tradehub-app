import { NextRequest, NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const db = getAdminClient();
  const { error } = await db.from('clients').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
