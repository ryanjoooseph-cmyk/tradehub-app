import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(_req: NextRequest) {
  void _req;
  return NextResponse.next();
}
