import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('access_token');

  const protectedPrefixes = ['/dashboard', '/profile'];

  const isProtected = protectedPrefixes.some(p =>
    path === p || path.startsWith(p + '/')
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
