import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/userSession";
import { protectRequest } from "@/lib/requestProtection";

export async function proxy(req: NextRequest) {
    const protectionResponse = await protectRequest(req);
  if (protectionResponse) return protectionResponse;
  const path = req.nextUrl.pathname;

  const matchesRoute = (route: string) =>
    path === route || path.startsWith(`${route}/`);

  const isAdminPath =
    matchesRoute("/admin") || matchesRoute("/api/admin");

  if (isAdminPath) {
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey) {
      return new NextResponse("Admin access is not configured.", {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      });
    }

    const urlKey = req.nextUrl.searchParams.get("key");
    const cookieKey = req.cookies.get("admin_key")?.value;

    if (
      req.method === "GET" &&
      matchesRoute("/admin") &&
      urlKey === adminKey
    ) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.searchParams.delete("key");

      const response = NextResponse.redirect(redirectUrl);

      response.cookies.set("admin_key", adminKey, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      response.headers.set("Cache-Control", "private, no-store");
      response.headers.set("Referrer-Policy", "no-referrer");

      return response;
    }

    if (cookieKey !== adminKey) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "Cache-Control": "private, no-store" },
      });
    }

    return NextResponse.next();
  }

  const protectedRoutes = [
    "/watchlist",
    "/notifications",
    "/rooms",
    "/profile",
    "/settings",
  ];

  const authRoutes = ["/login", "/signup"];

  const isProtected = protectedRoutes.some(matchesRoute);
  const isAuthRoute = authRoutes.some(matchesRoute);

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  try {
    const user = await getSessionUser();

    if (isProtected && !user) {
      const response = NextResponse.redirect(
        new URL("/login", req.url)
      );

      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    if (isAuthRoute && user) {
      const response = NextResponse.redirect(
        new URL("/watchlist", req.url)
      );

      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error: unknown) {
    console.error("SESSION CHECK ERROR:", error);

    return new NextResponse(
      "Unable to verify your session. Please try again.",
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static/|_next/webpack-hmr|_vercel/insights/|_vercel/speed-insights/|favicon\\.ico$|icon\\.png$|manifest\\.webmanifest$).*)",
  ],
};