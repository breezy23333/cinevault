import {
  getPopularMovies,
  getTrendingAll,
  getMovieGenres,
} from "@/lib/fetchers";
import HeroCarousel from "@/components/HeroCarousel";   // ✅ ADD THIS BACK
import type { NewsItem } from "@/components/NewsStrip";
import CategoriesTray from "@/components/CategoriesTray";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// runtime/perf
export const runtime =
  process.env.NODE_ENV === "development" ? "nodejs" : "edge";
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
const toShelfMedia = (x: any) => ({
  id: x.id,
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
  const [popularRes, trendingRes, genreRes] = await Promise.allSettled([
    withTimeout(getPopularMovies(1), 8000, "popular"),
    withTimeout(getTrendingAll(1), 8000, "trending"),
    withTimeout(getMovieGenres(), 8000, "genres"),
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

  // heroes (dedupe + ensure backdrop)
  const heroes = uniqueById([...norm(trendingRaw), ...norm(popularRaw)])
    .filter((x) => x.backdrop)
    .slice(0, MAX_HEROES);

  // shelves
  const popularShelf = popularRaw.slice(0, MAX_SHELF).map((x: any) => {
    const m = toShelfMedia(x);
    return { ...m, href: `/${m.media}/${m.id}` };
  });

  const trendingShelf = trendingRaw.slice(0, MAX_SHELF).map((x: any) => {
    const m = toShelfMedia(x);
    return { ...m, href: `/${m.media}/${m.id}` };
  });

  return (
    <main className="pb-10">
      {/* ❗ HeroCarousel doesn’t take `genres` now */}
      <HeroCarousel items={heroes} />

      <Surface>
        <div className="space-y-6">
          {Array.isArray(genres) && genres.length > 0 && (
            <div className="pt-1">
              <CategoriesTray genres={genres} />
            </div>
          )}

          <Panel title="More movies">
            <ShelfRow items={popularShelf} />
          </Panel>

          <Panel title="Trending movies">
            <ShelfRow items={trendingShelf} />
          </Panel>

          <Panel title="Top news">
            <NewsStrip items={trendingRaw.slice(0, MAX_NEWS).map(toNews)} />
          </Panel>
        </div>
      </Surface>
    </main>
  );
}

/* ---------- UI helpers ---------- */

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-[#0c111b] ring-1 ring-white/10 overflow-hidden">
      <div className="px-4 md:px-6 py-3 md:py-4">
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
      </div>
      <div className="px-2 md:px-4 pb-4">{children}</div>
    </section>
  );
}

function Surface({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 w-[100svw] left-1/2 -translate-x-1/2 -mt-8 md:-mt-10">
      <div className="relative bg-[#0e131f] rounded-t-[28px] ring-1 ring-white/10 before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-white/10">
        <div className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] px-4 md:px-8 pt-6 pb-8 space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
}

// simple skeleton
function RowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-[270px] w-[180px] rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}
