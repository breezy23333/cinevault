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
      headers: {
        "Content-Type": "application/json",
      },
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
    <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-4 py-28">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-black">Create account</h1>
        <p className="mt-2 text-white/60">
          Save your watchlist, get alerts, and continue watching on CineVault.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-yellow-400"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-yellow-400"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-yellow-400"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-yellow-300">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}