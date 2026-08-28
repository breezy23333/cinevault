import type { MetadataRoute } from "next";
import { GAME_CATEGORY_SLUGS } from "@/lib/games";
import { prisma } from "@/lib/prisma";

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
    apiGameIds,
    storedTitles,
    storedGames,
  ] = await Promise.all([
    fetchIdsAcrossPages(
      "/trending/movie/week?language=en-US",
    ),
    fetchIdsAcrossPages(
      "/movie/popular?language=en-US",
    ),
    fetchIdsAcrossPages(
      "/movie/top_rated?language=en-US",
    ),
    fetchIdsAcrossPages(
      "/trending/tv/week?language=en-US",
    ),
    fetchIdsAcrossPages(
      "/tv/popular?language=en-US",
    ),
    fetchIdsAcrossPages(
      "/tv/top_rated?language=en-US",
    ),
    fetchGameIds(),

    prisma.catalogTitle
      .findMany({
        where: {
          indexable: true,
          adult: false,
        },
        select: {
          tmdbId: true,
          mediaType: true,
          updatedAt: true,
        },
        orderBy: [
          {
            popularity: "desc",
          },
          {
            updatedAt: "desc",
          },
        ],
        take: 40000,
      })
      .catch(() => []),

    prisma.cachedGame
      .findMany({
        where: {
          backgroundImage: {
            not: null,
          },
        },
        select: {
          rawgId: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5000,
      })
      .catch(() => []),
  ]);

  const storedMovies = storedTitles.filter(
    (title) => title.mediaType === "movie",
  );

  const storedTelevision = storedTitles.filter(
    (title) => title.mediaType === "tv",
  );

  const movieLastModified = new Map(
    storedMovies.map((title) => [
      title.tmdbId,
      title.updatedAt,
    ]),
  );

  const televisionLastModified = new Map(
    storedTelevision.map((title) => [
      title.tmdbId,
      title.updatedAt,
    ]),
  );

  const gameLastModified = new Map(
    storedGames.map((game) => [
      game.rawgId,
      game.updatedAt,
    ]),
  );

  /*
   * Database entries are the permanent catalogue.
   * API entries remain as a fallback while the database
   * is still being populated.
   */
  const movieIds = [
    ...new Set([
      ...storedMovies.map((title) => title.tmdbId),
      ...trendingMovieIds,
      ...popularMovieIds,
      ...topRatedMovieIds,
    ]),
  ];

  const tvIds = [
    ...new Set([
      ...storedTelevision.map(
        (title) => title.tmdbId,
      ),
      ...trendingTvIds,
      ...popularTvIds,
      ...topRatedTvIds,
    ]),
  ];

  const gameIds = [
    ...new Set([
      ...storedGames.map((game) => game.rawgId),
      ...apiGameIds,
    ]),
  ];

  const topicPages: StaticPage[] =
    Object.entries(newsTopics).flatMap(
      ([category, topics]) =>
        topics.map((topic) => ({
          path: `/news/${category}/${topic}`,
          changeFrequency: "hourly" as const,
          priority: 0.7,
        })),
    );

  const staticPages = [
    ...primaryPages,
    ...informationPages,
    ...topicPages,
  ];

  return [
    ...staticPages.map((page) => ({
      url:
        page.path === "/"
          ? BASE_URL
          : `${BASE_URL}${page.path}`,
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
      lastModified:
        movieLastModified.get(id),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...tvIds.map((id) => ({
      url: `${BASE_URL}/tv/${id}`,
      lastModified:
        televisionLastModified.get(id),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...gameIds.map((id) => ({
      url: `${BASE_URL}/games/${id}`,
      lastModified:
        gameLastModified.get(id),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}