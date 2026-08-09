"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import type { RawgGame } from "@/lib/games";

function getPlatforms(game: RawgGame) {
  const platforms =
    game.parent_platforms?.length
      ? game.parent_platforms
      : game.platforms || [];

  return [...new Set(platforms.map((item) => item.platform.name))].slice(0, 4);
}

export default function GameHero({ games }: { games: RawgGame[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (games.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % games.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [games.length]);

  useEffect(() => {
    if (activeIndex >= games.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, games.length]);

  if (!games.length) {
    return (
      <section className="grid min-h-[420px] place-items-center rounded-3xl bg-white/[0.04] text-white/50 ring-1 ring-white/10">
        No featured games are available.
      </section>
    );
  }

  const game = games[activeIndex];
  const screenshots = (game.short_screenshots || [])
    .filter((screenshot) => screenshot.image)
    .slice(0, 4);

  const platforms = getPlatforms(game);

  function changeSlide(direction: number) {
    setActiveIndex((current) => {
      return (current + direction + games.length) % games.length;
    });
  }

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
          CINRYVAN Gaming
        </p>

        <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
          Featured & Recommended
        </h1>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-[#101722] shadow-2xl ring-1 ring-white/10">
        <div className="grid lg:grid-cols-[1.8fr_0.8fr]">
          <div className="relative min-h-[340px] overflow-hidden md:min-h-[520px]">
            {game.background_image ? (
              <img
                key={game.background_image}
                src={game.background_image}
                alt={game.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-zinc-900 text-white/40">
                No featured image
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#101722]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 max-w-2xl p-6 md:p-10 lg:hidden">
              <h2 className="text-3xl font-black text-white md:text-5xl">
                {game.name}
              </h2>
            </div>
          </div>

          <div className="flex min-h-[420px] flex-col p-6 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                Now on CINRYVAN
              </p>

              <h2 className="mt-3 hidden text-3xl font-black leading-tight text-white lg:block">
                {game.name}
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {screenshots.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="aspect-video overflow-hidden rounded-lg bg-black/30"
                  >
                    <img
                      src={screenshot.image}
                      alt={`${game.name} screenshot`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex flex-wrap gap-2">
                {game.genres?.slice(0, 4).map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/70"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/65">
                <span className="font-bold text-yellow-400">
                  ★ {game.rating ? game.rating.toFixed(1) : "Not rated"}
                </span>

                {game.metacritic !== null &&
                  game.metacritic !== undefined && (
                    <span className="rounded bg-green-500 px-2 py-1 text-xs font-black text-black">
                      {game.metacritic}
                    </span>
                  )}

                {game.released && (
                  <span>
                    {new Date(game.released).toLocaleDateString("en", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {platforms.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <span
                      key={platform}
                      className="text-xs font-semibold uppercase tracking-wide text-white/45"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              )}

             <Link
                href={`/games/${game.id}`}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                View game →
            </Link> 
            </div>
          </div>
        </div>

        {games.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => changeSlide(-1)}
              aria-label="Previous featured game"
              className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-3xl text-white ring-1 ring-white/20 transition hover:bg-yellow-400 hover:text-black"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => changeSlide(1)}
              aria-label="Next featured game"
              className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-3xl text-white ring-1 ring-white/20 transition hover:bg-yellow-400 hover:text-black"
            >
              ›
            </button>
          </>
        )}
      </div>

      {games.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {games.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.name}`}
              aria-pressed={index === activeIndex}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-8 bg-yellow-400"
                  : "w-2 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}