import { NextResponse, type NextRequest } from "next/server";
import {
  createHumanToken,
  HUMAN_COOKIE,
  HUMAN_MAX_AGE,
} from "@/lib/humanVerification";

export const runtime = "nodejs";

const TEST_SECRET = "1x0000000000000000000000000000000AA";

function fail(message: string, status: number) {
  return NextResponse.json(
    { ok: false, error: message },
    {
      status,
      headers: { "Cache-Control": "private, no-store" },
    }
  );
}

export async function POST(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  const expectedOrigin = isProduction
    ? "https://cinryvan.vercel.app"
    : req.nextUrl.origin;

  if (req.headers.get("origin") !== expectedOrigin) {
    return fail("Request origin is not allowed.", 403);
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret || (isProduction && secret === TEST_SECRET)) {
    return fail("Verification is not configured.", 503);
  }

  let token: unknown;

  try {
    // Limit the body before parsing it.
    const reader = req.body?.getReader();
    if (!reader) return fail("Missing verification token.", 400);

    const chunks: Uint8Array[] = [];
    let size = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;

      if (size > 4096) {
        await reader.cancel();
        return fail("Request is too large.", 413);
      }

      chunks.push(value);
    }

    const body: unknown = JSON.parse(
      Buffer.concat(chunks).toString("utf8")
    );

    if (
      typeof body !== "object" ||
      body === null ||
      !("token" in body)
    ) {
      return fail("Missing verification token.", 400);
    }

    token = body.token;
  } catch {
    return fail("Invalid verification request.", 400);
  }

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048
  ) {
    return fail("Invalid verification token.", 400);
  }

  try {
    const verificationResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!verificationResponse.ok) {
      return fail("Verification is unavailable. Please retry.", 503);
    }

    const result = (await verificationResponse.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };

    // Dummy keys are allowed only during local development.
    const localTest =
      process.env.NODE_ENV === "development" &&
      secret === TEST_SECRET;

    const expectedHostname = new URL(expectedOrigin).hostname;

    if (
      result.success !== true ||
      (!localTest &&
        (result.hostname !== expectedHostname ||
          result.action !== "site_access"))
    ) {
      return fail("Verification failed. Please try again.", 403);
    }

    const response = NextResponse.json(
      { ok: true },
      {
        headers: { "Cache-Control": "private, no-store" },
      }
    );

    response.cookies.set(HUMAN_COOKIE, createHumanToken(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: HUMAN_MAX_AGE,
    });

    return response;
  } catch {
    return fail("Verification is unavailable. Please retry.", 503);
  }
}