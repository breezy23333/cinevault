import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  paypalRequest,
  verifyPayPalWebhook,
} from "@/lib/paypal";

export const runtime = "nodejs";
export const maxDuration = 120;

const PROVIDER = "paypal:sandbox";

const SUBSCRIPTION_EVENTS = new Set([
  "BILLING.SUBSCRIPTION.CREATED",
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.UPDATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
]);

const PAYMENT_EVENTS = new Set([
  "PAYMENT.SALE.COMPLETED",
  "PAYMENT.SALE.REFUNDED",
  "PAYMENT.SALE.REVERSED",
]);

type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid object");
  }

  return value as JsonObject;
}

function text(value: unknown): string {
  if (typeof value !== "string" || !value) {
    throw new Error("Missing string");
  }

  return value;
}

function date(value: unknown): Date {
  const result = new Date(text(value));

  if (
    !Number.isFinite(result.getTime()) ||
    result.getTime() > Date.now() + 5 * 60 * 1000
  ) {
    throw new Error("Invalid payment date");
  }

  return result;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

// Each verified payment supplies one calendar month of access.
// Clamp dates such as January 31 to the last day of February.
function monthAfter(paidAt: Date): Date {
  const result = new Date(paidAt);
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + 1);

  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)
  ).getUTCDate();

  result.setUTCDate(Math.min(originalDay, lastDay));

  return result;
}

function subscriptionStatus(value: unknown): string {
  switch (value) {
    case "APPROVAL_PENDING":
      return "pending";
    case "APPROVED":
      return "approved";
    case "ACTIVE":
      return "active";
    case "SUSPENDED":
      return "suspended";
    case "CANCELLED":
      return "cancelled";
    case "EXPIRED":
      return "expired";
    default:
      throw new Error("Unknown subscription status");
  }
}

export async function POST(req: Request) {
  try {
    if (process.env.PAYPAL_ENV !== "sandbox") {
      return json({ error: "Sandbox webhook is not configured." }, 503);
    }

    const planId = process.env.PAYPAL_PLAN_ID?.trim();

    if (!planId) {
      return json({ error: "Missing billing configuration." }, 503);
    }

    const rawBody = await req.text();

    if (Buffer.byteLength(rawBody, "utf8") > 256 * 1024) {
      return json({ error: "Payload too large." }, 413);
    }

    let event: JsonObject;
    let resource: JsonObject;
    let eventId: string;
    let eventType: string;
    let eventTime: Date;

    try {
      event = object(JSON.parse(rawBody));
      resource = object(event.resource);
      eventId = text(event.id);
      eventType = text(event.event_type);
      eventTime = date(event.create_time);

      if (eventId.length > 150 || eventType.length > 150) {
        throw new Error("Invalid event");
      }
    } catch {
      return json({ error: "Invalid webhook payload." }, 400);
    }

    if (!(await verifyPayPalWebhook(req.headers, event))) {
      return json({ error: "Invalid webhook signature." }, 403);
    }

    const isPayment = PAYMENT_EVENTS.has(eventType);

    if (!isPayment && !SUBSCRIPTION_EVENTS.has(eventType)) {
      return json({ received: true, ignored: true });
    }

    const eventKey = {
      provider: PROVIDER,
      providerEventId: eventId,
    };

    const previous = await prisma.billingWebhookEvent.findUnique({
      where: { provider_providerEventId: eventKey },
    });

    if (previous?.processedAt) {
      return json({ received: true, duplicate: true });
    }

    let sale: JsonObject | null = null;
    let saleId: string | null = null;
    let remoteSubscriptionId: string;

    if (isPayment) {
      // Refund resources contain sale_id; sale events contain id.
      saleId =
        eventType === "PAYMENT.SALE.REFUNDED"
          ? text(resource.sale_id)
          : text(resource.id);

      if (!/^[A-Z0-9]+$/.test(saleId)) {
        throw new Error("Invalid sale ID");
      }

      // Retrieve the original sale using our own PayPal credentials.
      sale = object(
        await paypalRequest<unknown>(
          `/v1/payments/sale/${encodeURIComponent(saleId)}`
        )
      );

      if (sale.id !== saleId) {
        throw new Error("Sale ID mismatch");
      }

      remoteSubscriptionId = text(sale.billing_agreement_id);
    } else {
      remoteSubscriptionId = text(resource.id);
    }

    if (!/^I-[A-Z0-9]+$/.test(remoteSubscriptionId)) {
      throw new Error("Invalid subscription ID");
    }

    const remote = object(
      await paypalRequest<unknown>(
        `/v1/billing/subscriptions/${encodeURIComponent(
          remoteSubscriptionId
        )}`
      )
    );

    if (remote.id !== remoteSubscriptionId) {
      throw new Error("Subscription ID mismatch");
    }

    // This application may also receive events for other plans.
    if (remote.plan_id !== planId) {
      return json({ received: true, ignored: true });
    }

    const localId = text(remote.custom_id);
    const currentStatus = subscriptionStatus(remote.status);

    const local = await prisma.paidSubscription.findUnique({
      where: { id: localId },
    });

    if (
      !local ||
      local.provider !== PROVIDER ||
      local.providerPlanId !== planId ||
      (local.providerSubscriptionId !== null &&
        local.providerSubscriptionId !== remoteSubscriptionId)
    ) {
      // Do not acknowledge a payment we cannot safely associate.
      throw new Error("Subscription ownership mismatch");
    }

    let paymentStatus: string | null = null;
    let paidAt: Date | null = null;

    if (sale) {
      const amount = object(sale.amount);
      const total = text(amount.total);

      if (
        amount.currency !== "USD" ||
        !/^1(?:\.0{1,2})?$/.test(total) ||
        local.currency !== "USD" ||
        local.amountMinor !== 100
      ) {
        throw new Error("Unexpected payment amount or currency");
      }

      paidAt = date(sale.create_time);

      if (eventType === "PAYMENT.SALE.REVERSED") {
        paymentStatus = "reversed";
      } else if (
        eventType === "PAYMENT.SALE.REFUNDED" ||
        sale.state === "refunded" ||
        sale.state === "partially_refunded"
      ) {
        paymentStatus = "refunded";
      } else if (sale.state === "completed") {
        paymentStatus = "completed";
      } else {
        // Let PayPal retry if its sale details are not final yet.
        throw new Error("Payment is not completed");
      }
    }

    await prisma.$transaction(
      async (tx) => {
        // Serialize events affecting the same subscription.
        await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id"
          FROM "PaidSubscription"
          WHERE "id" = ${localId}
          FOR UPDATE
        `;

        const duplicate = await tx.billingWebhookEvent.findUnique({
          where: { provider_providerEventId: eventKey },
        });

        if (duplicate?.processedAt) return;

        if (saleId && paidAt && paymentStatus) {
          const paymentKey = {
            provider: PROVIDER,
            providerTransactionId: saleId,
          };

          const existingPayment =
            await tx.subscriptionPayment.findUnique({
              where: { provider_providerTransactionId: paymentKey },
            });

          if (
            existingPayment &&
            existingPayment.subscriptionId !== localId
          ) {
            throw new Error("Payment ownership mismatch");
          }

          // A delayed completion event must not restore a refunded sale.
          const finalPaymentStatus =
            existingPayment &&
            ["refunded", "reversed"].includes(existingPayment.status)
              ? existingPayment.status
              : paymentStatus;

          await tx.subscriptionPayment.upsert({
            where: { provider_providerTransactionId: paymentKey },
            create: {
              ...paymentKey,
              subscriptionId: localId,
              amountMinor: 100,
              currency: "USD",
              status: finalPaymentStatus,
              paidAt,
            },
            update: {
              status: finalPaymentStatus,
            },
          });
        }

        const latestPaid = await tx.subscriptionPayment.findFirst({
          where: {
            subscriptionId: localId,
            provider: PROVIDER,
            status: "completed",
          },
          orderBy: { paidAt: "desc" },
        });

        // Track provider event time to avoid older events overwriting
        // the subscription status recorded by newer events.
        const newerEvent = await tx.billingWebhookEvent.findFirst({
          where: {
            provider: `${PROVIDER}:subscription:${localId}`,
            createdAt: { gt: eventTime },
            processedAt: { not: null },
          },
        });

        await tx.paidSubscription.update({
          where: { id: localId },
          data: {
            providerSubscriptionId: remoteSubscriptionId,
            paidThrough: latestPaid ? monthAfter(latestPaid.paidAt) : null,
            lastPaymentAt: latestPaid?.paidAt ?? null,
            ...(!newerEvent
              ? {
                  status: currentStatus,
                  cancelledAt:
                    currentStatus === "cancelled"
                      ? local.cancelledAt ?? eventTime
                      : null,
                }
              : {}),
          },
        });

        const processedAt = new Date();

        await tx.billingWebhookEvent.upsert({
          where: { provider_providerEventId: eventKey },
          create: {
            ...eventKey,
            eventType,
            createdAt: eventTime,
            processedAt,
          },
          update: { processedAt },
        });

        // Separate ordering marker for this subscription.
        await tx.billingWebhookEvent.upsert({
          where: {
            provider_providerEventId: {
              provider: `${PROVIDER}:subscription:${localId}`,
              providerEventId: eventId,
            },
          },
          create: {
            provider: `${PROVIDER}:subscription:${localId}`,
            providerEventId: eventId,
            eventType,
            createdAt: eventTime,
            processedAt,
          },
          update: { processedAt },
        });
      },
      { maxWait: 10_000, timeout: 20_000 }
    );

    return json({ received: true });
  } catch {
    console.error("PAYPAL WEBHOOK: Verification or processing failed.");

    // Acknowledge only after successful processing.
    return json({ error: "Unable to process payment notification." }, 503);
  }
}