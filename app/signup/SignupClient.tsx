"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const posters = [
  "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  "https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
];

const perks = [
  "Persistent Watchlists",
  "Release Notifications",
  "Continue Watching",
  "Personal Movie Vault",
  "TV Show Tracking",
  "Anime & Cartoon Discovery",
];

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err) {
      console.error("SIGNUP FAILED:", err);
      setError("Signup failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03050b] text-white">
      <div className="absolute inset-0">
        <div className="grid h-full grid-cols-3 gap-3 opacity-25 md:grid-cols-6">
          {posters.concat(posters).map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt=""
              className={`h-full min-h-[220px] w-full object-cover ${
                i % 2 === 0 ? "translate-y-8" : "-translate-y-8"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.22),transparent_35%),radial-gradient(circle_at_85%_35%,rgba(79,70,229,0.24),transparent_35%)]" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-28 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.55em] text-yellow-300">
            Join CineVault
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] md:text-7xl">
            Build your
            <br />
            own cinema
            <br />
            universe.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Save movies, track shows, follow upcoming releases, and keep your
            entertainment world synced across devices.
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {["Watchlist", "Alerts", "Ratings", "News"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-2xl font-black text-yellow-300">+</p>
                <p className="mt-1 text-sm font-bold text-white/70">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {perks.map((perk) => (
              <div
                key={perk}
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white/75 backdrop-blur"
              >
                ✓ {perk}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSignup}
          className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111722]/90 p-7 shadow-[0_30px_120px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-8"
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
            New Explorer
          </p>

          <h2 className="text-4xl font-black">Create account</h2>

          <p className="mt-3 text-white/60">
            Start your free CineVault account and build your watchlist.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">
              Account created. Sending you to login...
            </div>
          )}

          <div className="mt-7 space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              autoComplete="name"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 text-white outline-none transition focus:border-yellow-400"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              autoComplete="email"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 text-white outline-none transition focus:border-yellow-400"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 text-white outline-none transition focus:border-yellow-400"
            />

            <button
              disabled={loading || success}
              className="w-full rounded-2xl bg-yellow-400 px-4 py-4 font-black text-black shadow-[0_0_35px_rgba(250,204,21,0.25)] transition hover:bg-yellow-300 disabled:opacity-60"
            >
              {success
                ? "Account created..."
                : loading
                ? "Creating account..."
                : "Create Free Account"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-black text-yellow-300 hover:text-yellow-200">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}