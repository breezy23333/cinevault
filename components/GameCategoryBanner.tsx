"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { GameCategory } from "@/components/GameCategoryCarousel";

export default function GameCategoryBanner({
  categories,
}: {
  categories: GameCategory[];
}) {
  const banners = useMemo(
    () => categories.filter((category) => category.image).slice(0, 10),
    [categories],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (activeIndex >= banners.length) setActiveIndex(0);
  }, [activeIndex, banners.length]);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % banners.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [banners.length, paused]);

  if (!banners.length) return null;

  const active = banners[activeIndex] ?? banners[0];
  const previous = () =>
    setActiveIndex(
      (current) => (current - 1 + banners.length) % banners.length,
    );
  const next = () =>
    setActiveIndex((current) => (current + 1) % banners.length);

  return (
    <section
      className="relative overflow-hidden border-y border-white/10 bg-[#0b1019] shadow-[0_18px_55px_rgba(0,0,0,.45)]"
      aria-label="Featured game category"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto min-h-[220px] max-w-[1600px] sm:min-h-[250px] lg:min-h-[285px]">
        <img
          key={active.image}
          src={active.image!}
          alt={`${active.label} games`}
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/85 to-[#080b12]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b12]/85 via-transparent to-black/20" />

        <div className="relative z-10 mx-auto flex min-h-[220px] max-w-7xl items-center px-14 py-8 sm:min-h-[250px] md:px-20 lg:min-h-[285px] lg:px-6">
          <div className="max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
              Category spotlight
            </p>
            <h1 className="mt-2 text-3xl font-black leading-none tracking-tight text-white sm:text-4xl lg:text-5xl">
              {active.label}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
              Enter new worlds and discover standout {active.label.toLowerCase()} games.
            </p>
            <Link
              href={active.href}
              prefetch={false}
              className="mt-5 inline-flex items-center gap-2 bg-yellow-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              Explore {active.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous category"
              className="absolute left-0 top-1/2 z-20 grid h-20 w-11 -translate-y-1/2 place-items-center bg-gradient-to-r from-black/85 to-transparent text-white/80 transition hover:text-yellow-400"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next category"
              className="absolute right-0 top-1/2 z-20 grid h-20 w-11 -translate-y-1/2 place-items-center bg-gradient-to-l from-black/85 to-transparent text-white/80 transition hover:text-yellow-400"
            >
              <ChevronRight className="h-7 w-7" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {banners.map((category, index) => (
                <button
                  key={`${category.href}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${category.label}`}
                  aria-pressed={index === activeIndex}
                  className={`h-1.5 transition-all ${
                    index === activeIndex
                      ? "w-7 bg-yellow-400"
                      : "w-4 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}