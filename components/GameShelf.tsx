"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
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

    shelf.scrollBy({
      left:
        direction === "left"
          ? -Math.max(300, shelf.clientWidth * 0.82)
          : Math.max(300, shelf.clientWidth * 0.82),
      behavior: "smooth",
    });
  }

  if (!games.length) return null;

  return (
    <section className="py-8" aria-labelledby={`shelf-${toId(title)}`}>
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
            Discover games
          </p>
          <h2
            id={`shelf-${toId(title)}`}
            className="mt-1 text-xl font-black tracking-tight text-white md:text-2xl"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm leading-5 text-white/45">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden border border-white/20 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-white/70 transition hover:border-yellow-400 hover:text-yellow-400 sm:block"
            >
              View all
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollShelf("left")}
            aria-label={`Scroll ${title} left`}
            className="grid h-9 w-9 place-items-center border border-white/15 bg-white/5 text-white/70 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollShelf("right")}
            aria-label={`Scroll ${title} right`}
            className="grid h-9 w-9 place-items-center border border-white/15 bg-white/5 text-white/70 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative -mx-4 px-4 md:-mx-6 md:px-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#080b12] to-transparent md:w-12" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#080b12] to-transparent md:w-12" />

        <div
          ref={shelfRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[235px] lg:w-[250px]"
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="mt-4 inline-flex border border-white/20 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-white/70 transition hover:border-yellow-400 hover:text-yellow-400 sm:hidden"
        >
          View all {title}
        </Link>
      )}
    </section>
  );
}

function toId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}