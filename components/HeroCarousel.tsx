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
    setPlayTrailer(false);

    similarRowRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }, [currentIndex]);

  const [playTrailer, setPlayTrailer] =
  useState(false);

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
    <section className="relative left-1/2 mb-6 w-[100svw] -translate-x-1/2 bg-[#05070d] px-2 py-2 sm:mb-8 sm:px-3 sm:py-4 md:px-6 lg:mb-10 lg:px-8">
      <div className="mx-auto max-w-[1800px] overflow-hidden rounded-2xl border border-yellow-400/30 bg-[#070910] shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:rounded-[30px] sm:border-yellow-400/40 lg:shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        {/* Main hero */}
        <div className="relative min-h-[480px] overflow-hidden sm:min-h-[560px] lg:min-h-[680px]">
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
              className="absolute left-2 top-[42%] z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:left-3 sm:h-12 sm:w-12 md:left-6 md:top-1/2"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              type="button"
              aria-label="Next featured movie"
              onClick={showNextMovie}
              className="absolute right-2 top-[42%] z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:right-3 sm:h-12 sm:w-12 md:right-6 md:top-1/2"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )} 

          <div className="relative z-10 grid min-h-[480px] items-end gap-6 px-4 pb-6 pt-16 sm:min-h-[560px] sm:px-8 sm:pb-10 sm:pt-20 md:px-10 lg:min-h-[680px] lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.72fr)] lg:items-center lg:gap-10 lg:px-14 lg:py-16 xl:px-20">
            {/* Movie information */}
            <div className="max-w-4xl">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.26em] text-yellow-400 sm:mb-5 sm:text-xs sm:tracking-[0.3em]">
                Featured movie
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-sm">
                  Movie
                </span>

                {featured.year && (
                  <span className="rounded-full border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-sm">
                    {featured.year}
                  </span>
                )}

                {typeof featured.rating ===
                  "number" && (
                  <span className="rounded-md bg-yellow-400 px-2 py-1 text-[10px] font-black text-black sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm">
                    ★ {featured.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <h1 className="mt-3 line-clamp-2 text-3xl font-black leading-[0.98] text-white drop-shadow-2xl sm:mt-6 sm:text-5xl md:text-7xl xl:text-8xl">
                {featured.title}
              </h1>

              {featured.overview && (
                <p className="mt-3 line-clamp-2 max-w-3xl text-xs leading-5 text-white/80 sm:mt-5 sm:line-clamp-3 sm:text-base sm:leading-7 md:mt-6 md:line-clamp-4 md:text-lg md:leading-8">
                  {featured.overview}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                <Link
                  href={href}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-yellow-400 px-3 text-[10px] font-black text-black shadow-[0_10px_30px_rgba(250,204,21,0.18)] transition hover:bg-yellow-300 sm:h-auto sm:gap-2 sm:rounded-xl sm:px-7 sm:py-3.5 sm:text-sm"
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
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-black/35 px-3 text-[10px] font-black text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400 sm:h-auto sm:gap-2 sm:rounded-xl sm:px-7 sm:py-3.5 sm:text-sm"
                  >
                    Watch trailer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={`${href}?tab=trailer`}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-black/35 px-3 text-[10px] font-black text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400 sm:h-auto sm:gap-2 sm:rounded-xl sm:px-7 sm:py-3.5 sm:text-sm"
                  >
                    <Play className="h-4 w-4" />
                    Find trailer
                  </Link>
                )}
              </div>

              {items.length > 1 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
                  <span className="text-[10px] font-bold text-white/60 sm:text-sm sm:text-white/70">
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

            {/* Floating mobile trailer; full desktop trailer panel */}
            <div className="absolute right-3 top-3 z-20 w-[150px] sm:right-6 sm:top-6 sm:w-[230px] lg:static lg:z-auto lg:block lg:w-full lg:justify-self-end">
              <div className="overflow-hidden rounded-lg border border-yellow-400/45 bg-black/55 p-1 shadow-[0_15px_45px_rgba(0,0,0,0.65)] backdrop-blur-md sm:rounded-xl lg:rounded-3xl lg:border-yellow-400/35 lg:bg-black/40 lg:p-2 lg:shadow-[0_25px_70px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-video overflow-hidden rounded-md bg-black sm:rounded-lg lg:rounded-[18px]">
                  {featured.trailerKey && playTrailer ? (
                    <iframe
                      key={`${featured.id}-${featured.trailerKey}`}
                      src={`https://www.youtube-nocookie.com/embed/${featured.trailerKey}?rel=0&modestbranding=1&autoplay=1`}
                      title={`${featured.title} official trailer`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <CineImage
                        src={featured.backdrop}
                        alt={`${featured.title} trailer preview`}
                        fallback="Trailer unavailable"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-black/35" />

                      {featured.trailerKey ? (
                        <button
                          type="button"
                          onClick={() => setPlayTrailer(true)}
                          aria-label={`Play ${featured.title} trailer`}
                          className="absolute inset-0 grid place-items-center"
                        >
                          <span className="grid h-14 w-14 place-items-center rounded-full bg-yellow-400 text-black shadow-2xl transition hover:scale-110 sm:h-16 sm:w-16">
                            <Play
                              className="ml-1 h-6 w-6 sm:h-7 sm:w-7"
                              fill="currentColor"
                            />
                          </span>
                        </button>
                      ) : (
                        <Link
                          href={`${href}?tab=trailer`}
                          aria-label={`Find ${featured.title} trailer`}
                          className="absolute inset-0 grid place-items-center"
                        >
                          <span className="grid h-14 w-14 place-items-center rounded-full bg-yellow-400 text-black shadow-2xl transition hover:scale-110 sm:h-16 sm:w-16">
                            <Play
                              className="ml-1 h-6 w-6 sm:h-7 sm:w-7"
                              fill="currentColor"
                            />
                          </span>
                        </Link>
                      )}
                    </>
                  )}
                </div>

                <div className="hidden items-center justify-between gap-4 px-3 py-3 lg:flex">
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
          <div className="border-t border-yellow-400/20 bg-[#070910] px-3 py-4 sm:px-5 sm:py-6 md:px-10 md:py-7 lg:px-14">
            <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5 sm:gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-yellow-400 sm:text-xs sm:tracking-[0.25em]">
                  More like this
                </p>

                <h2 className="mt-1 text-base font-black text-white sm:text-xl md:text-2xl">
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
              className="flex snap-x snap-proximity gap-2 overflow-x-auto pb-1.5 [scrollbar-width:none] sm:gap-4 sm:pb-2 [&::-webkit-scrollbar]:hidden"
            >
              {similarMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group w-[150px] shrink-0 snap-start sm:w-[210px] md:w-[245px]"
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

                  <h3 className="mt-1.5 truncate text-[11px] font-bold text-white transition group-hover:text-yellow-400 sm:mt-3 sm:text-base">
                    {movie.title}
                  </h3>

                  <p className="mt-0.5 text-[9px] text-white/45 sm:mt-1 sm:text-sm sm:text-white/50">
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