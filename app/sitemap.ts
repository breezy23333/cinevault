import type { MetadataRoute } from "next";
import { GAME_CATEGORY_SLUGS } from "@/lib/games";
export const revalidate = 86400;

const baseUrl = "https://cinryvan.vercel.app";
const TMDB_BASE = "https://api.themoviedb.org/3";
const RAWG_BASE = "https://api.rawg.io/api";

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

  return key
    ? `${url}${url.includes("?") ? "&" : "?"}api_key=${key}`
    : url;
}

async function fetchIds(path: string): Promise<number[]> {
  try {
    const response = await fetch(withKey(`${TMDB_BASE}${path}`), {
      headers: authHeaders(),
      next: { revalidate: 86400 },
    });

    if (!response.ok) return [];

    const data = await response.json();

    return (data.results || [])
      .map((item: { id?: number }) => item.id)
      .filter(
        (id: number | undefined): id is number =>
          typeof id === "number"
      )
      .slice(0, 40);
  } catch {
    return [];
  }
}

async function fetchGameIds(): Promise<number[]> {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) return [];

  const url = new URL(`${RAWG_BASE}/games`);

  url.searchParams.set("key", apiKey);
  url.searchParams.set("page_size", "40");
  url.searchParams.set("ordering", "-added");
  url.searchParams.set("exclude_additions", "true");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) return [];

    const data = await response.json();

    return (data.results || [])
      .map((game: { id?: number }) => game.id)
      .filter(
        (id: number | undefined): id is number =>
          typeof id === "number",
      );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      path: "/",
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      path: "/movie",
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      path: "/tv",
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      path: "/trending",
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      path: "/top",
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      path: "/upcoming",
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      path: "/news",
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      path: "/games",
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      path: "/anime",
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      path: "/cartoons",
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      path: "/browse",
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      path: "/categories",
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      path: "/store",
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      path: "/community",
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      path: "/about",
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      path: "/support",
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      path: "/contact",
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      path: "/privacy",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      path: "/terms",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      path: "/cookies",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      path: "/dmca",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

    const [
    trendingMovieIds,
    popularMovieIds,
    topRatedMovieIds,
    trendingTvIds,
    popularTvIds,
    topRatedTvIds,
    gameIds,
  ] = await Promise.all([
    fetchIds("/trending/movie/week?language=en-US"),
    fetchIds("/movie/popular?language=en-US"),
    fetchIds("/movie/top_rated?language=en-US"),
    fetchIds("/trending/tv/week?language=en-US"),
    fetchIds("/tv/popular?language=en-US"),
    fetchIds("/tv/top_rated?language=en-US"),
    fetchGameIds(),
  ]);

  const uniqueMovieIds = [
    ...new Set([
      ...trendingMovieIds,
      ...popularMovieIds,
      ...topRatedMovieIds,
    ]),
  ].slice(0, 120);

  const uniqueTvIds = [
    ...new Set([
      ...trendingTvIds,
      ...popularTvIds,
      ...topRatedTvIds,
    ]),
  ].slice(0, 120);

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.path === "/" ? "" : page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),

    ...GAME_CATEGORY_SLUGS.map((slug) => ({
      url: `${baseUrl}/games/category/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...uniqueMovieIds.map((id) => ({
      url: `${baseUrl}/movie/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...uniqueTvIds.map((id) => ({
      url: `${baseUrl}/tv/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...gameIds.map((id) => ({
      url: `${baseUrl}/games/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}