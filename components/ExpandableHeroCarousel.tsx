"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  const cards = useMemo(
    () =>
      items
        .filter((item) => item.id && item.title && (item.backdrop || item.poster))
        .slice(0, 6),
    [items],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (activeIndex >= cards.length) setActiveIndex(0);
  }, [activeIndex, cards.length]);

  useEffect(() => {
    if (paused || cards.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [cards.length, paused]);

  if (!cards.length) return null;

  const activeCard = cards[activeIndex] ?? cards[0];
  const href = `/${activeCard.media}/${activeCard.id}`;

  const previous = () =>
    setActiveIndex((current) => (current - 1 + cards.length) % cards.length);

  const next = () =>
    setActiveIndex((current) => (current + 1) % cards.length);

  return (
    <section
      className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#070910] shadow-[0_30px_100px_rgba(0,0,0,0.45)] md:rounded-[34px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[470px] overflow-hidden sm:min-h-[520px] lg:min-h-[590px]">
        {cards.map((item, index) => (
          <div
            key={`${item.media}-${item.id}`}
            aria-hidden={index !== activeIndex}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.backdrop || item.poster!}
              alt=""
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-center"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-[#070910] via-[#070910]/78 to-[#070910]/10 lg:via-[#070910]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070910] via-transparent to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(250,204,21,0.13),transparent_26%)]" />

        <div className="relative z-10 flex min-h-[470px] flex-col p-5 sm:min-h-[520px] sm:p-7 lg:min-h-[590px] lg:p-10 xl:p-12">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-black/35 px-3 py-1.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-400 sm:text-xs">
                  {eyebrow}
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous animated title"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next animated title"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-auto grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_210px] xl:grid-cols-[minmax(0,1fr)_235px]">
            <div key={`${activeCard.media}-${activeCard.id}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md sm:text-xs">
                  {activeCard.media === "tv" ? "TV Series" : "Movie"}
                </span>
                {activeCard.year && (
                  <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md sm:text-xs">
                    {activeCard.year}
                  </span>
                )}
                {typeof activeCard.rating === "number" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1.5 text-[11px] font-black text-black sm:text-xs">
                    <Star className="h-3.5 w-3.5" fill="currentColor" />
                    {activeCard.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <h3 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] text-white drop-shadow-2xl sm:text-5xl lg:text-6xl xl:text-7xl">
                {activeCard.title}
              </h3>

              {activeCard.overview && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 line-clamp-2 sm:text-base sm:leading-7 lg:line-clamp-3">
                  {activeCard.overview}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black shadow-[0_14px_40px_rgba(250,204,21,0.2)] transition hover:bg-yellow-300 sm:px-6"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                  View details
                </Link>
                <Link
                  href={href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-black/35 px-5 py-3 text-sm font-black text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400 sm:px-6"
                >
                  Explore world
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {activeCard.poster && (
              <Link
                href={href}
                className="group relative hidden aspect-[2/3] overflow-hidden rounded-[22px] border border-white/20 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.55)] lg:block"
              >
                <Image
                  src={activeCard.poster}
                  alt={`${activeCard.title} poster`}
                  fill
                  sizes="235px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-black/75 px-4 py-3 text-xs font-black text-white backdrop-blur-md transition group-hover:translate-y-0">
                  Open title
                  <ArrowUpRight className="h-4 w-4 text-yellow-400" />
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="absolute bottom-5 right-5 z-20 flex gap-2 md:hidden">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous animated title"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next animated title"
            className="grid h-10 w-10 place-items-center rounded-full bg-yellow-400 text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative z-20 border-t border-white/10 bg-[#080a10] p-3 sm:p-4">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((item, index) => (
            <button
              key={`${item.media}-${item.id}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.title}`}
              aria-pressed={index === activeIndex}
              className={`group relative h-[66px] min-w-[145px] flex-1 overflow-hidden rounded-xl border text-left transition sm:h-[78px] sm:min-w-[175px] ${
                index === activeIndex
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/30"
              }`}
            >
              <Image
                src={item.backdrop || item.poster!}
                alt=""
                fill
                sizes="200px"
                className={`object-cover transition duration-500 ${
                  index === activeIndex
                    ? "opacity-55"
                    : "opacity-30 grayscale group-hover:opacity-50 group-hover:grayscale-0"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-center px-3">
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                    index === activeIndex ? "text-yellow-400" : "text-white/45"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 line-clamp-1 text-xs font-black text-white sm:text-sm">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}