import { NextResponse } from 'next/server';
export function middleware(req: Request) {
  const url = new URL(req.url);
  if (url.pathname === '/sw.js') {
    return NextResponse.rewrite(new URL('/api/sw', req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/sw.js'] };
