import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("id,name,email,phone,created_at,updated_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, clients: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
