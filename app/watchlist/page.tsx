"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type WatchlistItem = {
  id: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  voteAverage?: number | null;
};

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  async function loadWatchlist() {
    const res = await fetch("/api/watchlist", {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Watchlist API failed:", res.status);
      setItems([]);
      return;
    }

    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function removeItem(item: WatchlistItem) {
    await fetch("/api/watchlist", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tmdbId: item.tmdbId,
        mediaType: item.mediaType,
      }),
    });

    setItems((prev) => prev.filter((x) => x.id !== item.id));
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-28">
      <h1 className="text-4xl font-black">Watchlist</h1>
      <p className="mt-3 text-white/60">
        Your saved movies and shows appear here.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-white/70">No saved titles yet.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${item.mediaType}/${item.tmdbId}`}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-yellow-400/50"
            >
              <div className="relative aspect-[2/3] bg-zinc-800">
                {item.posterPath && (
                  <Image
                    src={
                      item.posterPath.startsWith("http")
                        ? item.posterPath
                        : `https://image.tmdb.org/t/p/w500${item.posterPath}`
                    }
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                )}
              </div>

              <div className="p-3">
                <p className="line-clamp-1 font-bold">{item.title}</p>
                <p className="text-sm text-white/50">
                  {item.mediaType.toUpperCase()} · {item.releaseDate || "—"}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item);
                  }}
                  className="mt-3 w-full rounded-xl bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20"
                >
                  Remove
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}