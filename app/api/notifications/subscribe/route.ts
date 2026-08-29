import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_TOPICS = new Set([
  "movies",
  "tv",
  "gaming",
  "sports",
  "trailers",
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://cinryvan.vercel.app"
  ).replace(/\/$/, "");
}

async function sendVerificationEmail({
  email,
  verificationUrl,
  topics,
}: {
  email: string;
  verificationUrl: string;
  topics: string[];
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Email service is not configured.");
  }

  const from =
    process.env.EMAIL_FROM ||
    "CINRYVAN Alerts <onboarding@resend.dev>";

  const topicText = topics
    .map((topic) =>
      topic === "tv"
        ? "TV Shows"
        : topic.charAt(0).toUpperCase() + topic.slice(1),
    )
    .join(", ");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Confirm your CINRYVAN email alerts",
      html: `
        <div style="background:#05070d;padding:40px 20px;font-family:Arial,sans-serif;color:#ffffff;">
          <div style="max-width:620px;margin:0 auto;background:#10131a;border:1px solid #31343c;border-radius:24px;padding:36px;">
            <p style="margin:0;color:#facc15;font-size:12px;font-weight:800;letter-spacing:3px;">CINRYVAN ALERTS</p>
            <h1 style="margin:18px 0 12px;font-size:34px;line-height:1.1;">Confirm your subscription</h1>
            <p style="margin:0;color:#a8abb3;font-size:16px;line-height:1.7;">You requested email updates for: ${topicText}.</p>
            <a href="${verificationUrl}" style="display:inline-block;margin-top:28px;background:#facc15;color:#05070d;text-decoration:none;font-weight:800;padding:14px 22px;border-radius:12px;">Confirm Email Alerts</a>
            <p style="margin:28px 0 0;color:#6f737d;font-size:12px;line-height:1.6;">This confirmation link expires in 24 hours. If you did not request these alerts, ignore this email.</p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    console.error(
      "Resend verification email failed:",
      await response.text(),
    );
    throw new Error("Could not send the confirmation email.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(
      request.headers.get("content-length") || 0,
    );

    if (contentLength > 10_000) {
      return NextResponse.json(
        { error: "Subscription request is too large." },
        { status: 413 },
      );
    }

    const body: unknown = await request.json();
    const data = body as { email?: unknown; topics?: unknown };

    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";

    const requestedTopics: unknown[] = Array.isArray(data.topics)
      ? data.topics
      : [];

    const topics: string[] = Array.from(
      new Set(
        requestedTopics.filter(
          (topic): topic is string =>
            typeof topic === "string" && ALLOWED_TOPICS.has(topic),
        ),
      ),
    );

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!topics.length) {
      return NextResponse.json(
        { error: "Choose at least one alert topic." },
        { status: 400 },
      );
    }

    const existing = await prisma.emailSubscription.findUnique({
      where: { email },
    });

    if (
      existing?.status === "pending" &&
      existing.updatedAt > new Date(Date.now() - 60_000)
    ) {
      return NextResponse.json({
        success: true,
        message:
          "A confirmation email was recently sent. Check your inbox.",
      });
    }

    const verificationToken = randomBytes(32).toString("hex");
    const unsubscribeToken = randomBytes(32).toString("hex");
    const verificationTokenHash = hashToken(verificationToken);
    const unsubscribeTokenHash = hashToken(unsubscribeToken);
    const verificationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const forwardedFor = request.headers.get("x-forwarded-for");
    const consentIp =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const consentUserAgent =
      request.headers.get("user-agent")?.slice(0, 500) || null;

    await prisma.emailSubscription.upsert({
      where: { email },
      create: {
        email,
        topics,
        status: "pending",
        verificationTokenHash,
        verificationExpiresAt,
        unsubscribeTokenHash,
        consentIp,
        consentUserAgent,
      },
      update: {
        topics,
        status: "pending",
        verificationTokenHash,
        verificationExpiresAt,
        unsubscribeTokenHash,
        verifiedAt: null,
        consentedAt: new Date(),
        consentIp,
        consentUserAgent,
      },
    });

    const verificationUrl =
      `${getSiteUrl()}/api/notifications/verify` +
      `?token=${encodeURIComponent(verificationToken)}`;

    try {
      await sendVerificationEmail({ email, verificationUrl, topics });
    } catch (error) {
      console.error("Verification email error:", error);
      await prisma.emailSubscription
        .delete({ where: { email } })
        .catch(() => null);

      return NextResponse.json(
        {
          error:
            "We could not send the confirmation email. Try again later.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Check your email and confirm your CINRYVAN alerts.",
    });
  } catch (error) {
    console.error("Email subscription error:", error);
    return NextResponse.json(
      { error: "Could not create your subscription." },
      { status: 500 },
    );
  }
}
