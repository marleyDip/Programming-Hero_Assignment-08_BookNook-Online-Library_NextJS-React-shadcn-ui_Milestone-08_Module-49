/**
 *
 * Next.js 16 renamed "middleware" to "proxy")
 *
 * Sends logged-out visitors away from private routes to /login?callbackUrl=...
 * This is an optimistic cookie check. Always verify the session again on the
 * server (auth.api.getSession) before returning private data.
 *
 */

import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const PRIVATE_ROUTES = ["/add-book", "/my-books", "/my-borrows", "/profile"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(getSessionCookie(request));

  const isPrivate = PRIVATE_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isPrivate && !hasSession) {
    const url = new URL("/login", request.url);

    url.searchParams.set("callbackUrl", pathname + search);

    return NextResponse.redirect(url);
  }

  // Logged-in users have no reason to see login / register
  if (hasSession && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book/:path*",
    "/my-books/:path*",
    "/my-borrows/:path*",
    "/profile/:path*",
    "/books/:path+",
    "/login",
    "/register",
  ],
};
