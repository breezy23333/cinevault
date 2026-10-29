
import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const userId =
    req.cookies.get("cinryvan_user")?.value ||
    req.cookies.get("cinryvan_user_id")?.value;

  const protectedRoutes = [
    "/watchlist",
    "/notifications",
    "/rooms",
  ];

  const authRoutes = ["/login", "/signup"];

  const matchesRoute = (route: string) =>
    path === route || path.startsWith(`${route}/`);

  const isProtected = protectedRoutes.some(matchesRoute);
  const isAuthRoute = authRoutes.some(matchesRoute);

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && userId) {
    return NextResponse.redirect(new URL("/watchlist", req.url));
  }

  const isAdminPath =
    matchesRoute("/admin") ||
    matchesRoute("/api/admin");

  if (isAdminPath) {
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey) {
      return new NextResponse(
        "Admin access is not configured.",
        { status: 503 }
      );
    }

    const urlKey = req.nextUrl.searchParams.get("key");
    const cookieKey = req.cookies.get("admin_key")?.value;

    // Preserve the existing admin login flow.
    if (
      req.method === "GET" &&
      matchesRoute("/admin") &&
      urlKey === adminKey
    ) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.searchParams.delete("key");

      const res = NextResponse.redirect(redirectUrl);

      res.cookies.set("admin_key", adminKey, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      return res;
    }

    if (cookieKey !== adminKey) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/watchlist/:path*",
    "/notifications/:path*",
    "/rooms/:path*",
    "/login",
    "/signup",
  ],
};
