// components/NewsStrip.tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type NewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
};

export default function NewsStrip({
  items,
}: {
  items: NewsItem[];
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] =
    useState(false);
  const [canScrollRight, setCanScrollRight] =
    useState(false);

  const updateScrollState = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;

    setCanScrollLeft(strip.scrollLeft > 4);
    setCanScrollRight(
      strip.scrollLeft + strip.clientWidth <
        strip.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(
      updateScrollState,
    );

    resizeObserver.observe(strip);
    strip.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true },
    );

    return () => {
      resizeObserver.disconnect();
      strip.removeEventListener(
        "scroll",
        updateScrollState,
      );
    };
  }, [items.length, updateScrollState]);

  function scrollStrip(
    direction: "left" | "right",
  ) {
    const strip = stripRef.current;
    if (!strip) return;

    const distance =
      strip.clientWidth *
      0.78 *
      (direction === "left" ? -1 : 1);

    strip.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <div className="relative min-w-0">
      <div
        ref={stripRef}
        className="
          hide-scrollbar
          flex snap-x snap-proximity gap-2
          overflow-x-auto overscroll-x-contain
          scroll-smooth px-0.5 pb-1.5
          sm:gap-3 sm:pb-2
          md:gap-4
        "
      >
        {items.map((item, index) => (
          <Link
            key={`${item.url}-${index}`}
            href={item.url}
            className="
              group block w-[200px] shrink-0 snap-start
              outline-none
              sm:w-[280px]
              md:w-[320px]
            "
          >
            <div
              className="
                relative aspect-video overflow-hidden
                rounded-lg border border-white/10
                bg-[#111722]
                shadow-[0_12px_30px_rgba(0,0,0,0.28)]
                transition duration-300
                group-hover:-translate-y-0.5
                group-hover:border-yellow-400/50
                group-focus-visible:border-yellow-400
                sm:rounded-xl
              "
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-[10px] text-white/35 sm:text-sm">
                  Image unavailable
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

              {item.source && (
                <span className="absolute left-1.5 top-1.5 bg-black/70 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-yellow-300 backdrop-blur-sm sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[10px]">
                  {item.source}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-yellow-400 transition duration-300 group-hover:scale-x-100" />
            </div>

            <div className="px-0.5 pt-1.5 sm:pt-2">
              <h3 className="line-clamp-2 text-[11px] font-bold leading-4 text-white/85 transition group-hover:text-yellow-300 sm:text-sm sm:leading-5">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll news left"
        onClick={() => scrollStrip("left")}
        disabled={!canScrollLeft}
        className="
          absolute left-1 top-1/2 z-20 hidden
          h-10 w-10 -translate-y-1/2
          items-center justify-center rounded-full
          border border-white/15 bg-black/75
          text-white shadow-xl backdrop-blur-md
          transition
          hover:border-yellow-400
          hover:bg-yellow-400 hover:text-black
          disabled:pointer-events-none disabled:opacity-0
          md:flex
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Scroll news right"
        onClick={() => scrollStrip("right")}
        disabled={!canScrollRight}
        className="
          absolute right-1 top-1/2 z-20 hidden
          h-10 w-10 -translate-y-1/2
          items-center justify-center rounded-full
          border border-white/15 bg-black/75
          text-white shadow-xl backdrop-blur-md
          transition
          hover:border-yellow-400
          hover:bg-yellow-400 hover:text-black
          disabled:pointer-events-none disabled:opacity-0
          md:flex
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}