// app/api/jobs/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

function getClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
}

export async function GET() {
  try {
    const { data, error } = await getClient()
      .from("jobs")
      .select("id,title,created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const raw = typeof body?.title === "string" ? body.title : "";
    const title = raw.trim();
    if (!title) {
      return NextResponse.json({ ok: false, error: "title required" }, { status: 400 });
    }

    const { data, error } = await getClient()
      .from("jobs")
      .insert({ title })
      .select("id,title,created_at")
      .single();

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
