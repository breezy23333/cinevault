"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export type GameCategory = {
  label: string;
  href: string;
  image?: string | null;
};

function CategoryArtwork({
  image,
  label,
}: {
  image?: string | null;
  label: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;

  if (!showImage) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(250,204,21,0.22),transparent_35%),linear-gradient(135deg,#26364d_0%,#111b2a_50%,#080b12_100%)]" />
    );
  }

  return (
    <>
      {/* Soft background fills the card without leaving empty space. */}
      <img
        src={image!}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-md"
      />

      {/* Main image remains visible without severe cropping. */}
      <img
        src={image!}
        alt={`${label} games`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-contain object-center transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
      />
    </>
  );
}

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

          <p className="mt-1 text-sm text-white/50">
            Explore games by genre, style and experience.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollCategories(-1)}
            aria-label="Scroll game categories left"
            className="grid h-9 w-9 place-items-center border border-white/20 bg-white/[0.07] text-white/80 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollCategories(1)}
            aria-label="Scroll game categories right"
            className="grid h-9 w-9 place-items-center border border-white/20 bg-white/[0.07] text-white/80 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative -mx-4 px-4 md:-mx-6 md:px-6">
        <div
          ref={categoryRef}
          className="grid auto-cols-[210px] grid-flow-col grid-rows-1 gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[230px] md:grid-rows-2 md:auto-cols-[250px]"
        >
          {categories.map((category) => (
            <Link
              key={`${category.label}-${category.href}`}
              href={category.href}
              prefetch={false}
              className="group relative h-[138px] overflow-hidden border border-white/15 bg-[#121a27] shadow-[0_10px_28px_rgba(0,0,0,.25)] transition duration-300 hover:-translate-y-0.5 hover:border-yellow-400/80"
            >
              <CategoryArtwork
                image={category.image}
                label={category.label}
              />

              {/* Lighter overlay keeps both the image and text visible. */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080d]/90 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />

              <div className="relative z-[1] flex h-full items-end justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-yellow-400">
                    Category
                  </p>

                  <h3 className="mt-1 truncate text-lg font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.9)] transition group-hover:text-yellow-300">
                    {category.label}
                  </h3>
                </div>

                <span className="grid h-8 w-8 shrink-0 translate-y-1 place-items-center border border-white/30 bg-black/55 text-white opacity-0 transition group-hover:translate-y-0 group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-wider text-white/40">
        <span>{categories.length} categories</span>
        <span className="hidden sm:block">
          Drag or use arrows to explore
        </span>
      </div>
    </section>
  );
}