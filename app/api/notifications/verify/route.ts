import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function redirectToNotifications(
  request: NextRequest,
  result: "confirmed" | "expired" | "invalid",
) {
  const url = new URL("/notifications", request.url);
  url.searchParams.set("subscription", result);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim();

    if (!token || token.length > 256) {
      return redirectToNotifications(request, "invalid");
    }

    const verificationTokenHash = hashToken(token);

    const subscription =
      await prisma.emailSubscription.findUnique({
        where: {
          verificationTokenHash,
        },
      });

    if (!subscription || subscription.status !== "pending") {
      return redirectToNotifications(request, "invalid");
    }

    if (
      !subscription.verificationExpiresAt ||
      subscription.verificationExpiresAt <= new Date()
    ) {
      await prisma.emailSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          verificationTokenHash: null,
          verificationExpiresAt: null,
        },
      });

      return redirectToNotifications(request, "expired");
    }

    await prisma.emailSubscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: "active",
        verifiedAt: new Date(),
        verificationTokenHash: null,
        verificationExpiresAt: null,
      },
    });

    return redirectToNotifications(request, "confirmed");
  } catch (error) {
    console.error("Email verification error:", error);
    return redirectToNotifications(request, "invalid");
  }
}
