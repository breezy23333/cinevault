"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "dark";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
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

export default function VerifyHumanPage() {
  const container = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);

  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("Loading verification…");
  const [failed, setFailed] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    const api = getTurnstile();

    if (!ready || !api || !container.current || !siteKey) {
      return;
    }

    let active = true;
    const controller = new AbortController();
    submitting.current = false;

    setFailed(false);
    setStatus("Complete the verification below.");

    function showError(message: string) {
      if (!active) return;
      setStatus(message);
      setFailed(true);
    }

    const widgetId = api.render(container.current, {
      sitekey: siteKey,
      action: "site_access",
      theme: "dark",

      callback: (token) => {
        if (!active || submitting.current) return;

        submitting.current = true;
        setStatus("Checking verification…");

        void (async () => {
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
                data.error || "Verification failed. Please retry."
              );
              return;
            }

            // Only permit redirects within this website.
            const requested =
              new URLSearchParams(window.location.search).get(
                "next"
              ) || "/";

            let destination = "/";

            try {
              const target = new URL(
                requested,
                window.location.origin
              );

              if (
                target.origin === window.location.origin &&
                target.pathname !== "/verify-human" &&
                !target.pathname.startsWith("/verify-human/") &&
                !target.pathname.startsWith("/api/")
              ) {
                destination =
                  target.pathname + target.search + target.hash;
              }
            } catch {
              destination = "/";
            }

            // Full navigation ensures the new cookie is used.
            window.location.replace(destination);
          } catch {
            showError(
              "Could not complete verification. Please retry."
            );
          }
        })();
      },

      "expired-callback": () => {
        if (!submitting.current) {
          showError("Verification expired. Please retry.");
        }
      },

      "error-callback": () => {
        showError(
          "Verification could not load. Check your connection and retry."
        );
      },
    });

    return () => {
      active = false;
      controller.abort();
      api.remove(widgetId);
    };
  }, [ready, attempt, siteKey]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950 p-6 text-center">
        <p className="mb-3 text-sm font-semibold tracking-widest text-violet-400">
          CINRYVAN
        </p>

        <h1 className="text-2xl font-bold">
          Verify you’re human
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          Complete this quick check to continue to CINRYVAN.
        </p>

        <div
          ref={container}
          className="mt-6 flex justify-center"
        />

        <p
          role="status"
          aria-live="polite"
          className="mt-4 text-sm text-zinc-300"
        >
          {siteKey
            ? status
            : "Verification is not configured. Please try again later."}
        </p>

        {failed && (
          <button
            type="button"
            className="mt-5 rounded-lg bg-violet-600 px-5 py-2 font-medium hover:bg-violet-500"
            onClick={() => {
              if (!ready) {
                window.location.reload();
              } else {
                setAttempt((value) => value + 1);
              }
            }}
          >
            Try again
          </button>
        )}

        <noscript>
          JavaScript must be enabled to complete verification.
        </noscript>
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