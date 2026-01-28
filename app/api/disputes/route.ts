import { NextRequest, NextResponse } from "next/server";
import getAdminClient from "@/lib/supabase/admin";
import { requireApiKey } from "@/lib/api/requireApiKey";

type DisputeInsert = {
  job_id?: string | null;
  invoice_id?: string | null;
  reason?: string | null;
  status?: string | null;
};

export async function GET(req: NextRequest) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const s = getAdminClient();
  const { data, error } = await s
    .from("disputes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ disputes: data ?? [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const body = (await req.json()) as Partial<DisputeInsert>;

  // whitelist fields
  const payload: DisputeInsert = {
    job_id: body.job_id ?? null,
    invoice_id: body.invoice_id ?? null,
    reason: body.reason ?? null,
    status: body.status ?? "open",
  };

  const s = getAdminClient();
  const { data, error } = await s
    .from("disputes")
    .insert(payload)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispute: data }, { status: 201 });
}
