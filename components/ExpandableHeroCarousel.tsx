"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Play,
  Star,
} from "lucide-react";
import { useState } from "react";

type Item = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
};

type ExpandableHeroCarouselProps = {
  eyebrow: string;
  title: string;
  items: Item[];
};

export default function ExpandableHeroCarousel({
  eyebrow,
  title,
  items,
}: ExpandableHeroCarouselProps) {
  const cards = items
    .filter(
      (item) => item.backdrop || item.poster,
    )
    .slice(0, 7);

  const [activeIndex, setActiveIndex] =
    useState(0);

  if (!cards.length) {
    return null;
  }

  const activeCard =
    cards[activeIndex] ?? cards[0];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-yellow-400/25 bg-[#05070d] shadow-[0_30px_100px_rgba(0,0,0,0.5)] md:rounded-[36px]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.13),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.13),transparent_35%)]" />

      {/* Heading */}
      <div className="relative z-10 flex flex-col gap-3 px-5 pb-7 pt-8 md:flex-row md:items-end md:justify-between md:px-9 md:pb-9 md:pt-10">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
            {title}
          </h2>
        </div>

        <div className="hidden items-center gap-2 text-sm font-semibold text-white/50 md:flex">
          <span className="h-px w-10 bg-yellow-400/60" />
          Hover over a line to explore
        </div>
      </div>

      {/* Mobile */}
      <div className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
        {cards.map((item) => (
          <Link
            key={`${item.media}-${item.id}`}
            href={`/${item.media}/${item.id}`}
            className="group relative h-[390px] w-[280px] shrink-0 snap-center overflow-hidden rounded-[26px] border border-white/15 bg-white/5"
          >
            <Image
              src={item.backdrop || item.poster!}
              alt={item.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="280px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  {item.media === "tv"
                    ? "TV Series"
                    : "Movie"}
                </span>

                {item.year && (
                  <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {item.year}
                  </span>
                )}

                {typeof item.rating ===
                  "number" && (
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">
                    ★ {item.rating}
                  </span>
                )}
              </div>

              <h3 className="mt-4 line-clamp-2 text-2xl font-black leading-tight text-white">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop expanding panels */}
      <div className="relative hidden h-[590px] overflow-hidden border-t border-white/10 md:flex">
        {cards.map((item, index) => {
          const isActive =
            index === activeIndex;

          return (
            <div
              key={`${item.media}-${item.id}`}
              onMouseEnter={() =>
                setActiveIndex(index)
              }
              onFocusCapture={() =>
                setActiveIndex(index)
              }
              className={`relative h-full min-w-0 overflow-hidden border-r transition-[flex-basis,flex-grow,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                  ? "z-20 flex-[1_1_100%] basis-full border-yellow-400/35 opacity-100"
                  : "z-10 flex-[0_0_22px] basis-[22px] cursor-pointer border-white/20 opacity-65 grayscale-[35%] hover:border-yellow-400 hover:opacity-100 hover:grayscale-0"
              }`}
            >
              <Image
                src={
                  item.backdrop || item.poster!
                }
                alt={item.title}
                fill
                priority={index === 0}
                className={`object-cover transition duration-1000 ${
                  isActive
                    ? "scale-100"
                    : "scale-110"
                }`}
                sizes={
                  isActive
                    ? "(max-width: 1800px) 90vw, 1600px"
                    : "80px"
                }
              />

              {/* Narrow yellow line */}
              <div
                className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-[2px] transition ${
                  isActive
                    ? "bg-yellow-400/70"
                    : "bg-white/20"
                }`}
              />

              {/* Inactive panel indicator */}
              {!isActive && (
                <div className="absolute inset-0 z-10 bg-black/45">
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-yellow-400/65 to-transparent" />
                </div>
              )}

              {/* Active content */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? "opacity-100 delay-200"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/95 via-[#05070d]/52 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/95 via-transparent to-black/15" />

                <div className="relative z-10 flex h-full max-w-4xl flex-col justify-end px-10 pb-12 pt-20 lg:px-16 lg:pb-16 xl:px-20">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                      {item.media === "tv"
                        ? "TV Series"
                        : "Movie"}
                    </span>

                    {item.year && (
                      <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                        {item.year}
                      </span>
                    )}

                    {typeof item.rating ===
                      "number" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black text-black">
                        <Star
                          className="h-3.5 w-3.5"
                          fill="currentColor"
                        />
                        {item.rating}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] text-white drop-shadow-2xl lg:text-6xl xl:text-7xl">
                    {item.title}
                  </h3>

                  {item.overview && (
                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 line-clamp-3 lg:text-lg lg:leading-8">
                      {item.overview}
                    </p>
                  )}

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href={`/${item.media}/${item.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-black text-black shadow-[0_15px_40px_rgba(250,204,21,0.22)] transition hover:bg-yellow-300"
                    >
                      <Play
                        className="h-4 w-4"
                        fill="currentColor"
                      />
                      View details
                    </Link>

                    <Link
                      href={`/${item.media}/${item.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400"
                    >
                      Explore world
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Active number */}
                <div className="absolute right-8 top-8 z-20 text-right">
                  <p className="text-5xl font-black text-white/15 lg:text-7xl">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </p>

                  <p className="mt-1 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                    Selected world
                  </p>
                </div>
              </div>

              {/* Invisible accessible hover target */}
              {!isActive && (
                <button
                  type="button"
                  aria-label={`Open ${item.title}`}
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  className="absolute inset-0 z-30 cursor-pointer"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected-title navigation */}
      <div className="relative hidden items-center justify-between border-t border-white/10 bg-black/30 px-9 py-4 md:flex">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Currently viewing
          </p>

          <p className="mt-1 truncate font-bold text-white">
            {activeCard.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cards.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Open ${item.title}`}
              onMouseEnter={() =>
                setActiveIndex(index)
              }
              onClick={() =>
                setActiveIndex(index)
              }
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-9 bg-yellow-400"
                  : "w-2 bg-white/25 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}