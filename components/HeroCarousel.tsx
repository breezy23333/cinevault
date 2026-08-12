"use client";

import CineImage from "@/components/CineImage";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
};

export default function HeroCarousel({
  items,
}: {
  items: Norm[];
}) {
  const heroes = useMemo(
    () => (items || []).filter((item) => Boolean(item.backdrop)),
    [items],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (
      heroes.length > 0 &&
      currentIndex >= heroes.length
    ) {
      setCurrentIndex(0);
    }
  }, [heroes.length, currentIndex]);

  useEffect(() => {
    if (heroes.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex(
        (previous) => (previous + 1) % heroes.length,
      );
    }, 8000);

    return () => window.clearInterval(interval);
  }, [heroes.length]);

  if (!heroes.length) {
    return null;
  }

  const currentHero = heroes[currentIndex];

  const href =
    `/${currentHero.media}/${currentHero.id}`;

  function showNext() {
    setCurrentIndex(
      (previous) => (previous + 1) % heroes.length,
    );
  }

  function showPrevious() {
    setCurrentIndex(
      (previous) =>
        (previous - 1 + heroes.length) % heroes.length,
    );
  }

  function handleTouchEnd() {
    const distance = touchStart - touchEnd;

    if (distance > 50) {
      showNext();
    }

    if (distance < -50) {
      showPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  }

  return (
    <section className="relative left-1/2 z-0 w-[100svw] -translate-x-1/2 overflow-hidden bg-[#05070d]">
      <div
        className="relative min-h-[calc(100svh-72px)] w-full"
        onTouchStart={(event) => {
          const position =
            event.targetTouches[0].clientX;

          setTouchStart(position);
          setTouchEnd(position);
        }}
        onTouchMove={(event) => {
          setTouchEnd(
            event.targetTouches[0].clientX,
          );
        }}
        onTouchEnd={handleTouchEnd}
      >
        <CineImage
          key={`${currentHero.media}-${currentHero.id}`}
          src={currentHero.backdrop}
          alt={currentHero.title}
          fallback="No backdrop"
          priority={currentIndex === 0}
          className="object-cover object-center"
        />

        {/* Light horizontal shading—stronger only behind the text */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070d]/80 via-[#05070d]/25 to-transparent" />

      {/* Soft shading at the top and bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070d]/75 via-transparent to-black/10" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1600px] items-end px-5 pb-24 pt-32 md:px-10 md:pb-28 lg:px-16">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-bold text-white/80 backdrop-blur">
                {currentHero.media === "tv"
                  ? "TV Series"
                  : "Movie"}
              </span>

              {currentHero.year && (
                <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-bold text-white/80 backdrop-blur">
                  {currentHero.year}
                </span>
              )}

              {typeof currentHero.rating === "number" && (
                <span className="rounded-lg bg-yellow-400 px-3 py-1.5 font-black text-black">
                  ★ {currentHero.rating}
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              {currentHero.title}
            </h1>

            {currentHero.overview && (
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 line-clamp-3 md:text-lg md:leading-8">
                {currentHero.overview}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={href}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 text-sm font-black text-black shadow-[0_15px_40px_rgba(250,204,21,0.2)] transition hover:bg-yellow-300"
              >
                <Play
                  className="h-4 w-4"
                  fill="currentColor"
                />
                View details
              </Link>

              <Link
                href={`${href}?tab=trailer`}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-black/45 px-7 py-3.5 text-sm font-black text-white backdrop-blur transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Watch trailer
              </Link>
            </div>
          </div>
        </div>

        {heroes.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous featured title"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:border-yellow-400 hover:text-yellow-400 md:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Next featured title"
              onClick={showNext}
              className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:border-yellow-400 hover:text-yellow-400 md:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {heroes.map((hero, index) => (
                <button
                  key={`${hero.media}-${hero.id}`}
                  type="button"
                  aria-label={`Show ${hero.title}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-10 bg-yellow-400"
                      : "w-4 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#05070d]/20 to-[#05070d]/75" />
      </div>
    </section>
  );
}