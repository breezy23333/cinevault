// components/GameShelf.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import GameCard from "@/components/GameCard";
import type { RawgGame } from "@/lib/games";

type GameShelfProps = {
  title: string;
  subtitle?: string;
  games: RawgGame[];
  viewAllHref?: string;
};

export default function GameShelf({
  title,
  subtitle,
  games,
  viewAllHref,
}: GameShelfProps) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const headingId = `shelf-${toId(title)}`;

  function scrollShelf(direction: "left" | "right") {
    const shelf = shelfRef.current;
    if (!shelf) return;

    const distance =
      shelf.clientWidth *
      0.78 *
      (direction === "left" ? -1 : 1);

    shelf.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  }

  if (!games.length) return null;

  return (
    <section
      className="border-b border-white/[0.06] py-5 sm:py-6 md:py-8"
      aria-labelledby={headingId}
    >
      <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
        <div className="min-w-0 border-l-2 border-yellow-400/60 pl-3">
          <p className="text-[8px] font-black uppercase tracking-[0.26em] text-yellow-400/70 sm:text-[10px] sm:tracking-[0.3em]">
            Discover games
          </p>

          <h2
            id={headingId}
            className="mt-0.5 truncate text-base font-black tracking-tight text-white sm:mt-1 sm:text-xl md:text-2xl"
          >
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 line-clamp-1 max-w-2xl text-[10px] leading-4 text-white/40 sm:text-sm sm:leading-5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-[9px] font-black uppercase tracking-wider text-white/45 transition hover:text-yellow-400 sm:text-[11px]"
            >
              View all →
            </Link>
          )}

          <button
            type="button"
            onClick={() => scrollShelf("left")}
            aria-label={`Scroll ${title} left`}
            className="
              hidden h-9 w-9 place-items-center
              border border-white/15 bg-white/5
              text-white/70 transition
              hover:border-yellow-400
              hover:bg-yellow-400 hover:text-black
              md:grid
            "
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollShelf("right")}
            aria-label={`Scroll ${title} right`}
            className="
              hidden h-9 w-9 place-items-center
              border border-white/15 bg-white/5
              text-white/70 transition
              hover:border-yellow-400
              hover:bg-yellow-400 hover:text-black
              md:grid
            "
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative min-w-0">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#05070d] to-transparent sm:w-10" />

        <div
          ref={shelfRef}
          className="
            hide-scrollbar
            flex snap-x snap-proximity gap-2
            overflow-x-auto overscroll-x-contain
            scroll-smooth pb-1.5
            sm:gap-3 sm:pb-2
          "
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="
                w-[160px] shrink-0 snap-start
                sm:w-[210px]
                md:w-[235px]
                lg:w-[250px]
              "
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function toId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}