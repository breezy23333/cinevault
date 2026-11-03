import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let contactLimiter: Ratelimit | undefined;

function getContactLimiter() {
  if (!contactLimiter) {
    contactLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "cinryvan:contact:v1",
      analytics: false,
      timeout: 3000,
    });
  }

  return contactLimiter;
}

export async function rateLimit(ip: string | undefined) {
  if (!ip) {
    throw new Error("Client IP unavailable");
  }

  const result = await getContactLimiter().limit(ip);

  // Upstash can return success on timeout.
  // Do not allow a contact submission without a completed check.
  if (result.reason === "timeout") {
    throw new Error("Rate limiter unavailable");
  }

  await result.pending;

  return {
    allowed: result.success,
    remaining: result.remaining,
    retryAfter: Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000)
    ),
  };
}
