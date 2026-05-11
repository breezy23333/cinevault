import Link from "next/link";
import { Bookmark, Bell, Film, Sparkles } from "lucide-react";

export default function WatchlistPage() {
  return (
    <main className="min-h-screen bg-[#080d16] px-4 pb-20 pt-28 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-yellow-400/25 bg-gradient-to-br from-yellow-400/15 via-white/[0.04] to-transparent p-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
            <Bookmark className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black">Watchlist</h1>

          <p className="mt-3 max-w-2xl text-white/65">
            Save movies and shows you want to watch later. Soon, CineVault will
            use this list for alerts, recommendations, and new episode updates.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/search"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-white/[0.07]"
          >
            <Film className="mb-4 h-8 w-8 text-yellow-400" />
            <h2 className="font-bold">Find titles</h2>
            <p className="mt-2 text-sm text-white/60">
              Search movies and shows to start building your watchlist.
            </p>
          </Link>

          <Link
            href="/notifications"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-white/[0.07]"
          >
            <Bell className="mb-4 h-8 w-8 text-yellow-400" />
            <h2 className="font-bold">Watchlist alerts</h2>
            <p className="mt-2 text-sm text-white/60">
              Saved titles will power future notifications and release alerts.
            </p>
          </Link>

          <Link
            href="/trending"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-white/[0.07]"
          >
            <Sparkles className="mb-4 h-8 w-8 text-yellow-400" />
            <h2 className="font-bold">Trending picks</h2>
            <p className="mt-2 text-sm text-white/60">
              Discover popular titles and add them to your list next.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}