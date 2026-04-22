// lib/rateLimit.ts
const buckets = new Map<string, { tokens: number; ts: number }>();
const WINDOW_MS = 60_000;     // 1 min window
const MAX_TOKENS = 5;         // 5 requests / min / IP
const REFILL_RATE = MAX_TOKENS / WINDOW_MS; // tokens per ms

export function rateLimit(ip: string | undefined) {
  const key = ip || "unknown";
  const now = Date.now();
  const b = buckets.get(key) || { tokens: MAX_TOKENS, ts: now };
  const delta = now - b.ts;
  b.tokens = Math.min(MAX_TOKENS, b.tokens + delta * REFILL_RATE);
  b.ts = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return { allowed: false, remaining: 0 };
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return { allowed: true, remaining: b.tokens };
}
