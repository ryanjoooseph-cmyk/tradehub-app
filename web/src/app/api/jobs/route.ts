import { NextResponse } from "next/server";
import { jobs } from "@/lib/demo";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(jobs);
}
