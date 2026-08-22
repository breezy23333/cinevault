import "server-only";
import { getSteamRequirements } from "@/lib/steam";
import { igdbRequest } from "@/lib/igdb";
import type {
  GameDetails,
  GameScreenshot,
  RawgGame,
} from "@/lib/games";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined;

type GameQuery = Record<string, QueryValue>;

type IgdbNamedItem = {
  id: number;
  name: string;
  slug?: string;
};

type IgdbImage = {
  id: number;
  image_id: string;
};

type IgdbPlatform = IgdbNamedItem & {
  abbreviation?: string;
};

type IgdbCompanyLink = {
  developer?: boolean;
  publisher?: boolean;
  company: IgdbNamedItem;
};

type IgdbWebsite = {
  id: number;
  url: string;
};

type IgdbVideo = {
  id: number;
  name: string;
  video_id: string;
};

type IgdbGame = {
  id: number;
  name: string;
  slug?: string;
  summary?: string;
  storyline?: string;
  first_release_date?: number;
  created_at?: number;
  updated_at?: number;
  total_rating?: number;
  total_rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  hypes?: number;
  videos?: IgdbVideo[];
  cover?: IgdbImage;
  artworks?: IgdbImage[];
  screenshots?: IgdbImage[];
  genres?: IgdbNamedItem[];
  themes?: IgdbNamedItem[];
  keywords?: IgdbNamedItem[];
  platforms?: IgdbPlatform[];
  websites?: IgdbWebsite[];
  involved_companies?: IgdbCompanyLink[];
  similar_games?: IgdbGame[];
};

const LIST_FIELDS = [
  "id",
  "name",
  "slug",
  "first_release_date",
  "total_rating",
  "total_rating_count",
  "aggregated_rating",
  "aggregated_rating_count",
  "hypes",
  "cover.id",
  "cover.image_id",
  "artworks.id",
  "artworks.image_id",
  "screenshots.id",
  "screenshots.image_id",
  "genres.id",
  "genres.name",
  "genres.slug",
  "themes.id",
  "themes.name",
  "themes.slug",
  "platforms.id",
  "platforms.name",
  "platforms.abbreviation",
].join(",");

const DETAIL_FIELDS = [
  LIST_FIELDS,
  "summary",
  "storyline",
  "created_at",
  "updated_at",
  "keywords.id",
  "videos.id",
"videos.name",
"videos.video_id",
  "keywords.name",
  "keywords.slug",
  "websites.id",
  "websites.url",
  "involved_companies.developer",
  "involved_companies.publisher",
  "involved_companies.company.id",
  "involved_companies.company.name",
  "involved_companies.company.slug",
].join(",");

const GENRE_IDS: Record<string, number> = {
  fighting: 4,
  shooter: 5,
  music: 7,
  platformer: 8,
  puzzle: 9,
  racing: 10,
  "real-time-strategy-rts": 11,
  "role-playing-games-rpg": 12,
  simulation: 13,
  sport: 14,
  strategy: 15,
  "turn-based-strategy-tbs": 16,
  tactical: 24,
  "hack-and-slash-beat-em-up": 25,
  "quiz-trivia": 26,
  "pinball": 30,
  adventure: 31,
  indie: 32,
  arcade: 33,
  "visual-novel": 34,
  roguelike: 35,
};

const PLATFORM_IDS: Record<number, number[]> = {
  1: [6],
  2: [7, 8, 9, 38, 46, 48, 167],
  3: [11, 12, 49, 169],
  7: [4, 5, 18, 19, 21, 37, 41, 130],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageUrl(
  imageId: string | undefined,
  size = "t_1080p",
) {
  if (!imageId) return null;

  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}

function selectBackground(game: IgdbGame) {
  return (
    imageUrl(game.screenshots?.[0]?.image_id, "t_screenshot_big") ??
    imageUrl(game.screenshots?.[1]?.image_id, "t_screenshot_big") ??
    imageUrl(game.artworks?.[0]?.image_id, "t_1080p") ??
    imageUrl(game.cover?.image_id, "t_cover_big")
  );
}

function releaseDate(timestamp?: number) {
  if (!timestamp) return null;

  return new Date(timestamp * 1000)
    .toISOString()
    .slice(0, 10);
}

function platformSlug(platform: IgdbPlatform) {
  const name =
    platform.abbreviation || platform.name;

  return slugify(name);
}

function mapGame(game: IgdbGame): RawgGame {
  const screenshots: GameScreenshot[] =
    game.screenshots?.map((screenshot) => ({
      id: screenshot.id,
      image:
        imageUrl(screenshot.image_id) ?? "",
    })) ?? [];

  const totalRating =
    game.total_rating ??
    game.aggregated_rating ??
    0;

  const ratingsCount =
    game.total_rating_count ??
    game.aggregated_rating_count ??
    0;

  return {
    id: game.id,
    slug: game.slug || slugify(game.name),
    name: game.name,
    released: releaseDate(game.first_release_date),
    background_image: selectBackground(game),
    rating: Number((totalRating / 20).toFixed(1)),
    rating_top: 5,
    ratings_count: ratingsCount,
    metacritic:
      game.aggregated_rating == null
        ? null
        : Math.round(game.aggregated_rating),
    playtime: 0,
    platforms:
      game.platforms?.map((platform) => ({
        platform: {
          id: platform.id,
          name: platform.name,
          slug: platformSlug(platform),
        },
      })) ?? [],
    parent_platforms:
      game.platforms?.map((platform) => ({
        platform: {
          id: platform.id,
          name: platform.name,
          slug: platformSlug(platform),
        },
      })) ?? [],
    genres:
      game.genres?.map((genre) => ({
        id: genre.id,
        name: genre.name,
        slug: genre.slug || slugify(genre.name),
      })) ?? [],
    tags:
      game.themes?.map((theme) => ({
        id: theme.id,
        name: theme.name,
        slug: theme.slug || slugify(theme.name),
      })) ?? [],
    stores: [],
    short_screenshots: screenshots,
    esrb_rating: null,
  };
}

function unixDate(value: string) {
  const milliseconds = Date.parse(value);

  if (Number.isNaN(milliseconds)) {
    return null;
  }

  return Math.floor(milliseconds / 1000);
}

function buildGameQuery(query: GameQuery) {
  const pageSize = Math.min(
    Number(query.page_size) || 24,
    50,
  );

  const page = Math.max(Number(query.page) || 1, 1);
  const offset = (page - 1) * pageSize;
  const where: string[] = ["version_parent = null"];

  const dates = String(query.dates || "").split(",");

  if (dates[0]) {
    const start = unixDate(dates[0]);
    if (start) {
      where.push(`first_release_date >= ${start}`);
    }
  }

  if (dates[1]) {
    const end = unixDate(dates[1]);
    if (end) {
      where.push(`first_release_date <= ${end}`);
    }
  }

  const genre = String(query.genres || "").trim();

  if (genre && GENRE_IDS[genre]) {
    where.push(`genres = (${GENRE_IDS[genre]})`);
  }

  /*
  * IGDB does not use RAWG-style tags.
  * Each CINRYVAN category is translated into native IGDB fields here.
  */
  if (genre === "action") {
    where.push("themes = (1)");
  }

  if (genre === "casual") {
    where.push("genres = (33)");
  }

  const tag = String(query.tags || "")
    .trim()
    .toLowerCase();

  switch (tag) {
    case "first-person":
      where.push("player_perspectives = (1)");
      break;

    case "third-person":
      where.push("player_perspectives = (2)");
      break;

    case "horror":
      where.push("themes = (19)");
      break;

    case "survival":
      where.push("themes = (21)");
      break;

    case "sci-fi,cyberpunk":
    case "sci-fi":
    case "science-fiction":
    case "cyberpunk":
      where.push("themes = (18)");
      break;

    case "open-world":
      where.push("themes = (38)");
      break;

    case "city-builder":
      where.push("genres = (13)");
      where.push("themes = (33)");
      break;

    case "visual-novel":
      where.push("genres = (34)");
      break;

    case "story-rich":
      where.push("themes = (31)");
      where.push("total_rating_count > 10");
      break;

    case "co-op":
      where.push("game_modes = (3)");
      break;

    case "roguelike":
      where.push("genres = (35)");
      break;

    case "anime":
      where.push("genres = (12)");
      where.push("themes = (17)");
      break;

    case "vr":
      where.push("player_perspectives = (7)");
      break;

    case "esports":
      where.push("game_modes = (2,3,4,5)");
      where.push("total_rating_count > 25");
      break;
  }

  const parentPlatform = Number(
    query.parent_platforms,
  );

  if (
    parentPlatform &&
    PLATFORM_IDS[parentPlatform]
  ) {
    where.push(
      `platforms = (${PLATFORM_IDS[
        parentPlatform
      ].join(",")})`,
    );
  }

  const metacritic = String(query.metacritic || "");

  if (metacritic) {
    const [minimum, maximum] = metacritic
      .split(",")
      .map(Number);

    if (Number.isFinite(minimum)) {
      where.push(`aggregated_rating >= ${minimum}`);
    }

    if (Number.isFinite(maximum)) {
      where.push(`aggregated_rating <= ${maximum}`);
    }
  }

  let sort = "total_rating_count desc";

  if (query.ordering === "-released") {
    sort = "first_release_date desc";
  }

  if (query.ordering === "-metacritic") {
    sort = "aggregated_rating desc";
  }

  const search = String(query.search || "")
    .replace(/["\\]/g, "")
    .trim();

  return [
    `fields ${LIST_FIELDS};`,
    search ? `search "${search}";` : "",
    `where ${where.join(" & ")};`,
    `sort ${sort};`,
    `limit ${pageSize};`,
    `offset ${offset};`,
  ]
    .filter(Boolean)
    .join(" ");
}

export async function getIgdbGames(
  query: GameQuery = {},
): Promise<RawgGame[]> {
  try {
    const games = await igdbRequest<IgdbGame[]>(
      "games",
      buildGameQuery(query),
    );

    return games.map(mapGame);
  } catch (error) {
    console.error("IGDB games request failed:", error);
    return [];
  }
}

export async function getIgdbGameCount(
  query: GameQuery = {},
): Promise<number> {
  try {
    const fullQuery = buildGameQuery({
      ...query,
      page: 1,
      page_size: 1,
    });

    const whereStatement =
      fullQuery.match(/where .*?;/)?.[0] ?? "";

    const result = await igdbRequest<{ count: number }>(
      "games/count",
      whereStatement,
    );

    return result.count ?? 0;
  } catch (error) {
    console.error("IGDB game count failed:", error);
    return 0;
  }
}

export async function getIgdbGameDetails(
  id: string | number,
): Promise<GameDetails | null> {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  try {
    const games = await igdbRequest<IgdbGame[]>(
      "games",
      [
        `fields ${DETAIL_FIELDS};`,
        `where id = ${numericId};`,
        "limit 1;",
      ].join(" "),
    );

    const source = games[0];

    if (!source) return null;

    const game = mapGame(source);

    const steam = await getSteamRequirements(source.id);

        if (steam) {
        const pcPlatform = game.platforms.find(
            (item) =>
            item.platform.id === 6 ||
            item.platform.slug === "pc" ||
            item.platform.slug ===
                "pc-microsoft-windows",
        );

        if (pcPlatform) {
            pcPlatform.requirements = {
            minimum: steam.minimum,
            recommended: steam.recommended,
            };
        }

        game.stores = [
            {
            id: 1,
            store: {
                id: 1,
                name: "Steam",
                slug: "steam",
            },
            },
        ];
        }

    const developers =
      source.involved_companies
        ?.filter((item) => item.developer)
        .map((item) => ({
          id: item.company.id,
          name: item.company.name,
          slug:
            item.company.slug ||
            slugify(item.company.name),
        })) ?? [];

    const publishers =
      source.involved_companies
        ?.filter((item) => item.publisher)
        .map((item) => ({
          id: item.company.id,
          name: item.company.name,
          slug:
            item.company.slug ||
            slugify(item.company.name),
        })) ?? [];

    const tags = [
      ...(source.themes ?? []),
      ...(source.keywords ?? []),
    ].map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug || slugify(item.name),
    }));

    const trailer =
    source.videos?.find((video) =>
        video.name.toLowerCase().includes("trailer"),
    ) || source.videos?.[0];

    return {
      ...game,
      description:
        source.summary || source.storyline || "",
      description_raw:
        source.summary || source.storyline || "",
      trailer_video_id: trailer?.video_id || null,
      background_image_additional:
        imageUrl(source.screenshots?.[1]?.image_id),
      website: source.websites?.[0]?.url || "",
      developers,
      publishers,
      tags,
      added: source.hypes ?? 0,
      updated: source.updated_at
        ? new Date(source.updated_at * 1000).toISOString()
        : "",
    };
  } catch (error) {
    console.error(
      "IGDB game details request failed:",
      error,
    );
    return null;
  }
}

export async function getIgdbGameScreenshots(
  id: string | number,
): Promise<GameScreenshot[]> {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return [];
  }

  try {
    const games = await igdbRequest<IgdbGame[]>(
      "games",
      [
        "fields screenshots.id,screenshots.image_id;",
        `where id = ${numericId};`,
        "limit 1;",
      ].join(" "),
    );

    return (
      games[0]?.screenshots
        ?.map((screenshot) => ({
          id: screenshot.id,
          image:
            imageUrl(screenshot.image_id) ?? "",
        }))
        .filter((screenshot) =>
          Boolean(screenshot.image),
        )
        .slice(0, 12) ?? []
    );
  } catch (error) {
    console.error(
      "IGDB screenshot request failed:",
      error,
    );
    return [];
  }
}

export async function getIgdbSimilarGames(
  id: string | number,
): Promise<RawgGame[]> {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return [];
  }

  try {
    const games = await igdbRequest<IgdbGame[]>(
      "games",
      [
        `fields similar_games.${LIST_FIELDS.replaceAll(
          ",",
          ",similar_games.",
        )};`,
        `where id = ${numericId};`,
        "limit 1;",
      ].join(" "),
    );

    return (
      games[0]?.similar_games
        ?.map(mapGame)
        .filter((game) =>
          Boolean(game.background_image),
        )
        .slice(0, 12) ?? []
    );
  } catch (error) {
    console.error(
      "IGDB similar-games request failed:",
      error,
    );
    return [];
  }
}

export async function getIgdbGamesByNames(
  names: string[],
): Promise<RawgGame[]> {
  const uniqueNames = [...new Set(names.map((name) => name.trim()))]
    .filter(Boolean)
    .slice(0, 20);

  const results = await Promise.all(
    uniqueNames.map(async (name) => {
      try {
        const safeName = name.replace(/["\\]/g, "");
        const games = await igdbRequest<IgdbGame[]>(
          "games",
          [
            `fields ${LIST_FIELDS};`,
            `search "${safeName}";`,
            "where version_parent = null;",
            "limit 5;",
          ].join(" "),
        );

        const normalizedTarget = slugify(name);
        const exact = games.find(
          (game) => slugify(game.name) === normalizedTarget,
        );

        return exact ?? games[0] ?? null;
      } catch (error) {
        console.error(`IGDB search failed for ${name}:`, error);
        return null;
      }
    }),
  );

  const usedIds = new Set<number>();

  return results
    .filter((game): game is IgdbGame => Boolean(game))
    .filter((game) => {
      if (usedIds.has(game.id)) return false;
      usedIds.add(game.id);
      return true;
    })
    .map(mapGame);
}