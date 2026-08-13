"use client";

import CineImage from "@/components/CineImage";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type Movie = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
  trailerKey?: string | null;
};

type HeroMovie = Movie & {
  similarMovies: Movie[];
};

type HeroCarouselProps = {
  items: HeroMovie[];
};

export default function HeroCarousel({
  items,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const similarRowRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    similarRowRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }, [currentIndex]);

  if (!items.length) {
    return null;
  }

  const featured = items[currentIndex];
  const similarMovies =
    featured?.similarMovies ?? [];

  const href = `/movie/${featured.id}`;

  function showPreviousMovie() {
    setCurrentIndex(
      (previous) =>
        (previous - 1 + items.length) %
        items.length,
    );
  }

  function showNextMovie() {
    setCurrentIndex(
      (previous) =>
        (previous + 1) % items.length,
    );
  }

  function scrollSimilar(direction: number) {
    similarRowRef.current?.scrollBy({
      left: direction * 520,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative left-1/2 mb-10 w-[100svw] -translate-x-1/2 bg-[#05070d] px-3 py-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px] overflow-hidden rounded-[30px] border border-yellow-400/40 bg-[#070910] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        {/* Main hero */}
        <div className="relative min-h-[620px] overflow-hidden lg:min-h-[680px]">
          <CineImage
            src={featured.backdrop}
            alt={featured.title}
            fallback="No backdrop"
            priority
            className="object-cover object-center"
          />

          {/* Lighter overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070d]/90 via-[#05070d]/45 to-transparent" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070d]/95 via-transparent to-black/10" />

         {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous featured movie"
              onClick={showPreviousMovie}
              className="absolute left-3 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black md:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Next featured movie"
              onClick={showNextMovie}
              className="absolute right-3 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black md:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )} 

          <div className="relative z-10 grid min-h-[620px] items-center gap-10 px-5 py-16 md:px-10 lg:min-h-[680px] lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.72fr)] lg:px-14 xl:px-20">
            {/* Movie information */}
            <div className="max-w-4xl">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Featured movie
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-md">
                  Movie
                </span>

                {featured.year && (
                  <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-md">
                    {featured.year}
                  </span>
                )}

                {typeof featured.rating ===
                  "number" && (
                  <span className="rounded-lg bg-yellow-400 px-3 py-1.5 text-sm font-black text-black">
                    ★ {featured.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[0.98] text-white drop-shadow-2xl sm:text-5xl md:text-7xl xl:text-8xl">
                {featured.title}
              </h1>

              {featured.overview && (
                <p className="mt-6 max-w-3xl text-base leading-7 text-white/90 line-clamp-4 md:text-lg md:leading-8">
                  {featured.overview}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 text-sm font-black text-black shadow-[0_15px_40px_rgba(250,204,21,0.22)] transition hover:bg-yellow-300"
                >
                  <Play
                    className="h-4 w-4"
                    fill="currentColor"
                  />
                  View details
                </Link>

                {featured.trailerKey ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${featured.trailerKey}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/35 px-7 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    Watch trailer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={`${href}?tab=trailer`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/35 px-7 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    <Play className="h-4 w-4" />
                    Find trailer
                  </Link>
                )}
              </div>

              {items.length > 1 && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-white/70">
                    {String(currentIndex + 1).padStart(2, "0")}
                    {" / "}
                    {String(items.length).padStart(2, "0")}
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {items.map((movie, index) => (
                      <button
                        key={movie.id}
                        type="button"
                        aria-label={`Show ${movie.title}`}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentIndex
                            ? "w-8 bg-yellow-400"
                            : "w-3 bg-white/35 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trailer panel */}
            <div className="w-full lg:justify-self-end">
              <div className="overflow-hidden rounded-3xl border border-yellow-400/35 bg-black/40 p-2 shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-md">
                <div className="relative aspect-video overflow-hidden rounded-[18px] bg-black">
                  {featured.trailerKey ? (
                    <iframe
                      key={`${featured.id}-${featured.trailerKey}`}
                      src={`https://www.youtube-nocookie.com/embed/${featured.trailerKey}?rel=0&modestbranding=1`}
                      title={`${featured.title} official trailer`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <CineImage
                        src={featured.backdrop}
                        alt={`${featured.title} trailer`}
                        fallback="Trailer unavailable"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-black/25" />

                      <Link
                        href={`${href}?tab=trailer`}
                        aria-label={`Find ${featured.title} trailer`}
                        className="absolute inset-0 grid place-items-center"
                      >
                        <span className="grid h-16 w-16 place-items-center rounded-full bg-yellow-400 text-black shadow-2xl transition hover:scale-110">
                          <Play
                            className="ml-1 h-7 w-7"
                            fill="currentColor"
                          />
                        </span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 px-3 py-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                      Official trailer
                    </p>

                    <p className="mt-1 truncate font-bold text-white">
                      {featured.title}
                    </p>
                  </div>

                  {featured.trailerKey && (
                    <a
                      href={`https://www.youtube.com/watch?v=${featured.trailerKey}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open trailer on YouTube"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:border-yellow-400 hover:text-yellow-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar movies */}
        {similarMovies.length > 0 && (
          <div className="border-t border-yellow-400/30 bg-[#070910] px-5 py-7 md:px-10 lg:px-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                  More like this
                </p>

                <h2 className="mt-1 text-xl font-black text-white md:text-2xl">
                  Similar movies
                </h2>
              </div>

              {/* Manual controls only */}
              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="Scroll similar movies left"
                  onClick={() => scrollSimilar(-1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label="Scroll similar movies right"
                  onClick={() => scrollSimilar(1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              ref={similarRowRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {similarMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group w-[210px] shrink-0 snap-start sm:w-[245px]"
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 group-hover:-translate-y-1 group-hover:border-yellow-400/70">
                    <CineImage
                      src={
                        movie.backdrop ||
                        movie.poster
                      }
                      alt={movie.title}
                      fallback="No image"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {typeof movie.rating ===
                      "number" && (
                      <span className="absolute right-2 top-2 rounded-md bg-black/75 px-2 py-1 text-xs font-black text-yellow-400 backdrop-blur">
                        ★ {movie.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 truncate font-bold text-white transition group-hover:text-yellow-400">
                    {movie.title}
                  </h3>

                  <p className="mt-1 text-sm text-white/50">
                    {movie.year || "Movie"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}