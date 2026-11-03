import { NextResponse, type NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

type Policy =
  | "pages"
  | "search"
  | "apiRead"
  | "apiWrite"
  | "login"
  | "signup"
  | "images";

let limiters: Record<Policy, Ratelimit> | undefined;

function getLimiters() {
  if (limiters) return limiters;

  const redis = Redis.fromEnv();

  function create(
    policy: Policy,
    count: number,
    window: "60 s" | "10 m"
  ) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(count, window),
      prefix: `cinryvan:request:v1:${policy}`,
      analytics: false,
      ephemeralCache: false,
      timeout: 3000,
    });
  }

  limiters = {
    pages: create("pages", 120, "60 s"),
    search: create("search", 30, "60 s"),
    apiRead: create("apiRead", 120, "60 s"),
    apiWrite: create("apiWrite", 30, "60 s"),
    login: create("login", 10, "10 m"),
    signup: create("signup", 5, "10 m"),
    images: create("images", 180, "60 s"),
  };

  return limiters;
}

function matches(path: string, route: string) {
  return path === route || path.startsWith(`${route}/`);
}

function selectPolicy(req: NextRequest): Policy {
  const path = req.nextUrl.pathname;
  const isRead = req.method === "GET" || req.method === "HEAD";

  if (matches(path, "/_next/image")) return "images";

  if (!isRead && matches(path, "/api/auth/login")) {
    return "login";
  }

  if (!isRead && matches(path, "/api/auth/signup")) {
    return "signup";
  }

  if (
    matches(path, "/search") ||
    matches(path, "/games/search") ||
    matches(path, "/api/people/search")
  ) {
    return "search";
  }

  if (matches(path, "/api")) {
    return isRead ? "apiRead" : "apiWrite";
  }

  return isRead ? "pages" : "apiWrite";
}

function blocked(
  req: NextRequest,
  status: 429 | 503,
  message: string,
  retryAfter: number
) {
  const headers = {
    "Cache-Control": "private, no-store",
    "Retry-After": String(retryAfter),
  };

  if (matches(req.nextUrl.pathname, "/api")) {
    return NextResponse.json(
      { ok: false, error: message },
      { status, headers }
    );
  }

  return new NextResponse(message, {
    status,
    headers: {
      ...headers,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function protectRequest(
  req: NextRequest
): Promise<NextResponse | null> {
  // Contact POST already enforces its own stricter Redis limit.
  // Avoid charging two Redis checks for the same submission.
  if (
    req.method === "POST" &&
    matches(req.nextUrl.pathname, "/api/contact")
  ) {
    return null;
  }

  // Only trust forwarded IPs when hosted behind Vercel.
  // Local development deliberately shares one test identifier.
  const ip =
    process.env.VERCEL === "1"
      ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : process.env.NODE_ENV === "development"
        ? "local-development"
        : undefined;

  if (!ip) {
    return blocked(
      req,
      503,
      "Unable to verify this request. Please try again shortly.",
      30
    );
  }

  try {
    const policy = selectPolicy(req);
    const result = await getLimiters()[policy].limit(ip);

    if (result.reason === "timeout") {
      return blocked(
        req,
        503,
        "Request protection is temporarily unavailable. Please retry.",
        30
      );
    }

    await result.pending;

    if (!result.success) {
      return blocked(
        req,
        429,
        "Too many requests. Please wait before trying again.",
        Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
      );
    }

    return null;
  } catch {
    // Do not expose credentials or raw provider errors.
    return blocked(
      req,
      503,
      "Request protection is temporarily unavailable. Please retry.",
      30
    );
  }
}