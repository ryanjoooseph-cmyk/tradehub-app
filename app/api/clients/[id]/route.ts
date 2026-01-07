import { NextResponse } from 'next/server';
import getAdminClient from '../../../../lib/supabase/admin';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const supabase = getAdminClient();
  const { error } = await supabase.from('clients').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
