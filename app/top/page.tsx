import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Crown,
  Medal,
  Play,
  Star,
  Trophy,
} from "lucide-react";
import CineImage from "@/components/CineImage";
import ShelfRow from "@/components/ShelfRow";

export const revalidate = 3600;

const TMDB_BASE = "https://api.themoviedb.org/3";
const TOTAL_VISIBLE_PAGES = 20;
const MAX_SHELF = 16;
const SITE_URL = "https://cinryvan.vercel.app";
const TOP_URL = `${SITE_URL}/top`;

type TopPageProps = {
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
}: TopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = normalizePage(params?.page);
  const canonical = page === 1 ? TOP_URL : `${TOP_URL}?page=${page}`;
  const pageSuffix = page > 1 ? ` — Page ${page}` : "";
  const title = `Top Rated Movies of All Time${pageSuffix}`;
  const description =
    page === 1
      ? "Explore the highest-rated movies of all time, acclaimed drama, horror masterpieces, science-fiction classics and award-worthy animation."
      : `Browse page ${page} of the highest-rated movies, acclaimed classics, audience favourites and award-winning cinema on CINRYVAN.`;

  return {
    title,
    description,
    category: "Top Rated Movies",
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
        alt: "Top-rated movies on CINRYVAN",
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
      next: { revalidate: 3600 },
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

export default async function TopPage({
  searchParams,
}: TopPageProps) {
  const params = await searchParams;
  const page = normalizePage(params?.page);
  const currentYear = new Date().getUTCFullYear();

  const [topRated, bestThisYear, drama, horror, scienceFiction, animation] =
    await Promise.all([
      tmdb(`/movie/top_rated?language=en-US&page=${page}`),
      tmdb(
        `/discover/movie?include_adult=false&language=en-US&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${currentYear}&page=1`,
      ),
      tmdb(
        "/discover/movie?include_adult=false&language=en-US&sort_by=vote_average.desc&vote_count.gte=1000&with_genres=18&page=1",
      ),
      tmdb(
        "/discover/movie?include_adult=false&language=en-US&sort_by=vote_average.desc&vote_count.gte=750&with_genres=27&page=1",
      ),
      tmdb(
        "/discover/movie?include_adult=false&language=en-US&sort_by=vote_average.desc&vote_count.gte=1000&with_genres=878&page=1",
      ),
      tmdb(
        "/discover/movie?include_adult=false&language=en-US&sort_by=vote_average.desc&vote_count.gte=500&with_genres=16&page=1",
      ),
    ]);

  const movies = uniqueMovies(topRated.results);
  const hero = movies.find((movie) => movie.backdrop_path) ?? movies[0];
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");
  const leaders = movies.slice(0, 5);
  const rankedMovies = movies.slice(5);
  const pageOffset = (page - 1) * 20;
  const pageUrl = page === 1 ? TOP_URL : `${TOP_URL}?page=${page}`;

  const genreRows = [
    { id: "this-year", eyebrow: `${currentYear} cinema`, title: "Best Movies This Year", items: toShelf(bestThisYear.results) },
    { id: "drama", eyebrow: "Powerful cinema", title: "Acclaimed Drama", items: toShelf(drama.results) },
    { id: "horror", eyebrow: "Nightmare canon", title: "Horror Masterpieces", items: toShelf(horror.results) },
    { id: "sci-fi", eyebrow: "Visionary worlds", title: "Science-Fiction Classics", items: toShelf(scienceFiction.results) },
    { id: "animation", eyebrow: "Animated excellence", title: "Top Animation", items: toShelf(animation.results) },
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
        name: "Top Movies",
        item: pageUrl,
      },
    ],
  };

  const topJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name:
      page === 1 ? "Top Rated Movies" : `Top Rated Movies — Page ${page}`,
    description:
      "Explore the highest-rated movies and acclaimed cinema on CINRYVAN.",
    url: pageUrl,
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    mainEntity: { "@id": `${pageUrl}#ranked-movies` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const rankedMoviesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#ranked-movies`,
    name: `Top-rated movies — page ${page}`,
    numberOfItems: movies.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
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
          __html: JSON.stringify(topJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(rankedMoviesJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative min-h-[560px] overflow-hidden pt-24 md:pt-28 lg:min-h-[680px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/80 to-[#05070d]/12" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(250,204,21,0.2),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[470px] w-full max-w-[1500px] items-end px-4 pb-14 sm:min-h-[530px] sm:px-6 lg:min-h-[580px] lg:px-10 lg:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-yellow-400 pl-3">
              <Clapperboard className="h-4 w-4 text-yellow-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.36em] text-yellow-400 sm:text-xs">
                CINRYVAN Film Canon · Page {page}
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] sm:text-6xl lg:text-8xl">
              Top Rated Movies
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/65 sm:text-lg sm:leading-8">
              Audience favourites, critical landmarks and cinema that earned its place in the canon.
            </p>

            {hero && (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/movie/${hero.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                  View top movie
                </Link>
                <Link
                  href="/movie"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400"
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
          <div className="mb-6 flex items-end justify-between gap-5 border-l-2 border-yellow-400 pl-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
                Cinema leaderboard
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                The Five Leaders
              </h2>
            </div>
            <Trophy className="hidden h-7 w-7 text-yellow-400 sm:block" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {leaders.map((movie, index) => {
              const rankIcons = [Crown, Trophy, Medal, Award, Star];
              const RankIcon = rankIcons[index] ?? Star;

              return (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className={`group relative min-h-[270px] overflow-hidden border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-yellow-400/65 sm:min-h-[320px] ${
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
                      <span className="text-5xl font-black text-yellow-400">
                        {String(pageOffset + index + 1).padStart(2, "0")}
                      </span>
                      <RankIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h3 className="mt-3 text-xl font-black sm:text-2xl">
                      {movie.title || "Untitled"}
                    </h3>
                    {typeof movie.vote_average === "number" && (
                      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-black text-black">
                        <Star className="h-3.5 w-3.5" fill="currentColor" />
                        {movie.vote_average.toFixed(1)}
                      </p>
                    )}
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
                All-time rankings
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                More Essential Movies
              </h2>
            </div>
            <p className="text-sm font-bold text-white/40">Page {page}</p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {rankedMovies.map((movie, index) => {
              const rank = pageOffset + index + 6;

              return (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-yellow-400/65"
                >
                  <span className="absolute left-2 top-2 z-20 grid h-9 min-w-9 place-items-center rounded-full bg-yellow-400 px-2 text-xs font-black text-black shadow-xl">
                    {rank}
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
                        <span className="inline-flex items-center gap-1 text-yellow-400">
                          <Star className="h-3 w-3" fill="currentColor" />
                          {movie.vote_average.toFixed(1)}
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

        <div className="mt-14 space-y-12 sm:space-y-16">
          {genreRows.map((row) =>
            row.items.length ? (
              <section
                key={row.id}
                id={row.id}
                className="border-t border-white/10 pt-10"
              >
                <div className="mb-5 border-l-2 border-yellow-400 pl-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
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
              ["Trending", "/trending"],
              ["Movies", "/movie"],
              ["TV Hall of Fame", "/tv/top"],
              ["Anime", "/anime"],
              ["Upcoming", "/upcoming"],
            ].map(([title, href]) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[110px] items-end justify-between bg-[#080b12] p-5 font-black transition hover:bg-yellow-400 hover:text-black"
              >
                {title}
                <ArrowRight className="h-5 w-5 text-yellow-400 transition group-hover:translate-x-1 group-hover:text-black" />
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
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Top movie pages">
      <Link
        href={`/top?page=${Math.max(1, currentPage - 1)}`}
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
            href={`/top?page=${number}`}
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
        href={`/top?page=${Math.min(TOTAL_VISIBLE_PAGES, currentPage + 1)}`}
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