//page.tsx
import {
  getPopularMovies,
  getTrendingAll,
  getMovieGenres,
  getTvByGenre,
} from "@/lib/fetchers";
import { getEntertainmentNews } from "@/lib/news";
import HeroCarousel from "@/components/HeroCarousel";   // ✅ ADD THIS BACK
import type { NewsItem } from "@/components/NewsStrip";
import CategoriesTray from "@/components/CategoriesTray";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

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
const MAX_SHELF = 18;
const MAX_NEWS = 12;

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
  .slice(0, MAX_HEROES);

  const animationHeroes = uniqueById(
    norm(animationTv.results.map((x: any) => ({ ...x, media_type: "tv" })))
  )
    .filter((x) => x.backdrop)
    .slice(0, MAX_HEROES);


  // shelves
  const popularShelf = popularRaw.slice(0, MAX_SHELF).map((x: any) => {
    const m = toShelfMedia(x);
    return { ...m, href: `/${m.media}/${m.id}` };
  });

  const trendingMoviesShelf = trendingRaw
  .filter((x: any) => x.media_type !== "tv")
  .slice(0, MAX_SHELF)
  .map((x: any) => {
    const m = toShelfMedia(x);
    return { ...m, href: `/movie/${m.id}` };
  });

const trendingTvShelf = trendingRaw
  .filter((x: any) => x.media_type === "tv")
  .slice(0, MAX_SHELF)
  .map((x: any) => {
    const m = toShelfMedia(x);
    return { ...m, href: `/tv/${m.id}` };
  });

 
const dramaShelf = dramaTv.results.slice(0, MAX_SHELF).map((x: any) => {
  const m = toShelfMedia({ ...x, media_type: "tv" });
  return { ...m, href: `/tv/${m.id}` };
});

const fantasyShelf = fantasyTv.results.slice(0, MAX_SHELF).map((x: any) => {
  const m = toShelfMedia({ ...x, media_type: "tv" });
  return { ...m, href: `/tv/${m.id}` };
});

const crimeShelf = crimeTv.results.slice(0, MAX_SHELF).map((x: any) => {
  const m = toShelfMedia({ ...x, media_type: "tv" });
  return { ...m, href: `/tv/${m.id}` };
});  

const animeShelf = animationTv.results
  .filter((x: any) => x.original_language === "ja")
  .slice(0, MAX_SHELF)
  .map((x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    return { ...m, href: `/tv/${m.id}` };
  });

const cartoonShelf = animationTv.results
  .filter((x: any) => x.original_language !== "ja")
  .slice(0, MAX_SHELF)
  .map((x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    return { ...m, href: `/tv/${m.id}` };
  });


  return (
  <main className="relative min-h-screen overflow-hidden bg-[#05070d] pb-16 text-white">
    {/* cosmic background */}
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,184,0,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(80,120,255,0.18),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.14),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,13,0.25),#05070d_85%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,white_0px,white_1px,transparent_1px,transparent_90px)]" />
    </div>

    <div className="relative z-10">
      <HeroCarousel items={heroes} />

      <Surface>
        <div className="space-y-8">
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

          <Panel eyebrow="Popular galaxy" title="More movies">
            <ShelfRow items={popularShelf} />
          </Panel>

          <Panel eyebrow="Heat signal" title="Trending movies">
            <ShelfRow items={trendingMoviesShelf} />
          </Panel>

          <FeatureBreak
            title="Series Dimension"
            text="A second cinematic layer for TV worlds, drama, fantasy, and crime stories."
          />

          <HeroCarousel items={seriesHeroes} />

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

          <FeatureBreak
            title="Animation Universe"
            text="Anime and cartoons separated into their own cinematic stream."
          />

          <HeroCarousel items={animationHeroes} />

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

          <Panel eyebrow="Industry radar" title="Top news">
            <NewsStrip items={newsItems.slice(0, MAX_NEWS)} />
          </Panel>
        </div>
      </Surface>
    </div>
  </main>
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
    <section className="relative z-10 w-[100svw] left-1/2 -translate-x-1/2 -mt-10 md:-mt-14">
      <div className="relative rounded-t-[36px] border-t border-white/10 bg-[#070a12]/90 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />

        <div className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-6 md:px-8 md:pt-8">
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

