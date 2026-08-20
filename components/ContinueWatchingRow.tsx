// components/ContinueWatchingRow.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type ContinueItem,
  getContinueWatching,
} from "@/lib/continueWatching";

const getPoster = (path?: string | null) =>
  path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : null;

export default function ContinueWatchingRow() {
  const [items, setItems] = useState<ContinueItem[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  const updateScrollState = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    setCanScrollLeft(row.scrollLeft > 4);
    setCanScrollRight(
      row.scrollLeft + row.clientWidth < row.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || items.length === 0) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);

    resizeObserver.observe(row);
    row.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    return () => {
      resizeObserver.disconnect();
      row.removeEventListener("scroll", updateScrollState);
    };
  }, [items.length, updateScrollState]);

  function scrollRow(direction: "left" | "right") {
    const row = rowRef.current;
    if (!row) return;

    const distance =
      row.clientWidth * 0.78 * (direction === "left" ? -1 : 1);

    row.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="relative border-b border-white/[0.08] pb-6 sm:pb-8">
      <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
        <div className="border-l-2 border-yellow-400/70 pl-3 sm:pl-4">
          <p className="mb-1 text-[9px] font-black uppercase tracking-[0.28em] text-yellow-400/75 sm:text-[10px]">
            Your vault
          </p>

          <h2 className="text-lg font-black sm:text-xl md:text-2xl">
            Continue Watching
          </h2>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollRow("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll Continue Watching left"
            className="
              grid h-9 w-9 place-items-center rounded-full
              border border-white/15 bg-black/60
              text-white transition
              hover:border-yellow-400 hover:bg-yellow-400 hover:text-black
              disabled:pointer-events-none disabled:opacity-25
            "
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollRow("right")}
            disabled={!canScrollRight}
            aria-label="Scroll Continue Watching right"
            className="
              grid h-9 w-9 place-items-center rounded-full
              border border-white/15 bg-black/60
              text-white transition
              hover:border-yellow-400 hover:bg-yellow-400 hover:text-black
              disabled:pointer-events-none disabled:opacity-25
            "
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="
          hide-scrollbar
          flex snap-x snap-proximity gap-2
          overflow-x-auto overscroll-x-contain
          scroll-smooth px-0.5 pb-1.5
          sm:gap-3 sm:pb-2
          md:gap-4
        "
      >
        {items.map((item) => {
          const poster = getPoster(item.poster_path);

          return (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={`/${item.media_type}/${item.id}`}
              className="
                group block w-[108px] shrink-0 snap-start
                outline-none
                sm:w-[140px]
                md:w-[160px]
              "
            >
              <div
                className="
                  relative aspect-[2/3] overflow-hidden
                  rounded-xl border border-white/10
                  bg-[#111722]
                  shadow-[0_12px_30px_rgba(0,0,0,0.28)]
                  transition duration-300
                  group-hover:-translate-y-1
                  group-hover:border-yellow-400/50
                  group-focus-visible:border-yellow-400
                  sm:rounded-2xl
                "
              >
                {poster ? (
                  <Image
                    src={poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 639px) 108px, (max-width: 767px) 140px, 160px"
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center px-2 text-center text-[10px] text-white/35">
                    Poster unavailable
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-yellow-400 transition duration-300 group-hover:scale-x-100" />
              </div>

              <div className="px-0.5 pt-1.5 sm:pt-2">
                <h3 className="line-clamp-1 text-[11px] font-bold leading-tight text-white/90 transition group-hover:text-yellow-300 sm:text-sm">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-[9px] uppercase text-white/40 sm:text-xs">
                  {item.media_type === "tv" ? "TV Show" : "Movie"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}