"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleLogin(e: React.FormEvent | React.MouseEvent) {
  e.preventDefault();

  console.log("LOGIN BUTTON CLICKED");

  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", res.status, data);

    if (!res.ok) {
      setError(data.error || "Invalid login credentials");
      setLoading(false);
      return;
    }

    setSuccess(true);
    localStorage.setItem("cinevault_user", JSON.stringify(data.user));

    setTimeout(() => {
      window.location.assign("/");
    }, 1200);
  } catch (err) {
    console.error("LOGIN FAILED:", err);
    setError("Login failed. Check console.");
    setLoading(false);
  }
}


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] px-4 py-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,190,0,0.16),transparent_35%),radial-gradient(circle_at_75%_30%,rgba(100,80,255,0.2),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.45em] text-yellow-300">
            Welcome Back
          </p>
          <h1 className="max-w-xl text-6xl font-black leading-tight">
            Continue your cinematic journey.
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/60">
            Your saved movies, shows, ratings, and watch history are waiting.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm font-bold text-yellow-300">System online</p>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <span>✓ Database watchlist active</span>
              <span>✓ Account session active</span>
              <span>✓ Notifications coming next</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleLogin}
          className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111722]/80 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
            CineVault Access
          </p>
          <h2 className="text-4xl font-black">Welcome back</h2>
          <p className="mt-3 text-white/60">
            Log in to continue watching, rating, and saving titles.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
              {error}
            </div>
          )}

          <div className="mt-7 space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-yellow-400" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none focus:border-yellow-400" />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading || success}
              className="w-full rounded-2xl bg-yellow-400 px-4 py-4 font-black text-black shadow-[0_0_35px_rgba(250,204,21,0.25)] hover:bg-yellow-300 disabled:opacity-60"
            >
              {success ? "Opening CineVault..." : loading ? "Logging in..." : "Enter CineVault"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            No account yet?{" "}
            <Link href="/signup" className="font-black text-yellow-300">
              Create one
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}