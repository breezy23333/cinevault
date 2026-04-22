import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Protect /admin and /api/admin
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin");
  if (!isAdminPath) return NextResponse.next();

  const urlKey = req.nextUrl.searchParams.get("key");
  const cookieKey = req.cookies.get("admin_key")?.value;
  const adminKey = process.env.ADMIN_KEY || "";

  // If ?key= provided and correct, store cookie and clean URL
  if (urlKey && urlKey === adminKey) {
    const res = NextResponse.redirect(new URL(req.nextUrl.pathname, req.url));
    res.cookies.set("admin_key", urlKey, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return res;
  }

  // No cookie or wrong cookie → block
  if (!cookieKey || cookieKey !== adminKey) {
    return new NextResponse("Unauthorized. Append ?key=YOUR_ADMIN_KEY to the URL.", { status: 401 });
  }

  return NextResponse.next();
}

// Only run on these paths
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
