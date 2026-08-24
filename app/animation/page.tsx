import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  Film,
  Heart,
  Laugh,
  Layers3,
  Play,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Tv,
} from "lucide-react";
import ShelfRow from "@/components/ShelfRow";

export const revalidate = 3600;

const MAX_SHELF = 16;
const SITE_URL = "https://cinryvan.vercel.app";
const ANIMATION_URL = `${SITE_URL}/animation`;

export const metadata: Metadata = {
  title: "Animated Movies, TV Shows, Anime & Cartoons",
  description:
    "Discover popular animated movies and TV shows, anime, cartoons, family adventures, fantasy worlds, superhero animation, classics and upcoming releases.",
  category: "Animation",
  alternates: { canonical: ANIMATION_URL },
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
    title: "Animated Movies, TV Shows, Anime & Cartoons | CINRYVAN",
    description:
      "Discover animated movies, shows, anime, cartoons, family adventures and fantasy worlds on CINRYVAN.",
    url: ANIMATION_URL,
    siteName: "CINRYVAN",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Animated movies, shows, anime and cartoons on CINRYVAN",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Animated Movies, TV Shows, Anime & Cartoons | CINRYVAN",
    description:
      "Explore animated movies, TV shows, anime, cartoons, classics and upcoming animation.",
    images: ["/og-image.png"],
  },
};

type MediaType = "movie" | "tv";

type TmdbItem = {
  id: number;
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
  genres?: string;
  language?: string;
  sortBy?: string;
  networks?: string;
  dateGte?: string;
  dateLte?: string;
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const blockedAnimationText =
  /hentai|overflow|secret mission|caressing my hibernating bear|souryo to majiwaru|immoral guild|showtime!|fire in his fingertips/i;

const isSafeAnimation = (item: TmdbItem) => {
  const text = `${item.title || item.name || ""} ${item.overview || ""}`;
  return item.adult !== true && !blockedAnimationText.test(text);
};

async function discoverAnimation({
  media = "movie",
  genres = "16",
  language,
  sortBy = "popularity.desc",
  networks,
  dateGte,
  dateLte,
}: DiscoverOptions = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;
  const params = new URLSearchParams({
    include_adult: "false",
    language: "en-US",
    page: "1",
    sort_by: sortBy,
    with_genres: genres,
  });

  if (apiKey) params.set("api_key", apiKey);
  if (language) params.set("with_original_language", language);
  if (networks && media === "tv") params.set("with_networks", networks);

  if (media === "movie") {
    if (dateGte) params.set("primary_release_date.gte", dateGte);
    if (dateLte) params.set("primary_release_date.lte", dateLte);
  } else {
    params.set("include_null_first_air_dates", "false");
    if (dateGte) params.set("first_air_date.gte", dateGte);
    if (dateLte) params.set("first_air_date.lte", dateLte);
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/${media}?${params.toString()}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return [] as TmdbItem[];
    const data = await response.json();
    return Array.isArray(data?.results)
      ? data.results.filter(isSafeAnimation)
      : [];
  } catch {
    return [] as TmdbItem[];
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

const toShelfItem = (item: TmdbItem, media: MediaType) => ({
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

const toShelf = (items: TmdbItem[], media: MediaType) =>
  uniqueItems(items)
    .filter((item) => item.poster_path || item.backdrop_path)
    .slice(0, MAX_SHELF)
    .map((item) => toShelfItem(item, media));

export default async function AnimationPage() {
  const today = new Date().toISOString().slice(0, 10);
  const nextYear = `${new Date().getUTCFullYear() + 1}-12-31`;

  const [
    animatedMovies,
    animatedSeries,
    anime,
    cartoons,
    familyMovies,
    fantasyMovies,
    comedySeries,
    superheroSeries,
    adultAnimation,
    classics,
    upcomingMovies,
  ] = await Promise.all([
    discoverAnimation({ media: "movie" }),
    discoverAnimation({ media: "tv" }),
    discoverAnimation({ media: "tv", language: "ja" }),
    discoverAnimation({ media: "tv", language: "en" }),
    discoverAnimation({ media: "movie", genres: "16,10751" }),
    discoverAnimation({ media: "movie", genres: "16,14" }),
    discoverAnimation({ media: "tv", genres: "16,35", language: "en" }),
    discoverAnimation({ media: "tv", genres: "16,10759", language: "en" }),
    discoverAnimation({ media: "tv", networks: "80", language: "en" }),
    discoverAnimation({
      media: "movie",
      sortBy: "vote_average.desc",
      dateLte: "2005-12-31",
    }),
    discoverAnimation({
      media: "movie",
      sortBy: "primary_release_date.asc",
      dateGte: today,
      dateLte: nextYear,
    }),
  ]);

  const heroCandidates = uniqueItems([
    ...animatedMovies,
    ...familyMovies,
    ...fantasyMovies,
  ]).filter((item) => item.backdrop_path && (item.vote_count || 0) > 50);
  const hero = heroCandidates[0] ?? animatedMovies[0];
  const heroTitle = hero?.title || hero?.name || "Animation Universe";
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");

  const gatewayCards = [
    {
      title: "Anime Universe",
      eyebrow: "Japanese animation",
      description:
        "Action, fantasy, romance, supernatural stories and legendary anime worlds.",
      href: "/anime",
      icon: Sparkles,
      image: tmdbImage(
        anime.find((item: TmdbItem) => item.backdrop_path)?.backdrop_path,
      ),
      color: "from-pink-500/45",
    },
    {
      title: "Cartoon Universe",
      eyebrow: "Animated channels",
      description:
        "Cartoon Network, Disney, Nickelodeon, Adult Swim and timeless classics.",
      href: "/cartoons",
      icon: Tv,
      image: tmdbImage(
        cartoons.find((item: TmdbItem) => item.backdrop_path)?.backdrop_path,
      ),
      color: "from-cyan-400/45",
    },
    {
      title: "Animated Movies",
      eyebrow: "Big-screen worlds",
      description:
        "Family adventures, fantasy epics, comedy and unforgettable animated films.",
      href: "/search?genre=16",
      icon: Film,
      image: tmdbImage(
        animatedMovies.find((item: TmdbItem) => item.backdrop_path)
          ?.backdrop_path,
      ),
      color: "from-yellow-400/45",
    },
  ];

  const rows = [
    { id: "movies", eyebrow: "Popular now", title: "Trending Animated Movies", items: toShelf(animatedMovies, "movie") },
    { id: "series", eyebrow: "On every screen", title: "Animated Series", items: toShelf(animatedSeries, "tv") },
    { id: "family", eyebrow: "All ages", title: "Family Adventures", items: toShelf(familyMovies, "movie") },
    { id: "fantasy", eyebrow: "Impossible realms", title: "Fantasy Animation", items: toShelf(fantasyMovies, "movie") },
    { id: "comedy", eyebrow: "Laugh zone", title: "Animated Comedy", items: toShelf(comedySeries, "tv") },
    { id: "heroes", eyebrow: "Hero worlds", title: "Superhero Animation", items: toShelf(superheroSeries, "tv") },
    { id: "adult", eyebrow: "Animation after dark", title: "Adult Animation", items: toShelf(adultAnimation, "tv") },
    { id: "classics", eyebrow: "Animation archive", title: "Animated Classics", items: toShelf(classics, "movie") },
    { id: "upcoming", eyebrow: "Coming soon", title: "Upcoming Animation", items: toShelf(upcomingMovies, "movie") },
  ];

  const featuredItems = Array.from(
    new Map(
      rows
        .flatMap((row) => row.items)
        .map((item) => [item.href, item]),
    ).values(),
  ).slice(0, 30);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${ANIMATION_URL}#breadcrumb`,
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
        name: "Animation",
        item: ANIMATION_URL,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${ANIMATION_URL}#collection`,
    name: "Animated Movies, TV Shows, Anime & Cartoons",
    description:
      "Explore animated movies, series, anime, cartoons, family adventures, classics and upcoming animation.",
    url: ANIMATION_URL,
    breadcrumb: { "@id": `${ANIMATION_URL}#breadcrumb` },
    mainEntity: { "@id": `${ANIMATION_URL}#featured-animation` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const animationListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${ANIMATION_URL}#featured-animation`,
    name: "Featured animated movies and television shows",
    numberOfItems: featuredItems.length,
    itemListElement: featuredItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": item.media === "movie" ? "Movie" : "TVSeries",
        name: item.title,
        url: `${SITE_URL}${item.href}`,
        image: item.poster || undefined,
        dateCreated: item.year || undefined,
        aggregateRating:
          typeof item.rating === "number" &&
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
          __html: JSON.stringify(animationListJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative min-h-[590px] overflow-hidden pt-24 md:pt-28 lg:min-h-[720px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/74 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(168,85,247,0.18),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[500px] w-full max-w-[1500px] items-end px-4 pb-14 sm:min-h-[560px] sm:px-6 lg:min-h-[620px] lg:px-10 lg:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-violet-400 pl-3">
              <Layers3 className="h-4 w-4 text-violet-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.36em] text-violet-300 sm:text-xs">
                CINRYVAN Animation Universe
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] drop-shadow-2xl sm:text-6xl lg:text-8xl">
              {heroTitle}
            </h1>

            {hero?.overview ? (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 line-clamp-3 sm:text-lg sm:leading-8">
                {hero.overview}
              </p>
            ) : (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 sm:text-lg sm:leading-8">
                Enter hand-drawn worlds, computer-generated adventures, anime legends and cartoon universes.
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={hero ? `/movie/${hero.id}` : "/search?genre=16"}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-violet-300"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                View featured
              </Link>
              <a
                href="#worlds"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-violet-400 hover:text-violet-300"
              >
                Choose a world
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <section id="worlds" className="scroll-mt-28">
          <div className="mb-6 border-l-2 border-violet-400 pl-4">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-violet-300">
              Three animation worlds
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-4xl">
              Where do you want to begin?
            </h2>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {gatewayCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative min-h-[260px] overflow-hidden border border-white/10 bg-[#090d16] p-6 transition hover:-translate-y-1 hover:border-violet-400/60 sm:min-h-[310px] sm:p-8"
                >
                  {card.image && (
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                    />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.color} via-[#05070d]/65 to-transparent`} />

                  <div className="relative z-10 flex h-full min-h-[210px] flex-col">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-white" />
                      <ArrowRight className="h-5 w-5 text-white/50 transition group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                    <div className="mt-auto">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/65">
                        {card.eyebrow}
                      </p>
                      <h3 className="mt-2 text-3xl font-black sm:text-4xl">
                        {card.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-2 gap-2 border-y border-white/10 py-4 sm:grid-cols-4 lg:grid-cols-8">
          {[
            ["Movies", "#movies", Film],
            ["Series", "#series", Tv],
            ["Family", "#family", Heart],
            ["Fantasy", "#fantasy", Sparkles],
            ["Comedy", "#comedy", Laugh],
            ["Heroes", "#heroes", Shield],
            ["Classics", "#classics", Star],
            ["Upcoming", "#upcoming", Rocket],
          ].map(([title, href, Icon]) => {
            const IconComponent = Icon as typeof Film;
            return (
              <a
                key={title as string}
                href={href as string}
                className="group flex min-h-[82px] flex-col justify-between border border-white/10 bg-white/[0.025] p-3 transition hover:border-violet-400 hover:bg-violet-400 hover:text-black"
              >
                <IconComponent className="h-4 w-4 text-violet-300 group-hover:text-black" />
                <span className="mt-4 text-xs font-black sm:text-sm">{title as string}</span>
              </a>
            );
          })}
        </section>

        <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-14">
          {rows.map((row) =>
            row.items.length ? (
              <section
                key={row.id}
                id={row.id}
                className="scroll-mt-28 border-b border-white/[0.08] pb-9"
              >
                <div className="mb-5 flex items-end justify-between gap-5 border-l-2 border-violet-400 pl-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-violet-300">
                      {row.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                      {row.title}
                    </h2>
                  </div>
                  <Link
                    href="/search?genre=16"
                    className="hidden items-center gap-2 text-xs font-black text-white/50 transition hover:text-violet-300 sm:flex"
                  >
                    Browse all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <ShelfRow items={row.items} />
              </section>
            ) : null,
          )}
        </div>

        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-violet-300">
            Keep discovering
          </p>
          <div className="mt-5 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Anime Universe", "/anime"],
              ["Cartoon Universe", "/cartoons"],
              ["Upcoming Releases", "/upcoming/animation"],
              ["Animation News", "/news"],
            ].map(([title, href]) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[120px] items-end justify-between bg-[#080b12] p-5 text-lg font-black transition hover:bg-violet-400 hover:text-black"
              >
                {title}
                <ArrowRight className="h-5 w-5 text-violet-300 transition group-hover:translate-x-1 group-hover:text-black" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}