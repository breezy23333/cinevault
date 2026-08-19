import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const TMDB_BASE = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const SITE_URL = "https://cinryvan.vercel.app";
const FIRST_SUPPORTED_DECADE = 1900;
const CURRENT_DECADE = Math.floor(new Date().getFullYear() / 10) * 10;

type PageProps = {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

type Movie = {
  id: number;
  title?: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
  overview?: string;
};

type DiscoverResponse = {
  page?: number;
  results?: Movie[];
  total_pages?: number;
  total_results?: number;
};

const ERA_THEMES: Record<number, { accent: string; glow: string; label: string; statement: string }> = {
  1900: { accent: "#d6d3d1", glow: "rgba(168,162,158,.22)", label: "The earliest moving images", statement: "Cinema learns how to dream." },
  1910: { accent: "#d6d3d1", glow: "rgba(168,162,158,.22)", label: "Silent innovation", statement: "A new visual language emerges." },
  1920: { accent: "#e7c58b", glow: "rgba(202,138,4,.24)", label: "The roaring screen", statement: "Silent cinema reaches its height." },
  1930: { accent: "#f5d0a1", glow: "rgba(217,119,6,.23)", label: "Sound changes everything", statement: "The movies find their voice." },
  1940: { accent: "#cbd5e1", glow: "rgba(100,116,139,.25)", label: "Shadows and resilience", statement: "Cinema confronts a changing world." },
  1950: { accent: "#fb7185", glow: "rgba(244,63,94,.23)", label: "Widescreen spectacle", statement: "Bigger screens. Bolder stars." },
  1960: { accent: "#fbbf24", glow: "rgba(245,158,11,.25)", label: "A cinematic revolution", statement: "The old rules begin to break." },
  1970: { accent: "#f97316", glow: "rgba(234,88,12,.26)", label: "The new Hollywood", statement: "Filmmakers take control." },
  1980: { accent: "#f472b6", glow: "rgba(236,72,153,.25)", label: "Blockbusters and neon", statement: "Movies become global events." },
  1990: { accent: "#a78bfa", glow: "rgba(139,92,246,.26)", label: "A decade without limits", statement: "Independent voices meet blockbuster scale." },
  2000: { accent: "#38bdf8", glow: "rgba(14,165,233,.26)", label: "The digital transition", statement: "Cinema enters a new millennium." },
  2010: { accent: "#34d399", glow: "rgba(16,185,129,.24)", label: "Universes expand", statement: "Franchises, streaming and new voices collide." },
  2020: { accent: "#facc15", glow: "rgba(250,204,21,.25)", label: "Cinema now", statement: "Every screen becomes a destination." },
};

function authHeaders() {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  return bearer ? { Authorization: `Bearer ${bearer}` } : undefined;
}

function parseDecade(value: string) {
  if (!/^\d{4}$/.test(value)) return null;
  const decade = Number(value);

  if (
    !Number.isSafeInteger(decade) ||
    decade % 10 !== 0 ||
    decade < FIRST_SUPPORTED_DECADE ||
    decade > CURRENT_DECADE
  ) {
    return null;
  }

  return decade;
}

function parsePage(value?: string | string[]) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue || "1");

  if (!Number.isSafeInteger(page) || page < 1 || page > 500) return 1;
  return page;
}

function getEraTheme(decade: number) {
  return (
    ERA_THEMES[decade] ?? {
      accent: "#facc15",
      glow: "rgba(250,204,21,.24)",
      label: "Cinema through time",
      statement: "Every decade leaves its mark.",
    }
  );
}

function eraHref(decade: number, page = 1) {
  return page > 1 ? `/era/${decade}?page=${page}` : `/era/${decade}`;
}

export async function generateMetadata({
  params,
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { year } = await params;
  const startYear = parseDecade(year);

  if (!startYear) {
    return {
      title: "Cinema Era Not Found | CINRYVAN",
      robots: { index: false, follow: false },
    };
  }

  const endYear = startYear + 9;

  return {
    title: `${startYear}s Movies | CINRYVAN`,
    description: `Explore popular movies released between ${startYear} and ${endYear} on CINRYVAN.`,
    alternates: { canonical: `/era/${startYear}` },
    openGraph: {
      title: `${startYear}s Movies | CINRYVAN`,
      description: `Discover popular movies from the ${startYear}s era on CINRYVAN.`,
      url: `/era/${startYear}`,
      siteName: "CINRYVAN",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${startYear}s Movies | CINRYVAN`,
      description: `Explore popular movies released from ${startYear} to ${endYear}.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function EraPage({ params, searchParams }: PageProps) {
  const [{ year }, query] = await Promise.all([params, searchParams]);
  const startYear = parseDecade(year);

  if (!startYear) notFound();

  const currentPage = parsePage(query.page);
  const endYear = startYear + 9;
  const theme = getEraTheme(startYear);
  const themeStyle = {
    "--era-accent": theme.accent,
    "--era-glow": theme.glow,
  } as CSSProperties;

  const requestUrl = new URL(`${TMDB_BASE}/discover/movie`);
  requestUrl.searchParams.set("include_adult", "false");
  requestUrl.searchParams.set("include_video", "false");
  requestUrl.searchParams.set("language", "en-US");
  requestUrl.searchParams.set("page", String(currentPage));
  requestUrl.searchParams.set("sort_by", "popularity.desc");
  requestUrl.searchParams.set("primary_release_date.gte", `${startYear}-01-01`);
  requestUrl.searchParams.set("primary_release_date.lte", `${endYear}-12-31`);
  requestUrl.searchParams.set("vote_count.gte", "20");

  let data: DiscoverResponse = {};

  try {
    const response = await fetch(requestUrl, {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      data = (await response.json()) as DiscoverResponse;
    }
  } catch {
    data = {};
  }

  const movies = Array.isArray(data.results)
    ? data.results.filter((movie) => movie?.id && movie.title)
    : [];
  const totalPages = Math.min(Math.max(data.total_pages || 1, 1), 500);
  const totalResults = Math.max(data.total_results || movies.length, movies.length);
  const heroMovies = movies.filter((movie) => movie.poster_path).slice(0, 4);
  const decades = Array.from(
    { length: (CURRENT_DECADE - FIRST_SUPPORTED_DECADE) / 10 + 1 },
    (_, index) => CURRENT_DECADE - index * 10,
  );

  const eraJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${startYear}s Movies`,
    description: `Explore popular movies released between ${startYear} and ${endYear}.`,
    url: `${SITE_URL}/era/${startYear}`,
    isPartOf: { "@type": "WebSite", name: "CINRYVAN", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: movies.length,
      itemListElement: movies.slice(0, 20).map((movie, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/movie/${movie.id}`,
        name: movie.title,
      })),
    },
  };

  return (
    <main
      style={themeStyle}
      className="min-h-screen overflow-hidden bg-[#080b12] pb-24 pt-28 text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eraJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative min-h-[570px] overflow-hidden border border-white/10 bg-[#0d131d]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,var(--era-glow),transparent_26%),linear-gradient(110deg,#111925_5%,#0c111a_58%,#080b12_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080b12] to-transparent" />

          <div className="relative z-10 grid min-h-[570px] items-center gap-12 p-7 sm:p-10 lg:grid-cols-[.95fr_1.05fr] lg:p-14">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--era-accent)]">
                Cinema Through Time
              </p>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-white/35">
                {theme.label}
              </p>
              <h1 className="mt-2 text-7xl font-black leading-none tracking-[-0.065em] sm:text-8xl lg:text-[104px]">
                {startYear}<span className="text-[var(--era-accent)]">s</span>
              </h1>
              <h2 className="mt-5 text-2xl font-black sm:text-3xl">{theme.statement}</h2>
              <p className="mt-4 max-w-xl leading-7 text-white/55">
                Explore popular films released from {startYear} to {endYear},
                and rediscover how this decade shaped cinema.
              </p>
              <a
                href="#era-collection"
                className="mt-7 inline-flex bg-[var(--era-accent)] px-6 py-3.5 text-sm font-black text-[#080b12] transition hover:brightness-110"
              >
                Explore the decade ↓
              </a>
            </div>

            <div className="relative hidden h-[410px] lg:block" aria-label="Featured posters from this era">
              {heroMovies.length > 0 ? (
                heroMovies.map((movie, index) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group absolute top-1/2 aspect-[2/3] w-[190px] -translate-y-1/2 overflow-hidden border border-white/15 bg-[#151c27] shadow-[0_30px_70px_rgba(0,0,0,.55)] transition duration-500 hover:z-20 hover:-translate-y-[53%]"
                    style={{
                      left: `${index * 22}%`,
                      transform: `translateY(-50%) rotate(${(index - 1.5) * 3.5}deg)`,
                      zIndex: index + 1,
                    }}
                  >
                    <img
                      src={`${POSTER_BASE}${movie.poster_path}`}
                      alt={movie.title || `${startYear}s movie`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <p className="absolute inset-x-3 bottom-3 line-clamp-2 text-sm font-black">
                      {movie.title}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="absolute inset-0 grid place-items-center border border-white/10 bg-white/[0.025] text-center text-sm text-white/35">
                  <span>Featured posters will appear when movie data is available.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <nav
          aria-label="Browse cinema by decade"
          className="-mt-px flex gap-1 overflow-x-auto border border-white/10 bg-[#101722] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {decades.map((decade) => (
            <Link
              key={decade}
              href={eraHref(decade)}
              aria-current={decade === startYear ? "page" : undefined}
              className={`shrink-0 px-4 py-3 text-xs font-black transition ${
                decade === startYear
                  ? "bg-[var(--era-accent)] text-[#080b12]"
                  : "text-white/45 hover:bg-white/5 hover:text-white"
              }`}
            >
              {decade}s
            </Link>
          ))}
        </nav>

        <section id="era-collection" className="scroll-mt-28 py-16">
          <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--era-accent)]">
                The collection
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Popular {startYear}s movies</h2>
            </div>
            <p className="text-sm text-white/35">
              {totalResults.toLocaleString()} titles · Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
            </p>
          </div>

          {movies.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
              {movies.map((movie) => {
                const releaseYear = movie.release_date?.slice(0, 4) || "Unknown";
                const rating =
                  typeof movie.vote_average === "number" && movie.vote_average > 0
                    ? movie.vote_average.toFixed(1)
                    : null;

                return (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group relative min-w-0 overflow-hidden border border-white/10 bg-[#101722] transition duration-300 hover:-translate-y-1 hover:border-[var(--era-accent)]"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                      {movie.poster_path ? (
                        <img
                          src={`${POSTER_BASE}${movie.poster_path}`}
                          alt={movie.title || "Movie poster"}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full place-items-center p-4 text-center text-xs text-white/30">
                          Poster unavailable
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-transparent opacity-60" />
                      {rating && (
                        <span className="absolute right-2 top-2 bg-[#080b12]/90 px-2 py-1 text-[10px] font-black text-[var(--era-accent)] backdrop-blur">
                          ★ {rating}
                        </span>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="line-clamp-2 text-sm font-black sm:text-base">{movie.title}</h3>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/35">
                        <span>{releaseYear}</span>
                        <span className="transition group-hover:text-[var(--era-accent)]">View →</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[var(--era-accent)] transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
              <h2 className="text-2xl font-black">Movies are unavailable right now</h2>
              <p className="mt-3 text-white/50">Please try this era again shortly.</p>
            </div>
          )}

          {movies.length > 0 && totalPages > 1 && (
            <nav aria-label={`${startYear}s movie pagination`} className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={eraHref(startYear, currentPage - 1)}
                  className="border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black transition hover:border-[var(--era-accent)] hover:text-[var(--era-accent)]"
                >
                  ← Previous
                </Link>
              ) : (
                <span className="cursor-not-allowed border border-white/5 bg-white/[0.02] px-5 py-3 text-sm font-black text-white/20">
                  ← Previous
                </span>
              )}

              <span className="bg-[var(--era-accent)] px-5 py-3 text-sm font-black text-[#080b12]">
                Page {currentPage}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={eraHref(startYear, currentPage + 1)}
                  className="border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black transition hover:border-[var(--era-accent)] hover:text-[var(--era-accent)]"
                >
                  Next →
                </Link>
              ) : (
                <span className="cursor-not-allowed border border-white/5 bg-white/[0.02] px-5 py-3 text-sm font-black text-white/20">
                  Next →
                </span>
              )}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}