"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const POSTERS = [
  "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Your CINRYVAN identity could not be created.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      window.setTimeout(() => router.push("/login"), 900);
    } catch (signupError) {
      console.error("SIGNUP FAILED:", signupError);
      setError("CINRYVAN could not be reached. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_42%,rgba(79,70,229,.25),transparent_24%),radial-gradient(circle_at_75%_70%,rgba(250,204,21,.17),transparent_25%),linear-gradient(125deg,#090d18_0%,#05070b_58%,#0d111a_100%)]" />
        <div className="absolute left-[26%] top-1/2 hidden h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/15 lg:block" />
        <div className="universe-ring absolute left-[26%] top-1/2 hidden h-[570px] w-[570px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08] lg:block" />
        <div className="universe-ring-reverse absolute left-[26%] top-1/2 hidden h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/15 lg:block" />
        <div className="absolute left-[26%] top-1/2 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 shadow-[0_0_110px_40px_rgba(79,70,229,.35)] lg:block" />

        {POSTERS.map((poster, index) => {
          const positions = [
            "left-[5%] top-[9%] -rotate-12",
            "left-[24%] top-[2%] rotate-7",
            "left-[38%] top-[14%] rotate-12",
            "left-[7%] bottom-[2%] rotate-9",
            "left-[31%] bottom-[-4%] -rotate-8",
          ];
          return (
            <div
              key={poster}
              className={`absolute hidden aspect-[2/3] w-[150px] overflow-hidden border border-white/10 opacity-40 shadow-[0_35px_90px_rgba(0,0,0,.7)] lg:block ${positions[index]}`}
            >
              <img src={poster} alt="" className="h-full w-full object-cover saturate-[.8]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-indigo-950/20" />
            </div>
          );
        })}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070b] to-transparent" />
      </div>

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center bg-yellow-400 text-sm font-black text-black transition group-hover:-rotate-6">C</span>
          <span className="text-sm font-black tracking-[0.22em]">CINRYVAN</span>
        </Link>
        <Link href="/" className="text-xs font-black uppercase tracking-[0.22em] text-white/40 transition hover:text-yellow-300">
          Exit creation <span className="ml-1">↗</span>
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1500px] items-center gap-12 px-5 pb-12 pt-28 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-10 lg:pt-24">
        <div className="relative hidden min-h-[650px] lg:flex lg:items-end">
          <div className="relative z-10 max-w-[650px] pb-8">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-indigo-300">Origin sequence</p>
            <h1 className="mt-5 text-7xl font-black leading-[.86] tracking-[-0.065em] xl:text-[104px]">
              Create the
              <span className="block text-yellow-400">centre</span>
              <span className="block text-white/22">of your world.</span>
            </h1>
            <div className="mt-7 flex max-w-xl items-center gap-5 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              <span>Save</span><span className="h-1 w-1 rounded-full bg-indigo-400" />
              <span>Track</span><span className="h-1 w-1 rounded-full bg-indigo-400" />
              <span>Discover</span><span className="h-1 w-1 rounded-full bg-indigo-400" />
              <span>Return</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSignup}
          className="relative z-20 ml-auto w-full max-w-[560px] border border-white/10 bg-[#0c111a]/95 p-6 shadow-[0_45px_120px_rgba(0,0,0,.65)] backdrop-blur-2xl sm:p-9 lg:p-10"
        >
          <div className="absolute right-0 top-0 h-1 w-28 bg-indigo-400" />
          <div className="absolute left-0 top-0 h-12 w-12 border-l border-t border-indigo-400/40" />

          <div className="flex items-center justify-between gap-5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">Identity creation</p>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/25">Free account · 01/01</span>
          </div>

          <h2 className="mt-8 text-5xl font-black leading-[.9] tracking-[-0.055em] sm:text-6xl">
            Begin your
            <span className="block text-white/28">universe.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/50">
            One identity for the films, series, animation, games and discoveries you never want to lose.
          </p>

          {error && (
            <div role="alert" aria-live="polite" className="mt-6 border-l-2 border-red-400 bg-red-500/[0.09] px-4 py-3 text-sm font-bold text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div role="status" aria-live="polite" className="mt-6 border-l-2 border-emerald-400 bg-emerald-500/[0.09] px-4 py-3 text-sm font-bold text-emerald-200">
              Identity created. Preparing the gateway…
            </div>
          )}

          <div className="mt-7 grid gap-4">
            <label className="block">
              <span className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/38"><span>Your name</span><span>01</span></span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="How should CINRYVAN know you?"
                autoComplete="name"
                required
                disabled={loading || success}
                className="w-full border border-white/10 bg-[#06090f] px-4 py-4 text-base text-white outline-none transition placeholder:text-white/20 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(129,140,248,.09)] disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/38"><span>Email identity</span><span>02</span></span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                required
                disabled={loading || success}
                className="w-full border border-white/10 bg-[#06090f] px-4 py-4 text-base text-white outline-none transition placeholder:text-white/20 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(129,140,248,.09)] disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/38"><span>Create access key</span><span>03</span></span>
              <span className="relative block">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Use at least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading || success}
                  className="w-full border border-white/10 bg-[#06090f] px-4 py-4 pr-20 text-base text-white outline-none transition placeholder:text-white/20 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(129,140,248,.09)] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35 transition hover:text-indigo-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
              <span className="mt-2 grid grid-cols-4 gap-1" aria-label={`Password strength ${passwordStrength} of 4`}>
                {[1, 2, 3, 4].map((level) => (
                  <span key={level} className={`h-1 transition ${passwordStrength >= level ? (passwordStrength >= 4 ? "bg-emerald-400" : "bg-indigo-400") : "bg-white/10"}`} />
                ))}
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || success}
              className="group relative mt-1 w-full overflow-hidden bg-yellow-400 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center justify-between">
                {success ? "Identity complete" : loading ? "Creating universe" : "Create CINRYVAN identity"}
                <span className="text-lg transition group-hover:translate-x-1">→</span>
              </span>
              {loading && <span className="creation-scan absolute inset-y-0 w-24 -skew-x-12 bg-white/30" />}
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-white/30">
            By creating an account, you agree to the <Link href="/terms" className="font-bold text-white/55 hover:text-yellow-300">Terms</Link> and acknowledge the <Link href="/privacy" className="font-bold text-white/55 hover:text-yellow-300">Privacy Policy</Link>.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[9px] font-black uppercase tracking-[0.28em] text-white/25">Already registered?</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <Link href="/login" className="mt-5 flex items-center justify-center border border-white/10 px-5 py-3.5 text-sm font-black text-white/65 transition hover:border-indigo-400/60 hover:text-indigo-300">
            Return to the access gateway
          </Link>
        </form>
      </section>

      <style jsx>{`
        @keyframes universeRing { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes universeRingReverse { to { transform: translate(-50%, -50%) rotate(-360deg); } }
        @keyframes creationScan { from { left: -30%; } to { left: 120%; } }
        .universe-ring { animation: universeRing 38s linear infinite; }
        .universe-ring-reverse { animation: universeRingReverse 26s linear infinite; }
        .creation-scan { animation: creationScan 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .universe-ring, .universe-ring-reverse, .creation-scan { animation: none; }
        }
      `}</style>
    </main>
  );
}