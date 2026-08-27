"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { RawgGame } from "@/lib/games";

type GameHeroProps = {
  games: RawgGame[];
};

export default function GameHero({
  games,
}: GameHeroProps) {
  const featuredGames = useMemo(
    () =>
      games
        .filter(
          (game) =>
            game.id &&
            game.name &&
            game.background_image,
        )
        .slice(0, 8),
    [games],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [trailerId, setTrailerId] =
    useState<string | null>(null);
  const [showTrailer, setShowTrailer] =
    useState(false);
  const [trailerReady, setTrailerReady] =
    useState(false);
  const [soundOn, setSoundOn] =
    useState(false);

  const isHovering = useRef(false);
  const trailerFrame =
    useRef<HTMLIFrameElement>(null);

  const trailerCache = useRef(
    new Map<number, string | null>(),
  );

  useEffect(() => {
    if (activeIndex >= featuredGames.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, featuredGames.length]);

  useEffect(() => {
    isHovering.current = false;
    setTrailerId(null);
    setShowTrailer(false);
    setTrailerReady(false);
    setSoundOn(false);
  }, [activeIndex]);

  if (!featuredGames.length) {
    return null;
  }

  const game = featuredGames[activeIndex];

  const screenshots = (game.short_screenshots ?? [])
    .filter((shot) => shot.image)
    .slice(0, 4);

  const heroImage = game.background_image!;

  const trailerSrc =
    showTrailer && trailerId
      ? `https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`
      : null;

  async function startTrailer() {
    isHovering.current = true;

    const cachedTrailer =
      trailerCache.current.get(game.id);

    if (cachedTrailer !== undefined) {
      if (cachedTrailer) {
        setTrailerId(cachedTrailer);
        setShowTrailer(true);
      }

      return;
    }

    try {
      const response = await fetch(
        `/api/games/trailer?name=${encodeURIComponent(
          game.name,
        )}`,
      );

      if (!response.ok) {
        trailerCache.current.set(game.id, null);
        return;
      }

      const data = (await response.json()) as {
        trailer?: {
          videoId?: string;
        } | null;
      };

      const videoId =
        data.trailer?.videoId || null;

      trailerCache.current.set(game.id, videoId);

      if (videoId && isHovering.current) {
        setTrailerId(videoId);
        setShowTrailer(true);
      }
    } catch {
      trailerCache.current.set(game.id, null);
    }
  }

  function stopTrailer() {
    isHovering.current = false;

    setShowTrailer(false);
    setTrailerReady(false);
    setSoundOn(false);
  }

  function toggleTrailerSound() {
    const nextSoundOn = !soundOn;

    trailerFrame.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: nextSoundOn ? "unMute" : "mute",
        args: [],
      }),
      "*",
    );

    if (nextSoundOn) {
      trailerFrame.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "setVolume",
          args: [70],
        }),
        "*",
      );
    }

    setSoundOn(nextSoundOn);
  }

  function showGame(index: number) {
    stopTrailer();
    setActiveIndex(index);
  }

  function previous() {
    stopTrailer();

    setActiveIndex(
      (current) =>
        (current -
          1 +
          featuredGames.length) %
        featuredGames.length,
    );
  }

  function next() {
    stopTrailer();

    setActiveIndex(
      (current) =>
        (current + 1) %
        featuredGames.length,
    );
  }

  return (
    <section aria-labelledby="featured-games-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-yellow-400">
            Cinryvan Gaming
          </p>

          <h1
            id="featured-games-title"
            className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl"
          >
            Featured &amp; Recommended
          </h1>
        </div>

        <Link
          href="/games/category/popular"
          className="hidden border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/70 transition hover:border-yellow-400 hover:text-yellow-400 sm:block"
        >
          Browse all
        </Link>
      </div>

      <div
        className="group relative overflow-hidden border border-white/10 bg-[#0c111b] shadow-[0_22px_70px_rgba(0,0,0,.55)]"
        onMouseEnter={startTrailer}
        onMouseLeave={stopTrailer}
      >
        <div className="grid lg:grid-cols-3">
          <div className="relative block h-[280px] overflow-hidden sm:h-[360px] lg:col-span-2 lg:h-[460px]">
            <img
              key={heroImage}
              src={heroImage}
              alt={game.name}
              className={`
                absolute inset-0 h-full w-full
                object-cover object-center
                transition duration-700
                group-hover:scale-[1.01]
                ${
                  showTrailer && trailerReady
                    ? "opacity-0"
                    : "opacity-100"
                }
              `}
            />

            {trailerSrc && (
              <iframe
                ref={trailerFrame}
                src={trailerSrc}
                title={`${game.name} trailer preview`}
                aria-hidden="true"
                tabIndex={-1}
                allow="autoplay; encrypted-media; picture-in-picture"
                onLoad={() =>
                  setTrailerReady(true)
                }
                className={`
                  pointer-events-none absolute inset-0
                  h-full w-full border-0
                  transition-opacity duration-700
                  ${
                    trailerReady
                      ? "opacity-100"
                      : "opacity-0"
                  }
                `}
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/15 to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0c111b]/65" />

            {!showTrailer && (
              <div className="pointer-events-none absolute left-4 top-4 z-20 hidden items-center gap-2 bg-black/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white/85 backdrop-blur-md md:flex">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Hover for trailer
              </div>
            )}

            {showTrailer && trailerReady && (
              <>
                <div className="pointer-events-none absolute left-4 top-4 z-20 hidden items-center gap-2 bg-red-600/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md md:flex">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  Trailer preview
                </div>

                <button
                  type="button"
                  onClick={toggleTrailerSound}
                  className="absolute bottom-4 left-4 z-30 hidden items-center gap-2 rounded-full border border-white/20 bg-black/80 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300 md:flex"
                  aria-label={
                    soundOn
                      ? "Mute trailer"
                      : "Turn trailer sound on"
                  }
                >
                  {soundOn ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}

                  {soundOn
                    ? "Sound on"
                    : "Sound off"}
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-5 lg:hidden">
              <GameSummary game={game} />
            </div>
          </div>

          <aside className="hidden h-[460px] min-w-0 bg-gradient-to-b from-[#151d2b] to-[#0b1019] p-5 lg:col-span-1 lg:flex lg:flex-col">
            <GameSummary game={game} />

            <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3">
              {screenshots.length ? (
                screenshots.map(
                  (shot, index) => (
                    <Link
                      key={shot.id}
                      href={`/games/${game.id}`}
                      className="group/shot relative aspect-video overflow-hidden bg-white/5"
                    >
                      <img
                        src={shot.image}
                        alt={`${game.name} screenshot ${
                          index + 1
                        }`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover/shot:scale-105 group-hover/shot:brightness-110"
                      />
                    </Link>
                  ),
                )
              ) : (
                <div className="col-span-2 flex aspect-video items-center justify-center bg-white/5 text-xs text-white/35">
                  Screenshots coming soon
                </div>
              )}
            </div>
          </aside>
        </div>

        {featuredGames.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous featured game"
              className="absolute left-0 top-1/2 z-20 grid h-14 w-8 -translate-y-1/2 place-items-center bg-gradient-to-r from-black/85 to-transparent text-white transition hover:text-yellow-400 sm:h-20 sm:w-11 lg:-left-11 lg:group-hover:left-0"
            >
              <ChevronLeft className="h-5 w-5 sm:h-8 sm:w-8" />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next featured game"
              className="absolute right-0 top-1/2 z-20 grid h-14 w-8 -translate-y-1/2 place-items-center bg-gradient-to-l from-black/85 to-transparent text-white transition hover:text-yellow-400 sm:h-20 sm:w-11 lg:-right-11 lg:group-hover:right-0"
            >
              <ChevronRight className="h-5 w-5 sm:h-8 sm:w-8" />
            </button>
          </>
        )}
      </div>

      {featuredGames.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {featuredGames.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  showGame(index)
                }
                aria-label={`Show ${item.name}`}
                aria-pressed={
                  index === activeIndex
                }
                className={`h-2 transition-all ${
                  index === activeIndex
                    ? "w-7 bg-yellow-400"
                    : "w-4 bg-white/20 hover:bg-white/45"
                }`}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}

function GameSummary({
  game,
}: {
  game: RawgGame;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-black uppercase tracking-[0.24em] text-yellow-400 sm:text-[10px] sm:tracking-[0.28em]">
        Featured now
      </p>

      <h2 className="mt-1 line-clamp-2 text-lg font-black leading-tight text-white sm:mt-2 sm:text-2xl lg:text-3xl">
        {game.name}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-1 text-[9px] sm:mt-3 sm:gap-2 sm:text-xs">
        {game.released && (
          <span className="bg-white/10 px-1.5 py-0.5 font-bold text-white/75 sm:px-2 sm:py-1">
            {new Date(
              game.released,
            ).getFullYear()}
          </span>
        )}

        {game.rating > 0 && (
          <span className="inline-flex items-center gap-1 bg-yellow-400 px-1.5 py-0.5 font-black text-black sm:px-2 sm:py-1">
            <Star
              className="h-2.5 w-2.5 sm:h-3 sm:w-3"
              fill="currentColor"
            />
            {game.rating.toFixed(1)}
          </span>
        )}

        {typeof game.metacritic ===
          "number" && (
          <span className="border border-emerald-400/50 px-1.5 py-0.5 font-black text-emerald-300 sm:px-2 sm:py-1">
            {game.metacritic}
            <span className="hidden sm:inline">
              {" "}
              Metascore
            </span>
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
        {game.genres
          ?.slice(0, 2)
          .map((genre) => (
            <span
              key={genre.id}
              className="bg-black/45 px-1.5 py-0.5 text-[8px] text-white/65 sm:px-2 sm:py-1 sm:text-[11px]"
            >
              {genre.name}
            </span>
          ))}

        {game.genres
          ?.slice(2, 4)
          .map((genre) => (
            <span
              key={genre.id}
              className="hidden bg-black/45 px-2 py-1 text-[11px] text-white/65 sm:inline-block"
            >
              {genre.name}
            </span>
          ))}
      </div>

      <Link
        href={`/games/${game.id}`}
        className="mt-3 inline-flex h-8 items-center gap-1.5 bg-yellow-400 px-3 text-[10px] font-black text-black transition hover:bg-yellow-300 sm:mt-5 sm:h-auto sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
      >
        <Gamepad2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        View game
      </Link>
    </div>
  );
}