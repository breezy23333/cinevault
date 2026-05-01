import type { MetadataRoute } from "next";

const baseUrl = "https://cinevault-tau-drab.vercel.app";
const TMDB_BASE = "https://api.themoviedb.org/3";

function authHeaders() {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  return bearer ? { Authorization: `Bearer ${bearer}` } : undefined;
}

function withKey(url: string) {
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  return key ? `${url}${url.includes("?") ? "&" : "?"}api_key=${key}` : url;
}

async function fetchIds(path: string): Promise<number[]> {
  try {
    const res = await fetch(withKey(`${TMDB_BASE}${path}`), {
      headers: authHeaders(),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const data = await res.json();

    return (data.results || [])
      .map((item: { id?: number }) => item.id)
      .filter(Boolean)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "/",
    "/top",
    "/trending",
    "/search",
    "/store",
    "/support",
    "/watchlist",
  ];

  const movieIds = [
    ...(await fetchIds("/trending/movie/week?language=en-US")),
    ...(await fetchIds("/movie/popular?language=en-US")),
    ...(await fetchIds("/movie/top_rated?language=en-US")),
  ];

  const tvIds = [
    ...(await fetchIds("/trending/tv/week?language=en-US")),
    ...(await fetchIds("/tv/popular?language=en-US")),
    ...(await fetchIds("/tv/top_rated?language=en-US")),
  ];

  const uniqueMovieIds = [...new Set(movieIds)].slice(0, 60);
  const uniqueTvIds = [...new Set(tvIds)].slice(0, 60);

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page === "/" ? "" : page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: page === "/" ? 1 : 0.8,
    })),

    ...uniqueMovieIds.map((id) => ({
      url: `${baseUrl}/movie/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),

    ...uniqueTvIds.map((id) => ({
      url: `${baseUrl}/tv/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}