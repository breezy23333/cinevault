/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { RawgGame } from "@/lib/games";

function getPlatformNames(game: RawgGame) {
  const platforms = game.parent_platforms?.length
    ? game.parent_platforms
    : game.platforms ?? [];

  return [...new Set(platforms.map((item) => item.platform.name))].slice(0, 3);
}

export default function GameCard({ game }: { game: RawgGame }) {
  const platforms = getPlatformNames(game);
  const releaseYear = game.released
    ? new Date(game.released).getUTCFullYear()
    : null;

  return (
    <Link
      href={`/games/${game.id}`}
      aria-label={`View ${game.name}`}
      className="group flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[#121a27] shadow-[0_12px_35px_rgba(0,0,0,.28)] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/70 hover:shadow-[0_18px_45px_rgba(0,0,0,.5)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0b1019]">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-[#1a2433] to-[#0b1019] text-xs font-bold uppercase tracking-widest text-white/30">
            Image unavailable
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

        {typeof game.metacritic === "number" && (
          <span className="absolute right-2 top-2 border border-emerald-300/50 bg-[#173e2b]/95 px-2 py-1 text-[11px] font-black text-emerald-200 shadow-lg">
            {game.metacritic}
          </span>
        )}

        {releaseYear && (
          <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 text-[10px] font-bold text-white/75 backdrop-blur-sm">
            {releaseYear}
          </span>
        )}

        <span className="absolute bottom-2 right-2 grid h-8 w-8 translate-y-2 place-items-center bg-yellow-400 text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-black leading-[22px] text-white transition group-hover:text-yellow-400">
          {game.name}
        </h3>

        <div className="mt-2 flex min-w-0 items-center gap-2 text-[11px]">
          <span className="inline-flex shrink-0 items-center gap-1 font-black text-yellow-400">
            <Star className="h-3 w-3" fill="currentColor" />
            {game.rating > 0 ? game.rating.toFixed(1) : "N/A"}
          </span>

          {game.genres?.[0] && (
            <>
              <span className="text-white/20">•</span>
              <span className="truncate font-semibold text-white/50">
                {game.genres[0].name}
              </span>
            </>
          )}
        </div>

        <div className="mt-auto flex min-h-[32px] flex-wrap content-end gap-1 pt-3">
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

      <div className="h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}