import "server-only";

const RAWG_BASE_URL = "https://api.rawg.io/api";
const CACHE_TIME = 60 * 60 * 24; // 24 hours

export const RAWG_ATTRIBUTION_URL = "https://rawg.io";

type RawgQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

export type GamePlatform = {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  released_at?: string | null;
  requirements?: {
    minimum?: string;
    recommended?: string;
  };
};

export type GameGenre = {
  id: number;
  name: string;
  slug: string;
};

export type GameStore = {
  id: number;
  store: {
    id: number;
    name: string;
    slug: string;
  };
};

export type GameScreenshot = {
  id: number;
  image: string;
};

export type RawgGame = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  platforms: GamePlatform[];
  parent_platforms?: GamePlatform[];
  genres: GameGenre[];
  stores?: GameStore[];
  short_screenshots?: GameScreenshot[];
  esrb_rating?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

type RawgGamesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
};

async function rawgFetch<T>(
  path: string,
  query: RawgQuery = {}
): Promise<T | null> {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    console.error("RAWG_API_KEY is missing.");
    return null;
  }

  const url = new URL(`${RAWG_BASE_URL}${path}`);
  url.searchParams.set("key", apiKey);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: CACHE_TIME,
      },
    });

    if (!response.ok) {
      console.error(`RAWG request failed with status ${response.status}.`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("RAWG request failed:", error);
    return null;
  }
}

export async function getGames(
  query: RawgQuery = {},
): Promise<RawgGame[]> {
  const response = await rawgFetch<RawgGamesResponse>("/games", {
    page_size: 24,
    exclude_additions: true,
    ...query,
  });

  return response?.results ?? [];
}

function cleanGameCollection(
  games: RawgGame[],
  limit: number,
): RawgGame[] {
  const usedIds = new Set<number>();

  return games
    .filter((game) => {
      if (
        !game?.id ||
        !game.name ||
        !game.background_image ||
        usedIds.has(game.id)
      ) {
        return false;
      }

      usedIds.add(game.id);
      return true;
    })
    .slice(0, limit);
}

async function getGameCollection(
  query: RawgQuery,
  limit = 20,
): Promise<RawgGame[]> {
  const pageSize = Math.min(
    40,
    Math.max(limit + 8, 24),
  );

  const games = await getGames({
    ...query,
    page_size: pageSize,
  });

  return cleanGameCollection(games, limit);
}

function dateWithYearOffset(offset: number) {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() + offset);
  return date.toISOString().slice(0, 10);
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------------------------------- */
/* Homepage gaming data               */
/* ---------------------------------- */

export function getFeaturedGames(limit = 8) {
  return getGameCollection(
    {
      dates: `${dateWithYearOffset(-1)},${dateWithYearOffset(1)}`,
      ordering: "-added",
    },
    limit,
  );
}

export function getFirstPersonShooters(limit = 20) {
  return getGameCollection(
    {
      genres: "shooter",
      tags: "first-person",
      ordering: "-added",
    },
    limit,
  );
}

export function getThirdPersonShooters(limit = 20) {
  return getGameCollection(
    {
      genres: "shooter",
      tags: "third-person",
      ordering: "-added",
    },
    limit,
  );
}

export function getEsportsGames(limit = 20) {
  return getGameCollection(
    {
      tags: "esports",
      ordering: "-added",
    },
    limit,
  );
}

export function getRacingGames(limit = 20) {
  return getGameCollection(
    {
      genres: "racing",
      ordering: "-added",
    },
    limit,
  );
}

export function getStoryRpgGames(limit = 20) {
  return getGameCollection(
    {
      genres: "role-playing-games-rpg",
      ordering: "-added",
    },
    limit,
  );
}

export function getHorrorSurvivalGames(limit = 20) {
  return getGameCollection(
    {
      tags: "horror",
      ordering: "-added",
    },
    limit,
  );
}

export async function getGamingHomeData() {
  const [
    featured,
    firstPersonShooters,
    thirdPersonShooters,
    esports,
    racing,
    storyRpg,
    horrorSurvival,
  ] = await Promise.all([
    getFeaturedGames(8),
    getFirstPersonShooters(20),
    getThirdPersonShooters(20),
    getEsportsGames(20),
    getRacingGames(20),
    getStoryRpgGames(20),
    getHorrorSurvivalGames(20),
  ]);

  return {
    featured,
    firstPersonShooters,
    thirdPersonShooters,
    esports,
    racing,
    storyRpg,
    horrorSurvival,
  };
}

/* ---------------------------------- */
/* Full /games catalogue data         */
/* ---------------------------------- */

export function getPopularGames(limit = 20) {
  return getGameCollection(
    {
      dates: `${dateWithYearOffset(-5)},${currentDate()}`,
      ordering: "-added",
    },
    limit,
  );
}

export function getNewReleaseGames(limit = 20) {
  return getGameCollection(
    {
      dates: `${dateWithYearOffset(-1)},${currentDate()}`,
      ordering: "-released",
    },
    limit,
  );
}

export function getTopRatedGames(limit = 20) {
  return getGameCollection(
    {
      dates: `${dateWithYearOffset(-15)},${currentDate()}`,
      metacritic: "80,100",
      ordering: "-metacritic",
    },
    limit,
  );
}

export function getUpcomingGames(limit = 20) {
  return getGameCollection(
    {
      dates: `${currentDate()},${dateWithYearOffset(2)}`,
      ordering: "-added",
    },
    limit,
  );
}

function getPlatformGames(
  parentPlatform: number,
  limit = 20,
) {
  return getGameCollection(
    {
      parent_platforms: parentPlatform,
      ordering: "-added",
    },
    limit,
  );
}

export function getPcGames(limit = 20) {
  return getPlatformGames(1, limit);
}

export function getPlayStationGames(limit = 20) {
  return getPlatformGames(2, limit);
}

export function getXboxGames(limit = 20) {
  return getPlatformGames(3, limit);
}

export function getNintendoGames(limit = 20) {
  return getPlatformGames(7, limit);
}

export async function getGamingBrowseData() {
  const [
    popular,
    newReleases,
    topRated,
    upcoming,
    pc,
    playStation,
    xbox,
    nintendo,
    firstPersonShooters,
    thirdPersonShooters,
    esports,
    racing,
    storyRpg,
    horrorSurvival,
  ] = await Promise.all([
    getPopularGames(20),
    getNewReleaseGames(20),
    getTopRatedGames(20),
    getUpcomingGames(20),
    getPcGames(20),
    getPlayStationGames(20),
    getXboxGames(20),
    getNintendoGames(20),
    getFirstPersonShooters(20),
    getThirdPersonShooters(20),
    getEsportsGames(20),
    getRacingGames(20),
    getStoryRpgGames(20),
    getHorrorSurvivalGames(20),
  ]);

  return {
    popular,
    newReleases,
    topRated,
    upcoming,
    pc,
    playStation,
    xbox,
    nintendo,
    firstPersonShooters,
    thirdPersonShooters,
    esports,
    racing,
    storyRpg,
    horrorSurvival,
  };
}

export type GameCompany = {
  id: number;
  name: string;
  slug: string;
};

export type GameTag = {
  id: number;
  name: string;
  slug: string;
};

export type GameDetails = RawgGame & {
  description: string;
  description_raw: string;
  background_image_additional: string | null;
  website: string;
  reddit_url?: string;
  metacritic_url?: string;
  developers: GameCompany[];
  publishers: GameCompany[];
  tags: GameTag[];
  added: number;
  updated: string;
};

export async function getGameDetails(
  id: string | number
): Promise<GameDetails | null> {
  const safeId = encodeURIComponent(String(id));

  return rawgFetch<GameDetails>(`/games/${safeId}`);
}

type RawgScreenshotsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: GameScreenshot[];
};

export async function getGameScreenshots(
  id: string | number,
): Promise<GameScreenshot[]> {
  const safeId = encodeURIComponent(String(id));

  const response = await rawgFetch<RawgScreenshotsResponse>(
    `/games/${safeId}/screenshots`,
    {
      page_size: 12,
    },
  );

  return response?.results ?? [];
}

export async function getGameSeries(
  id: string | number,
): Promise<RawgGame[]> {
  const safeId = encodeURIComponent(String(id));

  const response = await rawgFetch<RawgGamesResponse>(
    `/games/${safeId}/game-series`,
    {
      page_size: 12,
    },
  );

  return response?.results ?? [];
}

export async function getRelatedGames(
  game: GameDetails,
): Promise<RawgGame[]> {
  const primaryGenre = game.genres?.[0]?.slug;

  if (!primaryGenre) {
    return [];
  }

  const games = await getGames({
    genres: primaryGenre,
    ordering: "-added",
    page_size: 18,
  });

  return games.filter((item) => item.id !== game.id);
}

function prepareMoreGames(
  currentGameId: number,
  games: RawgGame[],
): RawgGame[] {
  const usedIds = new Set<number>([currentGameId]);

  return games
    .filter((game) => {
      if (usedIds.has(game.id) || !game.background_image) {
        return false;
      }

      usedIds.add(game.id);
      return true;
    })
    .slice(0, 12);
}

export type GamePageData = {
  game: GameDetails;
  screenshots: GameScreenshot[];
  seriesGames: RawgGame[];
  moreGames: RawgGame[];
};

export async function getGamePageData(
  id: string | number,
): Promise<GamePageData | null> {
  const game = await getGameDetails(id);

  if (!game) {
    return null;
  }

  const [screenshots, seriesResults] = await Promise.all([
    getGameScreenshots(game.id),
    getGameSeries(game.id),
  ]);

  const seriesGames = prepareMoreGames(game.id, seriesResults);

  let relatedGames: RawgGame[] = [];

  if (seriesGames.length < 12) {
    relatedGames = await getRelatedGames(game);
  }

  const moreGames = prepareMoreGames(game.id, [
    ...seriesGames,
    ...relatedGames,
  ]);

  return {
    game,
    screenshots: screenshots
      .filter((screenshot) => Boolean(screenshot.image))
      .slice(0, 12),
    seriesGames,
    moreGames,
  };
}