import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

/**
 * Exclude Next internals and raw assets from middleware,
 * so /sw.js is served directly from /public.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|site.webmanifest|manifest.json|sw.js|.*\\.map).*)'
  ]
};
