import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0e131f] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-3xl bg-[#0c111b] ring-1 ring-white/10 p-8 shadow-2xl">
        <h1 className="text-4xl font-black mb-2">Welcome back</h1>
        <p className="text-white/60 mb-8">
          Log in to continue watching, rating, and saving titles on CineVault.
        </p>

        <form className="space-y-4">
          <div>
            <label className="text-sm font-bold text-white/70">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl bg-black/40 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-white/70">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl bg-black/40 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-yellow-400"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-yellow-400 text-black font-black py-3 hover:bg-yellow-300 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-white/50 mt-6">
          No account yet?{" "}
          <Link href="/signup" className="text-yellow-400 font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}