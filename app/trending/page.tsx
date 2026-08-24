import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Flame,
  Globe2,
  Play,
  Radio,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import CineImage from "@/components/CineImage";
import ShelfRow from "@/components/ShelfRow";

export const revalidate = 300;

const TMDB_BASE = "https://api.themoviedb.org/3";
const TOTAL_VISIBLE_PAGES = 20;
const MAX_SHELF = 16;
const SITE_URL = "https://cinryvan.vercel.app";
const TRENDING_URL = `${SITE_URL}/trending`;

type TrendingPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

function normalizePage(value?: string) {
  const page = Number(value || 1);
  return Number.isFinite(page)
    ? Math.min(Math.max(Math.trunc(page), 1), TOTAL_VISIBLE_PAGES)
    : 1;
}

export async function generateMetadata({
  searchParams,
}: TrendingPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = normalizePage(params?.page);
  const canonical =
    page === 1 ? TRENDING_URL : `${TRENDING_URL}?page=${page}`;
  const pageSuffix = page > 1 ? ` — Page ${page}` : "";
  const title = `Trending Movies Right Now & What to Watch${pageSuffix}`;
  const description =
    page === 1
      ? "See the movies trending worldwide right now, including daily breakouts, weekly momentum, ratings, trailers and popular cinema worth watching."
      : `Browse page ${page} of movies trending worldwide, daily breakouts, audience favourites and popular cinema on CINRYVAN.`;

  return {
    title,
    description,
    category: "Trending Movies",
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: `${title} | CINRYVAN`,
      description,
      url: canonical,
      siteName: "CINRYVAN",
      locale: "en_US",
      images: [{
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trending movies on CINRYVAN",
      }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CINRYVAN`,
      description,
      images: ["/og-image.png"],
    },
  };
}

type Movie = {
  id: number;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  adult?: boolean;
};

type TmdbResponse = {
  results: Movie[];
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
      next: { revalidate: 300 },
    });

    if (!response.ok) return { results: [], page: 1, total_pages: 1 };
    const data = await response.json();

    return {
      results: Array.isArray(data?.results)
        ? data.results.filter((movie: Movie) => movie.adult !== true)
        : [],
      page: Number(data?.page || 1),
      total_pages: Number(data?.total_pages || 1),
    };
  } catch {
    return { results: [], page: 1, total_pages: 1 };
  }
}

const uniqueMovies = (movies: Movie[]) => {
  const seen = new Set<number>();
  return movies.filter((movie) => {
    if (!movie.id || seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
};

const toShelf = (movies: Movie[]) =>
  uniqueMovies(movies)
    .filter((movie) => movie.poster_path || movie.backdrop_path)
    .slice(0, MAX_SHELF)
    .map((movie) => ({
      id: movie.id,
      media: "movie" as const,
      title: movie.title || "Untitled",
      poster:
        tmdbImage(movie.poster_path, "w342") ||
        tmdbImage(movie.backdrop_path, "w780"),
      year: String(movie.release_date || "").slice(0, 4),
      rating:
        typeof movie.vote_average === "number"
          ? Math.round(movie.vote_average * 10) / 10
          : undefined,
      voteCount:
        typeof movie.vote_count === "number" ? movie.vote_count : undefined,
      href: `/movie/${movie.id}`,
    }));

export default async function TrendingPage({
  searchParams,
}: TrendingPageProps) {
  const params = await searchParams;
  const page = normalizePage(params?.page);

  const [daily, weekly, popular, upcoming, action] = await Promise.all([
    tmdb(`/trending/movie/day?language=en-US&page=${page}`),
    tmdb("/trending/movie/week?language=en-US&page=1"),
    tmdb("/movie/popular?language=en-US&page=1"),
    tmdb("/movie/upcoming?language=en-US&page=1"),
    tmdb(
      "/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=28&page=1",
    ),
  ]);

  const movies = uniqueMovies(daily.results);
  const hero =
    movies.find(
      (movie) =>
        movie.backdrop_path && movie.overview && (movie.vote_count || 0) > 25,
    ) ?? movies[0];
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");
  const breakouts = movies.slice(0, 5);
  const trendingGrid = movies.slice(5);
  const pageOffset = (page - 1) * 20;
  const pageUrl =
    page === 1 ? TRENDING_URL : `${TRENDING_URL}?page=${page}`;

  const shelves = [
    {
      id: "weekly",
      eyebrow: "Seven-day movement",
      title: "Weekly Momentum",
      items: toShelf(weekly.results),
    },
    {
      id: "global",
      eyebrow: "Worldwide audience",
      title: "Popular Across the World",
      items: toShelf(popular.results),
    },
    {
      id: "action",
      eyebrow: "Adrenaline signal",
      title: "Action Heating Up",
      items: toShelf(action.results),
    },
    {
      id: "upcoming",
      eyebrow: "Next wave",
      title: "Upcoming with Momentum",
      items: toShelf(upcoming.results),
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Trending Movies",
        item: pageUrl,
      },
    ],
  };

  const trendingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name:
      page === 1 ? "Trending Movies" : `Trending Movies — Page ${page}`,
    description:
      "Discover movies gaining global attention and audience momentum right now.",
    url: pageUrl,
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    mainEntity: { "@id": `${pageUrl}#movies` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const movieListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#movies`,
    name: `Trending movies — page ${page}`,
    numberOfItems: movies.length,
    itemListElement: movies.map((movie, index) => {
      const rating =
        typeof movie.vote_average === "number"
          ? Math.round(movie.vote_average * 10) / 10
          : undefined;

      return {
        "@type": "ListItem",
        position: pageOffset + index + 1,
        item: {
          "@type": "Movie",
          name: movie.title || "Untitled",
          url: `${SITE_URL}/movie/${movie.id}`,
          image:
            tmdbImage(movie.poster_path, "w780") ||
            tmdbImage(movie.backdrop_path, "w1280") ||
            undefined,
          dateCreated: movie.release_date || undefined,
          aggregateRating:
            typeof rating === "number" &&
            typeof movie.vote_count === "number" &&
            movie.vote_count > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: rating,
                  ratingCount: movie.vote_count,
                  bestRating: 10,
                  worstRating: 0,
                }
              : undefined,
        },
      };
    }),
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-20 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trendingJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(movieListJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative min-h-[550px] overflow-hidden pt-24 md:pt-28 lg:min-h-[680px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/77 to-[#05070d]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(249,115,22,0.22),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[460px] w-full max-w-[1500px] items-end px-4 pb-14 sm:min-h-[520px] sm:px-6 lg:min-h-[580px] lg:px-10 lg:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-orange-500 pl-3">
              <Radio className="h-4 w-4 animate-pulse text-orange-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.36em] text-orange-400 sm:text-xs">
                Live 24-hour cinema pulse · Page {page}
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] sm:text-6xl lg:text-8xl">
              Trending Movies
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/65 sm:text-lg sm:leading-8">
              The films accelerating across screens, searches and conversations around the world today.
            </p>

            {hero && (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/movie/${hero.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-black text-white transition hover:bg-orange-400"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                  Open hottest movie
                </Link>
                <Link
                  href="/movie"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-orange-500 hover:text-orange-400"
                >
                  All movies
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <section>
          <div className="mb-6 flex items-end justify-between gap-5 border-l-2 border-orange-500 pl-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-400">
                Breakout films
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                Five Movies Rising Fast
              </h2>
            </div>
            <Activity className="hidden h-7 w-7 text-orange-400 sm:block" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {breakouts.map((movie, index) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className={`group relative min-h-[260px] overflow-hidden border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-orange-500/70 sm:min-h-[320px] ${
                  index === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                {(movie.backdrop_path || movie.poster_path) && (
                  <Image
                    src={tmdbImage(movie.backdrop_path || movie.poster_path, "w780")!}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"
                    className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-orange-400">
                      {String(pageOffset + index + 1).padStart(2, "0")}
                    </span>
                    <Flame className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="mt-3 text-xl font-black sm:text-2xl">
                    {movie.title || "Untitled"}
                  </h3>
                  {typeof movie.vote_average === "number" && (
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-black text-orange-300">
                      <Star className="h-3.5 w-3.5" fill="currentColor" />
                      {movie.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-white/10 pt-10 sm:mt-16 sm:pt-14">
          <div className="flex flex-col gap-3 border-l-2 border-orange-500 pl-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-400">
                Daily momentum
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                More Trending Movies
              </h2>
            </div>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-white/40">
              <Globe2 className="h-4 w-4" />
              Page {page}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trendingGrid.map((movie, index) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-orange-500/70"
              >
                <span className="absolute left-2 top-2 z-20 grid h-9 min-w-9 place-items-center rounded-full bg-orange-500 px-2 text-xs font-black text-white shadow-xl">
                  {pageOffset + index + 6}
                </span>
                <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                  <CineImage
                    src={tmdbImage(movie.poster_path, "w500")}
                    alt={movie.title || "Movie"}
                    fallback="No poster"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-black sm:text-base">
                    {movie.title || "Untitled"}
                  </h3>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                    <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
                    {typeof movie.vote_average === "number" && (
                      <span className="inline-flex items-center gap-1 text-orange-400">
                        <Star className="h-3 w-3" fill="currentColor" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={Math.min(TOTAL_VISIBLE_PAGES, daily.total_pages)}
          />
        </section>

        <div className="mt-14 space-y-12 sm:space-y-16">
          {shelves.map((row) =>
            row.items.length ? (
              <section key={row.id} className="border-t border-white/10 pt-10">
                <div className="mb-5 border-l-2 border-orange-500 pl-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-400">
                    {row.eyebrow}
                  </p>
                  <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                    {row.title}
                  </h2>
                </div>
                <ShelfRow items={row.items} />
              </section>
            ) : null,
          )}
        </div>

        <section className="mt-16 border-t border-white/10 pt-10">
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Top Rated", "/top", Star],
              ["Movies", "/movie", Clapperboard],
              ["Trending TV", "/tv/trending", TrendingUp],
              ["Upcoming", "/upcoming", Rocket],
              ["Entertainment News", "/news", Sparkles],
            ].map(([title, href, Icon]) => {
              const IconComponent = Icon as typeof Star;
              return (
                <Link
                  key={title as string}
                  href={href as string}
                  className="group flex min-h-[110px] items-end justify-between bg-[#080b12] p-5 font-black transition hover:bg-orange-500 hover:text-white"
                >
                  {title as string}
                  <IconComponent className="h-5 w-5 text-orange-400 group-hover:text-white" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const safeTotal = Math.max(1, totalPages);
  const start = Math.max(1, Math.min(currentPage - 2, Math.max(1, safeTotal - 4)));
  const count = Math.min(5, safeTotal);
  const pages = Array.from({ length: count }, (_, index) => start + index);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Trending movie pages">
      <Link
        href={`/trending?page=${Math.max(1, currentPage - 1)}`}
        aria-disabled={currentPage === 1}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === 1
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-white/20 text-white hover:border-orange-500 hover:text-orange-400"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((number) => (
          <Link
            key={number}
            href={`/trending?page=${number}`}
            className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-black transition ${
              currentPage === number
                ? "bg-orange-500 text-white"
                : "border border-white/15 bg-[#0a0e17] text-white hover:border-orange-500"
            }`}
          >
            {number}
          </Link>
        ))}
      </div>

      <span className="grid h-11 min-w-11 place-items-center rounded-full bg-orange-500 px-3 text-sm font-black text-white sm:hidden">
        {currentPage}
      </span>

      <Link
        href={`/trending?page=${Math.min(safeTotal, currentPage + 1)}`}
        aria-disabled={currentPage >= safeTotal}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage >= safeTotal
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-orange-500 bg-orange-500 text-white hover:bg-orange-400"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}