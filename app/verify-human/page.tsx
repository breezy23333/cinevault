"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import AccessBackground from "@/components/AccessBackground";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "dark";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": (code?: string) => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
};

function getTurnstile(): TurnstileApi | undefined {
  return (
    window as Window & {
      turnstile?: TurnstileApi;
    }
  ).turnstile;
}

function getDestination() {
  const requested =
    new URLSearchParams(window.location.search).get("next") || "/";

  try {
    const target = new URL(requested, window.location.origin);

    if (
      target.origin === window.location.origin &&
      target.pathname !== "/verify-human" &&
      !target.pathname.startsWith("/verify-human/") &&
      target.pathname !== "/api" &&
      !target.pathname.startsWith("/api/")
    ) {
      return target.pathname + target.search + target.hash;
    }
  } catch {
    // Fall back to the homepage.
  }

  return "/";
}

export default function VerifyHumanPage() {
  const container = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);

  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("Preparing your verification...");
  const [failed, setFailed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [verifiedDestination, setVerifiedDestination] =
    useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const verified = verifiedDestination !== null;

  useEffect(() => {
    const api = getTurnstile();

    if (!ready || !api || !container.current || !siteKey) return;

    let active = true;
    let completed = false;
    const controller = new AbortController();

    submitting.current = false;
    setFailed(false);
    setLeaving(false);
    setVerifiedDestination(null);
    setStatus("Complete the security check below.");

    function showError(message: string) {
      if (!active || completed) return;
      setVerifiedDestination(null);
      setStatus(message);
      setFailed(true);
    }

    let widgetId: string | undefined;

    try {
      widgetId = api.render(container.current, {
        sitekey: siteKey,
        action: "site_access",
        theme: "dark",

        callback: (token) => {
          if (!active || submitting.current || completed) return;

          submitting.current = true;
          setFailed(false);
          setStatus("Confirming your verification...");

          void (async () => {
            const timeout = window.setTimeout(
              () => controller.abort(),
              15000
            );

            try {
              const response = await fetch("/api/verify-human", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ token }),
                signal: controller.signal,
              });

              const data = (await response.json()) as {
                ok?: boolean;
                error?: string;
              };

              if (!active) return;

              if (!response.ok || data.ok !== true) {
                showError(
                  data.error || "Verification failed. Please try again."
                );
                return;
              }

              completed = true;
              setFailed(false);
              setStatus("Verification complete. You're ready to continue.");
              setVerifiedDestination(getDestination());
            } catch {
              showError(
                controller.signal.aborted
                  ? "Verification timed out. Please try again."
                  : "Unable to complete verification. Please try again."
              );
            } finally {
              window.clearTimeout(timeout);
            }
          })();
        },

        "expired-callback": () => {
          if (!submitting.current) {
            showError("Your check expired. Please try again.");
          }
        },

        "error-callback": (code) => {
          showError(
            `Unable to load verification${code ? ` (${code})` : ""}. Please retry.`
          );
        },
      });
    } catch {
      showError("Unable to start verification. Please retry.");
    }

    return () => {
      active = false;
      controller.abort();

      if (widgetId !== undefined) {
        api.remove(widgetId);
      }
    };
  }, [ready, attempt, siteKey]);

  return (
    <main className="relative isolate flex min-h-[85svh] items-center overflow-hidden bg-[#08090b] px-4 py-16 text-white sm:px-8 lg:py-24">
      <AccessBackground variant="backdrop" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <section>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber-300/20 bg-amber-300/5 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-200">
              The CINRYVAN experience
            </span>
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Great stories.
            <br />
            <span className="text-amber-400">One step away.</span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-zinc-400">
            Movies, series, animation and games. Your next discovery
            starts with a quick security check.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {["WATCH", "DISCOVER", "PLAY"].map((label) => (
              <span
                key={label}
                className="rounded-md border border-white/10 px-3 py-2 text-[10px] font-semibold tracking-[0.2em] text-zinc-500"
              >
                {label}
              </span>
            ))}
          </div>

          <p className="mt-10 text-xs leading-6 text-zinc-500">
            This check helps protect CINRYVAN from automated abuse.
          </p>
        </section>

        <section
          aria-labelledby="verification-heading"
          className="relative rounded-[28px] border border-white/10 bg-[#111215]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-10"
        >
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              Access check
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                verified
                  ? "bg-emerald-400/10 text-emerald-300"
                  : failed
                    ? "bg-red-400/10 text-red-300"
                    : "bg-amber-300/10 text-amber-200"
              }`}
            >
              {verified ? "Complete" : failed ? "Retry needed" : "Verification"}
            </span>
          </div>

          <div className="relative mx-auto my-9 flex h-24 w-24 items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-dashed border-amber-300/25 motion-safe:animate-[spin_40s_linear_infinite]"
            />
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
                verified
                  ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-300"
                  : "border-amber-300/25 bg-amber-300/10 text-amber-300"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-8 w-8"
              >
                <path d="M12 3 4.5 6v5.5c0 4.3 3 7.7 7.5 9.5 4.5-1.8 7.5-5.2 7.5-9.5V6L12 3Z" />
                <path d="m8.5 12 2.3 2.3 4.7-4.7" />
              </svg>
            </div>
          </div>

          <h2
            id="verification-heading"
            className="text-center text-3xl font-bold tracking-tight"
          >
            {verified ? "You're all set." : "Verify you're human"}
          </h2>

          <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-6 text-zinc-400">
            {verified
              ? "Continue to your account and membership."
              : "A quick check before your next discovery."}
          </p>

          <div
            ref={container}
            className="mt-8 flex min-h-16 justify-center"
          />

          <p
            role="status"
            aria-live="polite"
            className={`mt-6 text-center text-sm leading-6 ${
              failed ? "text-red-300" : "text-zinc-400"
            }`}
          >
            {siteKey
              ? status
              : "Verification is not configured. Please try again later."}
          </p>

          {verifiedDestination !== null && (
            <button
              type="button"
              disabled={leaving}
              onClick={() => {
                setLeaving(true);
                window.location.assign(verifiedDestination);
              }}
              className="mt-7 flex w-full items-center justify-between rounded-xl bg-amber-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 disabled:cursor-wait disabled:opacity-60"
            >
              <span>{leaving ? "Opening CINRYVAN..." : "Continue"}</span>
              <span aria-hidden="true">→</span>
            </button>
          )}

          {failed && (
            <button
              type="button"
              onClick={() => {
                if (!ready) window.location.reload();
                else setAttempt((value) => value + 1);
              }}
              className="mt-7 w-full rounded-xl border border-amber-300/30 bg-amber-300/10 px-6 py-4 text-sm font-bold text-amber-200 transition hover:bg-amber-300/20"
            >
              Try verification again
            </button>
          )}

          <div className="mt-8 flex justify-center gap-6 border-t border-white/5 pt-6 text-xs text-zinc-500">
            <a href="/privacy" className="hover:text-amber-200">
              Privacy
            </a>
            <a href="/support" className="hover:text-amber-200">
              Need help?
            </a>
          </div>

          <noscript>
            JavaScript must be enabled to complete verification.
          </noscript>
        </section>
      </div>

      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => {
          setStatus("Unable to load verification. Please retry.");
          setFailed(true);
        }}
      />
    </main>
  );
}