"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWatchlist, WatchlistItem } from "@/lib/watchlist";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setItems(getWatchlist());
  }, []);

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
              key={`${item.media_type}-${item.id}`}
              href={`/${item.media_type}/${item.id}`}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-yellow-400/50"
            >
              <div className="relative aspect-[2/3] bg-zinc-800">
                {item.poster_path && (
                  <Image
                    src={
                      item.poster_path?.startsWith("http")
                        ? item.poster_path
                        : `https://image.tmdb.org/t/p/w500${item.poster_path}`
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
                  {item.media_type.toUpperCase()} · {item.release_date || "—"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}