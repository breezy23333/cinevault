import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  Play,
  Radio,
  Rocket,
  Sparkles,
  Star,
  Tv,
} from "lucide-react";
import CineImage from "@/components/CineImage";
import {
  getUpcomingMovies,
  getUpcomingTvSeries,
  getUpcomingAnimation,
} from "@/lib/fetchers";

export const revalidate = 300;

const TOTAL_VISIBLE_PAGES = 20;

export const metadata: Metadata = {
  title: "Upcoming Movies, TV Shows & Animation | CINRYVAN",
  description:
    "Track upcoming movies, television series, anime, cartoons and animated releases before they arrive on CINRYVAN.",
  keywords: [
    "upcoming movies",
    "upcoming TV shows",
    "coming soon movies",
    "upcoming animation",
    "future releases",
    "CINRYVAN upcoming",
  ],
  alternates: { canonical: "/upcoming" },
  openGraph: {
    title: "Upcoming Movies, TV Shows & Animation | CINRYVAN",
    description: "Track the next cinematic and television releases.",
    url: "/upcoming",
    siteName: "CINRYVAN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Upcoming releases on CINRYVAN",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Movies, TV Shows & Animation | CINRYVAN",
    description: "See which entertainment worlds are arriving next.",
    images: ["/og-image.png"],
  },
};

type MediaType = "movie" | "tv";

type UpcomingItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const itemTitle = (item: UpcomingItem) =>
  item.title || item.name || "Untitled";

const itemDate = (item: UpcomingItem) =>
  item.release_date || item.first_air_date || "";

const formatDate = (date: string) => {
  if (!date) return "Release date TBA";

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "Release date TBA";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
};

const daysUntil = (date: string) => {
  if (!date) return null;
  const release = new Date(`${date}T00:00:00Z`).getTime();
  if (Number.isNaN(release)) return null;

  const today = new Date();
  const startToday = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );

  return Math.max(0, Math.ceil((release - startToday) / 86_400_000));
};

const uniqueItems = (items: UpcomingItem[]) => {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export default async function UpcomingPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params?.page || 1);
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.trunc(requestedPage), 1), TOTAL_VISIBLE_PAGES)
    : 1;

  const [movieData, tvData, animationData] = await Promise.all([
    getUpcomingMovies(page),
    getUpcomingTvSeries(page),
    getUpcomingAnimation(page),
  ]);

  const movies: UpcomingItem[] = uniqueItems(
    Array.isArray(movieData) ? movieData : [],
  );
  const tv: UpcomingItem[] = uniqueItems(Array.isArray(tvData) ? tvData : []);
  const animation: UpcomingItem[] = uniqueItems(
    Array.isArray(animationData) ? animationData : [],
  );

  const allReleases = uniqueItems([...movies, ...tv, ...animation]).sort(
    (a, b) => itemDate(a).localeCompare(itemDate(b)),
  );
  const hero =
    allReleases.find((item) => item.backdrop_path && item.overview) ??
    allReleases[0];
  const heroType: MediaType = [...movies, ...animation].some(
    (item) => item.id === hero?.id,
  )
    ? "movie"
    : "tv";
  const heroImage = tmdbImage(hero?.backdrop_path || hero?.poster_path, "original");
  const featured = allReleases
    .filter((item) => item.id !== hero?.id && (item.backdrop_path || item.poster_path))
    .slice(0, 3);

  const upcomingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Upcoming Movies, TV Series and Animation",
    description:
      "Discover upcoming movies, TV series, anime, cartoons and animated releases before they arrive.",
    url: "https://cinryvan.vercel.app/upcoming",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(upcomingJsonLd) }}
      />

      <section className="relative min-h-[570px] overflow-hidden pt-24 md:pt-28 lg:min-h-[700px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/76 to-[#05070d]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(249,115,22,0.2),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[480px] w-full max-w-[1500px] items-end px-4 pb-14 sm:min-h-[540px] sm:px-6 lg:min-h-[600px] lg:px-10 lg:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border-l-2 border-orange-400 pl-3">
              <Radio className="h-4 w-4 animate-pulse text-orange-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.36em] text-orange-400 sm:text-xs">
                CINRYVAN Future Radar · Page {page}
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.92] sm:text-6xl lg:text-8xl">
              {hero ? itemTitle(hero) : "What Arrives Next"}
            </h1>

            {hero?.overview && (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 line-clamp-3 sm:text-lg sm:leading-8">
                {hero.overview}
              </p>
            )}

            {hero && (
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-black">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-3 py-1.5 text-black">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(itemDate(hero))}
                </span>
                {daysUntil(itemDate(hero)) !== null && (
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                    {daysUntil(itemDate(hero))} days away
                  </span>
                )}
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={hero ? `/${heroType}/${hero.id}` : "/upcoming"}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-orange-300"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                View release
              </Link>
              <a
                href="#release-lanes"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:border-orange-400 hover:text-orange-300"
              >
                Open future radar
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-5 w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        {featured.length > 0 && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-5 border-l-2 border-orange-400 pl-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-400">
                  Next on the radar
                </p>
                <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                  Featured Upcoming Releases
                </h2>
              </div>
              <Rocket className="hidden h-7 w-7 text-orange-400 sm:block" />
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {featured.map((item) => {
                const type: MediaType = [...movies, ...animation].some(
                  (release) => release.id === item.id,
                )
                  ? "movie"
                  : "tv";
                const countdown = daysUntil(itemDate(item));

                return (
                  <Link
                    key={`${type}-${item.id}`}
                    href={`/${type}/${item.id}`}
                    className="group relative min-h-[250px] overflow-hidden border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 hover:border-orange-400/60 sm:min-h-[310px]"
                  >
                    {(item.backdrop_path || item.poster_path) && (
                      <Image
                        src={tmdbImage(item.backdrop_path || item.poster_path, "w780")!}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                        {countdown === null ? "Date TBA" : `${countdown} days away`}
                      </p>
                      <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                        {itemTitle(item)}
                      </h3>
                      <p className="mt-2 text-xs font-bold text-white/50">
                        {formatDate(itemDate(item))}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section
          id="release-lanes"
          className="mt-12 scroll-mt-28 border-t border-white/10 pt-10 sm:mt-16 sm:pt-14"
        >
          <div className="mb-8 border-l-2 border-orange-400 pl-4">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-400">
              Release channels
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">
              Everything Coming Soon
            </h2>
          </div>

          <div className="space-y-12 sm:space-y-16">
            <ReleaseLane
              id="movies"
              eyebrow="Cinema countdown"
              title="Upcoming Movies"
              items={movies}
              type="movie"
              accent="yellow"
              icon={Film}
            />
            <ReleaseLane
              id="television"
              eyebrow="Series radar"
              title="Upcoming TV Series"
              items={tv}
              type="tv"
              accent="blue"
              icon={Tv}
            />
            <ReleaseLane
              id="animation"
              eyebrow="Animated futures"
              title="Upcoming Animation"
              items={animation}
              type="movie"
              accent="violet"
              icon={Sparkles}
            />
          </div>
        </section>

        <Pagination currentPage={page} />

        <section className="mt-16 border-t border-white/10 pt-10">
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["All Movies", "/movie", Film],
              ["All TV Shows", "/tv", Tv],
              ["Animation", "/animation", Sparkles],
              ["Entertainment News", "/news", Clapperboard],
            ].map(([title, href, Icon]) => {
              const IconComponent = Icon as typeof Film;
              return (
                <Link
                  key={title as string}
                  href={href as string}
                  className="group flex min-h-[120px] items-end justify-between bg-[#080b12] p-5 text-lg font-black transition hover:bg-orange-400 hover:text-black"
                >
                  {title as string}
                  <IconComponent className="h-5 w-5 text-orange-400 group-hover:text-black" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function ReleaseLane({
  id,
  eyebrow,
  title,
  items,
  type,
  accent,
  icon: Icon,
}: {
  id: string;
  eyebrow: string;
  title: string;
  items: UpcomingItem[];
  type: MediaType;
  accent: "yellow" | "blue" | "violet";
  icon: typeof Film;
}) {
  const colors = {
    yellow: {
      border: "border-yellow-400",
      text: "text-yellow-400",
      hover: "hover:border-yellow-400/65",
    },
    blue: {
      border: "border-blue-400",
      text: "text-blue-300",
      hover: "hover:border-blue-400/65",
    },
    violet: {
      border: "border-violet-400",
      text: "text-violet-300",
      hover: "hover:border-violet-400/65",
    },
  }[accent];

  const visibleItems = items
    .filter((item) => item.poster_path)
    .slice(0, 12);

  if (!visibleItems.length) return null;

  return (
    <section id={id} className="scroll-mt-28">
      <div className={`mb-5 flex items-end justify-between gap-5 border-l-2 pl-4 ${colors.border}`}>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.32em] ${colors.text}`}>
            {eyebrow}
          </p>
          <h3 className="mt-2 text-2xl font-black sm:text-4xl">{title}</h3>
        </div>
        <Icon className={`hidden h-6 w-6 sm:block ${colors.text}`} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-6">
        {visibleItems.map((item) => (
          <Link
            key={`${type}-${item.id}`}
            href={`/${type}/${item.id}`}
            className={`group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17] transition hover:-translate-y-1 ${colors.hover}`}
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
              <CineImage
                src={tmdbImage(item.poster_path, "w500")}
                alt={itemTitle(item)}
                fallback="No poster"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/75 px-2 py-1.5 text-center text-[9px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
                {formatDate(itemDate(item))}
              </span>
            </div>
            <div className="p-3">
              <h4 className="line-clamp-2 text-sm font-black">
                {itemTitle(item)}
              </h4>
              <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-white/40">
                <span>{type === "movie" ? "Movie" : "TV Series"}</span>
                {typeof item.vote_average === "number" && (
                  <span className={`inline-flex items-center gap-1 ${colors.text}`}>
                    <Star className="h-3 w-3" fill="currentColor" />
                    {item.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Pagination({ currentPage }: { currentPage: number }) {
  const start = Math.max(
    1,
    Math.min(currentPage - 2, TOTAL_VISIBLE_PAGES - 4),
  );
  const pages = Array.from({ length: 5 }, (_, index) => start + index);

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Upcoming pages">
      <Link
        href={`/upcoming?page=${Math.max(1, currentPage - 1)}`}
        aria-disabled={currentPage === 1}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === 1
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-white/20 text-white hover:border-orange-400 hover:text-orange-300"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((number) => (
          <Link
            key={number}
            href={`/upcoming?page=${number}`}
            className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-black transition ${
              currentPage === number
                ? "bg-orange-400 text-black"
                : "border border-white/15 bg-[#0a0e17] text-white hover:border-orange-400"
            }`}
          >
            {number}
          </Link>
        ))}
      </div>

      <span className="grid h-11 min-w-11 place-items-center rounded-full bg-orange-400 px-3 text-sm font-black text-black sm:hidden">
        {currentPage}
      </span>

      <Link
        href={`/upcoming?page=${Math.min(TOTAL_VISIBLE_PAGES, currentPage + 1)}`}
        aria-disabled={currentPage === TOTAL_VISIBLE_PAGES}
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          currentPage === TOTAL_VISIBLE_PAGES
            ? "pointer-events-none border-white/10 text-white/20"
            : "border-orange-400 bg-orange-400 text-black hover:bg-orange-300"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}