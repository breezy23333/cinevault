import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Flame,
  Play,
  Rocket,
  Skull,
  Sparkles,
  Star,
  Swords,
} from "lucide-react";
import CineImage from "@/components/CineImage";
import ShelfRow from "@/components/ShelfRow";

export const revalidate = 3600;

const TOTAL_VISIBLE_PAGES = 20;
const MAX_SHELF = 16;
const TMDB_BASE = "https://api.themoviedb.org/3";
const SITE_URL = "https://cinryvan.vercel.app";
const MOVIES_URL = `${SITE_URL}/movie`;

type MoviesPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

function normalizePage(value?: string) {
  const requestedPage = Number(value || 1);
  return Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), TOTAL_VISIBLE_PAGES)
    : 1;
}

export async function generateMetadata({
  searchParams,
}: MoviesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = normalizePage(params?.page);
  const canonical = page === 1 ? MOVIES_URL : `${MOVIES_URL}?page=${page}`;
  const pageSuffix = page > 1 ? ` — Page ${page}` : "";
  const pageTitle = `Popular Movies, New Releases & What to Watch${pageSuffix}`;
  const description =
    page === 1
      ? "Discover popular and trending movies, new releases, top-rated films, upcoming cinema, action, horror and science-fiction picks on CINRYVAN."
      : `Browse page ${page} of popular movies with ratings, release years and direct links to trailers, casts and watch options on CINRYVAN.`;

  return {
    title: pageTitle,
    description,
    category: "Movies",
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
      title: `${pageTitle} | CINRYVAN`,
      description,
      url: canonical,
      siteName: "CINRYVAN",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Popular and trending movies on CINRYVAN",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | CINRYVAN`,
      description,
      images: ["/og-image.png"],
    },
  };
}

type Movie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
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
      href: `/movie/${movie.id}`,
    }));

const movieChannels = [
  { title: "Trending", href: "#trending", icon: Flame },
  { title: "Now Playing", href: "#now-playing", icon: Clapperboard },
  { title: "Top Rated", href: "#top-rated", icon: Star },
  { title: "Action", href: "#action", icon: Swords },
  { title: "Horror", href: "#horror", icon: Skull },
  { title: "Sci-Fi", href: "#sci-fi", icon: Rocket },
  { title: "Upcoming", href: "#upcoming", icon: CalendarDays },
  { title: "All Movies", href: "#all-movies", icon: Sparkles },
];

export default async function MoviesPage({
  searchParams,
}: MoviesPageProps) {
  const params = await searchParams;
  const page = normalizePage(params?.page);

  const [
    popular,
    trending,
    nowPlaying,
    topRated,
    upcoming,
    action,
    horror,
    scienceFiction,
  ] = await Promise.all([
    tmdb(`/movie/popular?language=en-US&page=${page}`),
    tmdb("/trending/movie/week?language=en-US&page=1"),
    tmdb("/movie/now_playing?language=en-US&page=1"),
    tmdb("/movie/top_rated?language=en-US&page=1"),
    tmdb("/movie/upcoming?language=en-US&page=1"),
    tmdb("/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=28&page=1"),
    tmdb("/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=27&page=1"),
    tmdb("/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&with_genres=878&page=1"),
  ]);

  const heroCandidates = uniqueMovies([
    ...trending.results,
    ...nowPlaying.results,
    ...popular.results,
  ]).filter(
    (movie) =>
      movie.backdrop_path &&
      movie.overview &&
      (movie.vote_count || 0) > 50,
  );
  const hero = heroCandidates[0] ?? popular.results[0];
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");

  const rows = [
    { id: "trending", eyebrow: "Heat signal", title: "Trending Movies", items: toShelf(trending.results) },
    { id: "now-playing", eyebrow: "In cinemas now", title: "Now Playing", items: toShelf(nowPlaying.results) },
    { id: "top-rated", eyebrow: "Cinema essentials", title: "Top Rated Movies", items: toShelf(topRated.results) },
    { id: "action", eyebrow: "Adrenaline zone", title: "Action Movies", items: toShelf(action.results) },
    { id: "horror", eyebrow: "Nightmare vault", title: "Horror Movies", items: toShelf(horror.results) },
    { id: "sci-fi", eyebrow: "Future worlds", title: "Science Fiction", items: toShelf(scienceFiction.results) },
    { id: "upcoming", eyebrow: "Coming soon", title: "Upcoming Movies", items: toShelf(upcoming.results) },
  ];

  const pageUrl = page === 1 ? MOVIES_URL : `${MOVIES_URL}?page=${page}`;
  const popularMovies = uniqueMovies(popular.results);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name: page === 1 ? "Popular Movies on CINRYVAN" : `Popular Movies — Page ${page}`,
    description:
      "Browse popular, trending, top-rated and upcoming movies on CINRYVAN.",
    url: pageUrl,
    mainEntity: { "@id": `${pageUrl}#movies` },
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  const moviesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#movies`,
    name: `Popular movies — page ${page}`,
    numberOfItems: popularMovies.length,
    itemListElement: popularMovies.map((movie, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Movie",
        name: movie.title,
        url: `${SITE_URL}/movie/${movie.id}`,
        image:
          tmdbImage(movie.poster_path, "w500") ||
          tmdbImage(movie.backdrop_path, "w780") ||
          undefined,
        datePublished: movie.release_date || undefined,
        aggregateRating:
          typeof movie.vote_average === "number" &&
          movie.vote_average > 0 &&
          (movie.vote_count || 0) > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: movie.vote_average,
                ratingCount: movie.vote_count,
                bestRating: 10,
                worstRating: 0,
              }
            : undefined,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Movies", item: pageUrl },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-20 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(moviesJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/72 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(250,204,21,0.14),transparent_28%)]" />

        <div className="relative z-10 mx-auto flex min-h-[510px] w-full max-w-[1500px] items-end px-4 pb-16 sm:min-h-[580px] sm:px-6 lg:min-h-[650px] lg:px-10 lg:pb-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-yellow-400 pl-3">
              <Clapperboard className="h-4 w-4 text-yellow-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-yellow-400 sm:text-xs">
                CINRYVAN Movie Premiere
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] drop-shadow-2xl sm:text-6xl lg:text-8xl">
              {hero?.title || "Discover Cinema"}
            </h1>

            {hero?.overview && (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 line-clamp-3 sm:text-lg sm:leading-8">
                {hero.overview}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-black">
              {hero?.release_date && (
                <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 backdrop-blur-md">
                  {hero.release_date.slice(0, 4)}
                </span>
              )}
              {typeof hero?.vote_average === "number" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1.5 text-black">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                  {hero.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={hero ? `/movie/${hero.id}` : "/movie"}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                View details
              </Link>
              <a
                href="#trending"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Explore movies
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <section className="border-y border-white/10 bg-[#080c14]/95 p-3 backdrop-blur-xl sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {movieChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="group flex min-h-[88px] flex-col justify-between border border-white/10 bg-white/[0.025] p-3 transition hover:-translate-y-1 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  <Icon className="h-4 w-4 text-yellow-400 group-hover:text-black" />
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
                <div className="mb-5 flex items-end justify-between gap-5 border-l-2 border-yellow-400 pl-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
                      {row.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                      {row.title}
                    </h2>
                  </div>
                  <Link
                    href="/categories"
                    className="hidden items-center gap-2 text-xs font-black text-white/50 transition hover:text-yellow-400 sm:flex"
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

        <section id="all-movies" className="scroll-mt-28 pt-12 sm:pt-16">
          <div className="flex flex-col gap-3 border-l-2 border-yellow-400 pl-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
                Complete discovery
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                Popular Movies
              </h2>
            </div>
            <p className="text-sm font-bold text-white/40">
              Page {page} of {Math.min(TOTAL_VISIBLE_PAGES, popular.total_pages)}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {popular.results.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                  <CineImage
                    src={tmdbImage(movie.poster_path, "w500")}
                    alt={movie.title}
                    fallback="No image"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {typeof movie.vote_average === "number" && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-black text-yellow-400 backdrop-blur-md">
                      <Star className="h-3 w-3" fill="currentColor" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-black sm:text-base">
                    {movie.title}
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    {movie.release_date?.slice(0, 4) || "TBA"} · Movie
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={page} />
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
            Continue discovering
          </p>
          <div className="mt-5 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Movie Categories", "/categories"],
              ["TV Shows", "/tv"],
              ["Animation", "/animation"],
              ["Entertainment News", "/news"],
            ].map(([title, href]) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[120px] items-end justify-between bg-[#080b12] p-5 text-lg font-black transition hover:bg-yellow-400 hover:text-black"
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
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Movie pages">
      <Link
        href={`/movie?page=${Math.max(1, currentPage - 1)}#all-movies`}
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
            href={`/movie?page=${number}#all-movies`}
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
        href={`/movie?page=${Math.min(TOTAL_VISIBLE_PAGES, currentPage + 1)}#all-movies`}
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