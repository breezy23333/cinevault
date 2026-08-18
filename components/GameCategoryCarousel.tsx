"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export type GameCategory = {
  label: string;
  href: string;
  image?: string | null;
};

export default function GameCategoryCarousel({
  categories,
}: {
  categories: GameCategory[];
}) {
  const categoryRef = useRef<HTMLDivElement>(null);

  if (!categories.length) return null;

  function scrollCategories(direction: -1 | 1) {
    const container = categoryRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction * Math.max(300, container.clientWidth * 0.8),
      behavior: "smooth",
    });
  }

  return (
    <section className="py-8" aria-labelledby="game-categories-title">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
            Find your next world
          </p>
          <h2
            id="game-categories-title"
            className="mt-1 text-xl font-black tracking-tight text-white md:text-2xl"
          >
            Browse by Category
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Explore games by genre, style and experience.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollCategories(-1)}
            aria-label="Scroll game categories left"
            className="grid h-9 w-9 place-items-center border border-white/15 bg-white/5 text-white/70 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollCategories(1)}
            aria-label="Scroll game categories right"
            className="grid h-9 w-9 place-items-center border border-white/15 bg-white/5 text-white/70 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative -mx-4 px-4 md:-mx-6 md:px-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#080b12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#080b12] to-transparent" />

        <div
          ref={categoryRef}
          className="grid auto-cols-[210px] grid-flow-col grid-rows-1 gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[230px] md:grid-rows-2 md:auto-cols-[250px]"
        >
          {categories.map((category) => (
            <Link
              key={`${category.label}-${category.href}`}
              href={category.href}
              prefetch={false}
              className="group relative h-[128px] overflow-hidden border border-white/10 bg-[#121a27] shadow-[0_10px_28px_rgba(0,0,0,.25)] transition duration-300 hover:-translate-y-0.5 hover:border-yellow-400/70"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={`${category.label} games`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05] group-hover:brightness-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#26364d] to-[#0b1019]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/25 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />

              <div className="relative z-[1] flex h-full items-end justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-yellow-400">
                    Category
                  </p>
                  <h3 className="mt-1 truncate text-lg font-black text-white transition group-hover:text-yellow-300">
                    {category.label}
                  </h3>
                </div>
                <span className="grid h-8 w-8 shrink-0 translate-y-1 place-items-center border border-white/20 bg-black/45 text-white opacity-0 transition group-hover:translate-y-0 group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-wider text-white/30">
        <span>{categories.length} categories</span>
        <span className="hidden sm:block">Drag or use arrows to explore</span>
      </div>
    </section>
  );
}