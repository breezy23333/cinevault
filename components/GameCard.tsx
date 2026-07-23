/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { RawgGame } from "@/lib/games";

function getPlatformNames(game: RawgGame) {
  const platforms =
    game.parent_platforms?.length
      ? game.parent_platforms
      : game.platforms || [];

  return [...new Set(platforms.map((item) => item.platform.name))].slice(0, 3);
}

export default function GameCard({ game }: { game: RawgGame }) {
  const platforms = getPlatformNames(game);
  const releaseYear = game.released
    ? new Date(game.released).getUTCFullYear()
    : null;

  return (
    <Link
      href={`/game/${game.id}`}
      className="group block w-[280px] flex-none overflow-hidden rounded-2xl bg-white/[0.05] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-yellow-400/70"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-white/40">
            No game image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {game.metacritic !== null && game.metacritic !== undefined && (
          <span className="absolute right-3 top-3 rounded-md bg-green-500 px-2 py-1 text-xs font-black text-black">
            {game.metacritic}
          </span>
        )}

        {releaseYear && (
          <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white/80 backdrop-blur">
            {releaseYear}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[48px] text-base font-bold text-white transition group-hover:text-yellow-400">
          {game.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
          <span className="text-yellow-400">
            ★ {game.rating ? game.rating.toFixed(1) : "Not rated"}
          </span>

          {game.genres?.[0] && (
            <>
              <span>•</span>
              <span>{game.genres[0].name}</span>
            </>
          )}
        </div>

        {platforms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="rounded-md bg-white/[0.07] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/65"
              >
                {platform}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}