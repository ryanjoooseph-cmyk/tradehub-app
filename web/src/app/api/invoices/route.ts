/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: quotes, error } = await supabaseAdmin
      .from("quotes")
      .select("id,client_id,status,created_at,updated_at,job_id,total_cents")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const clientIds = Array.from(new Set((quotes || []).map((q: any) => q.client_id).filter(Boolean)));
    const clientsById: Record<string, any> = {};
    if (clientIds.length) {
      const { data: clients } = await supabaseAdmin.from("clients").select("id,name,email").in("id", clientIds);
      (clients || []).forEach((c: any) => (clientsById[c.id] = c));
    }

    const invoices = (quotes || []).map((q: any) => ({
      id: q.id,
      number: `Q-${String(q.id).slice(0, 6).toUpperCase()}`,
      client: clientsById[q.client_id]?.name || "Unknown",
      status:
        q.status === "paid" ? "Paid" :
        q.status === "sent" ? "Sent" :
        q.status === "overdue" ? "Overdue" :
        "Draft",
      amountCents: q.total_cents || 0,
      createdAt: q.created_at,
      dueAt: q.created_at,
      note: q.job_id ? `Job: ${q.job_id}` : undefined,
    }));

    return NextResponse.json({ ok: true, invoices });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
