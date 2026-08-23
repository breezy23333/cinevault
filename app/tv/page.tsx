import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Play,
  Radio,
  Search,
  Sparkles,
  Star,
  Tv,
  Users,
} from "lucide-react";
import CineImage from "@/components/CineImage";
import ShelfRow from "@/components/ShelfRow";

export const revalidate = 3600;

const TOTAL_VISIBLE_PAGES = 20;
const MAX_SHELF = 16;
const TMDB_BASE = "https://api.themoviedb.org/3";

export const metadata: Metadata = {
  title: "TV Shows – Trending, Popular & Top Series | CINRYVAN",
  description:
    "Browse popular TV shows, trending series, top-rated shows, drama, fantasy, crime, reality television and entertainment recommendations on CINRYVAN.",
  keywords: [
    "TV shows",
    "popular TV shows",
    "trending series",
    "top rated TV shows",
    "drama series",
    "crime shows",
    "fantasy series",
    "reality TV",
    "CINRYVAN TV",
  ],
  alternates: { canonical: "/tv" },
  openGraph: {
    title: "TV Shows – Trending, Popular & Top Series | CINRYVAN",
    description:
      "Explore trending, popular and top-rated television series on CINRYVAN.",
    url: "/tv",
    siteName: "CINRYVAN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CINRYVAN TV Shows",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Shows – Trending, Popular & Top Series | CINRYVAN",
    description:
      "Discover trending series, drama, crime, fantasy and reality television.",
    images: ["/og-image.png"],
  },
};

type Show = {
  id: number;
  name: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  adult?: boolean;
};

type TmdbResponse = {
  results: Show[];
  page: number;
  total_pages: number;
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function tmdb(path: string): Promise<TmdbResponse> {
  const token =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  const separator = path.includes("?") ? "&" : "?";
  const url = apiKey
    ? `${TMDB_BASE}${path}${separator}api_key=${apiKey}`
    : `${TMDB_BASE}${path}`;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return { results: [], page: 1, total_pages: 1 };
    const data = await response.json();
    return {
      results: Array.isArray(data?.results)
        ? data.results.filter((show: Show) => show.adult !== true)
        : [],
      page: Number(data?.page || 1),
      total_pages: Number(data?.total_pages || 1),
    };
  } catch {
    return { results: [], page: 1, total_pages: 1 };
  }
}

const uniqueShows = (shows: Show[]) => {
  const seen = new Set<number>();
  return shows.filter((show) => {
    if (!show.id || seen.has(show.id)) return false;
    seen.add(show.id);
    return true;
  });
};

const toShelf = (shows: Show[]) =>
  uniqueShows(shows)
    .filter((show) => show.poster_path || show.backdrop_path)
    .slice(0, MAX_SHELF)
    .map((show) => ({
      id: show.id,
      media: "tv" as const,
      title: show.name || "Untitled",
      poster:
        tmdbImage(show.poster_path, "w342") ||
        tmdbImage(show.backdrop_path, "w780"),
      year: String(show.first_air_date || "").slice(0, 4),
      rating:
        typeof show.vote_average === "number"
          ? Math.round(show.vote_average * 10) / 10
          : undefined,
      href: `/tv/${show.id}`,
    }));

const tvChannels = [
  { title: "Trending", href: "#trending", icon: Flame },
  { title: "Airing Today", href: "#airing-today", icon: Radio },
  { title: "On the Air", href: "#on-the-air", icon: CalendarClock },
  { title: "Top Rated", href: "#top-rated", icon: Crown },
  { title: "Drama", href: "#drama", icon: Sparkles },
  { title: "Crime", href: "#crime", icon: Search },
  { title: "Sci-Fi", href: "#sci-fi", icon: Star },
  { title: "All Shows", href: "#all-shows", icon: Tv },
];

export default async function TVPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params?.page || 1);
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), TOTAL_VISIBLE_PAGES)
    : 1;

  const [
    popular,
    trending,
    airingToday,
    onTheAir,
    topRated,
    drama,
    crime,
    scienceFiction,
    reality,
  ] = await Promise.all([
    tmdb(`/tv/popular?language=en-US&page=${page}`),
    tmdb("/trending/tv/week?language=en-US&page=1"),
    tmdb("/tv/airing_today?language=en-US&page=1"),
    tmdb("/tv/on_the_air?language=en-US&page=1"),
    tmdb("/tv/top_rated?language=en-US&page=1"),
    tmdb("/discover/tv?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=18&page=1"),
    tmdb("/discover/tv?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=80&page=1"),
    tmdb("/discover/tv?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=10765&page=1"),
    tmdb("/discover/tv?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=10764&page=1"),
  ]);

  const heroCandidates = uniqueShows([
    ...trending.results,
    ...onTheAir.results,
    ...popular.results,
  ]).filter(
    (show) =>
      show.backdrop_path && show.overview && (show.vote_count || 0) > 50,
  );
  const hero = heroCandidates[0] ?? popular.results[0];
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");

  const rows = [
    { id: "trending", eyebrow: "Global signal", title: "Trending TV Shows", items: toShelf(trending.results) },
    { id: "airing-today", eyebrow: "Broadcast today", title: "Airing Today", items: toShelf(airingToday.results) },
    { id: "on-the-air", eyebrow: "Current seasons", title: "On the Air", items: toShelf(onTheAir.results) },
    { id: "top-rated", eyebrow: "Television essentials", title: "Top Rated Series", items: toShelf(topRated.results) },
    { id: "drama", eyebrow: "Powerful stories", title: "Drama Series", items: toShelf(drama.results) },
    { id: "crime", eyebrow: "Dark files", title: "Crime Shows", items: toShelf(crime.results) },
    { id: "sci-fi", eyebrow: "Impossible worlds", title: "Sci-Fi & Fantasy", items: toShelf(scienceFiction.results) },
    { id: "reality", eyebrow: "Unscripted television", title: "Reality TV", items: toShelf(reality.results) },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "TV Shows on CINRYVAN",
    description:
      "Browse popular, trending, top-rated, airing and on-the-air television series.",
    url: "https://cinryvan.vercel.app/tv",
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

      <section className="relative min-h-[600px] overflow-hidden pt-24 md:pt-28 lg:min-h-[750px]">
        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/73 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(59,130,246,0.18),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[510px] w-full max-w-[1500px] items-end px-4 pb-16 sm:min-h-[580px] sm:px-6 lg:min-h-[650px] lg:px-10 lg:pb-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-blue-400 pl-3">
              <Radio className="h-4 w-4 text-blue-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-blue-300 sm:text-xs">
                CINRYVAN Broadcast Premiere
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] drop-shadow-2xl sm:text-6xl lg:text-8xl">
              {hero?.name || "Television Worlds"}
            </h1>

            {hero?.overview && (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 line-clamp-3 sm:text-lg sm:leading-8">
                {hero.overview}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-black">
              {hero?.first_air_date && (
                <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 backdrop-blur-md">
                  {hero.first_air_date.slice(0, 4)}
                </span>
              )}
              {typeof hero?.vote_average === "number" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-400 px-3 py-1.5 text-black">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                  {hero.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={hero ? `/tv/${hero.id}` : "/tv"}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-blue-300"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                View series
              </Link>
              <a
                href="#trending"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-blue-400 hover:text-blue-300"
              >
                Explore television
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <section className="border-y border-white/10 bg-[#080c14]/95 p-3 backdrop-blur-xl sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {tvChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="group flex min-h-[88px] flex-col justify-between border border-white/10 bg-white/[0.025] p-3 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-400 hover:text-black"
                >
                  <Icon className="h-4 w-4 text-blue-300 group-hover:text-black" />
                  <span className="mt-4 text-xs font-black sm:text-sm">
                    {channel.title}
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-14">
          {rows.map((row) =>
            row.items.length ? (
              <section
                key={row.id}
                id={row.id}
                className="scroll-mt-28 border-b border-white/[0.08] pb-9"
              >
                <div className="mb-5 flex items-end justify-between gap-5 border-l-2 border-blue-400 pl-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-300">
                      {row.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                      {row.title}
                    </h2>
                  </div>
                  <Link
                    href="/categories"
                    className="hidden items-center gap-2 text-xs font-black text-white/50 transition hover:text-blue-300 sm:flex"
                  >
                    More categories
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <ShelfRow items={row.items} />
              </section>
            ) : null,
          )}
        </div>

        <section id="all-shows" className="scroll-mt-28 pt-12 sm:pt-16">
          <div className="flex flex-col gap-3 border-l-2 border-blue-400 pl-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-300">
                Complete discovery
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                Popular TV Shows
              </h2>
            </div>
            <p className="text-sm font-bold text-white/40">
              Page {page} of {Math.min(TOTAL_VISIBLE_PAGES, popular.total_pages)}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {popular.results.map((show) => (
              <Link
                key={show.id}
                href={`/tv/${show.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-blue-400/60"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                  <CineImage
                    src={tmdbImage(show.poster_path, "w500")}
                    alt={show.name}
                    fallback="No poster"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {typeof show.vote_average === "number" && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-black text-blue-300 backdrop-blur-md">
                      <Star className="h-3 w-3" fill="currentColor" />
                      {show.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-black sm:text-base">
                    {show.name}
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    {show.first_air_date?.slice(0, 4) || "TBA"} · TV Series
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={page} />
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-300">
            Continue discovering
          </p>
          <div className="mt-5 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["TV Categories", "/categories"],
              ["Movies", "/movie"],
              ["Anime", "/anime"],
              ["Entertainment News", "/news"],
            ].map(([title, href]) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[120px] items-end justify-between bg-[#080b12] p-5 text-lg font-black transition hover:bg-blue-400 hover:text-black"
              >
                {title}
                <ArrowRight className="h-5 w-5 text-blue-300 transition group-hover:translate-x-1 group-hover:text-black" />
              </Link>
            ))}
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
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="TV pages">
      <Link
        href={`/tv?page=${Math.max(1, currentPage - 1)}#all-shows`}
        aria-disabled={currentPage === 1}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === 1
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-white/20 text-white hover:border-blue-400 hover:text-blue-300"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((number) => (
          <Link
            key={number}
            href={`/tv?page=${number}#all-shows`}
            className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-black transition ${
              currentPage === number
                ? "bg-blue-400 text-black"
                : "border border-white/15 bg-[#0a0e17] text-white hover:border-blue-400"
            }`}
          >
            {number}
          </Link>
        ))}
      </div>

      <span className="grid h-11 min-w-11 place-items-center rounded-full bg-blue-400 px-3 text-sm font-black text-black sm:hidden">
        {currentPage}
      </span>

      <Link
        href={`/tv?page=${Math.min(TOTAL_VISIBLE_PAGES, currentPage + 1)}#all-shows`}
        aria-disabled={currentPage === TOTAL_VISIBLE_PAGES}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === TOTAL_VISIBLE_PAGES
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-blue-400 bg-blue-400 text-black hover:bg-blue-300"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}