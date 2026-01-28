import { NextRequest, NextResponse } from "next/server";
import getAdminClient from "@/lib/supabase/admin";
import { requireApiKey } from "@/lib/api/requireApiKey";

type Ctx = { params: { id: string } } | { params: Promise<{ id: string }> } | any;

async function getId(ctx: Ctx): Promise<string> {
  const p = ctx?.params;
  if (!p) return "";
  if (typeof p?.then === "function") {
    const resolved = await p;
    return resolved?.id ?? "";
  }
  return p?.id ?? "";
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const id = await getId(ctx);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const s = getAdminClient();
  const { data, error } = await s.from("disputes").select("*").eq("id", id).maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ dispute: data }, { status: 200 });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const id = await getId(ctx);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = (await req.json()) as Record<string, unknown>;
  const payload: Record<string, unknown> = {};
  for (const k of ["job_id", "invoice_id", "reason", "status"]) {
    if (k in body) payload[k] = body[k];
  }

  const s = getAdminClient();
  const { data, error } = await s
    .from("disputes")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispute: data }, { status: 200 });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const id = await getId(ctx);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const s = getAdminClient();
  const { error } = await s.from("disputes").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
