"use client";

import { useRef } from "react";
import Link from "next/link";
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

  function scrollShelf(direction: "left" | "right") {
    const shelf = shelfRef.current;

    if (!shelf) return;

    const distance = Math.max(320, shelf.clientWidth * 0.85);

    shelf.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  if (!games.length) return null;

  return (
    <section className="py-7">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white md:text-3xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-white/55">{subtitle}</p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
          >
            View all →
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollShelf("left")}
          aria-label={`Scroll ${title} left`}
          className="absolute -left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/90 text-3xl text-white ring-1 ring-white/20 transition hover:bg-yellow-400 hover:text-black"
        >
          ‹
        </button>

        <div
          ref={shelfRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {games.map((game) => (
            <div key={game.id} className="snap-start">
              <GameCard game={game} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollShelf("right")}
          aria-label={`Scroll ${title} right`}
          className="absolute -right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/90 text-3xl text-white ring-1 ring-white/20 transition hover:bg-yellow-400 hover:text-black"
        >
          ›
        </button>
      </div>
    </section>
  );
}