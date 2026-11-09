import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/userSession";
import { paypalRequest } from "@/lib/paypal";

export const runtime = "nodejs";
export const maxDuration = 60;

type PayPalSubscription = {
  id: string;
  status: string;
  plan_id?: string;
  custom_id?: string;
  links?: Array<{
    href: string;
    rel: string;
    method?: string;
  }>;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function POST(req: Request) {
  try {
    // Keep this first implementation restricted to test payments.
    if (process.env.PAYPAL_ENV !== "sandbox") {
      return json({ error: "Sandbox checkout is not configured." }, 503);
    }

    const planId = process.env.PAYPAL_PLAN_ID?.trim();
    const configuredUrl = process.env.CINRYVAN_APP_URL?.trim();

    if (!planId || !/^P-[A-Z0-9]+$/.test(planId) || !configuredUrl) {
      return json({ error: "Checkout configuration is incomplete." }, 503);
    }

    const appUrl = new URL(configuredUrl);

    if (
      appUrl.protocol !== "https:" &&
      !(
        appUrl.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(appUrl.hostname)
      )
    ) {
      return json({ error: "Invalid checkout site URL." }, 503);
    }

    // Only accept browser requests originating from our own site.
    if (req.headers.get("origin") !== appUrl.origin) {
      return json({ error: "Invalid request origin." }, 403);
    }

    const user = await getSessionUser();

    if (!user) {
      return json({ error: "Please sign in before subscribing." }, 401);
    }

    // Separate test subscriptions from future live subscriptions.
    const provider = "paypal:sandbox";

    const subscription = await prisma.$transaction(async (tx) => {
      // Serialize checkout creation for this user across requests.
      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id"
        FROM "User"
        WHERE "id" = ${user.id}
        FOR UPDATE
      `;

      const existing = await tx.paidSubscription.findFirst({
        where: {
          userId: user.id,
          provider,
          OR: [
            {
              status: {
                in: ["pending", "active", "approved", "suspended"],
              },
            },
            { paidThrough: { gt: new Date() } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      if (existing) return existing;

      return tx.paidSubscription.create({
        data: {
          userId: user.id,
          provider,
          providerPlanId: planId,
          status: "pending",
          currency: "USD",
          amountMinor: 100,
        },
      });
    });

    if (
      subscription.status !== "pending" ||
      (subscription.paidThrough &&
        subscription.paidThrough.getTime() > Date.now())
    ) {
      return json(
        { error: "You already have a subscription. Check its status first." },
        409
      );
    }

    if (subscription.providerPlanId !== planId) {
      return json(
        { error: "An earlier checkout uses a different plan. Contact support." },
        409
      );
    }

    // Avoid retrying an uncertain creation beyond the retry window.
    if (
      !subscription.providerSubscriptionId &&
      Date.now() - subscription.createdAt.getTime() > 24 * 60 * 60 * 1000
    ) {
      return json(
        { error: "An earlier checkout needs checking before you retry." },
        409
      );
    }

    let remote: PayPalSubscription;

    if (subscription.providerSubscriptionId) {
      // Reuse an existing checkout instead of making another subscription.
      try {
        remote = await paypalRequest<PayPalSubscription>(
            `/v1/billing/subscriptions/${encodeURIComponent(
            subscription.providerSubscriptionId
            )}`
        );
        } catch (error) {
        const missingSandboxSubscription =
            process.env.PAYPAL_ENV === "sandbox" &&
            error instanceof Error &&
            error.message === "PayPal API request failed (404)";

        if (!missingSandboxSubscription) {
            throw error;
        }

        // Confirm the configured plan is accessible with these credentials.
        const plan = await paypalRequest<{
            id: string;
            status: string;
        }>(`/v1/billing/plans/${encodeURIComponent(planId)}`);

        if (plan.id !== planId || plan.status !== "ACTIVE") {
            return json(
            { error: "The Sandbox subscription plan is unavailable." },
            503
            );
        }

        // Preserve the old record, but stop reusing an unpaid test checkout.
        const result = await prisma.paidSubscription.updateMany({
            where: {
            id: subscription.id,
            userId: user.id,
            provider: "paypal:sandbox",
            providerSubscriptionId: subscription.providerSubscriptionId,
            status: "pending",
            paidThrough: null,
            lastPaymentAt: null,
            payments: { none: {} },
            },
            data: {
            status: "checkout_missing",
            },
        });

        return json(
            {
            error:
                result.count === 1
                ? "The previous Sandbox checkout is unavailable. Click Continue to PayPal Sandbox again to start a new checkout."
                : "This subscription needs checking before another checkout can be created.",
            },
            409
        );
        }
    } else {
      remote = await paypalRequest<PayPalSubscription>(
        "/v1/billing/subscriptions",
        {
          method: "POST",
          // Retries for this local record use the same idempotency key.
          requestId: subscription.id,
          body: {
            plan_id: planId,
            custom_id: subscription.id,
            application_context: {
              brand_name: "CINRYVAN",
              shipping_preference: "NO_SHIPPING",
              user_action: "SUBSCRIBE_NOW",
              return_url: new URL(
                "/subscribe?checkout=returned",
                appUrl.origin
              ).href,
              cancel_url: new URL(
                "/subscribe?checkout=cancelled",
                appUrl.origin
              ).href,
            },
          },
        }
      );

      if (typeof remote.id !== "string" || !/^I-[A-Z0-9]+$/.test(remote.id)) {
        throw new Error("Invalid PayPal subscription response");
      }

      await prisma.paidSubscription.update({
        where: { id: subscription.id },
        data: { providerSubscriptionId: remote.id },
      });
    }

    if (
      remote.plan_id !== undefined &&
      remote.plan_id !== planId
    ) {
      throw new Error("PayPal plan mismatch");
    }

    if (
      remote.custom_id !== undefined &&
      remote.custom_id !== subscription.id
    ) {
      throw new Error("PayPal subscription ownership mismatch");
    }

    if (remote.status !== "APPROVAL_PENDING") {
      return json(
        {
          error:
            "This checkout has already progressed. Check payment status before retrying.",
        },
        409
      );
    }

    const approvalLink = remote.links?.find(
      (link) => link.rel === "approve"
    )?.href;

    if (!approvalLink) {
      throw new Error("Missing PayPal approval link");
    }

    const approvalUrl = new URL(approvalLink);

    if (
      approvalUrl.protocol !== "https:" ||
      approvalUrl.hostname !== "www.sandbox.paypal.com" ||
      approvalUrl.username ||
      approvalUrl.password
    ) {
      throw new Error("Unexpected PayPal approval URL");
    }

    // Checkout approval is not proof of payment.
    // Only the verified payment handler will set paidThrough.
    return json({ approvalUrl: approvalUrl.href });
    } catch (error: unknown) {
    let reason = "Unclassified checkout error";

    if (error instanceof Error) {
      const safeMessages = [
        "Invalid PayPal subscription response",
        "PayPal plan mismatch",
        "PayPal subscription ownership mismatch",
        "Missing PayPal approval link",
        "Unexpected PayPal approval URL",
        "PayPal returned an invalid access token",
        "PAYPAL_ENV must be sandbox or live",
      ];

      if (
        safeMessages.includes(error.message) ||
        /^PayPal authentication failed \(\d{3}\)$/.test(error.message) ||
        /^PayPal API request failed \(\d{3}\)$/.test(error.message) ||
        /^Missing environment variable: [A-Z_]+$/.test(error.message)
      ) {
        reason = error.message;
      } else if (
        error.name === "TimeoutError" ||
        error.name === "AbortError"
      ) {
        reason = "PayPal request timed out";
      } else if (error.message === "fetch failed") {
        reason = "Network connection to PayPal failed";
      }

      if ("code" in error) {
        const code = String(error.code);

        if (/^P\d{4}$/.test(code)) {
          reason = `Prisma database error ${code}`;
        }
      }
    }

    // Log only controlled diagnostics, not credentials or payment data.
    console.error("PAYPAL CHECKOUT:", reason);

    return json(
      { error: "Unable to start checkout. Please try again shortly." },
      503
    );
  }
}