import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const userId =
    req.cookies.get("cinevault_user")?.value ||
    req.cookies.get("cinevault_user_id")?.value;

  const protectedRoutes = ["/watchlist", "/notifications", "/rooms"];
  const authRoutes = ["/login", "/signup"];

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && userId) {
    return NextResponse.redirect(new URL("/watchlist", req.url));
  }

  const isAdminPath =
    path.startsWith("/admin") || path.startsWith("/api/admin");

  if (isAdminPath) {
    const urlKey = req.nextUrl.searchParams.get("key");
    const cookieKey = req.cookies.get("admin_key")?.value;
    const adminKey = process.env.ADMIN_KEY || "";

    if (urlKey && urlKey === adminKey) {
      const res = NextResponse.redirect(new URL(path, req.url));
      res.cookies.set("admin_key", urlKey, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      return res;
    }

    if (!cookieKey || cookieKey !== adminKey) {
      return new NextResponse(
        "Unauthorized. Append ?key=YOUR_ADMIN_KEY to the URL.",
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",

    "/watchlist",
    "/watchlist/:path*",

    "/notifications",
    "/notifications/:path*",

    "/rooms",
    "/rooms/:path*",

    "/login",
    "/signup",
  ],
};