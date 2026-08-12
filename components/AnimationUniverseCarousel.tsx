"use client";

import CineImage from "@/components/CineImage";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type AnimationItem = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview?: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
};

export default function AnimationUniverseCarousel({
  items,
}: {
  items: AnimationItem[];
}) {
  const slides = (items || [])
    .filter((item) => item.backdrop || item.poster)
    .slice(0, 6);

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] =
    useState<number | null>(null);
  const [touchEnd, setTouchEnd] =
    useState<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex(
        (previous) => (previous + 1) % slides.length,
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (
      slides.length > 0 &&
      activeIndex >= slides.length
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  if (!slides.length) {
    return null;
  }

  function showNext() {
    setActiveIndex(
      (previous) => (previous + 1) % slides.length,
    );
  }

  function showPrevious() {
    setActiveIndex(
      (previous) =>
        (previous - 1 + slides.length) % slides.length,
    );
  }

  function handleTouchEnd() {
    if (touchStart === null || touchEnd === null) {
      return;
    }

    const distance = touchStart - touchEnd;

    if (distance > 50) {
      showNext();
    } else if (distance < -50) {
      showPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }

  return (
    <section className="relative left-1/2 w-[100svw] -translate-x-1/2 overflow-hidden border-y border-white/10 bg-[#05070d] py-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(250,204,21,0.14),transparent_42%)]" />

      <div className="relative mx-auto mb-8 flex w-full max-w-[1800px] items-end justify-between gap-5 px-5 md:px-10 lg:px-16">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.38em] text-yellow-400">
            Animation Universe
          </p>

          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            Animated Worlds
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
            Enter extraordinary anime stories, animated
            adventures and unforgettable cartoon worlds.
          </p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/anime"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Anime
          </Link>

          <Link
            href="/cartoons"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Cartoons
          </Link>

          <Link
            href="/animation"
            className="rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
          >
            View all
          </Link>
        </div>
      </div>

      <div
        className="relative mx-auto h-[540px] w-full max-w-[1900px] touch-pan-y overflow-hidden md:h-[650px]"
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
        <div className="absolute inset-y-0 -left-[7%] -right-[7%] flex items-stretch justify-center gap-0">
          {slides.map((item, index) => {
            const isActive = index === activeIndex;
            const href = `/${item.media}/${item.id}`;

            return (
              <article
                key={`${item.media}-${item.id}`}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group relative -ml-[2.5%] min-w-0 overflow-hidden border-x border-white/15 transition-[flex-grow,filter,opacity] duration-700 ease-out first:ml-0 ${
                  isActive
                    ? "z-20 flex-[2.45] opacity-100"
                    : "z-10 flex-[1] opacity-65 grayscale-[15%]"
                }`}
                style={{
                  clipPath:
                    "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                }}
              >
                <Link
                  href={href}
                  aria-label={`View ${item.title}`}
                  className="absolute inset-0"
                >
                  <CineImage
                    src={item.backdrop || item.poster}
                    alt={item.title}
                    fallback="No animation image"
                    className={`object-cover transition duration-700 ${
                      isActive
                        ? "scale-100"
                        : "scale-110 group-hover:scale-105"
                    }`}
                  />

                  <div
                    className={`absolute inset-0 transition duration-700 ${
                      isActive
                        ? "bg-black/5"
                        : "bg-black/40 group-hover:bg-black/20"
                    }`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                  <div
                    className={`absolute bottom-0 left-0 right-0 p-7 pl-[18%] transition-all duration-500 md:p-10 md:pl-[20%] ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-80"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        {item.media === "tv"
                          ? "TV Series"
                          : "Movie"}
                      </span>

                      {item.year && (
                        <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                          {item.year}
                        </span>
                      )}

                      {typeof item.rating === "number" && (
                        <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">
                          ★ {item.rating}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`mt-4 line-clamp-2 font-black leading-[0.96] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] transition-all duration-500 ${
                        isActive
                          ? "text-4xl md:text-6xl lg:text-7xl"
                          : "text-xl md:text-3xl"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {isActive && item.overview && (
                      <p className="mt-4 hidden max-w-xl text-sm leading-6 text-white/75 line-clamp-2 md:block">
                        {item.overview}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous animated title"
              onClick={showPrevious}
              className="absolute left-4 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black md:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Next animated title"
              onClick={showNext}
              className="absolute right-4 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black md:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <div className="relative mt-6 flex justify-center gap-2">
        {slides.map((item, index) => (
          <button
            key={`${item.media}-${item.id}`}
            type="button"
            aria-label={`Show ${item.title}`}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-10 bg-yellow-400"
                : "w-4 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      <div className="relative mt-7 flex justify-center gap-3 md:hidden">
        <Link
          href="/anime"
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white"
        >
          Anime
        </Link>

        <Link
          href="/cartoons"
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white"
        >
          Cartoons
        </Link>

        <Link
          href="/animation"
          className="rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-black text-black"
        >
          View all
        </Link>
      </div>
    </section>
  );
}