/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { RawgGame } from "@/lib/games";

function getPlatformNames(game: RawgGame) {
  const platforms = game.parent_platforms?.length
    ? game.parent_platforms
    : game.platforms ?? [];

  return [
    ...new Set(
      platforms.map((item) => item.platform.name),
    ),
  ].slice(0, 2);
}

export default function GameCard({
  game,
}: {
  game: RawgGame;
}) {
  const platforms = getPlatformNames(game);

  const releaseYear = game.released
    ? new Date(game.released).getUTCFullYear()
    : null;

  return (
    <Link
      href={`/games/${game.id}`}
      aria-label={`View ${game.name}`}
      className="
        group block w-full self-start overflow-hidden
        border border-white/10 bg-[#121a27]
        shadow-[0_10px_28px_rgba(0,0,0,.25)]
        transition duration-300
        hover:-translate-y-1
        hover:border-yellow-400/60
        hover:shadow-[0_16px_38px_rgba(0,0,0,.45)]
      "
    >
      {/* Compact artwork */}
      <div className="relative aspect-video overflow-hidden bg-[#080d14]">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="
              h-full w-full object-cover object-center
              transition duration-500
              group-hover:scale-[1.025]
              group-hover:brightness-110
            "
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-[#1a2433] to-[#0b1019] px-3 text-center text-xs font-bold uppercase tracking-wider text-white/30">
            Image unavailable
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/5" />

        {typeof game.metacritic === "number" ? (
          <span className="absolute right-2 top-2 border border-emerald-300/30 bg-[#123b28]/90 px-2 py-1 text-[10px] font-black text-emerald-200">
            {game.metacritic}
          </span>
        ) : null}

        {releaseYear ? (
          <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 text-[10px] font-bold text-white/70 backdrop-blur-sm">
            {releaseYear}
          </span>
        ) : null}

        <span className="absolute bottom-2 right-2 grid h-8 w-8 translate-y-2 place-items-center bg-yellow-400 text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Compact details */}
      <div className="p-3.5">
        <h3 className="line-clamp-2 text-[15px] font-black leading-5 text-white transition group-hover:text-yellow-400">
          {game.name}
        </h3>

        <div className="mt-2 flex min-w-0 items-center gap-2 text-[11px]">
          <span className="inline-flex shrink-0 items-center gap-1 font-black text-yellow-400">
            <Star
              className="h-3 w-3"
              fill="currentColor"
            />

            {game.rating > 0
              ? game.rating.toFixed(1)
              : "N/A"}
          </span>

          {game.genres?.[0] ? (
            <>
              <span className="text-white/20">•</span>

              <span className="truncate font-semibold text-white/45">
                {game.genres[0].name}
              </span>
            </>
          ) : null}
        </div>

        {platforms.length ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="border border-white/10 bg-black/20 px-1.5 py-1 text-[8px] font-black uppercase tracking-wide text-white/40 transition group-hover:border-yellow-400/20 group-hover:text-white/60"
              >
                {platform}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}