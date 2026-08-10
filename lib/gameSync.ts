import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { RawgGame } from "@/lib/games";

const RAWG_BASE_URL = "https://api.rawg.io/api";
const PAGE_SIZE = 40;

type SyncGame = RawgGame & {
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

type RawgSyncResponse = {
  results: SyncGame[];
  next: string | null;
};

function optionalJson(value: unknown) {
  return value == null
    ? Prisma.DbNull
    : (value as Prisma.InputJsonValue);
}

async function fetchRawgPage(
  page: number,
  attempt = 1,
): Promise<SyncGame[]> {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    throw new Error("RAWG_API_KEY is missing.");
  }

  const url = new URL(`${RAWG_BASE_URL}/games`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(PAGE_SIZE));
  url.searchParams.set("ordering", "-added");
  url.searchParams.set("exclude_additions", "true");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    if (attempt < 3 && response.status >= 500) {
      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 2_000),
      );

      return fetchRawgPage(page, attempt + 1);
    }

    throw new Error(
      `RAWG sync failed with status ${response.status}.`,
    );
  }

  const data = (await response.json()) as RawgSyncResponse;
  return data.results ?? [];
}

function validReleaseDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function saveGames(games: SyncGame[]) {
  const batches: SyncGame[][] = [];

  for (let index = 0; index < games.length; index += 20) {
    batches.push(games.slice(index, index + 20));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map((game) => {
        const data = {
          slug: game.slug,
          name: game.name,
          released: validReleaseDate(game.released),
          backgroundImage: game.background_image,
          rating: game.rating ?? 0,
          ratingTop: game.rating_top ?? 5,
          ratingsCount: game.ratings_count ?? 0,
          metacritic: game.metacritic,
          playtime: game.playtime ?? 0,

          platformSlugs:
            game.platforms?.map(
              (item) => item.platform.slug,
            ) ?? [],

          genreSlugs:
            game.genres?.map((genre) => genre.slug) ?? [],

          tagSlugs:
            game.tags?.map((tag) => tag.slug) ?? [],

          platforms:
            (game.platforms ?? []) as Prisma.InputJsonValue,

          parentPlatforms: optionalJson(game.parent_platforms),

          genres:
            (game.genres ?? []) as Prisma.InputJsonValue,

          stores: optionalJson(game.stores),
          screenshots: optionalJson(game.short_screenshots),
          esrbRating: optionalJson(game.esrb_rating),
          syncedAt: new Date(),
        };

        return prisma.cachedGame.upsert({
          where: {
            rawgId: game.id,
          },
          create: {
            rawgId: game.id,
            ...data,
          },
          update: data,
        });
      }),
    );
  }
}

export async function syncGamesFromRawg(maxPages = 10) {
  const collected = new Map<number, SyncGame>();

  for (let page = 1; page <= maxPages; page += 1) {
    const games = await fetchRawgPage(page);

    if (games.length === 0) {
      break;
    }

    for (const game of games) {
      if (game.id && game.name && game.slug) {
        collected.set(game.id, game);
      }
    }
  }

  const games = [...collected.values()];

  if (games.length === 0) {
    throw new Error(
      "RAWG returned no games. Existing cached games were preserved.",
    );
  }

  await saveGames(games);

  return {
    fetched: games.length,
    saved: games.length,
  };
}