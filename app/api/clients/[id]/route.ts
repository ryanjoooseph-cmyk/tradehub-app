import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const supabase = getAdminClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
