import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Crown,
  Medal,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Tv,
} from "lucide-react";
import CineImage from "@/components/CineImage";
import { getTopRatedTv } from "@/lib/fetchers";

export const revalidate = 300;

const TOTAL_VISIBLE_PAGES = 20;

export const metadata: Metadata = {
  title: "Top Rated TV Shows of All Time | CINRYVAN",
  description:
    "Explore the highest-rated television series, audience favourites and critically acclaimed TV shows on CINRYVAN.",
  keywords: [
    "top rated TV shows",
    "best TV series",
    "highest rated shows",
    "critically acclaimed television",
    "CINRYVAN top TV",
  ],
  alternates: { canonical: "/tv/top" },
  openGraph: {
    title: "Top Rated TV Shows of All Time | CINRYVAN",
    description:
      "Discover television series with the strongest audience ratings.",
    url: "/tv/top",
    siteName: "CINRYVAN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Top Rated TV Shows on CINRYVAN",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Rated TV Shows of All Time | CINRYVAN",
    description: "Explore the strongest audience-rated television series.",
    images: ["/og-image.png"],
  },
};

type Show = {
  id: number;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export default async function TopRatedTvPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params?.page || 1);
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), TOTAL_VISIBLE_PAGES)
    : 1;

  const data = await getTopRatedTv(page);
  const shows: Show[] = Array.isArray(data?.results) ? data.results : [];
  const spotlight = shows.find((show) => show.backdrop_path) ?? shows[0];
  const topThree = shows.slice(0, 3);
  const rankedShows = shows.slice(3);
  const pageOffset = (page - 1) * 20;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Top Rated TV Shows",
    description:
      "The highest-rated television series and audience favourites on CINRYVAN.",
    url: "https://cinryvan.vercel.app/tv/top",
    isPartOf: {
      "@type": "WebSite",
      name: "CINRYVAN",
      url: "https://cinryvan.vercel.app",
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-20 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <section className="relative min-h-[540px] overflow-hidden pt-24 md:pt-28 lg:min-h-[640px]">
        {spotlight?.backdrop_path && (
          <Image
            src={tmdbImage(spotlight.backdrop_path, "original")!}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/80 to-[#05070d]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(250,204,21,0.18),transparent_28%)]" />

        <div className="relative z-10 mx-auto flex min-h-[450px] w-full max-w-[1500px] items-end px-4 pb-14 sm:min-h-[510px] sm:px-6 lg:min-h-[540px] lg:px-10 lg:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-yellow-400 pl-3">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.36em] text-yellow-400 sm:text-xs">
                Television Hall of Fame · Page {page}
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] sm:text-6xl lg:text-8xl">
              Top Rated TV Shows
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/65 sm:text-lg sm:leading-8">
              Critically loved television and audience favourites with the strongest ratings.
            </p>

            {spotlight && (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/tv/${spotlight.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                  View highest rated
                </Link>
                <Link
                  href="/tv"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  All TV shows
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <section>
          <div className="mb-6 flex items-end justify-between gap-5 border-l-2 border-yellow-400 pl-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
                The winners circle
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                Highest Rated Top 3
              </h2>
            </div>
            <Award className="hidden h-7 w-7 text-yellow-400 sm:block" />
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {topThree.map((show, index) => {
              const podiumIcons = [Crown, Trophy, Medal];
              const PodiumIcon = podiumIcons[index] ?? Medal;

              return (
                <Link
                  key={show.id}
                  href={`/tv/${show.id}`}
                  className="group relative min-h-[280px] overflow-hidden border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-yellow-400/60 sm:min-h-[340px]"
                >
                  {(show.backdrop_path || show.poster_path) && (
                    <Image
                      src={tmdbImage(show.backdrop_path || show.poster_path, "w780")!}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-5xl font-black text-yellow-400 sm:text-6xl">
                        {String(pageOffset + index + 1).padStart(2, "0")}
                      </span>
                      <PodiumIcon className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                      {show.name || "Untitled"}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-xs font-bold text-white/55">
                      <span>{show.first_air_date?.slice(0, 4) || "TBA"}</span>
                      {typeof show.vote_average === "number" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-black">
                          <Star className="h-3.5 w-3.5" fill="currentColor" />
                          {show.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12 border-t border-white/10 pt-10 sm:mt-16 sm:pt-14">
          <div className="flex flex-col gap-3 border-l-2 border-yellow-400 pl-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
                Prestige rankings
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                More Acclaimed Series
              </h2>
            </div>
            <p className="text-sm font-bold text-white/40">Page {page}</p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {rankedShows.map((show, index) => {
              const rank = pageOffset + index + 4;

              return (
                <Link
                  key={show.id}
                  href={`/tv/${show.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-yellow-400/60"
                >
                  <span className="absolute left-2 top-2 z-20 grid h-9 min-w-9 place-items-center rounded-full bg-yellow-400 px-2 text-xs font-black text-black shadow-xl">
                    {rank}
                  </span>
                  <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                    <CineImage
                      src={tmdbImage(show.poster_path, "w500")}
                      alt={show.name || "TV Show"}
                      fallback="No poster"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-sm font-black sm:text-base">
                      {show.name || "Untitled"}
                    </h3>
                    <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                      <span>{show.first_air_date?.slice(0, 4) || "TBA"}</span>
                      {typeof show.vote_average === "number" && (
                        <span className="inline-flex items-center gap-1 text-yellow-400">
                          <Star className="h-3 w-3" fill="currentColor" />
                          {show.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Pagination currentPage={page} />
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["All TV Shows", "/tv", Tv],
              ["Popular TV", "/tv/popular", Sparkles],
              ["TV Categories", "/categories", ShieldCheck],
              ["Trending Now", "/trending", Star],
            ].map(([title, href, Icon]) => {
              const IconComponent = Icon as typeof Tv;
              return (
                <Link
                  key={title as string}
                  href={href as string}
                  className="group flex min-h-[120px] items-end justify-between bg-[#080b12] p-5 text-lg font-black transition hover:bg-yellow-400 hover:text-black"
                >
                  {title as string}
                  <IconComponent className="h-5 w-5 text-yellow-400 group-hover:text-black" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Pagination({ currentPage }: { currentPage: number }) {
  const start = Math.max(
    1,
    Math.min(currentPage - 2, TOTAL_VISIBLE_PAGES - 4),
  );
  const pages = Array.from({ length: 5 }, (_, index) => start + index);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Top rated TV pages">
      <Link
        href={`/tv/top?page=${Math.max(1, currentPage - 1)}`}
        aria-disabled={currentPage === 1}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === 1
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-white/20 text-white hover:border-yellow-400 hover:text-yellow-400"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((number) => (
          <Link
            key={number}
            href={`/tv/top?page=${number}`}
            className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-black transition ${
              currentPage === number
                ? "bg-yellow-400 text-black"
                : "border border-white/15 bg-[#0a0e17] text-white hover:border-yellow-400"
            }`}
          >
            {number}
          </Link>
        ))}
      </div>

      <span className="grid h-11 min-w-11 place-items-center rounded-full bg-yellow-400 px-3 text-sm font-black text-black sm:hidden">
        {currentPage}
      </span>

      <Link
        href={`/tv/top?page=${Math.min(TOTAL_VISIBLE_PAGES, currentPage + 1)}`}
        aria-disabled={currentPage === TOTAL_VISIBLE_PAGES}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === TOTAL_VISIBLE_PAGES
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-300"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}