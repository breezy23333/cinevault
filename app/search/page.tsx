// app/search/page.tsx
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { discoverMovies, searchTitles } from "@/lib/fetchers";

export const runtime = "nodejs";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Search Movies & TV Shows | CINRYVAN",
  description:
    "Search movies, TV shows, anime, cartoons, and entertainment titles on CINRYVAN.",
  alternates: { canonical: "/search" },
  openGraph: {
    title: "Search Movies & TV Shows | CINRYVAN",
    description: "Find movies, TV shows, anime, cartoons, and entertainment titles.",
    url: "/search",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Movies & TV Shows | CINRYVAN",
    description: "Search movies, TV shows, anime, cartoons, and entertainment titles.",
    images: ["/og-image.png"],
  },
};

type SP = Record<string, string | string[] | undefined>;

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  year: string;
  poster: string;
  backdrop: string | null;
  rating: number | null;
  overview: string;
  href: string;
};

type Category = {
  name: string;
  id: number;
  description: string;
  accent: string;
};

const categories: Category[] = [
  { name: "Action", id: 28, description: "Heroes, fights and impossible missions", accent: "from-red-600/65" },
  { name: "Adventure", id: 12, description: "Journeys beyond the known world", accent: "from-amber-500/65" },
  { name: "Animation", id: 16, description: "Illustrated worlds for every audience", accent: "from-pink-500/65" },
  { name: "Comedy", id: 35, description: "Big laughs and comfort watches", accent: "from-lime-500/55" },
  { name: "Crime", id: 80, description: "Heists, detectives and criminal empires", accent: "from-slate-600/75" },
  { name: "Drama", id: 18, description: "Powerful lives and emotional stories", accent: "from-rose-600/60" },
  { name: "Fantasy", id: 14, description: "Magic, legends and impossible realms", accent: "from-violet-600/65" },
  { name: "Horror", id: 27, description: "Nightmares, monsters and dark secrets", accent: "from-red-950/85" },
  { name: "Mystery", id: 9648, description: "Secrets waiting to be uncovered", accent: "from-indigo-700/70" },
  { name: "Romance", id: 10749, description: "Love stories and complicated hearts", accent: "from-pink-600/65" },
  { name: "Sci-Fi", id: 878, description: "Future technology and distant worlds", accent: "from-cyan-600/60" },
  { name: "Thriller", id: 53, description: "Tension, danger and unexpected turns", accent: "from-orange-700/70" },
];

const getParam = (sp: SP | undefined, key: string) => {
  const value = sp?.[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
};

const tmdb = (path?: string | null, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

function toNorm(item: any): Norm | null {
  if (!item || item.media_type === "person") return null;

  const media: "movie" | "tv" =
    item.media_type === "tv" || item.first_air_date ? "tv" : "movie";
  const poster = tmdb(item.poster_path, "w500") || tmdb(item.backdrop_path, "w780");
  if (!poster || !item.id) return null;

  return {
    id: Number(item.id),
    media,
    title: item.title || item.name || "Untitled",
    year: String(item.release_date || item.first_air_date || "").slice(0, 4) || "—",
    poster,
    backdrop: tmdb(item.backdrop_path, "original"),
    rating:
      typeof item.vote_average === "number" && item.vote_average > 0
        ? item.vote_average
        : null,
    overview: item.overview || "",
    href: `/${media}/${item.id}`,
  };
}

function buildHref(
  nextPage: number,
  params: { q?: string; year?: number; genreId?: number },
) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.year) search.set("year", String(params.year));
  if (params.genreId) search.set("genre", String(params.genreId));
  search.set("page", String(nextPage));
  return `/search?${search.toString()}`;
}

type PageProps = { searchParams?: Promise<SP> };

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = getParam(sp, "q").trim();
  const yearValue = getParam(sp, "year");
  const genreValue = getParam(sp, "genre");
  const pageValue = getParam(sp, "page");
  const year = yearValue ? Number(yearValue) : undefined;
  const genreId = genreValue ? Number(genreValue) : undefined;
  const page = Math.max(1, Number(pageValue || "1") || 1);
  const selectedCategory = categories.find((category) => category.id === genreId);

  let data: any = { results: [], total_pages: 1 };
  try {
    data = q
      ? await searchTitles(q, page)
      : await discoverMovies({ year, genreId, page });
  } catch {
    data = { results: [], total_pages: 1 };
  }

  const raw: any[] = Array.isArray(data?.results) ? data.results : [];
  const normalized: Array<Norm | null> = raw.map((movie: any) => toNorm(movie));
  const items: Norm[] = normalized
    .filter((item: Norm | null): item is Norm => item !== null)
    .slice(0, 40);
  const hero = items.find((item) => item.backdrop) || items[0];
  const totalPages = Math.min(Number(data?.total_pages || 1), 500);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  let categoryArtwork: Record<number, string | null> = {};
  if (!q) {
    const artworkResults = await Promise.all(
      categories.map(async (category) => {
        try {
          const response = await discoverMovies({ genreId: category.id, page: 1 });
          const candidates: any[] = Array.isArray(response?.results)
            ? response.results
            : [];
          const visual = candidates.find((movie: any) => movie.backdrop_path || movie.poster_path);
          return [category.id, tmdb(visual?.backdrop_path || visual?.poster_path, "w780")] as const;
        } catch {
          return [category.id, null] as const;
        }
      }),
    );
    categoryArtwork = Object.fromEntries(artworkResults);
  }

  const heroEyebrow = q
    ? "CINRYVAN Search"
    : selectedCategory
      ? "Movie genre unlocked"
      : "CINRYVAN Movie Discovery";
  const heroTitle = q
    ? `Results for “${q}”`
    : selectedCategory
      ? selectedCategory.name
      : "Discover Movies";
  const heroDescription = q
    ? `${items.length} visual matches on page ${page}. Search across movies and television.`
    : selectedCategory?.description ||
      "Enter a genre and discover blockbusters, hidden gems, classics and new releases.";

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-20 text-white">
      <section className="relative min-h-[500px] overflow-hidden border-b border-white/10 pt-24">
        {hero?.backdrop && (
          <img
            src={hero.backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/88 to-[#05070d]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(250,204,21,.15),transparent_26%)]" />

        <div className="relative mx-auto flex min-h-[410px] max-w-[1500px] items-end px-4 pb-12 md:px-8 lg:px-10">
          <div className="max-w-4xl">
            <p className="text-[11px] font-black uppercase tracking-[0.38em] text-yellow-400">
              {heroEyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              {heroDescription}
            </p>

            <form action="/search" className="mt-7 flex max-w-2xl overflow-hidden border border-white/15 bg-black/50 backdrop-blur-xl">
              <label htmlFor="cinryvan-search" className="sr-only">Search movies and TV shows</label>
              <Search className="ml-4 h-5 w-5 shrink-0 self-center text-white/35" />
              <input
                id="cinryvan-search"
                name="q"
                defaultValue={q}
                placeholder="Search movies, TV shows, anime..."
                className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm font-semibold text-white outline-none placeholder:text-white/30 sm:text-base"
              />
              <button className="shrink-0 bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300 sm:px-7">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-4 md:px-8 lg:px-10">
        {!q && (
          <section className="border-b border-white/10 py-12 sm:py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-yellow-400">
                  Find your next world
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">Browse by movie category</h2>
                <p className="mt-2 text-sm text-white/45">Choose a genre to rebuild the discovery screen around your mood.</p>
              </div>
              {genreId && (
                <Link href="/search" className="text-sm font-black text-yellow-300 hover:text-yellow-200">
                  Clear category ×
                </Link>
              )}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => {
                const active = genreId === category.id;
                const artwork = categoryArtwork[category.id];
                return (
                  <Link
                    key={category.id}
                    href={`/search?genre=${category.id}`}
                    className={`group relative min-h-[145px] overflow-hidden border transition duration-300 hover:-translate-y-1 sm:min-h-[170px] ${
                      active ? "border-yellow-400" : "border-white/10 hover:border-yellow-400/55"
                    }`}
                  >
                    {artwork && (
                      <img
                        src={artwork}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                      />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.accent} via-black/60 to-black/15`} />
                    <div className="relative flex h-full min-h-[145px] flex-col justify-end p-4 sm:min-h-[170px]">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400">
                        {active ? "Selected" : "Category"}
                      </p>
                      <h3 className="mt-1 text-xl font-black sm:text-2xl">{category.name}</h3>
                      <p className="mt-1 hidden line-clamp-1 text-[11px] text-white/50 sm:block">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
              <span>{categories.length} categories</span>
              <span>Choose a world to explore</span>
            </div>
          </section>
        )}

        <section className="py-12 sm:py-16">
          <div className="flex items-end justify-between gap-5 border-b border-white/10 pb-5">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
                {q ? <Search className="h-3.5 w-3.5" /> : <Clapperboard className="h-3.5 w-3.5" />}
                {q ? "Search results" : selectedCategory ? `${selectedCategory.name} collection` : "Popular discoveries"}
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                {q ? "Titles we found" : selectedCategory ? `${selectedCategory.name} movies` : "Movies to explore"}
              </h2>
            </div>
            <p className="hidden text-xs font-bold uppercase tracking-[0.18em] text-white/25 sm:block">
              Page {page} / {totalPages}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="mt-7 border border-white/10 bg-[#0a0e16] px-6 py-16 text-center">
              <Film className="mx-auto h-10 w-10 text-white/15" />
              <p className="mt-4 text-xl font-black">No titles found</p>
              <p className="mt-2 text-sm text-white/40">Try a different search or clear the current filters.</p>
              <Link href="/search" className="mt-5 inline-flex bg-yellow-400 px-5 py-3 text-sm font-black text-black">
                Reset discovery
              </Link>
            </div>
          ) : (
            <ul className="mt-7 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {items.map((item, index) => (
                <li key={`${item.media}-${item.id}`} className="group min-w-0">
                  <Link href={item.href} className="block" prefetch={false}>
                    <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-[#0a0e16] transition group-hover:border-yellow-400/65">
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className="absolute left-2 top-2 grid h-8 min-w-8 place-items-center bg-black/75 px-2 text-xs font-black text-white backdrop-blur">
                        {String((page - 1) * 20 + index + 1).padStart(2, "0")}
                      </span>
                      {item.rating && (
                        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-yellow-400 px-2 py-1 text-[10px] font-black text-black">
                          <Star className="h-3 w-3 fill-current" /> {item.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="pt-3">
                      <h3 className="line-clamp-1 text-sm font-black transition group-hover:text-yellow-300">{item.title}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                        {item.year} · {item.media === "tv" ? "TV" : "Movie"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 flex items-center justify-center gap-3 border-t border-white/10 pt-8">
            <Link
              aria-disabled={!hasPrev}
              href={hasPrev ? buildHref(page - 1, { q, year, genreId }) : "#"}
              className={`inline-flex h-11 items-center gap-2 border px-4 text-sm font-black transition sm:px-6 ${
                hasPrev
                  ? "border-white/15 hover:border-yellow-400/60 hover:text-yellow-300"
                  : "pointer-events-none border-white/5 text-white/20"
              }`}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Link>
            <span className="grid h-11 min-w-11 place-items-center bg-yellow-400 px-4 text-sm font-black text-black">
              {page}
            </span>
            <Link
              aria-disabled={!hasNext}
              href={hasNext ? buildHref(page + 1, { q, year, genreId }) : "#"}
              className={`inline-flex h-11 items-center gap-2 border px-4 text-sm font-black transition sm:px-6 ${
                hasNext
                  ? "border-white/15 hover:border-yellow-400/60 hover:text-yellow-300"
                  : "pointer-events-none border-white/5 text-white/20"
              }`}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Browse everything", "/browse", Film],
            ["Trending now", "/trending", Sparkles],
            ["Top rated", "/top", Star],
            ["Upcoming releases", "/upcoming", Clapperboard],
          ].map(([label, href, Icon]) => {
            const IconComponent = Icon as typeof Film;
            return (
              <Link
                key={label as string}
                href={href as string}
                className="group flex min-h-[110px] items-end justify-between bg-[#080c12] p-5 text-lg font-black transition hover:bg-yellow-400 hover:text-black"
              >
                {label as string}
                <IconComponent className="h-5 w-5 text-yellow-400 transition group-hover:text-black" />
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
