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
  ].slice(0, 3);
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
        group block h-full w-full
        transition duration-300
        hover:-translate-y-0.5
        sm:flex sm:flex-col sm:overflow-hidden
        sm:border sm:border-white/10
        sm:bg-[#121a27]
        sm:shadow-[0_12px_35px_rgba(0,0,0,.28)]
        sm:hover:-translate-y-1
        sm:hover:border-yellow-400/70
        sm:hover:shadow-[0_18px_45px_rgba(0,0,0,.5)]
      "
    >
      {/* Artwork */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-[#0b1019] sm:rounded-none sm:border-0">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-[#1a2433] to-[#0b1019] px-2 text-center text-[8px] font-bold uppercase tracking-wider text-white/30 sm:text-xs">
            Image unavailable
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

        {typeof game.metacritic === "number" && (
          <span className="absolute right-1.5 top-1.5 border border-emerald-300/40 bg-[#173e2b]/90 px-1.5 py-0.5 text-[8px] font-black text-emerald-200 shadow-lg sm:right-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[11px]">
            {game.metacritic}
          </span>
        )}

        {releaseYear && (
          <span className="absolute bottom-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 text-[8px] font-bold text-white/70 backdrop-blur-sm sm:bottom-2 sm:left-2 sm:px-2 sm:py-1 sm:text-[10px]">
            {releaseYear}
          </span>
        )}

        <span className="absolute bottom-2 right-2 hidden h-8 w-8 translate-y-2 place-items-center bg-yellow-400 text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:grid">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-yellow-400 transition duration-300 group-hover:scale-x-100 sm:hidden" />
      </div>

      {/* Details */}
      <div className="px-0.5 pt-1.5 sm:flex sm:flex-1 sm:flex-col sm:p-3.5">
        <h3 className="line-clamp-1 text-[11px] font-black leading-tight text-white transition group-hover:text-yellow-400 sm:line-clamp-2 sm:min-h-[44px] sm:text-[15px] sm:leading-[22px]">
          {game.name}
        </h3>

        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[9px] sm:mt-2 sm:gap-2 sm:text-[11px]">
          <span className="inline-flex shrink-0 items-center gap-1 font-black text-yellow-400">
            <Star
              className="h-2.5 w-2.5 sm:h-3 sm:w-3"
              fill="currentColor"
            />

            {game.rating > 0
              ? game.rating.toFixed(1)
              : "N/A"}
          </span>

          {game.genres?.[0] && (
            <>
              <span className="text-white/20">•</span>

              <span className="truncate font-semibold text-white/45">
                {game.genres[0].name}
              </span>
            </>
          )}
        </div>

        {/* Platforms remain available on tablet and desktop. */}
        <div className="mt-auto hidden min-h-[32px] flex-wrap content-end gap-1 pt-3 sm:flex">
          {platforms.length ? (
            platforms.map((platform) => (
              <span
                key={platform}
                className="border border-white/10 bg-black/20 px-1.5 py-1 text-[9px] font-black uppercase tracking-wide text-white/45 transition group-hover:border-yellow-400/20 group-hover:text-white/65"
              >
                {platform}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
              Platforms TBA
            </span>
          )}
        </div>
      </div>

      <div className="hidden h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full sm:block" />
    </Link>
  );
}