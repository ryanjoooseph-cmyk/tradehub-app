/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: jobs, error: jErr } = await supabaseAdmin
      .from("jobs")
      .select("id,title,client_id,created_at,updated_at,total_cents,status")
      .order("created_at", { ascending: false })
      .limit(200);

    if (jErr) return NextResponse.json({ ok: false, error: jErr.message }, { status: 500 });

    const jobIds = (jobs || []).map((j: any) => j.id);
    const clientIds = Array.from(new Set((jobs || []).map((j: any) => j.client_id).filter(Boolean)));

    const [{ data: disputes }, { data: clients }] = await Promise.all([
      jobIds.length
        ? supabaseAdmin.from("disputes").select("id,job_id,status,created_at,updated_at").in("job_id", jobIds)
        : Promise.resolve({ data: [] as any[] }),
      clientIds.length
        ? supabaseAdmin.from("clients").select("id,name,email").in("id", clientIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const disputesByJob: Record<string, any[]> = {};
    (disputes || []).forEach((d: any) => {
      disputesByJob[d.job_id] = disputesByJob[d.job_id] || [];
      disputesByJob[d.job_id].push(d);
    });

    const clientsById: Record<string, any> = {};
    (clients || []).forEach((c: any) => (clientsById[c.id] = c));

    const escrows = (jobs || []).map((j: any) => {
      const hasDispute = (disputesByJob[j.id] || []).length > 0;
      const total = j.total_cents || 0;

      const status =
        hasDispute ? "On Hold" :
        j.status === "completed" ? "Released" :
        total > 0 ? "Funded" :
        "Pending";

      const released = status === "Released" ? total : 0;
      const held = total - released;

      return {
        id: `esc_${j.id}`,
        jobId: j.id,
        jobTitle: j.title || "Untitled job",
        client: clientsById[j.client_id]?.name || "Unknown",
        status,
        totalCents: total,
        heldCents: held,
        releasedCents: released,
        createdAt: j.created_at,
        milestones: [],
        ledger: [
          { id: `l_${j.id}_1`, ts: j.created_at, type: total > 0 ? "Fund" : "Note", amountCents: total > 0 ? total : undefined, note: total > 0 ? "Derived: job funded" : "Derived: job created" },
          ...(hasDispute ? [{ id: `l_${j.id}_d`, ts: (disputesByJob[j.id][0]?.created_at || j.created_at), type: "Dispute", note: "Derived: dispute exists on this job" }] : []),
        ],
      };
    });

    return NextResponse.json({ ok: true, escrows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
