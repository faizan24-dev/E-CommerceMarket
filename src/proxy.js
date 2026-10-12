import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/server/auth/sessionCookie";

/**
 * Fast, optimistic redirect for signed-out visitors on private pages. It only
 * checks that a session cookie exists; the real check (is the session valid,
 * does the user have the right role) runs in each area's layout on the server.
 */
export function proxy(request) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*", "/sell/:path*", "/admin/:path*"],
};
