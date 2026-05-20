"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ContinueItem, getContinueWatching } from "@/lib/continueWatching";

const img = (p?: string | null) =>
  p ? `https://image.tmdb.org/t/p/w342${p}` : null;

export default function ContinueWatchingRow() {
  const [items, setItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="rounded-[30px] border border-yellow-400/20 bg-white/[0.045] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400/80">
        Your vault
      </p>

      <h2 className="mb-4 text-xl font-black md:text-2xl">
        Continue Watching
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {items.map((item) => {
          const poster = img(item.poster_path);

          return (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={`/${item.media_type}/${item.id}`}
              className="group w-[150px] shrink-0"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition group-hover:ring-yellow-400/50">
                {poster ? (
                  <Image
                    src={poster}
                    alt={item.title}
                    fill
                    sizes="150px"
                    loading="lazy"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-white/50">
                    No poster
                  </div>
                )}
              </div>

              <h3 className="mt-2 line-clamp-1 text-sm font-bold">
                {item.title}
              </h3>

              <p className="text-xs text-white/45">
                {item.media_type === "tv" ? "TV Show" : "Movie"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}