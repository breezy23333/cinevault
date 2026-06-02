//page.tsx
import {
  getPopularMovies,
  getTrendingAll,
  getUpcomingMovies,
  getUpcomingTvSeries,
  getUpcomingAnimation,
  getMovieGenres,
  getTvByGenre,
} from "@/lib/fetchers";
import { getEntertainmentNews } from "@/lib/news";
import HeroCarousel from "@/components/HeroCarousel";   // ✅ ADD THIS BACK
import ExpandableHeroCarousel from "@/components/ExpandableHeroCarousel";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import TvHeroCarousel from "@/components/TvHeroCarousel";
import type { NewsItem } from "@/components/NewsStrip";
import CategoriesTray from "@/components/CategoriesTray";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import FranchiseUniverse from "@/components/FranchiseUniverse";
import Link from "next/link";
import MovieEras from "@/components/MovieEras";

// runtime/perf
export const runtime = "nodejs";
export const revalidate = 120;

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
};

// images: shelves small, hero larger
const tmdbImg = (
  p?: string | null,
  size: "w342" | "w500" | "w780" | "w1280" | "original" = "w780"
) => (p ? `https://image.tmdb.org/t/p/${size}${p}` : null);

// helpers
const withTimeout = <T,>(p: Promise<T>, ms = 8000, label = "fetch") =>
  Promise.race<T>([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`${label} timeout`)), ms)
    ) as any,
  ]);

const uniqueById = <T extends { id: number }>(arr: T[]) => {
  const seen = new Set<number>();
  return arr.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
};

// TMDB -> compact shelf card
type ShelfItem = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster: string | null;
  year: string;
  rating?: number;
  trailer?: string | null;
};

const toShelfMedia = (x: any): ShelfItem => ({
  id: Number(x.id),
  media: x.media_type === "tv" ? "tv" : "movie",
  title: x.title || x.name || "Untitled",
  poster:
    x.poster ??
    (x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : null),
  year: String(x.release_date || x.first_air_date || "").slice(0, 4),
  rating:
  typeof x.vote_average === "number"
    ? Math.round(x.vote_average * 10) / 10
    : undefined,

    
});

function norm(list: unknown[]): Norm[] {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .filter((x: any) => x && typeof x.id === "number")
    .map((x: any) => ({
      id: x.id,
      media: x.media_type === "tv" ? "tv" : "movie",
      title: x.title || x.name || "Untitled",
      overview: x.overview || "",
      poster: tmdbImg(x.poster_path, "w500"),
      backdrop: tmdbImg(x.backdrop_path, "w1280") || tmdbImg(x.poster_path, "w780"),
      year: String(x.release_date || x.first_air_date || "").slice(0, 4),
      rating:
        typeof x.vote_average === "number"
          ? Math.round(x.vote_average * 10) / 10
          : undefined,
          
    }));
}

// temporary TMDB -> news card
const toNews = (x: any): NewsItem => ({
  title: x.title || x.name || "Untitled",
  url: `/${x.media_type === "tv" ? "tv" : "movie"}/${x.id}`,
  source: "TMDB",
  image: x.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${x.backdrop_path}`
    : x.poster_path
    ? `https://image.tmdb.org/t/p/w780${x.poster_path}`
    : null,
});

const MAX_HEROES = 6;
const MAX_SHELF = 14;
const MAX_NEWS = 8;


// ✅ dynamic imports (no duplicate identifiers)
const ShelfRow = dynamic(() => import("@/components/ShelfRow"), {
  ssr: true,
  loading: () => <RowSkeleton />,
});
const NewsStrip = dynamic(() => import("@/components/NewsStrip"), {
  ssr: true,
  loading: () => <RowSkeleton />,
});

export default async function Home() {
  const [popularRes, trendingRes, genreRes, newsRes] = await Promise.allSettled([
    withTimeout(getPopularMovies(1), 8000, "popular"),
    withTimeout(getTrendingAll(1), 8000, "trending"),
    withTimeout(getMovieGenres(), 8000, "genres"),
    withTimeout(getEntertainmentNews(), 8000, "news"),
  ]);

  const popularRaw: any[] =
    popularRes.status === "fulfilled" && Array.isArray((popularRes.value as any)?.results)
      ? (popularRes.value as any).results
      : [];

  const trendingRaw: any[] =
    trendingRes.status === "fulfilled" && Array.isArray((trendingRes.value as any)?.results)
      ? (trendingRes.value as any).results
      : [];

  const genres: any[] =
    genreRes.status === "fulfilled" && Array.isArray(genreRes.value as any)
      ? (genreRes.value as any)
      : [];

  const newsItems =
  newsRes.status === "fulfilled" && Array.isArray(newsRes.value)
    ? newsRes.value
    : [];  
    
    const upcomingMovies = await getUpcomingMovies();
    const upcomingTv = await getUpcomingTvSeries();
    const upcomingAnimation = await getUpcomingAnimation();

  // ✅ TV categories
  const dramaTv = await getTvByGenre(18);
  const fantasyTv = await getTvByGenre(10765);
  const crimeTv = await getTvByGenre(80);
  const animationTv = await getTvByGenre(16);

  // heroes (dedupe + ensure backdrop)
  const heroes = uniqueById([...norm(trendingRaw), ...norm(popularRaw)])
    .filter((x) => x.backdrop)
    .slice(0, MAX_HEROES);

  const seriesHeroes = uniqueById(norm(trendingRaw))
  .filter((x) => x.media === "tv" && x.backdrop)
  .slice(0, 10);

  const animationHeroes = uniqueById(
    norm(animationTv.results.map((x: any) => ({ ...x, media_type: "tv" })))
  )
    .filter((x) => x.backdrop)
    .slice(0, MAX_HEROES);


  // shelves
  const popularShelf = await Promise.all(
  popularRaw.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia(x);
    
    return {
      ...m,
      
      href: `/${m.media}/${m.id}`,
    };
  })
);

  const trendingMoviesShelf = await Promise.all(
  trendingRaw
    .filter((x: any) => x.media_type !== "tv")
    .slice(0, MAX_SHELF)
    .map(async (x: any) => {
      const m = toShelfMedia(x);
      
      return {
        ...m,
        
        href: `/movie/${m.id}`,
      };
    })
);

const trendingTvShelf = await Promise.all(
  trendingRaw
    .filter((x: any) => x.media_type === "tv")
    .slice(0, MAX_SHELF)
    .map(async (x: any) => {
      const m = toShelfMedia(x);
      

      return {
        ...m,
        
        href: `/tv/${m.id}`,
      };
    })
);

const dramaShelf = await Promise.all(
  dramaTv.results.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    

    return {
      ...m,
      
      href: `/tv/${m.id}`,
    };
  })
);

const fantasyShelf = await Promise.all(
  fantasyTv.results.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    

    return {
      ...m,
      
      href: `/tv/${m.id}`,
    };
  })
);

const crimeShelf = await Promise.all(
  crimeTv.results.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    

    return {
      ...m,
      
      href: `/tv/${m.id}`,
    };
  })
);

const animeShelf = await Promise.all(
  animationTv.results
    .filter((x: any) => x.original_language === "ja")
    .slice(0, MAX_SHELF)
    .map(async (x: any) => {
      const m = toShelfMedia({ ...x, media_type: "tv" });
      

      return {
        ...m,
        
        href: `/tv/${m.id}`,
      };
    })
);

const cartoonShelf = await Promise.all(
  animationTv.results
    .filter((x: any) => x.original_language !== "ja")
    .slice(0, MAX_SHELF)
    .map(async (x: any) => {
      const m = toShelfMedia({ ...x, media_type: "tv" });
      

      return {
        ...m,
        
        href: `/tv/${m.id}`,
      };
    })
);

 return (
  <div className="relative overflow-x-hidden bg-[#05070d] text-white">
    {/* cosmic background */}
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,190,0,0.16),transparent_35%),radial-gradient(circle_at_75%_30%,rgba(100,80,255,0.2),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,13,0.25),#05070d_85%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,white_0px,white_1px,transparent_1px,transparent_90px)]" />
    </div>

    <div className="relative z-10">
      <HeroCarousel items={heroes} />

      <Surface>
        <div className="space-y-8">
          <ContinueWatchingRow />
          <section className="rounded-[28px] border border-yellow-400/20 bg-white/[0.035] p-4 shadow-[0_0_80px_rgba(255,184,0,0.08)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-yellow-400">
                  CineVault System
                </p>
                <h1 className="mt-2 text-2xl font-black md:text-4xl">
                  Explore worlds beyond cinema
                </h1>
              </div>
              <div className="hidden rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/60 md:block">
                Live TMDB universe
              </div>
            </div>

            {Array.isArray(genres) && genres.length > 0 && (
              <CategoriesTray genres={genres} />
            )}
          </section>

          <MovieEras />

          <FranchiseUniverse />

          <Panel eyebrow="Popular galaxy" title="More movies">
            <ShelfRow items={popularShelf} />
          </Panel>

          <Panel eyebrow="Heat signal" title="Trending movies">
            <ShelfRow items={trendingMoviesShelf} />
          </Panel>


          <Panel
              eyebrow="Coming Soon"
              title={
                <div className="flex items-center justify-between">
                  <span>Upcoming Movies</span>
                  <a href="/upcoming" className="text-sm text-yellow-400 hover:underline">
                    View all →
                  </a>
                </div>
              }
            >
            <ShelfRow
              items={upcomingMovies
                .slice(0, MAX_SHELF)
                .map((movie: any) => ({
                  ...toShelfMedia(movie),
                  href: `/movie/${movie.id}`,
                }))}
            />
          </Panel>

          <FeatureBreak
            title="Series Dimension"
            text="A second cinematic layer for TV worlds, drama, fantasy, and crime stories."
          />

          <TvHeroCarousel items={seriesHeroes} />

          <Panel eyebrow="Broadcast pulse" title="Trending TV shows">
            <ShelfRow items={trendingTvShelf} />
          </Panel>

          <Panel eyebrow="Emotional worlds" title="Drama TV shows">
            <ShelfRow items={dramaShelf} />
          </Panel>

          <Panel eyebrow="Magic zone" title="Fantasy TV shows">
            <ShelfRow items={fantasyShelf} />
          </Panel>

          <Panel eyebrow="Dark files" title="Crime TV shows">
            <ShelfRow items={crimeShelf} />
          </Panel>

          <Panel
              eyebrow="Coming Soon"
              title={
                <div className="flex items-center justify-between">
                  <span>Upcoming Movies</span>
                  <a href="/upcoming" className="text-sm text-yellow-400 hover:underline">
                    View all →
                  </a>
                </div>
              }
            >
            <ShelfRow
              items={upcomingTv
                .slice(0, MAX_SHELF)
                .map((show: any) => ({
                  ...toShelfMedia({ ...show, media_type: "tv" }),
                  href: `/tv/${show.id}`,
                }))}
            />
          </Panel>

          <FeatureBreak
            title="Animation Universe"
            text="Anime and cartoons separated into their own cinematic stream."
          />

          <ExpandableHeroCarousel
              eyebrow="Animation Universe"
              title="Animated Worlds"
              items={animationHeroes}
            />

          <Panel
            eyebrow="Japan signal"
            title={
              <div className="flex items-center justify-between">
                <span>Anime</span>
                <a href="/anime" className="text-sm text-yellow-400 hover:underline">
                  View all →
                </a>
              </div>
            }
          >
            <ShelfRow items={animeShelf} />
          </Panel>

          <Panel
            eyebrow="Animated worlds"
            title={
              <div className="flex items-center justify-between">
                <span>Cartoons</span>
                <a href="/cartoons" className="text-sm text-yellow-400 hover:underline">
                  View all →
                </a>
              </div>
            }
          >
            <ShelfRow items={cartoonShelf} />
          </Panel>

          <Panel
            eyebrow="Coming Soon"
            title={
              <div className="flex items-center justify-between">
                <span>Upcoming Movies</span>
                <a href="/upcoming" className="text-sm text-yellow-400 hover:underline">
                  View all →
                </a>
              </div>
            }
          >
            <ShelfRow
              items={upcomingAnimation
                .slice(0, MAX_SHELF)
                .map((movie: any) => ({
                  ...toShelfMedia(movie),
                  href: `/movie/${movie.id}`,
                }))}
            />
          </Panel>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
              News Channels
            </p>

            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Explore News Categories
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link
                href="/news/entertainment"
                className="rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
              >
                <h3 className="text-xl font-black">Entertainment</h3>
                <p className="mt-2 text-sm opacity-70">
                  Movies, celebrities, streaming and culture.
                </p>
              </Link>

              <Link
                href="/news/gaming"
                className="rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-cyan-400/60 hover:bg-cyan-400 hover:text-black"
              >
                <h3 className="text-xl font-black">Gaming</h3>
                <p className="mt-2 text-sm opacity-70">
                  Games, consoles, esports and industry updates.
                </p>
              </Link>

              <Link
                href="/news/sports"
                className="rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-green-400/60 hover:bg-green-400 hover:text-black"
              >
                <h3 className="text-xl font-black">Sports</h3>
                <p className="mt-2 text-sm opacity-70">
                  Live headlines, major games and sports stories.
                </p>
              </Link>
            </div>
          </section>

          <Panel eyebrow="Industry radar" title="Top news">
            <NewsStrip items={newsItems.slice(0, MAX_NEWS)} />
          </Panel>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <h2 className="text-3xl font-black text-white">
              Explore the CineVault Universe
            </h2>

            <p className="mt-3 max-w-3xl text-white/70">
              Discover trending movies, TV shows, anime, cartoons,
              cinematic universes, trailers, and streaming discoveries.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/trending"
                className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-yellow-400/50 hover:bg-white/10"
              >
                <h3 className="text-lg font-bold">Trending</h3>
                <p className="mt-2 text-sm text-white/60">
                  Explore the hottest movies and shows right now.
                </p>
              </Link>

              <Link
                href="/top"
                className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-yellow-400/50 hover:bg-white/10"
              >
                <h3 className="text-lg font-bold">Top Rated</h3>
                <p className="mt-2 text-sm text-white/60">
                  Discover the highest-rated cinematic experiences.
                </p>
              </Link>

              <Link
                href="/anime"
                className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-pink-400/50 hover:bg-white/10"
              >
                <h3 className="text-lg font-bold">Anime</h3>
                <p className="mt-2 text-sm text-white/60">
                  Enter the world of anime adventures and stories.
                </p>
              </Link>

              <Link
                href="/cartoons"
                className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-cyan-400/50 hover:bg-white/10"
              >
                <h3 className="text-lg font-bold">Cartoons</h3>
                <p className="mt-2 text-sm text-white/60">
                  Explore animated worlds for every generation.
                </p>
              </Link>
            </div>
          </section>

        </div>
      </Surface>
    </div>
  </div>
);
}

/* ---------- UI helpers ---------- */

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:border-yellow-400/30 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,184,0,0.13),transparent_35%)] opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative px-4 py-4 md:px-6">
        {eyebrow && (
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400/80">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-black md:text-2xl">{title}</h2>
      </div>

      <div className="relative px-2 pb-5 md:px-4">{children}</div>
    </section>
  );
}

function Surface({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 w-full -mt-10 md:-mt-14">
      <div className="relative rounded-t-[36px] border-t border-white/10 bg-[#070a12]/90 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />

        <div className="mx-auto w-full max-w-[1500px] px-4 pb-0 pt-6 md:px-8 md:pt-8">
          {children}
        </div>
      </div>
    </section>
  );
}

function FeatureBreak({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-yellow-400/10 via-white/[0.04] to-blue-500/10 p-6 backdrop-blur-xl md:p-8">
      <div className="absolute right-8 top-1/2 hidden h-28 w-28 -translate-y-1/2 rounded-full border border-yellow-400/20 shadow-[0_0_60px_rgba(255,184,0,0.25)] md:block" />
      <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
        CineVault Layer
      </p>
      <h2 className="mt-2 text-2xl font-black md:text-4xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/60 md:text-base">{text}</p>
    </section>
  );
}

function RowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[270px] w-[180px] rounded-2xl bg-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

