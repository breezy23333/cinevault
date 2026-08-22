/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Gamepad2,
  Search,
  Star,
} from "lucide-react";

import {
  getGames,
  getPopularGames,
  type RawgGame,
} from "@/lib/games";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Search Games | CINRYVAN Gaming",
  description:
    "Search video games, ratings, platforms and gaming discoveries on CINRYVAN.",
  alternates: {
    canonical: "/games/search",
  },
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

function getYear(date?: string | null) {
  return date ? date.slice(0, 4) : "TBA";
}

function SearchGameCard({ game }: { game: RawgGame }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group overflow-hidden border border-white/10 bg-[#101b29] transition hover:-translate-y-1 hover:border-cyan-400/70"
    >
      <div className="relative aspect-video overflow-hidden bg-[#17283b]">
        {game.background_image ? (
          <>
            <div
              aria-hidden="true"
              style={{
                backgroundImage: `url("${game.background_image}")`,
              }}
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-lg"
            />

            <div
              role="img"
              aria-label={`${game.name} game artwork`}
              style={{
                backgroundImage: `url("${game.background_image}")`,
              }}
              className="absolute inset-0 bg-contain bg-center bg-no-repeat transition duration-500 group-hover:scale-[1.04]"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,.20),transparent_35%),linear-gradient(135deg,#263b51,#101b29_55%,#08111c)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#08111c]/80 via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-base font-black text-white transition group-hover:text-cyan-300">
            {game.name}
          </h2>

          {game.metacritic ? (
            <span className="shrink-0 bg-emerald-500 px-2 py-1 text-[10px] font-black text-white">
              {game.metacritic}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-white/50">
          <span>{getYear(game.released)}</span>

          {game.rating ? (
            <span className="inline-flex items-center gap-1 text-yellow-300">
              <Star className="h-3.5 w-3.5 fill-current" />
              {game.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        {game.genres?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="bg-white/[0.06] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/55"
              >
                {genre.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default async function GameSearchPage({
  searchParams,
}: PageProps) {
  const { q = "", page: pageValue = "1" } =
  await searchParams;

    const query = q.trim();

    const parsedPage = Number(pageValue);

    const page =
    Number.isInteger(parsedPage) && parsedPage > 0
        ? parsedPage
        : 1;

    const pageSize = 24;

    let games: RawgGame[] = [];

  try {
    games = query
  ? await getGames({
      search: query,
      page,
      page_size: pageSize,
    })
  : await getPopularGames(pageSize);
  } catch (error) {
    console.error("Game search failed:", error);
  }

  const visibleGames = games
    .filter(
      (game, index, items) =>
        Boolean(game.id && game.name) &&
        items.findIndex((item) => item.id === game.id) === index,
    )
    .slice(0, 24);

   const hasPreviousPage = page > 1;

    const hasNextPage =
    Boolean(query) && visibleGames.length === pageSize;

    const searchUrl = (targetPage: number) =>
    `/games/search?q=${encodeURIComponent(
        query,
    )}&page=${targetPage}`; 

  return (
    <main className="min-h-screen bg-[#08111c] pb-24 text-white">
      <section className="border-b border-white/10 bg-[#0b1623]">
        <div className="mx-auto max-w-[1500px] px-4 py-10 md:px-6 md:py-14">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/45 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to games
          </Link>

          <div className="mt-7 max-w-3xl">
            <div className="flex items-center gap-3 text-cyan-300">
              <Gamepad2 className="h-5 w-5" />

              <p className="text-xs font-black uppercase tracking-[0.35em]">
                CINRYVAN Gaming
              </p>
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              Search games
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
              Search for games across PC, PlayStation, Xbox,
              Nintendo and more.
            </p>
          </div>

          <form
            action="/games/search"
            method="get"
            className="mt-8 flex max-w-4xl border border-white/15 bg-[#111d2b] focus-within:border-cyan-400"
          >
            <label htmlFor="game-search" className="sr-only">
              Search for a game
            </label>

            <div className="grid w-14 shrink-0 place-items-center text-white/40">
              <Search className="h-5 w-5" />
            </div>

            <input
              id="game-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search Elden Ring, Forza, Call of Duty..."
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-1 py-4 text-sm font-semibold text-white outline-none placeholder:text-white/30 md:text-base"
            />

            <button
              type="submit"
              className="shrink-0 bg-cyan-400 px-5 text-xs font-black uppercase tracking-wider text-[#07111d] transition hover:bg-cyan-300 sm:px-8"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">
              {query ? "Search results" : "Popular discoveries"}
            </p>

            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              {query
                ? `Games matching “${query}”`
                : "Popular games"}
            </h2>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-white/35">
            {visibleGames.length} games
          </span>
        </div>

        {visibleGames.length ? (
            <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleGames.map((game) => (
                    <SearchGameCard key={game.id} game={game} />
                ))}
                </div>

                {(hasPreviousPage || hasNextPage) && (
                <nav
                    aria-label="Game search pages"
                    className="mt-10 flex items-center justify-center gap-3 border-t border-white/10 pt-8"
                >
                    {hasPreviousPage ? (
                    <Link
                        href={searchUrl(page - 1)}
                        className="border border-white/15 bg-white/[0.05] px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                        ← Previous
                    </Link>
                    ) : (
                    <span className="cursor-not-allowed border border-white/5 px-5 py-3 text-xs font-black uppercase tracking-wider text-white/20">
                        ← Previous
                    </span>
                    )}

                    <span className="px-4 text-xs font-black uppercase tracking-wider text-white/45">
                    Page {page}
                    </span>

                    {hasNextPage ? (
                    <Link
                        href={searchUrl(page + 1)}
                        className="bg-cyan-400 px-5 py-3 text-xs font-black uppercase tracking-wider text-[#07111d] transition hover:bg-cyan-300"
                    >
                        Next →
                    </Link>
                    ) : (
                    <span className="cursor-not-allowed bg-white/[0.05] px-5 py-3 text-xs font-black uppercase tracking-wider text-white/20">
                        Next →
                    </span>
                    )}
                </nav>
                )}
            </>
            ) : (
          <div className="border border-white/10 bg-white/[0.025] px-6 py-20 text-center">
            <Gamepad2 className="mx-auto h-10 w-10 text-white/20" />

            <h2 className="mt-5 text-2xl font-black">
              No games found
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/45">
              Check the spelling or try a shorter game title.
            </p>

            <Link
              href="/games/search"
              className="mt-6 inline-flex bg-cyan-400 px-5 py-3 text-xs font-black uppercase tracking-wider text-black"
            >
              View popular games
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}