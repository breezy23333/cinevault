"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ChevronLeft, ChevronRight, Gamepad2, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { RawgGame } from "@/lib/games";

type GameHeroProps = { games: RawgGame[] };

export default function GameHero({ games }: GameHeroProps) {
  const featuredGames = useMemo(
    () =>
      games
        .filter((game) => game.id && game.name && game.background_image)
        .slice(0, 8),
    [games],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (activeIndex >= featuredGames.length) setActiveIndex(0);
  }, [activeIndex, featuredGames.length]);

  useEffect(() => {
    if (paused || featuredGames.length <= 1) return;
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % featuredGames.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [featuredGames.length, paused]);

  if (!featuredGames.length) return null;

  const game = featuredGames[activeIndex];
  const screenshots = (game.short_screenshots ?? [])
    .filter((shot) => shot.image)
    .slice(0, 4);

  const previous = () =>
    setActiveIndex(
      (current) => (current - 1 + featuredGames.length) % featuredGames.length,
    );
  const next = () =>
    setActiveIndex((current) => (current + 1) % featuredGames.length);

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
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,.75fr)]">
          <Link
            href={`/games/${game.id}`}
            className="relative block min-h-[310px] overflow-hidden sm:min-h-[430px] lg:min-h-[500px]"
          >
            <img
              key={game.background_image}
              src={game.background_image!}
              alt={game.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0c111b]/65" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:hidden">
              <GameSummary game={game} />
            </div>
          </Link>

          <aside className="hidden min-w-0 bg-gradient-to-b from-[#151d2b] to-[#0b1019] p-5 lg:flex lg:flex-col">
            <GameSummary game={game} />

            <div className="mt-auto grid grid-cols-2 gap-1.5 pt-5">
              {screenshots.length ? (
                screenshots.map((shot, index) => (
                  <Link
                    key={shot.id}
                    href={`/games/${game.id}`}
                    className="group/shot relative aspect-video overflow-hidden bg-white/5"
                  >
                    <img
                      src={shot.image}
                      alt={`${game.name} screenshot ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover/shot:scale-105 group-hover/shot:brightness-110"
                    />
                  </Link>
                ))
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
              className="absolute left-0 top-1/2 z-20 grid h-20 w-11 -translate-y-1/2 place-items-center bg-gradient-to-r from-black/85 to-transparent text-white opacity-90 transition hover:text-yellow-400 lg:-left-11 lg:group-hover:left-0"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next featured game"
              className="absolute right-0 top-1/2 z-20 grid h-20 w-11 -translate-y-1/2 place-items-center bg-gradient-to-l from-black/85 to-transparent text-white opacity-90 transition hover:text-yellow-400 lg:-right-11 lg:group-hover:right-0"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}
      </div>

      {featuredGames.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {featuredGames.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.name}`}
              aria-pressed={index === activeIndex}
              className={`h-2 transition-all ${
                index === activeIndex
                  ? "w-7 bg-yellow-400"
                  : "w-4 bg-white/20 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function GameSummary({ game }: { game: RawgGame }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-400">
        Featured now
      </p>
      <h2 className="mt-2 line-clamp-2 text-3xl font-black leading-tight text-white lg:text-4xl">
        {game.name}
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {game.released && (
          <span className="bg-white/10 px-2 py-1 font-bold text-white/75">
            {new Date(game.released).getFullYear()}
          </span>
        )}
        {game.rating > 0 && (
          <span className="inline-flex items-center gap-1 bg-yellow-400 px-2 py-1 font-black text-black">
            <Star className="h-3 w-3" fill="currentColor" />
            {game.rating.toFixed(1)}
          </span>
        )}
        {typeof game.metacritic === "number" && (
          <span className="border border-emerald-400/50 px-2 py-1 font-black text-emerald-300">
            {game.metacritic} Metascore
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {game.genres?.slice(0, 4).map((genre) => (
          <span key={genre.id} className="bg-black/45 px-2 py-1 text-[11px] text-white/65">
            {genre.name}
          </span>
        ))}
      </div>

      <Link
        href={`/games/${game.id}`}
        className="mt-5 inline-flex items-center gap-2 bg-yellow-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
      >
        <Gamepad2 className="h-4 w-4" />
        View game
      </Link>
    </div>
  );
}