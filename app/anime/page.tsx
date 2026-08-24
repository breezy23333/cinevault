import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Play,
  Sparkles,
  Star,
  Swords,
} from "lucide-react";
import ShelfRow from "@/components/ShelfRow";

export const revalidate = 3600;

const MAX_SHELF = 16;
const TOTAL_PAGES = 20;
const SITE_URL = "https://cinryvan.vercel.app";
const ANIME_URL = `${SITE_URL}/anime`;

type AnimePageProps = {
  searchParams: Promise<{ page?: string }>;
};

function normalizePage(value?: string) {
  const requestedPage = Number(value || 1);
  return Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), TOTAL_PAGES)
    : 1;
}

export async function generateMetadata({
  searchParams,
}: AnimePageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = normalizePage(params.page);
  const canonical = page === 1 ? ANIME_URL : `${ANIME_URL}?page=${page}`;
  const pageSuffix = page > 1 ? ` — Page ${page}` : "";
  const pageTitle = `Best Anime Series, Movies & What to Watch${pageSuffix}`;
  const description =
    page === 1
      ? "Discover trending Japanese anime series and movies, action, fantasy, romance, comedy, supernatural stories and classic animation on CINRYVAN."
      : `Browse page ${page} of Japanese anime series with posters, ratings, release years and links to trailers, casts, seasons and watch options on CINRYVAN.`;

  return {
    title: pageTitle,
    description,
    category: "Anime",
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
          alt: "Anime series and movies on CINRYVAN",
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

type MediaType = "movie" | "tv";

type TmdbItem = {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  original_language?: string;
  adult?: boolean;
};

type DiscoverOptions = {
  media?: MediaType;
  page?: number;
  genres?: string;
  sortBy?: string;
  firstAirDateLte?: string;
  releaseDateLte?: string;
};

const blockedAnimeText =
  /hentai|overflow|secret mission|caressing my hibernating bear|souryo to majiwaru|immoral guild|showtime!|fire in his fingertips/i;

const isSafeAnime = (item: TmdbItem) => {
  const text = `${item.title || item.name || ""} ${item.overview || ""}`;
  return item.adult !== true && !blockedAnimeText.test(text);
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function discoverAnime({
  media = "tv",
  page = 1,
  genres = "16",
  sortBy = "popularity.desc",
  firstAirDateLte,
  releaseDateLte,
}: DiscoverOptions = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;
  const params = new URLSearchParams({
    include_adult: "false",
    language: "en-US",
    page: String(page),
    sort_by: sortBy,
    with_genres: genres,
    with_original_language: "ja",
  });

  if (apiKey) params.set("api_key", apiKey);
  if (media === "tv") params.set("include_null_first_air_dates", "false");
  if (firstAirDateLte) params.set("first_air_date.lte", firstAirDateLte);
  if (releaseDateLte) params.set("release_date.lte", releaseDateLte);

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/${media}?${params.toString()}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return { results: [] as TmdbItem[], total_pages: 1 };
    const data = await response.json();

    return {
      results: Array.isArray(data?.results)
        ? data.results.filter(isSafeAnime)
        : [],
      total_pages: Number(data?.total_pages || 1),
    };
  } catch {
    return { results: [] as TmdbItem[], total_pages: 1 };
  }
}

const uniqueItems = (items: TmdbItem[]) => {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const toShelfItem = (item: TmdbItem, media: MediaType = "tv") => ({
  id: item.id,
  media,
  title: item.title || item.name || "Untitled",
  poster:
    tmdbImage(item.poster_path, "w342") ||
    tmdbImage(item.backdrop_path, "w780"),
  year: String(item.release_date || item.first_air_date || "").slice(0, 4),
  rating:
    typeof item.vote_average === "number"
      ? Math.round(item.vote_average * 10) / 10
      : undefined,
  voteCount:
    typeof item.vote_count === "number" ? item.vote_count : undefined,
  href: `/${media}/${item.id}`,
});

const toShelf = (items: TmdbItem[], media: MediaType = "tv") =>
  uniqueItems(items)
    .filter((item) => item.poster_path || item.backdrop_path)
    .slice(0, MAX_SHELF)
    .map((item) => toShelfItem(item, media));

const animeCategories = [
  { title: "Trending", href: "#trending", icon: Flame },
  { title: "Action", href: "#action", icon: Swords },
  { title: "Fantasy", href: "#fantasy", icon: Sparkles },
  { title: "Romance", href: "#romance", icon: Star },
  { title: "Supernatural", href: "#supernatural", icon: Sparkles },
  { title: "Comedy", href: "#comedy", icon: Sparkles },
  { title: "Movies", href: "#movies", icon: Play },
  { title: "Classics", href: "#classics", icon: Star },
];

export default async function AnimePage({
  searchParams,
}: AnimePageProps) {
  const params = await searchParams;
  const currentPage = normalizePage(params.page);

  const [
    trending,
    action,
    fantasy,
    romance,
    supernatural,
    comedy,
    animeMovies,
    classics,
    discovery,
  ] = await Promise.all([
    discoverAnime(),
    discoverAnime({ genres: "16,10759" }),
    discoverAnime({ genres: "16,10765" }),
    discoverAnime({ genres: "16,18" }),
    discoverAnime({ genres: "16,9648" }),
    discoverAnime({ genres: "16,35" }),
    discoverAnime({ media: "movie", genres: "16" }),
    discoverAnime({
      sortBy: "vote_average.desc",
      firstAirDateLte: "2008-12-31",
    }),
    discoverAnime({ page: currentPage }),
  ]);

  const heroCandidates = uniqueItems([
    ...action.results,
    ...fantasy.results,
    ...trending.results,
  ]).filter((item) => item.backdrop_path);
  const hero = heroCandidates[0] ?? trending.results[0];
  const heroHref = hero ? `/tv/${hero.id}` : "/anime";
  const heroTitle = hero?.name || hero?.title || "Anime Universe";
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");

  const rows = [
    { id: "trending", eyebrow: "Now rising", title: "Trending Japanese Anime", items: toShelf(trending.results) },
    { id: "action", eyebrow: "Battle zone", title: "Action Anime", items: toShelf(action.results) },
    { id: "fantasy", eyebrow: "Other realms", title: "Fantasy & Adventure", items: toShelf(fantasy.results) },
    { id: "romance", eyebrow: "Stories of the heart", title: "Romance & Drama", items: toShelf(romance.results) },
    { id: "supernatural", eyebrow: "Dark signal", title: "Mystery & Supernatural", items: toShelf(supernatural.results) },
    { id: "comedy", eyebrow: "Light worlds", title: "Comedy Anime", items: toShelf(comedy.results) },
    { id: "movies", eyebrow: "Big-screen animation", title: "Anime Movies", items: toShelf(animeMovies.results, "movie") },
    { id: "classics", eyebrow: "Anime archive", title: "Classic Anime", items: toShelf(classics.results) },
  ];

  const discoveryShelf = uniqueItems(discovery.results)
    .filter((item) => item.poster_path)
    .map((item) => toShelfItem(item));

  const pageUrl =
    currentPage === 1 ? ANIME_URL : `${ANIME_URL}?page=${currentPage}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        name: "Anime",
        item: pageUrl,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name:
      currentPage === 1
        ? "Best Anime Series & Movies"
        : `Japanese Anime Series — Page ${currentPage}`,
    description:
      "Discover Japanese anime series, anime movies, action, fantasy, romance, comedy and classic animation.",
    url: pageUrl,
    mainEntity: { "@id": `${pageUrl}#anime` },
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  const animeJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#anime`,
    name: `Japanese anime series — page ${currentPage}`,
    numberOfItems: discoveryShelf.length,
    itemListElement: discoveryShelf.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TVSeries",
        name: item.title,
        url: `${SITE_URL}${item.href}`,
        image: item.poster || undefined,
        aggregateRating:
          typeof item.rating === "number" &&
          item.rating > 0 &&
          typeof item.voteCount === "number" &&
          item.voteCount > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: item.rating,
                ratingCount: item.voteCount,
                bestRating: 10,
                worstRating: 0,
              }
            : undefined,
      },
    })),
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
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(animeJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative min-h-[580px] overflow-hidden pt-24 sm:min-h-[650px] md:pt-28 lg:min-h-[720px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/30" />

        <div className="relative z-10 mx-auto flex min-h-[490px] w-full max-w-[1500px] items-end px-4 pb-14 sm:min-h-[550px] sm:px-6 lg:min-h-[620px] lg:px-10 lg:pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-yellow-400 pl-3">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-yellow-400 sm:text-xs">
                CINRYVAN Anime Universe
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] drop-shadow-2xl sm:text-6xl lg:text-8xl">
              {heroTitle}
            </h1>

            {hero?.overview && (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 line-clamp-3 sm:text-lg sm:leading-8">
                {hero.overview}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={heroHref}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                View anime
              </Link>
              <a
                href="#trending"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Explore collection
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <section className="border-y border-white/10 bg-[#080c14]/95 p-3 backdrop-blur-xl sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {animeCategories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.title}
                  href={category.href}
                  className="group flex min-h-[86px] flex-col justify-between border border-white/10 bg-white/[0.025] p-3 transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
                >
                  <Icon className="h-4 w-4 text-yellow-400 group-hover:text-black" />
                  <span className="mt-4 text-xs font-black sm:text-sm">
                    {category.title}
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
                  <a
                    href="#all-anime"
                    className="hidden items-center gap-2 text-xs font-black text-white/55 transition hover:text-yellow-400 sm:flex"
                  >
                    Browse more
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <ShelfRow items={row.items} />
              </section>
            ) : null,
          )}
        </div>

        <section id="all-anime" className="scroll-mt-28 pt-12 sm:pt-16">
          <div className="flex flex-col gap-3 border-l-2 border-yellow-400 pl-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
                Complete discovery
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                More Japanese Anime
              </h2>
            </div>
            <p className="text-sm font-bold text-white/40">
              Page {currentPage} of {Math.min(TOTAL_PAGES, discovery.total_pages)}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {discoveryShelf.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-yellow-400/55"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                  {item.poster && (
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 17vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  {typeof item.rating === "number" && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-black text-yellow-400 backdrop-blur-md">
                      <Star className="h-3 w-3" fill="currentColor" />
                      {item.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-black sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    {item.year || "TBA"} · Anime
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={currentPage} />
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
            Continue exploring
          </p>
          <div className="mt-5 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Cartoon Universe", "/cartoons"],
              ["Trending Now", "/trending"],
              ["Top Rated", "/top"],
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
  const start = Math.max(1, Math.min(currentPage - 2, TOTAL_PAGES - 4));
  const visiblePages = Array.from({ length: 5 }, (_, index) => start + index);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Anime pages">
      <Link
        href={`/anime?page=${Math.max(1, currentPage - 1)}#all-anime`}
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
        {visiblePages.map((page) => (
          <Link
            key={page}
            href={`/anime?page=${page}#all-anime`}
            className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-black transition ${
              currentPage === page
                ? "bg-yellow-400 text-black"
                : "border border-white/15 bg-[#0a0e17] text-white hover:border-yellow-400"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      <span className="grid h-11 min-w-11 place-items-center rounded-full bg-yellow-400 px-3 text-sm font-black text-black sm:hidden">
        {currentPage}
      </span>

      <Link
        href={`/anime?page=${Math.min(TOTAL_PAGES, currentPage + 1)}#all-anime`}
        aria-disabled={currentPage === TOTAL_PAGES}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === TOTAL_PAGES
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-300"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}