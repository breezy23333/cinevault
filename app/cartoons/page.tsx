import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Crown,
  Laugh,
  Play,
  Shield,
  Sparkles,
  Star,
  Tv,
} from "lucide-react";
import ShelfRow from "@/components/ShelfRow";

export const revalidate = 3600;

const MAX_SHELF = 16;
const TOTAL_PAGES = 20;

export const metadata: Metadata = {
  title: "Best Cartoons & Animated Shows | CINRYVAN",
  description:
    "Discover Cartoon Network, Disney, Nickelodeon, Adult Swim, classic cartoons, family favourites, superhero animation and trending animated shows on CINRYVAN.",
  keywords: [
    "cartoons",
    "animated shows",
    "Cartoon Network",
    "Disney cartoons",
    "Nickelodeon",
    "Adult Swim",
    "classic cartoons",
    "family animation",
    "CINRYVAN cartoons",
  ],
  alternates: { canonical: "/cartoons" },
  openGraph: {
    title: "Best Cartoons & Animated Shows | CINRYVAN",
    description:
      "Explore Cartoon Network, Disney, Nickelodeon, classic cartoons and modern animated worlds.",
    url: "/cartoons",
    siteName: "CINRYVAN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CINRYVAN Cartoons",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Cartoons & Animated Shows | CINRYVAN",
    description:
      "Discover classic cartoons, family favourites and trending animation.",
    images: ["/og-image.png"],
  },
};

type TmdbItem = {
  id: number;
  name?: string;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  release_date?: string;
  vote_average?: number;
  original_language?: string;
  adult?: boolean;
};

type DiscoverOptions = {
  page?: number;
  genres?: string;
  networks?: string;
  language?: string;
  sortBy?: string;
  firstAirDateLte?: string;
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const blockedText =
  /hentai|overflow|secret mission|caressing my hibernating bear|souryo to majiwaru|immoral guild|showtime!|fire in his fingertips/i;

const isSafeCartoon = (item: TmdbItem) => {
  const text = `${item.name || item.title || ""} ${item.overview || ""}`;
  return item.adult !== true && !blockedText.test(text);
};

async function discoverCartoons({
  page = 1,
  genres = "16",
  networks,
  language = "en",
  sortBy = "popularity.desc",
  firstAirDateLte,
}: DiscoverOptions = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;
  const params = new URLSearchParams({
    include_adult: "false",
    include_null_first_air_dates: "false",
    language: "en-US",
    page: String(page),
    sort_by: sortBy,
    with_genres: genres,
  });

  if (apiKey) params.set("api_key", apiKey);
  if (networks) params.set("with_networks", networks);
  if (language) params.set("with_original_language", language);
  if (firstAirDateLte) params.set("first_air_date.lte", firstAirDateLte);

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?${params.toString()}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return { results: [] as TmdbItem[], total_pages: 1 };
    const data = await response.json();

    return {
      results: Array.isArray(data?.results)
        ? data.results.filter(isSafeCartoon)
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

const toShelfItem = (item: TmdbItem) => ({
  id: item.id,
  media: "tv" as const,
  title: item.name || item.title || "Untitled",
  poster:
    tmdbImage(item.poster_path, "w342") ||
    tmdbImage(item.backdrop_path, "w780"),
  year: String(item.first_air_date || item.release_date || "").slice(0, 4),
  rating:
    typeof item.vote_average === "number"
      ? Math.round(item.vote_average * 10) / 10
      : undefined,
  href: `/tv/${item.id}`,
});

const toShelf = (items: TmdbItem[]) =>
  uniqueItems(items)
    .filter((item) => item.poster_path || item.backdrop_path)
    .slice(0, MAX_SHELF)
    .map(toShelfItem);

const channelLinks = [
  { title: "Trending", href: "#trending", icon: Sparkles, color: "bg-yellow-400" },
  { title: "Cartoon Network", href: "#cartoon-network", icon: Tv, color: "bg-cyan-400" },
  { title: "Disney", href: "#disney", icon: Crown, color: "bg-blue-400" },
  { title: "Nickelodeon", href: "#nickelodeon", icon: Clapperboard, color: "bg-orange-400" },
  { title: "Adult Swim", href: "#adult-swim", icon: Tv, color: "bg-violet-400" },
  { title: "Superheroes", href: "#superheroes", icon: Shield, color: "bg-red-400" },
  { title: "Comedy", href: "#comedy", icon: Laugh, color: "bg-green-400" },
  { title: "Classics", href: "#classics", icon: Star, color: "bg-pink-400" },
];

export default async function CartoonsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params.page || 1);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), TOTAL_PAGES)
    : 1;

  const [
    trending,
    cartoonNetwork,
    disney,
    nickelodeon,
    adultSwim,
    superheroes,
    comedy,
    family,
    classics,
    discovery,
  ] = await Promise.all([
    discoverCartoons(),
    discoverCartoons({ networks: "56" }),
    discoverCartoons({ networks: "44|54|2739" }),
    discoverCartoons({ networks: "13" }),
    discoverCartoons({ networks: "80" }),
    discoverCartoons({ genres: "16,10759" }),
    discoverCartoons({ genres: "16,35" }),
    discoverCartoons({ genres: "16,10751", language: "" }),
    discoverCartoons({
      sortBy: "vote_average.desc",
      firstAirDateLte: "2005-12-31",
    }),
    discoverCartoons({ page: currentPage }),
  ]);

  const heroCandidates = uniqueItems([
    ...cartoonNetwork.results,
    ...disney.results,
    ...trending.results,
  ]).filter((item) => item.backdrop_path);
  const hero = heroCandidates[0] ?? trending.results[0];
  const heroTitle = hero?.name || hero?.title || "Cartoon Universe";
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");

  const rows = [
    { id: "trending", eyebrow: "Playing everywhere", title: "Trending Cartoons", items: toShelf(trending.results) },
    { id: "cartoon-network", eyebrow: "CN worlds", title: "Cartoon Network", items: toShelf(cartoonNetwork.results) },
    { id: "disney", eyebrow: "Magic kingdom", title: "Disney Animation", items: toShelf(disney.results) },
    { id: "nickelodeon", eyebrow: "Orange universe", title: "Nickelodeon Cartoons", items: toShelf(nickelodeon.results) },
    { id: "adult-swim", eyebrow: "Animation after dark", title: "Adult Swim", items: toShelf(adultSwim.results) },
    { id: "superheroes", eyebrow: "Animated heroes", title: "Superhero Cartoons", items: toShelf(superheroes.results) },
    { id: "comedy", eyebrow: "Laugh zone", title: "Animated Comedy", items: toShelf(comedy.results) },
    { id: "family", eyebrow: "Everyone invited", title: "Family Animation", items: toShelf(family.results) },
    { id: "classics", eyebrow: "Cartoon archive", title: "Classic Cartoons", items: toShelf(classics.results) },
  ];

  const discoveryItems = uniqueItems(discovery.results)
    .filter((item) => item.poster_path)
    .map(toShelfItem);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cinryvan.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cartoons",
        item: "https://cinryvan.vercel.app/cartoons",
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best Cartoons & Animated Shows",
    description:
      "Discover Cartoon Network, Disney, Nickelodeon, Adult Swim, family animation and classic cartoons.",
    url: "https://cinryvan.vercel.app/cartoons",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <section className="relative min-h-[570px] overflow-hidden pt-24 sm:min-h-[650px] md:pt-28 lg:min-h-[710px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.16),transparent_28%)]" />

        <div className="relative z-10 mx-auto flex min-h-[480px] w-full max-w-[1500px] items-end px-4 pb-14 sm:min-h-[550px] sm:px-6 lg:min-h-[610px] lg:px-10 lg:pb-20">
          <div className="max-w-3xl">
            <p className="border-l-2 border-cyan-400 pl-3 text-[10px] font-black uppercase tracking-[0.36em] text-cyan-300 sm:text-xs">
              CINRYVAN Cartoon Universe
            </p>
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
                href={hero ? `/tv/${hero.id}` : "/cartoons"}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-black text-[#031014] transition hover:bg-cyan-300"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                View cartoon
              </Link>
              <a
                href="#channels"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Explore channels
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <section id="channels" className="scroll-mt-28 border-y border-white/10 bg-[#080c14]/95 p-3 backdrop-blur-xl sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {channelLinks.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="group relative flex min-h-[92px] flex-col justify-between overflow-hidden border border-white/10 bg-white/[0.025] p-3 transition hover:-translate-y-1 hover:border-white/30"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 ${channel.color}`} />
                  <Icon className="h-4 w-4 text-white/60 transition group-hover:text-white" />
                  <span className="mt-5 text-xs font-black sm:text-sm">
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
                <div className="mb-5 flex items-end justify-between gap-5 border-l-2 border-cyan-400 pl-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">
                      {row.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                      {row.title}
                    </h2>
                  </div>
                  <a
                    href="#all-cartoons"
                    className="hidden items-center gap-2 text-xs font-black text-white/50 transition hover:text-cyan-300 sm:flex"
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

        <section id="all-cartoons" className="scroll-mt-28 pt-12 sm:pt-16">
          <div className="flex flex-col gap-3 border-l-2 border-cyan-400 pl-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">
                Complete discovery
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                More Animated Shows
              </h2>
            </div>
            <p className="text-sm font-bold text-white/40">
              Page {currentPage} of {Math.min(TOTAL_PAGES, discovery.total_pages)}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {discoveryItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-cyan-400/60"
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
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-black text-cyan-300 backdrop-blur-md">
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
                    {item.year || "TBA"} · Cartoon
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={currentPage} />
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">
            Continue exploring
          </p>
          <div className="mt-5 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Anime Universe", "/anime"],
              ["All Animation", "/animation"],
              ["Top Rated", "/top"],
              ["Animation News", "/news"],
            ].map(([title, href]) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[120px] items-end justify-between bg-[#080b12] p-5 text-lg font-black transition hover:bg-cyan-400 hover:text-black"
              >
                {title}
                <ArrowRight className="h-5 w-5 text-cyan-300 transition group-hover:translate-x-1 group-hover:text-black" />
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
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Cartoon pages">
      <Link
        href={`/cartoons?page=${Math.max(1, currentPage - 1)}#all-cartoons`}
        aria-disabled={currentPage === 1}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === 1
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-white/20 text-white hover:border-cyan-400 hover:text-cyan-300"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="hidden items-center gap-2 sm:flex">
        {visiblePages.map((page) => (
          <Link
            key={page}
            href={`/cartoons?page=${page}#all-cartoons`}
            className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-black transition ${
              currentPage === page
                ? "bg-cyan-400 text-black"
                : "border border-white/15 bg-[#0a0e17] text-white hover:border-cyan-400"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      <span className="grid h-11 min-w-11 place-items-center rounded-full bg-cyan-400 px-3 text-sm font-black text-black sm:hidden">
        {currentPage}
      </span>

      <Link
        href={`/cartoons?page=${Math.min(TOTAL_PAGES, currentPage + 1)}#all-cartoons`}
        aria-disabled={currentPage === TOTAL_PAGES}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === TOTAL_PAGES
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-cyan-400 bg-cyan-400 text-black hover:bg-cyan-300"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}