import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { rateLimit } from "../../../lib/rateLimit";

export const runtime = "nodejs";

const EMAIL_RE = /^(?=.{3,254}$)[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_FILL_MS = 1200;
const MAX_MSG = 1000;
const MAX_BODY_BYTES = 16_384;

function reply(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {}
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      ...extraHeaders,
    },
  });
}

async function readBody(req: Request): Promise<unknown> {
  if (!req.body) throw new Error("EMPTY_BODY");

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;

      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("BODY_TOO_LARGE");
      }

      text += decoder.decode(value, { stream: true });
    }

    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}

export async function POST(req: Request) {
  const contentType = req.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return reply(
      { ok: false, error: "Invalid content type." },
      415
    );
  }

  // Trust the forwarding header only in the Vercel environment.
  // Local testing uses one shared identifier.
  const ip =
    process.env.VERCEL === "1"
      ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : process.env.NODE_ENV === "development"
        ? "local-development"
        : undefined;

  let limit: Awaited<ReturnType<typeof rateLimit>>;

  try {
    limit = await rateLimit(ip);
  } catch {
    return reply(
      {
        ok: false,
        error: "Contact form temporarily unavailable. Please try again.",
      },
      503,
      { "Retry-After": "30" }
    );
  }

  if (!limit.allowed) {
    return reply(
      {
        ok: false,
        error: "Too many requests. Please wait before trying again.",
      },
      429,
      { "Retry-After": String(limit.retryAfter) }
    );
  }

  let parsed: unknown;

  try {
    parsed = await readBody(req);
  } catch (error: unknown) {
    const tooLarge =
      error instanceof Error && error.message === "BODY_TOO_LARGE";

    return reply(
      {
        ok: false,
        error: tooLarge ? "Request is too large." : "Invalid JSON.",
      },
      tooLarge ? 413 : 400
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return reply({ ok: false, error: "Invalid form data." }, 400);
  }

  const body = parsed as Record<string, unknown>;

  const field = (key: string) =>
    typeof body[key] === "string" ? body[key].trim() : "";

  const name = field("name");
  const email = field("email");
  const subject = field("subject");
  const message = field("message");
  const phone = field("phone");
  const company = field("company");

  if (company) {
    return reply({ ok: true, saved: false });
  }

  const invalid = (field: string, error: string) =>
    reply({ ok: false, field, error }, 400);

  if (!name || name.length > 100) {
    return invalid("name", "Enter a name of 1–100 characters.");
  }

  if (!EMAIL_RE.test(email)) {
    return invalid("email", "Enter a valid email.");
  }

  if (!subject || subject.length > 200) {
    return invalid("subject", "Enter a subject of 1–200 characters.");
  }

  if (!message || message.length > MAX_MSG) {
    return invalid("message", "Enter a message of 1–1000 characters.");
  }

  if (phone.length > 50) {
    return invalid("phone", "Phone number is too long.");
  }

  const ts =
    typeof body.ts === "number" || typeof body.ts === "string"
      ? Number(body.ts)
      : NaN;

  if (!Number.isFinite(ts) || ts <= 0 || Date.now() - ts < MIN_FILL_MS) {
    return reply(
      {
        ok: false,
        error: "Submitted too quickly. Please try again.",
      },
      400
    );
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        phone: phone || null,
        ip,
        ua: req.headers.get("user-agent")?.slice(0, 512) || null,
      },
    });
  } catch {
    // Do not log connection strings, form contents, or raw DB errors.
    console.error("[CONTACT] Failed to save contact message.");

    return reply(
      {
        ok: false,
        saved: false,
        error: "Unable to save your message. Please try again.",
      },
      503
    );
  }

  return reply({
    ok: true,
    saved: true,
    remaining: limit.remaining,
  });
}