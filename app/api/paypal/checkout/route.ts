import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/userSession";
import { paypalRequest } from "@/lib/paypal";

export const runtime = "nodejs";
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;
// PayPal documents 72-hour retention for Subscriptions create idempotency keys.
// Beyond this point an uncertain creation requires manual reconciliation.
const IDEMPOTENCY_WINDOW_MS = 72 * 60 * 60 * 1000;
const PAYMENT_WINDOW_MS = 30 * DAY_MS;

type PayPalEnvironment = "sandbox" | "live";

type PayPalSubscription = {
  id: string;
  status: string;
  plan_id?: string;
  custom_id?: string;
  plan_overridden?: boolean;
  links?: Array<{ rel: string; href: string; method?: string }>;
};

type PayPalPlan = {
  id: string;
  status: string;
  billing_cycles?: Array<{
    tenure_type?: string;
    frequency?: { interval_unit?: string; interval_count?: number };
    total_cycles?: number;
    pricing_scheme?: {
      fixed_price?: { currency_code?: string; value?: string };
    };
  }>;
  payment_preferences?: {
    setup_fee?: { currency_code?: string; value?: string };
  };
  taxes?: { percentage?: string };
};

type PayPalHistory = {
  transactions?: Array<{
    id?: string;
    status?: string;
    time?: string;
    amount_with_breakdown?: {
      gross_amount?: { currency_code?: string; value?: string };
    };
  }>;
};

type Payment = NonNullable<PayPalHistory["transactions"]>[number];
type PaymentStatus = "completed" | "refunded";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function validAmount(value: unknown, expectedCents: number): boolean {
  if (typeof value !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(value)) {
    return false;
  }
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0")) === expectedCents;
}

function monthAfter(paidAt: Date): Date {
  const date = new Date(paidAt);
  const originalDay = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + 1);
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).getUTCDate();
  date.setUTCDate(Math.min(originalDay, lastDay));
  return date;
}

function configuredSiteUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    const isLocal =
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1");
    if (
      (url.protocol !== "https:" && !isLocal) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function checkSubscription(
  subscription: PayPalSubscription,
  expectedId: string,
  expectedPlan: string,
  expectedLocalId: string,
  requireFullDetails: boolean
) {
  if (!/^I-[A-Z0-9]+$/.test(subscription.id) || subscription.id !== expectedId) {
    throw new Error("PayPal subscription ID mismatch");
  }
  if (subscription.plan_overridden === true) {
    throw new Error("Unexpected PayPal subscription plan override");
  }
  if (
    (requireFullDetails || subscription.plan_id !== undefined) &&
    subscription.plan_id !== expectedPlan
  ) {
    throw new Error("PayPal subscription plan mismatch");
  }
  if (
    (requireFullDetails || subscription.custom_id !== undefined) &&
    subscription.custom_id !== expectedLocalId
  ) {
    throw new Error("PayPal subscription ownership mismatch");
  }
}

function approvalUrl(
  subscription: PayPalSubscription,
  environment: PayPalEnvironment
): string {
  const href = subscription.links?.find(
    (link) => link.rel === "approve" && (!link.method || link.method === "GET")
  )?.href;
  if (!href) throw new Error("PayPal approval link missing");

  const url = new URL(href);
  const expectedHost =
    environment === "live" ? "www.paypal.com" : "www.sandbox.paypal.com";
  if (
    url.protocol !== "https:" ||
    url.hostname !== expectedHost ||
    url.port ||
    url.username ||
    url.password
  ) {
    throw new Error("Unexpected PayPal approval URL");
  }
  return url.href;
}

async function verifyPlan(planId: string) {
  const plan = await paypalRequest<PayPalPlan>(
    `/v1/billing/plans/${encodeURIComponent(planId)}`
  );
  const regular = plan.billing_cycles?.filter(
    (cycle) => cycle.tenure_type === "REGULAR"
  );
  const cycle = regular?.[0];
  // Enforce the advertised product, not just an arbitrary configured plan ID.
  if (
    plan.id !== planId ||
    plan.status !== "ACTIVE" ||
    regular?.length !== 1 ||
    plan.billing_cycles?.length !== 1 || // no unadvertised trial cycle
    cycle?.frequency?.interval_unit !== "MONTH" ||
    cycle.frequency?.interval_count !== 1 ||
    cycle.total_cycles !== 0 || // renew indefinitely until cancelled
    cycle.pricing_scheme?.fixed_price?.currency_code !== "USD" ||
    !validAmount(cycle.pricing_scheme.fixed_price.value, 100)
  ) {
    throw new Error("PayPal plan does not match US$1/month");
  }
  const setupFee = plan.payment_preferences?.setup_fee;
  if (
    (setupFee &&
      (setupFee.currency_code !== "USD" || !validAmount(setupFee.value, 0))) ||
    (plan.taxes?.percentage !== undefined &&
      Number(plan.taxes.percentage) !== 0)
  ) {
    throw new Error("Unexpected PayPal plan fees");
  }
}

function parsePayment(payment: Payment): {
  id: string;
  paidAt: Date;
  status: PaymentStatus;
} | null {
  const status: PaymentStatus | null =
    payment.status === "COMPLETED"
      ? "completed"
      : payment.status === "REFUNDED" ||
          payment.status === "PARTIALLY_REFUNDED"
        ? "refunded"
        : null;
  if (!status) return null;
  const paidAt = new Date(payment.time ?? "");
  const amount = payment.amount_with_breakdown?.gross_amount;
  if (
    !payment.id ||
    !/^[A-Z0-9]+$/.test(payment.id) ||
    !Number.isFinite(paidAt.getTime()) ||
    paidAt.getTime() > Date.now() + 5 * 60 * 1000 ||
    amount?.currency_code !== "USD" ||
    !validAmount(amount.value, 100)
  ) {
    throw new Error("Invalid PayPal transaction");
  }
  return { id: payment.id, paidAt, status };
}

async function fetchRecentPayments(remoteId: string) {
  // Two <=30-day windows cover both 30- and 31-day billing intervals.
  // Overlap by one minute to avoid a boundary gap; DB upserts deduplicate IDs.
  const now = Date.now();
  const windows = [
    [now - PAYMENT_WINDOW_MS, now],
    [now - 2 * PAYMENT_WINDOW_MS, now - PAYMENT_WINDOW_MS + 60_000],
  ];
  const histories = await Promise.all(
    windows.map(async ([from, to]) => {
      const query = new URLSearchParams({
        start_time: new Date(from).toISOString(),
        end_time: new Date(to).toISOString(),
      });
      return paypalRequest<PayPalHistory>(
        `/v1/billing/subscriptions/${encodeURIComponent(remoteId)}/transactions?${query.toString()}`
      );
    })
  );
  const payments = new Map<string, NonNullable<ReturnType<typeof parsePayment>>>();
  for (const history of histories) {
    for (const transaction of history.transactions ?? []) {
      const payment = parsePayment(transaction);
      if (payment) {
        const previous = payments.get(payment.id);
        if (!previous || payment.status === "refunded") {
          payments.set(payment.id, payment);
        }
      }
    }
  }
  return Array.from(payments.values());
}

async function reconcilePayments(
  localId: string,
  userId: string,
  provider: string,
  remoteId: string,
  remoteStatus: string
): Promise<boolean> {
  const payments = await fetchRecentPayments(remoteId);

  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "PaidSubscription" WHERE "id" = ${localId} FOR UPDATE
      `;
      const local = await tx.paidSubscription.findUnique({
        where: { id: localId },
      });
      if (
        !local ||
        local.userId !== userId ||
        local.provider !== provider ||
        local.providerSubscriptionId !== remoteId ||
        local.currency !== "USD" ||
        local.amountMinor !== 100
      ) {
        throw new Error("Subscription ownership changed");
      }

      for (const payment of payments) {
        const key = {
          provider,
          providerTransactionId: payment.id,
        };
        const previous = await tx.subscriptionPayment.findUnique({
          where: { provider_providerTransactionId: key },
        });
        if (previous && previous.subscriptionId !== localId) {
          throw new Error("Payment ownership mismatch");
        }
        // A later completion must never reactivate a refunded/reversed sale.
        const status =
          previous && ["refunded", "reversed"].includes(previous.status)
            ? previous.status
            : payment.status;
        await tx.subscriptionPayment.upsert({
          where: { provider_providerTransactionId: key },
          create: {
            ...key,
            subscriptionId: localId,
            amountMinor: 100,
            currency: "USD",
            paidAt: payment.paidAt,
            status,
          },
          update: { status },
        });
      }

      // Preserve already verified payments even when PayPal's recent history
      // is temporarily empty. The webhook also writes to this same table.
      const latestPaid = await tx.subscriptionPayment.findFirst({
        where: {
          subscriptionId: localId,
          provider,
          currency: "USD",
          amountMinor: 100,
          status: "completed",
        },
        orderBy: { paidAt: "desc" },
      });
      const paidThrough = latestPaid ? monthAfter(latestPaid.paidAt) : null;
      await tx.paidSubscription.update({
        where: { id: localId },
        data: {
          paidThrough,
          lastPaymentAt: latestPaid?.paidAt ?? null,
        },
      });
      return (
        (remoteStatus === "ACTIVE" || remoteStatus === "CANCELLED") &&
        !!paidThrough &&
        paidThrough.getTime() > Date.now()
      );
    },
    { maxWait: 10_000, timeout: 20_000 }
  );
}

export async function POST(req: Request) {
  // Stage-only diagnostics make live failures actionable without logging secrets.
  let stage = "configuration";
  try {
    const environment = process.env.PAYPAL_ENV?.trim();
    if (environment !== "sandbox" && environment !== "live") {
      return json({ error: "PayPal checkout is not configured." }, 503);
    }
    const provider = `paypal:${environment}`;
    const planId = process.env.PAYPAL_PLAN_ID?.trim();
    const appUrl = configuredSiteUrl(process.env.CINRYVAN_APP_URL?.trim() ?? "");
    if (!planId || !/^P-[A-Z0-9]+$/.test(planId) || !appUrl) {
      return json({ error: "Checkout configuration is incomplete." }, 503);
    }
    if (req.headers.get("origin") !== appUrl.origin) {
      return json({ error: "Invalid request origin." }, 403);
    }
    stage = "session";
    const user = await getSessionUser();
    if (!user) {
      return json({ error: "Please sign in before subscribing." }, 401);
    }

    stage = "local-subscription";
    const subscription = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "User" WHERE "id" = ${user.id} FOR UPDATE
      `;
      const existing = await tx.paidSubscription.findFirst({
        where: {
          userId: user.id,
          provider,
          OR: [
            { status: { in: ["pending", "approved", "active", "suspended"] } },
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
      subscription.providerPlanId !== planId ||
      subscription.currency !== "USD" ||
      subscription.amountMinor !== 100
    ) {
      return json({ error: "Subscription configuration changed. Contact support." }, 409);
    }

    let remote: PayPalSubscription;
    let expectedRemoteId = subscription.providerSubscriptionId;
    if (expectedRemoteId) {
      if (!/^I-[A-Z0-9]+$/.test(expectedRemoteId)) {
        throw new Error("Invalid stored PayPal subscription ID");
      }
      try {
        stage = "paypal-get-subscription";
        remote = await paypalRequest<PayPalSubscription>(
          `/v1/billing/subscriptions/${encodeURIComponent(expectedRemoteId)}`
        );
      } catch (error) {
        // Only a sandbox checkout with no payment may be retired after 404.
        // Do not automatically abandon missing LIVE agreements.
        if (
          environment !== "sandbox" ||
          !(error instanceof Error) ||
          error.message !== "PayPal API request failed (404)"
        ) {
          throw error;
        }
        await prisma.paidSubscription.updateMany({
          where: {
            id: subscription.id,
            userId: user.id,
            provider,
            providerSubscriptionId: expectedRemoteId,
            status: "pending",
            paidThrough: null,
            lastPaymentAt: null,
            payments: { none: {} },
          },
          data: { status: "checkout_missing" },
        });
        return json({ error: "Previous test checkout is missing. Retry to start a new one." }, 409);
      }
      checkSubscription(remote, expectedRemoteId, planId, subscription.id, true);
    } else {
      if (subscription.status !== "pending") {
        return json({ error: "Subscription needs review before retrying." }, 409);
      }
      if (Date.now() - subscription.createdAt.getTime() >= IDEMPOTENCY_WINDOW_MS) {
        // Never create a new agreement when the previous PayPal create outcome
        // is unknown and the idempotency key may have expired.
        return json({ error: "Checkout needs reconciliation. Contact support." }, 409);
      }
      // Validate the real plan before attempting to charge a customer.
      stage = "paypal-get-plan";
      await verifyPlan(planId);
      stage = "paypal-create-subscription";
      remote = await paypalRequest<PayPalSubscription>(
        "/v1/billing/subscriptions",
        {
          method: "POST",
          requestId: subscription.id,
          body: {
            plan_id: planId,
            custom_id: subscription.id,
            application_context: {
              brand_name: "CINRYVAN",
              shipping_preference: "NO_SHIPPING",
              user_action: "SUBSCRIBE_NOW",
              return_url: new URL("/subscribe?checkout=returned", appUrl.origin).href,
              cancel_url: new URL("/subscribe?checkout=cancelled", appUrl.origin).href,
            },
          },
        }
      );
      if (!/^I-[A-Z0-9]+$/.test(remote.id)) {
        throw new Error("Invalid PayPal subscription response");
      }
      checkSubscription(remote, remote.id, planId, subscription.id, false);
      expectedRemoteId = remote.id;

      // A webhook may already have attached the same remote ID.
      stage = "save-paypal-subscription";
      const updated = await prisma.paidSubscription.updateMany({
        where: {
          id: subscription.id,
          userId: user.id,
          provider,
          providerPlanId: planId,
          providerSubscriptionId: null,
        },
        data: { providerSubscriptionId: remote.id },
      });
      if (updated.count !== 1) {
        const current = await prisma.paidSubscription.findUnique({
          where: { id: subscription.id },
        });
        if (current?.providerSubscriptionId !== remote.id) {
          throw new Error("Concurrent subscription mismatch");
        }
      }
    }

    if (remote.status === "APPROVAL_PENDING") {
      return json({ approvalUrl: approvalUrl(remote, environment) });
    }

    // Fetch full data before examining an already approved/active agreement:
    // PayPal POST may return a minimal representation without plan/custom ID.
    if (remote.plan_id === undefined || remote.custom_id === undefined) {
      stage = "paypal-verify-subscription";
      remote = await paypalRequest<PayPalSubscription>(
        `/v1/billing/subscriptions/${encodeURIComponent(expectedRemoteId)}`
      );
      checkSubscription(remote, expectedRemoteId, planId, subscription.id, true);
    }

    if (
      ["ACTIVE", "APPROVED", "CANCELLED", "SUSPENDED", "EXPIRED"].includes(
        remote.status
      )
    ) {
      stage = "reconcile-payments";
      const membershipActive = await reconcilePayments(
        subscription.id,
        user.id,
        provider,
        expectedRemoteId,
        remote.status
      );
      if (membershipActive) {
        return json({ membershipActive: true });
      }
      return json(
        { error: "Payment is not confirmed or membership is inactive. Check your PayPal status or contact support." },
        409
      );
    }
    throw new Error("Unexpected PayPal subscription status");
  } catch (error: unknown) {
    // Do not expose credentials, payment records, or raw provider responses.
    const code =
      error instanceof Error && "code" in error
        ? String(error.code)
        : "";
    const category =
      error instanceof Error &&
      ["AbortError", "TimeoutError"].includes(error.name)
        ? "timeout"
        : /^P\d{4}$/.test(code)
          ? "database"
          : "checkout";
    console.error("PAYPAL CHECKOUT: failed", { stage, category });
    return json({ error: "Unable to start checkout. Please try again shortly." }, 503);
  }
}
