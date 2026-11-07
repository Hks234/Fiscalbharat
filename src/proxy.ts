import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, CLIENT_COOKIE } from "@/lib/constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
  const clientToken = request.cookies.get(CLIENT_COOKIE)?.value;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (pathname.startsWith("/client") && !pathname.startsWith("/client/login") && !clientToken) {
    return NextResponse.redirect(new URL("/client/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
