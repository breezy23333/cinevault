import { Buffer } from "node:buffer";

const baseUrl = "https://api-m.sandbox.paypal.com";

async function main() {
  if (process.env.PAYPAL_ENV !== "sandbox") {
    throw new Error('Set PAYPAL_ENV="sandbox" in .env.local first.');
  }

  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal Sandbox credentials.");
  }

  if (process.env.PAYPAL_PLAN_ID?.trim()) {
    throw new Error(
      "PAYPAL_PLAN_ID already exists. Check that plan before creating another."
    );
  }

  const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    redirect: "error",
    signal: AbortSignal.timeout(20000),
  });

  if (!tokenResponse.ok) {
    throw new Error(
      `PayPal authentication failed: HTTP ${tokenResponse.status}`
    );
  }

  const tokenData = await tokenResponse.json();

  if (typeof tokenData.access_token !== "string") {
    throw new Error("PayPal did not return an access token.");
  }

  async function create(path, body, requestId) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=representation",
        "PayPal-Request-Id": requestId,
      },
      body: JSON.stringify(body),
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });

    const data = await response.json();

    if (!response.ok) {
      // Print error identifiers only, never credentials.
      const issues = Array.isArray(data.details)
        ? data.details.map((detail) => detail.issue).join(", ")
        : "";

      throw new Error(
        `PayPal HTTP ${response.status}: ${data.name ?? "ERROR"} ${issues}`
      );
    }

    if (typeof data.id !== "string") {
      throw new Error("PayPal did not return a resource ID.");
    }

    return data;
  }

  const product = await create(
    "/v1/catalogs/products",
    {
      name: "CINRYVAN Membership",
      description: "Membership for CINRYVAN entertainment discovery.",
      type: "SERVICE",
    },
    "cinryvan-sandbox-product-v1"
  );

  const plan = await create(
    "/v1/billing/plans",
    {
      product_id: product.id,
      name: "CINRYVAN Monthly - USD 1",
      description: "CINRYVAN membership at USD 1 per month.",
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: "1.00",
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: false,
        payment_failure_threshold: 1,
      },
    },
    "cinryvan-sandbox-usd1-monthly-v1"
  );

  console.log("Sandbox plan created.");
  console.log(`Status: ${plan.status ?? "Check PayPal dashboard"}`);
  console.log("Add this line to .env.local:");
  console.log(`PAYPAL_PLAN_ID="${plan.id}"`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});