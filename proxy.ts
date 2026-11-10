import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/userSession";
import { protectRequest } from "@/lib/requestProtection";
import { hasPaidMembership } from "@/lib/membership";
import {
  HUMAN_COOKIE,
  isHumanTokenValid,
} from "@/lib/humanVerification";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

function continueRequest() {
  return noStore(NextResponse.next());
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const matchesRoute = (route: string) =>
    path === route || path.startsWith(`${route}/`);

  const isRead = req.method === "GET" || req.method === "HEAD";

  // Only these exact background-job routes can bypass Turnstile.
  // They must supply the correct secret, even during development.
  const isCronPath =
    path === "/api/cron/catalog-sync" ||
    path === "/api/games/sync";

  if (isCronPath) {
    const secret = process.env.CRON_SECRET;

    if (
      req.method !== "GET" ||
      !secret ||
      req.headers.get("authorization") !== `Bearer ${secret}`
    ) {
      return noStore(
        NextResponse.json(
          { ok: false, error: "Unauthorized" },
          { status: 401 }
        )
      );
    }

    // The route also checks its own authorization.
    return continueRequest();
  }

  // Preserve existing Redis protection, including limits on
  // verification requests.
  const protectionResponse = await protectRequest(req);
  if (protectionResponse) return protectionResponse;
  // PayPal cannot complete browser-based human verification.
  // This exact route verifies PayPal's signature itself.
  if (path === "/api/paypal/webhook" && req.method === "POST") {
    return continueRequest();
  }

  // Visitors must be able to load and complete verification.
  const isVerificationRequest =
    (path === "/verify-human" && isRead) ||
    (path === "/api/verify-human" && req.method === "POST");

  // These expose crawler instructions, not content access.
  const isCrawlerMetadata =
    isRead &&
    (path === "/robots.txt" || path === "/sitemap.xml");

  if (isVerificationRequest || isCrawlerMetadata) {
    const response = continueRequest();

    if (path === "/verify-human") {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }

    return response;
  }

  // A cookie's presence alone is not enough:
  // verify its signature and expiration.
  let verified = false;

  try {
    verified = isHumanTokenValid(
      req.cookies.get(HUMAN_COOKIE)?.value
    );
  } catch {
    return noStore(
      NextResponse.json(
        {
          ok: false,
          error: "Verification is temporarily unavailable.",
        },
        { status: 503 }
      )
    );
  }

  if (!verified) {
    // APIs and writes receive an error rather than an HTML redirect.
    if (matchesRoute("/api") || !isRead) {
      return noStore(
        NextResponse.json(
          {
            ok: false,
            error: "Please verify you are human before continuing.",
            code: "HUMAN_VERIFICATION_REQUIRED",
            verificationUrl: "/verify-human",
          },
          { status: 403 }
        )
      );
    }

    const verificationUrl = new URL("/verify-human", req.url);
    verificationUrl.searchParams.set(
      "next",
      `${path}${req.nextUrl.search}`
    );

    const response = noStore(
      NextResponse.redirect(verificationUrl)
    );

    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }

  // Preserve existing admin protection after human verification.
  const isAdminPath =
    matchesRoute("/admin") || matchesRoute("/api/admin");

  if (isAdminPath) {
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey) {
      return noStore(
        new NextResponse("Admin access is not configured.", {
          status: 503,
        })
      );
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

      const response = noStore(
        NextResponse.redirect(redirectUrl)
      );

      response.cookies.set("admin_key", adminKey, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      response.headers.set("Referrer-Policy", "no-referrer");
      return response;
    }

    if (cookieKey !== adminKey) {
      return noStore(
        new NextResponse("Unauthorized", { status: 401 })
      );
    }

    return continueRequest();
  }

   // These pages remain available without a subscription.
  const publicPages = new Set([
    "/login",
    "/signup",
    "/privacy",
    "/terms",
    "/support",
    "/contact",
  ]);

  // Exact authentication/support endpoints.
  // Their route handlers retain their own validation.
  const publicApiRoutes = new Set([
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/logout",
    "/api/auth/me",
    "/api/contact",
  ]);

  if (
    (isRead && publicPages.has(path)) ||
    publicApiRoutes.has(path)
  ) {
    return continueRequest();
  }

  const isApi = matchesRoute("/api");

  const denyAccess = (
    status: number,
    code: string,
    message: string,
    destination: string
  ) => {
    if (isApi || !isRead) {
      return noStore(
        NextResponse.json(
          {
            ok: false,
            error: message,
            code,
            redirectUrl: destination,
          },
          { status }
        )
      );
    }

    return noStore(
      NextResponse.redirect(new URL(destination, req.url))
    );
  };

  // Reject missing/malformed session cookies before querying the DB.
  // A valid-looking cookie must still pass getSessionUser().
  const sessionToken = req.cookies.get("cinryvan_session")?.value;

  if (!sessionToken || !/^[a-f0-9]{64}$/i.test(sessionToken)) {
    return denyAccess(
      401,
      "AUTHENTICATION_REQUIRED",
      "Please sign in to continue.",
      "/login"
    );
  }

  try {
    const user = await getSessionUser();

    if (!user) {
      return denyAccess(
        401,
        "AUTHENTICATION_REQUIRED",
        "Please sign in to continue.",
        "/login"
      );
    }

    // Signed-in users must be able to subscribe and manage
    // their account before purchasing membership.
    const accountPages = new Set([
      "/subscribe",
      "/profile",
      "/settings",
    ]);

    if (isRead && accountPages.has(path)) {
      return continueRequest();
    }

    if (
      path === "/api/paypal/checkout" &&
      req.method === "POST"
    ) {
      return continueRequest();
    }

    // All remaining matched content pages and APIs require payment.
    const hasMembership = await hasPaidMembership(user.id);

    if (!hasMembership) {
      return denyAccess(
        403,
        "SUBSCRIPTION_REQUIRED",
        "An active paid membership is required.",
        "/subscribe"
      );
    }

    return continueRequest();
  } catch {
    console.error(
      "MEMBERSHIP CHECK ERROR: Access verification failed."
    );

    return noStore(
      NextResponse.json(
        {
          ok: false,
          error:
            "Unable to verify your membership. Please try again.",
        },
        { status: 503 }
      )
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static/|_next/webpack-hmr|_vercel/insights/|_vercel/speed-insights/|favicon\\.ico$|icon\\.png$|manifest\\.webmanifest$).*)",
  ],
};