import "server-only";

import { prisma } from "@/lib/prisma";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type CatalogMediaType = "movie" | "tv";

type TmdbCatalogItem = {
  id?: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  adult?: boolean;
};

type TmdbCatalogResponse = {
  page?: number;
  total_pages?: number;
  results?: TmdbCatalogItem[];
};

function getTmdbAuthentication() {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  const apiKey =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY;

  return {
    bearer,
    apiKey,
  };
}

function parseDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function cleanText(value?: string | null) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createTmdbUrl(
  mediaType: CatalogMediaType,
  page: number,
) {
  const { apiKey } = getTmdbAuthentication();

  const url = new URL(
    `${TMDB_BASE_URL}/discover/${mediaType}`,
  );

  url.searchParams.set("language", "en-US");
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("include_video", "false");
  url.searchParams.set("sort_by", "popularity.desc");
  url.searchParams.set("page", String(page));

  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  return url;
}

async function fetchCatalogPage(
  mediaType: CatalogMediaType,
  page: number,
): Promise<TmdbCatalogResponse> {
  const { bearer, apiKey } = getTmdbAuthentication();

  if (!bearer && !apiKey) {
    throw new Error(
      "TMDB authentication is not configured.",
    );
  }

  const response = await fetch(
    createTmdbUrl(mediaType, page),
    {
      headers: bearer
        ? {
            Authorization: `Bearer ${bearer}`,
            Accept: "application/json",
          }
        : {
            Accept: "application/json",
          },

      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    },
  );

  if (!response.ok) {
    throw new Error(
      `TMDB ${mediaType} catalogue request failed with ${response.status}.`,
    );
  }

  return response.json();
}

export async function syncCatalogPage(
  mediaType: CatalogMediaType,
  page: number,
) {
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 500
  ) {
    throw new Error(
      "TMDB catalogue page must be between 1 and 500.",
    );
  }

  const data = await fetchCatalogPage(
    mediaType,
    page,
  );

  const items = Array.isArray(data.results)
    ? data.results
    : [];

  const validItems = items.filter(
    (
      item,
    ): item is TmdbCatalogItem & {
      id: number;
    } =>
      typeof item.id === "number" &&
      Number.isSafeInteger(item.id) &&
      item.id > 0,
  );

  if (validItems.length === 0) {
    return {
      mediaType,
      page,
      received: 0,
      stored: 0,
    };
  }

  const syncedAt = new Date();

  const operations = validItems.map((item) => {
    const title = cleanText(
      mediaType === "movie"
        ? item.title
        : item.name,
    );

    const originalTitle = cleanText(
      mediaType === "movie"
        ? item.original_title
        : item.original_name,
    );

    const overview = cleanText(item.overview);

    const releaseDate = parseDate(
      mediaType === "movie"
        ? item.release_date
        : item.first_air_date,
    );

    /*
     * Only strong, useful pages should enter
     * Cinryvan's indexable sitemap.
     */
    const indexable = Boolean(
      !item.adult &&
        title &&
        overview.length >= 60 &&
        (item.poster_path || item.backdrop_path),
    );

    const values = {
      title,
      originalTitle:
        originalTitle &&
        originalTitle !== title
          ? originalTitle
          : null,
      overview: overview || null,
      posterPath: item.poster_path || null,
      backdropPath: item.backdrop_path || null,
      releaseDate,
      originalLanguage:
        item.original_language || null,
      popularity:
        typeof item.popularity === "number"
          ? item.popularity
          : 0,
      voteAverage:
        typeof item.vote_average === "number"
          ? item.vote_average
          : 0,
      voteCount:
        typeof item.vote_count === "number"
          ? item.vote_count
          : 0,
      adult: Boolean(item.adult),
      indexable,
      syncedAt,
    };

    return prisma.catalogTitle.upsert({
      where: {
        tmdbId_mediaType: {
          tmdbId: item.id,
          mediaType,
        },
      },

      create: {
        tmdbId: item.id,
        mediaType,
        ...values,
      },

      update: values,
    });
  });

  const stored = await prisma.$transaction(
    operations,
  );

  return {
    mediaType,
    page,
    received: validItems.length,
    stored: stored.length,
  };
}

export async function syncCatalogPages(
  mediaType: CatalogMediaType,
  pages: number[],
) {
  const results = [];

  for (const page of pages) {
    results.push(
      await syncCatalogPage(mediaType, page),
    );
  }

  return results;
}