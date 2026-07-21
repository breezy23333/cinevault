"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ContinueItem,
  getContinueWatching,
} from "@/lib/continueWatching";

const img = (p?: string | null) =>
  p ? `https://image.tmdb.org/t/p/w342${p}` : null;

export default function ContinueWatchingRow() {
  const [items, setItems] = useState<ContinueItem[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  function scrollRow(direction: "left" | "right") {
    const row = rowRef.current;

    if (!row) return;

    const amount = row.clientWidth * 0.85;

    row.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="rounded-[30px] border border-yellow-400/20 bg-white/[0.045] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400/80">
            Your vault
          </p>

          <h2 className="text-xl font-black md:text-2xl">
            Continue Watching
          </h2>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollRow("left")}
            aria-label="Scroll Continue Watching left"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-xl text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scrollRow("right")}
            aria-label="Scroll Continue Watching right"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-xl text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M9 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
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