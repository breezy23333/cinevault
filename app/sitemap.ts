import type { MetadataRoute } from "next";
import { GAME_CATEGORY_SLUGS } from "@/lib/games";

export const revalidate = 86400;

const BASE_URL = "https://cinryvan.vercel.app";
const TMDB_BASE = "https://api.themoviedb.org/3";
const RAWG_BASE = "https://api.rawg.io/api";
const CATALOGUE_PAGES = 5;

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type StaticPage = {
  path: string;
  changeFrequency: Frequency;
  priority: number;
};

function authHeaders() {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  return bearer ? { Authorization: `Bearer ${bearer}` } : undefined;
}

function withKey(url: string) {
  const key =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY;

  return key ? `${url}${url.includes("?") ? "&" : "?"}api_key=${key}` : url;
}

async function fetchIds(path: string): Promise<number[]> {
  try {
    const response = await fetch(withKey(`${TMDB_BASE}${path}`), {
      headers: authHeaders(),
      next: { revalidate: 86400 },
    });

    if (!response.ok) return [];
    const data = await response.json();

    return (Array.isArray(data?.results) ? data.results : [])
      .map((item: { id?: number }) => item.id)
      .filter(
        (id: number | undefined): id is number =>
          typeof id === "number" && Number.isSafeInteger(id) && id > 0,
      );
  } catch {
    return [];
  }
}

async function fetchIdsAcrossPages(path: string, pages = CATALOGUE_PAGES) {
  const separator = path.includes("?") ? "&" : "?";
  const results = await Promise.allSettled(
    Array.from({ length: pages }, (_, index) =>
      fetchIds(`${path}${separator}page=${index + 1}`),
    ),
  );

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

async function fetchGameIds(pages = CATALOGUE_PAGES): Promise<number[]> {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) return [];

  const results = await Promise.allSettled(
    Array.from({ length: pages }, async (_, index) => {
      const url = new URL(`${RAWG_BASE}/games`);
      url.searchParams.set("key", apiKey);
      url.searchParams.set("page", String(index + 1));
      url.searchParams.set("page_size", "40");
      url.searchParams.set("ordering", "-added");
      url.searchParams.set("exclude_additions", "true");

      try {
        const response = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
          next: { revalidate: 86400 },
        });

        if (!response.ok) return [] as number[];
        const data = await response.json();

        return (Array.isArray(data?.results) ? data.results : [])
          .map((game: { id?: number }) => game.id)
          .filter(
            (id: number | undefined): id is number =>
              typeof id === "number" && Number.isSafeInteger(id) && id > 0,
          );
      } catch {
        return [] as number[];
      }
    }),
  );

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

const primaryPages: StaticPage[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/movie", changeFrequency: "daily", priority: 0.9 },
  { path: "/tv", changeFrequency: "daily", priority: 0.9 },
  { path: "/games", changeFrequency: "daily", priority: 0.9 },
  { path: "/trending", changeFrequency: "daily", priority: 0.9 },
  { path: "/top", changeFrequency: "daily", priority: 0.8 },
  { path: "/upcoming", changeFrequency: "daily", priority: 0.8 },
  { path: "/upcoming/tv", changeFrequency: "daily", priority: 0.75 },
  { path: "/animation", changeFrequency: "daily", priority: 0.85 },
  { path: "/anime", changeFrequency: "daily", priority: 0.8 },
  { path: "/cartoons", changeFrequency: "daily", priority: 0.8 },
  { path: "/news", changeFrequency: "hourly", priority: 0.85 },
  { path: "/news/entertainment", changeFrequency: "hourly", priority: 0.8 },
  { path: "/news/gaming", changeFrequency: "hourly", priority: 0.8 },
  { path: "/news/sports", changeFrequency: "hourly", priority: 0.8 },
  { path: "/browse", changeFrequency: "daily", priority: 0.75 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.7 },
  { path: "/library", changeFrequency: "weekly", priority: 0.65 },
  { path: "/store", changeFrequency: "weekly", priority: 0.65 },
  { path: "/community", changeFrequency: "daily", priority: 0.65 },
];

const informationPages: StaticPage[] = [
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/support", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/dmca", changeFrequency: "yearly", priority: 0.3 },
];

const newsTopics = {
  entertainment: ["movies", "tv", "streaming", "celebrities", "anime"],
  gaming: ["console", "pc", "mobile", "esports", "playstation", "xbox", "nintendo"],
  sports: ["soccer", "football", "racing", "basketball", "tennis"],
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    trendingMovieIds,
    popularMovieIds,
    topRatedMovieIds,
    trendingTvIds,
    popularTvIds,
    topRatedTvIds,
    gameIds,
  ] = await Promise.all([
    fetchIdsAcrossPages("/trending/movie/week?language=en-US"),
    fetchIdsAcrossPages("/movie/popular?language=en-US"),
    fetchIdsAcrossPages("/movie/top_rated?language=en-US"),
    fetchIdsAcrossPages("/trending/tv/week?language=en-US"),
    fetchIdsAcrossPages("/tv/popular?language=en-US"),
    fetchIdsAcrossPages("/tv/top_rated?language=en-US"),
    fetchGameIds(),
  ]);

  const movieIds = [...new Set([
    ...trendingMovieIds,
    ...popularMovieIds,
    ...topRatedMovieIds,
  ])];
  const tvIds = [...new Set([
    ...trendingTvIds,
    ...popularTvIds,
    ...topRatedTvIds,
  ])];
  const uniqueGameIds = [...new Set(gameIds)];

  const topicPages: StaticPage[] = Object.entries(newsTopics).flatMap(
    ([category, topics]) =>
      topics.map((topic) => ({
        path: `/news/${category}/${topic}`,
        changeFrequency: "hourly" as const,
        priority: 0.7,
      })),
  );

  const staticPages = [...primaryPages, ...informationPages, ...topicPages];
  const paginatedHubs = [
    "/movie",
    "/tv",
    "/anime",
    "/cartoons",
    "/trending",
    "/top",
    "/upcoming",
  ];
  const paginationPages = paginatedHubs.flatMap((path) =>
    Array.from({ length: 19 }, (_, index) => ({
      path: `${path}?page=${index + 2}`,
      changeFrequency: "daily" as const,
      priority: 0.65,
    })),
  );

  return [
    ...[...staticPages, ...paginationPages].map((page) => ({
      url: `${BASE_URL}${page.path === "/" ? "" : page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...GAME_CATEGORY_SLUGS.map((slug) => ({
      url: `${BASE_URL}/games/category/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...movieIds.map((id) => ({
      url: `${BASE_URL}/movie/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tvIds.map((id) => ({
      url: `${BASE_URL}/tv/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...uniqueGameIds.map((id) => ({
      url: `${BASE_URL}/games/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}