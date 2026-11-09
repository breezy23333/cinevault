// lib/paypal.ts
// Server-side only: never import into a client component.

import { Buffer } from "node:buffer";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function paypalBaseUrl(): string {
  const environment = requiredEnv("PAYPAL_ENV");

  if (environment === "sandbox") {
    return "https://api-m.sandbox.paypal.com";
  }

  if (environment === "live") {
    return "https://api-m.paypal.com";
  }

  throw new Error("PAYPAL_ENV must be sandbox or live");
}

async function getAccessToken(): Promise<string> {
  const clientId = requiredEnv("PAYPAL_CLIENT_ID");
  const clientSecret = requiredEnv("PAYPAL_CLIENT_SECRET");

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${paypalBaseUrl()}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `PayPal authentication failed (${response.status})`
    );
  }

  const data = (await response.json()) as {
    access_token?: unknown;
  };

  if (
    typeof data.access_token !== "string" ||
    !data.access_token
  ) {
    throw new Error("PayPal returned an invalid access token");
  }

  return data.access_token;
}

type PayPalRequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  requestId?: string;
};

export async function paypalRequest<T>(
  path: string,
  options: PayPalRequestOptions = {}
): Promise<T> {
  // Only permit API paths on our configured PayPal host.
  if (!/^\/v[12]\//.test(path) || path.includes("\\")) {
    throw new Error("Invalid PayPal API path");
  }

  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (options.requestId) {
    headers["PayPal-Request-Id"] = options.requestId;
  }

  const response = await fetch(`${paypalBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    // Do not log credentials or customer payment data.
    const details = await response.json().catch(() => null);

    console.error("PAYPAL API DETAILS:", {
    status: response.status,
    operation: options.method ?? "GET",
    resource: path.startsWith("/v1/billing/subscriptions/")
        ? "existing subscription"
        : path === "/v1/billing/subscriptions"
        ? "create subscription"
        : "other",
    name:
        typeof details?.name === "string"
        ? details.name
        : "UNKNOWN",
    });

    throw new Error(
    `PayPal API request failed (${response.status})`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function verifyPayPalWebhook(
  headers: Headers,
  event: Record<string, unknown>
): Promise<boolean> {
  const authAlgo = headers.get("paypal-auth-algo");
  const certUrl = headers.get("paypal-cert-url");
  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionSig = headers.get("paypal-transmission-sig");
  const transmissionTime = headers.get("paypal-transmission-time");

  if (
    !authAlgo ||
    !certUrl ||
    !transmissionId ||
    !transmissionSig ||
    !transmissionTime
  ) {
    return false;
  }

  const result = await paypalRequest<{
    verification_status?: string;
  }>("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: requiredEnv("PAYPAL_WEBHOOK_ID"),
      webhook_event: event,
    },
  });

  return result.verification_status === "SUCCESS";
}