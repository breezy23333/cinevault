"use client";

import { useState } from "react";
import AccessBackground from "@/components/AccessBackground";
import MembershipPrice from "@/components/MembershipPrice";

type Props = {
  sandboxEnabled: boolean;
  checkout: string;
};

const benefits = [
  {
    number: "01",
    title: "Find your next obsession",
    description:
      "Explore movies, TV, anime and cartoons in one discovery destination.",
  },
  {
    number: "02",
    title: "Go beyond the screen",
    description:
      "Discover games and explore entertainment news alongside your favourites.",
  },
  {
    number: "03",
    title: "Make it your collection",
    description:
      "Keep a watchlist and find legal viewing options for your next watch.",
  },
];

export default function SubscribeClient({
  sandboxEnabled,
  checkout,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (busy || !sandboxEnabled || checkout === "returned") return;

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
    <main className="relative isolate min-h-[85svh] overflow-hidden bg-[#08090b] px-5 py-16 text-white sm:px-8 lg:py-24">
      <AccessBackground variant="posters" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          <span className="h-px w-10 bg-amber-400" />
          CINRYVAN Membership
        </div>

        <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <section>
            <h1 className="max-w-xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Less searching.
              <br />
              <span className="text-amber-400">More discovering.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-zinc-400">
              Your next favourite film. A series worth staying up for.
              A game you never saw coming. Find your next story with
              CINRYVAN.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {["MOVIES", "SERIES", "ANIMATION", "GAMES"].map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-[9px] font-semibold tracking-[0.18em] text-zinc-400"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-12 space-y-7">
              {benefits.map((benefit) => (
                <div key={benefit.number} className="flex gap-5">
                  <span className="pt-1 font-mono text-xs text-amber-400/70">
                    {benefit.number}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-zinc-100">
                      {benefit.title}
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-7 text-zinc-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="membership-heading"
            className="relative overflow-hidden rounded-[28px] border border-amber-300/20 bg-[#121315] shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

            <div className="border-b border-white/5 bg-gradient-to-br from-amber-300/[0.08] to-transparent px-6 pb-8 pt-8 sm:px-9">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
                  Your next chapter
                </p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-zinc-400">
                  Monthly membership
                </span>
              </div>

              <h2
                id="membership-heading"
                className="mt-7 text-2xl font-bold tracking-tight"
              >
                A world to discover.
              </h2>

              <MembershipPrice />

              <p className="mt-5 text-sm text-zinc-400">
                No trial. No setup fee.
              </p>
            </div>

            <div className="px-6 py-8 sm:px-9">
              <ul className="space-y-4 text-sm text-zinc-300">
                {[
                  "Entertainment discovery across movies, TV and games",
                  "Personal watchlist",
                  "Legal viewing options",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 text-amber-400"
                    >
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 border-t border-white/5 pt-6 text-xs leading-6 text-zinc-500">
                Membership covers CINRYVAN&apos;s discovery service.
                Streaming subscriptions, movie tickets and game purchases
                are sold separately.
              </p>

              {sandboxEnabled ? (
                <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                    Sandbox testing
                  </p>
                  <p className="mt-2 text-xs leading-6 text-amber-100/70">
                    Use a PayPal Sandbox buyer account. This checkout
                    does not collect real money.
                  </p>
                </div>
              ) : (
                <p
                  role="status"
                  className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-zinc-300"
                >
                  Checkout is currently unavailable. Please try again later.
                </p>
              )}

              {checkout === "returned" && (
                <div
                  role="status"
                  className="mt-5 rounded-xl border border-sky-300/20 bg-sky-300/5 p-4 text-sm leading-6 text-sky-200"
                >
                  You&apos;ve returned from PayPal. Your payment still
                  needs to be verified before membership access activates.
                  Returning here alone does not activate membership.
                </div>
              )}

              {checkout === "cancelled" && (
                <p
                  role="status"
                  className="mt-5 text-sm leading-6 text-zinc-300"
                >
                  Checkout was cancelled. You can try again when
                  you&apos;re ready.
                </p>
              )}

              {error && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-300"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={startCheckout}
                disabled={
                  busy || !sandboxEnabled || checkout === "returned"
                }
                className="mt-7 flex w-full items-center justify-between gap-3 rounded-xl bg-amber-400 px-5 py-4 text-sm font-bold text-black transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {busy
                    ? "Opening PayPal..."
                    : checkout === "returned"
                      ? "Awaiting payment verification"
                      : !sandboxEnabled
                        ? "Checkout unavailable"
                        : "Continue to PayPal Sandbox"}
                </span>
                <span aria-hidden="true">→</span>
              </button>

              <p className="mt-5 text-center text-xs leading-6 text-zinc-500">
                Renews monthly until cancelled.
                <br />
                Manage automatic payments through PayPal.
              </p>

              <div className="mt-6 flex justify-center gap-6 border-t border-white/5 pt-6 text-xs text-zinc-500">
                <a href="/terms" className="hover:text-amber-200">
                  Terms
                </a>
                <a href="/privacy" className="hover:text-amber-200">
                  Privacy
                </a>
                <a href="/support" className="hover:text-amber-200">
                  Support
                </a>
              </div>
            </div>
          </section>
        </div>

        <p className="mt-16 border-t border-white/5 pt-7 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          CINRYVAN · Created by Luvo Maphela
        </p>
      </div>
    </main>
  );
}