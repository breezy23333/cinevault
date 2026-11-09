"use client";

import { useState } from "react";

type Props = {
  sandboxEnabled: boolean;
  checkout: string;
};

export default function SubscribeClient({
  sandboxEnabled,
  checkout,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/paypal/checkout", {
        method: "POST",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.assign("/login");
        return;
      }

      if (data.code === "HUMAN_VERIFICATION_REQUIRED") {
        window.location.assign("/verify-human?next=%2Fsubscribe");
        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Unable to start checkout."
        );
      }

      if (typeof data.approvalUrl !== "string") {
        throw new Error("PayPal approval link is missing.");
      }

      const approvalUrl = new URL(data.approvalUrl);

      if (
        approvalUrl.protocol !== "https:" ||
        approvalUrl.hostname !== "www.sandbox.paypal.com"
      ) {
        throw new Error("Unexpected checkout URL.");
      }

      window.location.assign(approvalUrl.href);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start checkout. Please try again."
      );
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-20 text-white">
      <section className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
          CINRYVAN Membership
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Your next discovery starts here
        </h1>

        <p className="mt-4 leading-7 text-zinc-300">
          Membership for CINRYVAN’s entertainment discovery service.
          Streaming subscriptions and movie tickets are sold separately.
        </p>

        <div className="mt-8">
          <span className="text-5xl font-bold">US$1</span>
          <span className="ml-2 text-zinc-400">/ month</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Renews monthly until cancelled. No trial or setup fee.
          Manage automatic payments through PayPal.
        </p>

        <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Sandbox testing — use a PayPal Sandbox buyer account.
          This checkout does not collect real money.
        </div>

        {checkout === "returned" && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-blue-400/10 p-4 text-sm text-blue-200"
          >
            You’ve returned from PayPal. Membership access requires
            server verification of your payment; returning here alone
            does not activate it.
          </p>
        )}

        {checkout === "cancelled" && (
          <p role="status" className="mt-5 text-sm text-zinc-300">
            You left checkout. You can resume using the button below.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={startCheckout}
          disabled={busy || !sandboxEnabled || checkout === "returned"}
          className="mt-7 w-full rounded-xl bg-amber-400 px-5 py-4 font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy
            ? "Opening PayPal…"
            : checkout === "returned"
              ? "Awaiting payment verification"
              : "Continue to PayPal Sandbox"}
        </button>
      </section>
    </main>
  );
}