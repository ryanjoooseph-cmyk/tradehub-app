import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (!code) return NextResponse.redirect(`${origin}/login`);

  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return NextResponse.redirect(`${origin}/login?err=auth_callback_failed`);
  if (type === "recovery") return NextResponse.redirect(`${origin}/reset-password`);

  return NextResponse.redirect(`${origin}/app`);
}
