import { NextResponse, type NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Each limit applies per IP address.
// Page and verification-submission limits are separate.
const POLICIES = {
  pages: { requests: 120, window: "60 s" },
  search: { requests: 30, window: "60 s" },
  apiRead: { requests: 120, window: "60 s" },
  apiWrite: { requests: 30, window: "60 s" },
  login: { requests: 10, window: "10 m" },
  signup: { requests: 5, window: "10 m" },
  images: { requests: 180, window: "60 s" },
  verificationPage: { requests: 12, window: "60 s" },
  verificationSubmit: { requests: 6, window: "60 s" },
} as const;

type Policy = keyof typeof POLICIES;
type BlockStatus = 429 | 503;

const REDIS_TIMEOUT_MS = 3000;
const UNAVAILABLE_RETRY_SECONDS = 30;

// Reuse clients within this server instance.
// Redis remains the shared source of rate-limit state.
let redis: Redis | undefined;
const limiters = new Map<Policy, Ratelimit>();

function getLimiter(policy: Policy): Ratelimit {
  const existing = limiters.get(policy);
  if (existing) return existing;

  redis ??= Redis.fromEnv();

  const settings = POLICIES[policy];

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      settings.requests,
      settings.window
    ),
    // Preserve existing production counters.
    prefix: `cinryvan:request:v1:${policy}`,
    analytics: false,
    ephemeralCache: false,
    timeout: REDIS_TIMEOUT_MS,
  });

  limiters.set(policy, limiter);
  return limiter;
}

function matches(path: string, route: string): boolean {
  return path === route || path.startsWith(`${route}/`);
}

function selectPolicy(req: NextRequest): Policy {
  const path = req.nextUrl.pathname;
  const isRead = req.method === "GET" || req.method === "HEAD";

  // Check verification routes before the general page/API rules.
  // Query strings do not create separate rate-limit buckets.
  if (matches(path, "/verify-human")) {
    return "verificationPage";
  }

  if (matches(path, "/api/verify-human")) {
    return "verificationSubmit";
  }

  if (matches(path, "/_next/image")) {
    return "images";
  }

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

function getClientIdentifier(req: NextRequest): string | null {
  // Only use forwarded IP headers in the existing Vercel deployment.
  if (process.env.VERCEL === "1") {
    const ip = req.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();

    return ip || null;
  }

  // Local testing deliberately shares one identifier.
  if (process.env.NODE_ENV === "development") {
    return "local-development";
  }

  // Do not silently trust client-supplied headers on other hosts.
  return null;
}

function blocked(
  req: NextRequest,
  status: BlockStatus,
  message: string,
  retryAfter: number
): NextResponse {
  const headers = {
    "Cache-Control": "private, no-store",
    "Retry-After": String(retryAfter),
    "X-Robots-Tag": "noindex, nofollow",
  };

  if (matches(req.nextUrl.pathname, "/api")) {
    return NextResponse.json(
      {
        ok: false,
        code:
          status === 429
            ? "RATE_LIMIT_EXCEEDED"
            : "REQUEST_PROTECTION_UNAVAILABLE",
        error: message,
      },
      { status, headers }
    );
  }

  // Return a small response directly, without another redirect.
  return new NextResponse(
    req.method === "HEAD" ? null : message,
    {
      status,
      headers: {
        ...headers,
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}

function unavailable(req: NextRequest): NextResponse {
  return blocked(
    req,
    503,
    "Request protection is temporarily unavailable. Please retry shortly.",
    UNAVAILABLE_RETRY_SECONDS
  );
}

function getRetryAfter(reset: number): number {
  if (!Number.isFinite(reset)) {
    return 60;
  }

  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}

export async function protectRequest(
  req: NextRequest
): Promise<NextResponse | null> {
  // Preserve the existing contact handler's own stricter limit.
  // Only this exact POST endpoint receives the exception.
  if (
    req.method === "POST" &&
    req.nextUrl.pathname === "/api/contact"
  ) {
    return null;
  }

  const identifier = getClientIdentifier(req);

  if (!identifier) {
    return unavailable(req);
  }

  try {
    const policy = selectPolicy(req);
    const result = await getLimiter(policy).limit(identifier);

    // Attach a rejection handler even when returning on timeout.
    // Background bookkeeping must not produce an unhandled rejection.
    const pending = result.pending.catch(() => undefined);

    // Upstash may report success on timeout. Explicitly reject it.
    if (result.reason === "timeout") {
      return unavailable(req);
    }

    await pending;

    if (!result.success) {
      return blocked(
        req,
        429,
        "Too many requests. Please wait before trying again.",
        getRetryAfter(result.reset)
      );
    }

    return null;
  } catch {
    // Reject when protection cannot run.
    // Never expose credentials or raw provider errors.
    return unavailable(req);
  }
}