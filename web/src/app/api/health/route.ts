/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const env = process.env.NODE_ENV || "unknown";
  const sha = process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  const ts = new Date().toISOString();

  let db = { ok: false, error: "not_checked" } as any;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(url, anon);
    const { error } = await supabase.from("__healthcheck").select("id").limit(1);
    db = error ? { ok: false, error: error.message } : { ok: true };
  } catch (e: any) {
    db = { ok: false, error: String(e) };
  }

  return NextResponse.json({ ok: true, env, sha, ts, db });
}
