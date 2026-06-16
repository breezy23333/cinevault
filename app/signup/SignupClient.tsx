"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] px-4 py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,190,0,0.16),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(80,120,255,0.18),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <section className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.45em] text-yellow-300">
            CineVault Account
          </p>
          <h1 className="max-w-xl text-6xl font-black leading-tight">
            Build your own cinema universe.
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/60">
            Save movies, track shows, unlock alerts, and keep your watchlist synced across devices.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm font-bold text-yellow-300">Account perks</p>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <span>✓ Persistent watchlist</span>
              <span>✓ Personalized notifications</span>
              <span>✓ Continue watching system ready</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSignup}
          className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111722]/80 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
            New explorer
          </p>
          <h2 className="text-4xl font-black">Create account</h2>
          <p className="mt-3 text-white/60">
            Join CineVault and start building your watchlist.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
              {error}
            </div>
          )}

          <div className="mt-7 space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-yellow-400" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-yellow-400" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-yellow-400" />

            <button disabled={loading} className="w-full rounded-2xl bg-yellow-400 px-4 py-4 font-black text-black shadow-[0_0_35px_rgba(250,204,21,0.25)] hover:bg-yellow-300 disabled:opacity-60">
              {loading ? "Creating account..." : "Enter CineVault"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-black text-yellow-300">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}