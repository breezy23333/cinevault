import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function redirectToNotifications(
  request: NextRequest,
  result: "unsubscribed" | "invalid",
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

    const unsubscribeTokenHash = hashToken(token);

    const subscription =
      await prisma.emailSubscription.findUnique({
        where: {
          unsubscribeTokenHash,
        },
      });

    if (!subscription) {
      return redirectToNotifications(request, "invalid");
    }

    if (subscription.status !== "unsubscribed") {
      await prisma.emailSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: "unsubscribed",
          verificationTokenHash: null,
          verificationExpiresAt: null,
        },
      });
    }

    return redirectToNotifications(request, "unsubscribed");
  } catch (error) {
    console.error("Email unsubscribe error:", error);
    return redirectToNotifications(request, "invalid");
  }
}
