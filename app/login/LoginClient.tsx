"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const POSTERS = [
  "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  "https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "We could not verify those details.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      localStorage.setItem("cinryvan_user", JSON.stringify(data.user));

      window.setTimeout(() => {
        window.location.assign("/");
      }, 900);
    } catch (loginError) {
      console.error("LOGIN FAILED:", loginError);
      setError("CINRYVAN could not be reached. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgba(250,204,21,.16),transparent_18%),radial-gradient(circle_at_78%_72%,rgba(37,99,235,.16),transparent_28%),linear-gradient(120deg,#080b12_0%,#05070b_58%,#0b101a_100%)]" />
        <div className="access-orbit absolute left-[56%] top-1/2 hidden h-[690px] w-[690px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07] lg:block" />
        <div className="access-orbit-reverse absolute left-[56%] top-1/2 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/15 lg:block" />
        <div className="absolute left-[56%] top-1/2 hidden h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-[38px] border-yellow-400/[0.06] lg:block" />
        <div className="absolute left-[56%] top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_55px_20px_rgba(250,204,21,.55)] lg:block" />

        {POSTERS.map((poster, index) => {
          const positions = [
            "left-[34%] top-[6%] -rotate-12",
            "left-[49%] top-[2%] rotate-6",
            "left-[66%] top-[10%] rotate-12",
            "left-[37%] bottom-[0%] rotate-8",
            "left-[54%] bottom-[-4%] -rotate-5",
            "left-[70%] bottom-[2%] -rotate-12",
          ];

          return (
            <div
              key={poster}
              className={`absolute hidden aspect-[2/3] w-[145px] overflow-hidden border border-white/10 opacity-35 shadow-[0_30px_80px_rgba(0,0,0,.7)] grayscale-[30%] lg:block ${positions[index]}`}
            >
              <img src={poster} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-black/20" />
            </div>
          );
        })}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_right,black,transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#05070b] to-transparent" />
      </div>

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center bg-yellow-400 text-sm font-black text-black transition group-hover:rotate-6">
            C
          </span>
          <span className="text-sm font-black tracking-[0.22em]">CINRYVAN</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-black uppercase tracking-[0.22em] text-white/40 transition hover:text-yellow-300"
        >
          Exit access <span className="ml-1">↗</span>
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1500px] items-center gap-12 px-5 pb-12 pt-28 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-10 lg:pb-10 lg:pt-24">
        <form
          onSubmit={handleLogin}
          className="relative z-20 w-full max-w-[520px] border border-white/10 bg-[#0c111a]/95 p-6 shadow-[0_45px_120px_rgba(0,0,0,.65)] backdrop-blur-2xl sm:p-9 lg:p-10"
        >
          <div className="absolute left-0 top-0 h-1 w-24 bg-yellow-400" />
          <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-yellow-400/40" />

          <div className="flex items-center justify-between gap-5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
              Access sequence
            </p>
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/75">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Gateway online
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[.9] tracking-[-0.055em] sm:text-6xl">
            Welcome
            <span className="block text-white/28">back inside.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/50">
            Your watchlist, discoveries and entertainment universe are waiting exactly where you left them.
          </p>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mt-6 border-l-2 border-red-400 bg-red-500/[0.09] px-4 py-3 text-sm font-bold text-red-200"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 border-l-2 border-emerald-400 bg-emerald-500/[0.09] px-4 py-3 text-sm font-bold text-emerald-200"
            >
              Identity confirmed. Opening CINRYVAN…
            </div>
          )}

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/38">
                Email identity <span>01</span>
              </span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                required
                disabled={loading || success}
                className="w-full border border-white/10 bg-[#06090f] px-4 py-4 text-base text-white outline-none transition placeholder:text-white/20 focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(250,204,21,.08)] disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/38">
                Access key <span>02</span>
              </span>
              <span className="relative block">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading || success}
                  className="w-full border border-white/10 bg-[#06090f] px-4 py-4 pr-20 text-base text-white outline-none transition placeholder:text-white/20 focus:border-yellow-400 focus:shadow-[0_0_0_3px_rgba(250,204,21,.08)] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35 transition hover:text-yellow-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full overflow-hidden bg-yellow-400 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center justify-between">
                {success ? "Gateway opening" : loading ? "Verifying identity" : "Enter CINRYVAN"}
                <span className="text-lg transition group-hover:translate-x-1">→</span>
              </span>
              {loading && <span className="access-scan absolute inset-y-0 w-24 -skew-x-12 bg-white/30" />}
            </button>
          </div>

          <div className="mt-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[9px] font-black uppercase tracking-[0.28em] text-white/25">New to this universe?</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Link
            href="/signup"
            className="mt-5 flex items-center justify-center border border-white/10 px-5 py-3.5 text-sm font-black text-white/65 transition hover:border-yellow-400/60 hover:text-yellow-300"
          >
            Create your CINRYVAN identity
          </Link>
        </form>

        <div className="relative hidden min-h-[620px] lg:flex lg:items-end lg:justify-end">
          <div className="relative z-10 max-w-[620px] pb-10 text-right">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">Return transmission</p>
            <h2 className="mt-5 text-7xl font-black leading-[.86] tracking-[-0.065em] xl:text-[104px]">
              Pick up
              <span className="block text-white/22">the story.</span>
            </h2>
            <div className="mt-7 ml-auto flex max-w-lg items-center justify-end gap-5 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              <span>Saved worlds</span>
              <span className="h-1 w-1 rounded-full bg-yellow-400" />
              <span>Personal watchlist</span>
              <span className="h-1 w-1 rounded-full bg-yellow-400" />
              <span>One identity</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes accessOrbit { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes accessOrbitReverse { to { transform: translate(-50%, -50%) rotate(-360deg); } }
        @keyframes accessScan { from { left: -30%; } to { left: 120%; } }
        .access-orbit { animation: accessOrbit 34s linear infinite; }
        .access-orbit-reverse { animation: accessOrbitReverse 24s linear infinite; }
        .access-scan { animation: accessScan 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .access-orbit, .access-orbit-reverse, .access-scan { animation: none; }
        }
      `}</style>
    </main>
  );
}