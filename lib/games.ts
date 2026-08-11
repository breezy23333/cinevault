import "server-only";
import {
  getIgdbGameCount,
  getIgdbGameDetails,
  getIgdbGameScreenshots,
  getIgdbGames,
  getIgdbSimilarGames,
} from "@/lib/igdbGames";

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
  return getIgdbGames(query);
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
  const [popular, newReleases, topRated] = await Promise.all([
    getPopularGames(20),
    getNewReleaseGames(20),
    getTopRatedGames(20),
  ]);

  const [upcoming, pc, playStation] = await Promise.all([
    getUpcomingGames(20),
    getPcGames(20),
    getPlayStationGames(20),
  ]);

  const [xbox, nintendo, firstPersonShooters] = await Promise.all([
    getXboxGames(20),
    getNintendoGames(20),
    getFirstPersonShooters(20),
  ]);

  const [thirdPersonShooters, esports, racing] = await Promise.all([
    getThirdPersonShooters(20),
    getEsportsGames(20),
    getRacingGames(20),
  ]);

  const [storyRpg, horrorSurvival] = await Promise.all([
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

export const GAME_CATEGORY_SLUGS = [
  "popular",
  "new-releases",
  "top-rated",
  "upcoming",
  "pc",
  "playstation",
  "xbox",
  "nintendo",
  "first-person",
  "third-person",
  "esports",
  "racing",
  "rpg",
  "horror",
  "puzzle",
  "survival",
  "sci-fi-cyberpunk",
  "city-settlement",
  "open-world",
  "strategy",
  "adventure",
  "visual-novel",
  "story-rich",
  "simulation",
  "fighting",
  "co-op",
  "roguelike",
  "action",
  "casual",
  "anime",
  "vr",
] as const;

export type GameCategorySlug =
  (typeof GAME_CATEGORY_SLUGS)[number];

export type GameCategoryInfo = {
  slug: string;
  label: string;
  title: string;
  description: string;
};

type GameCategoryConfig = GameCategoryInfo & {
  query: RawgQuery;
};

export type GameCategoryPageData = GameCategoryInfo & {
  games: RawgGame[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
};

const GAME_CATEGORY_PAGE_SIZE = 24;

function getGameCategoryConfig(
  slug: string,
): GameCategoryConfig | null {
  const today = currentDate();

  const categories: Record<GameCategorySlug, GameCategoryConfig> = {
    popular: {
      slug: "popular",
      label: "Popular",
      title: "Popular Games",
      description:
        "Explore the games attracting the most players and attention right now.",
      query: {
        dates: `${dateWithYearOffset(-5)},${today}`,
        ordering: "-added",
      },
    },

    "new-releases": {
      slug: "new-releases",
      label: "New Releases",
      title: "New Game Releases",
      description:
        "Discover recently released games across PC and console.",
      query: {
        dates: `${dateWithYearOffset(-1)},${today}`,
        ordering: "-released",
      },
    },

    "top-rated": {
      slug: "top-rated",
      label: "Top Rated",
      title: "Top-Rated Games",
      description:
        "Browse critically acclaimed games with exceptional ratings.",
      query: {
        dates: `${dateWithYearOffset(-15)},${today}`,
        metacritic: "80,100",
        ordering: "-metacritic",
      },
    },

    upcoming: {
      slug: "upcoming",
      label: "Upcoming",
      title: "Upcoming Games",
      description:
        "See the most anticipated games scheduled for release next.",
      query: {
        dates: `${today},${dateWithYearOffset(2)}`,
        ordering: "-added",
      },
    },

    pc: {
      slug: "pc",
      label: "PC",
      title: "PC Games",
      description:
        "Explore popular releases and essential experiences available on PC.",
      query: {
        parent_platforms: 1,
        ordering: "-added",
      },
    },

    playstation: {
      slug: "playstation",
      label: "PlayStation",
      title: "PlayStation Games",
      description:
        "Discover popular games across the PlayStation family of consoles.",
      query: {
        parent_platforms: 2,
        ordering: "-added",
      },
    },

    xbox: {
      slug: "xbox",
      label: "Xbox",
      title: "Xbox Games",
      description:
        "Browse adventures, shooters, racers and more available on Xbox.",
      query: {
        parent_platforms: 3,
        ordering: "-added",
      },
    },

    nintendo: {
      slug: "nintendo",
      label: "Nintendo",
      title: "Nintendo Games",
      description:
        "Explore memorable Nintendo adventures, family games and exclusives.",
      query: {
        parent_platforms: 7,
        ordering: "-added",
      },
    },

    "first-person": {
      slug: "first-person",
      label: "First-Person",
      title: "First-Person Games",
      description:
        "Experience shooters and adventures directly through the character's eyes.",
      query: {
        genres: "shooter",
        tags: "first-person",
        ordering: "-added",
      },
    },

    "third-person": {
      slug: "third-person",
      label: "Third-Person",
      title: "Third-Person Games",
      description:
        "Discover cinematic action, exploration and combat from a third-person perspective.",
      query: {
        tags: "third-person",
        ordering: "-added",
      },
    },

    esports: {
      slug: "esports",
      label: "Esports",
      title: "Esports & Competitive Games",
      description:
        "Competitive games built around skill, teamwork and ranked play.",
      query: {
        tags: "esports",
        ordering: "-added",
      },
    },

    racing: {
      slug: "racing",
      label: "Racing",
      title: "Racing & Motorsport Games",
      description:
        "Experience street racing, rally, open-wheel racing and realistic motorsport.",
      query: {
        genres: "racing",
        ordering: "-added",
      },
    },

    rpg: {
      slug: "rpg",
      label: "RPG",
      title: "Role-Playing Games",
      description:
        "Enter deep worlds filled with memorable characters and player-driven stories.",
      query: {
        genres: "role-playing-games-rpg",
        ordering: "-added",
      },
    },

    horror: {
      slug: "horror",
      label: "Horror",
      title: "Horror & Survival Games",
      description:
        "Enter terrifying worlds where every decision can determine whether you survive.",
      query: {
        tags: "horror",
        ordering: "-added",
      },
    },

        puzzle: {
      slug: "puzzle",
      label: "Puzzle",
      title: "Puzzle Games",
      description:
        "Solve mysteries, master logic challenges and discover inventive puzzle experiences.",
      query: {
        genres: "puzzle",
        ordering: "-added",
      },
    },

    survival: {
      slug: "survival",
      label: "Survival",
      title: "Survival Games",
      description:
        "Gather resources, build shelter and survive against dangerous worlds.",
      query: {
        tags: "survival",
        ordering: "-added",
      },
    },

    "sci-fi-cyberpunk": {
      slug: "sci-fi-cyberpunk",
      label: "Sci-Fi & Cyberpunk",
      title: "Sci-Fi & Cyberpunk Games",
      description:
        "Explore futuristic cities, distant worlds and technology-driven adventures.",
      query: {
        tags: "sci-fi,cyberpunk",
        ordering: "-added",
      },
    },

    "city-settlement": {
      slug: "city-settlement",
      label: "City & Settlement",
      title: "City & Settlement Games",
      description:
        "Build cities, manage communities and create thriving settlements.",
      query: {
        tags: "city-builder",
        ordering: "-added",
      },
    },

    "open-world": {
      slug: "open-world",
      label: "Open World",
      title: "Open-World Games",
      description:
        "Explore enormous worlds filled with quests, discoveries and freedom.",
      query: {
        tags: "open-world",
        ordering: "-added",
      },
    },

    strategy: {
      slug: "strategy",
      label: "Strategy",
      title: "Strategy Games",
      description:
        "Plan carefully, command armies and outthink your opponents.",
      query: {
        genres: "strategy",
        ordering: "-added",
      },
    },

    adventure: {
      slug: "adventure",
      label: "Adventure",
      title: "Adventure Games",
      description:
        "Embark on unforgettable journeys filled with discovery and danger.",
      query: {
        genres: "adventure",
        ordering: "-added",
      },
    },

    "visual-novel": {
      slug: "visual-novel",
      label: "Visual Novel",
      title: "Visual Novel Games",
      description:
        "Experience character-driven stories where your decisions shape the journey.",
      query: {
        tags: "visual-novel",
        ordering: "-added",
      },
    },

    "story-rich": {
      slug: "story-rich",
      label: "Story-Rich",
      title: "Story-Rich Games",
      description:
        "Discover memorable characters, powerful narratives and cinematic worlds.",
      query: {
        tags: "story-rich",
        ordering: "-added",
      },
    },

    simulation: {
      slug: "simulation",
      label: "Simulation",
      title: "Simulation Games",
      description:
        "Experience detailed systems, realistic careers and simulated worlds.",
      query: {
        genres: "simulation",
        ordering: "-added",
      },
    },

    fighting: {
      slug: "fighting",
      label: "Fighting",
      title: "Fighting Games",
      description:
        "Master powerful fighters, competitive combat and spectacular special moves.",
      query: {
        genres: "fighting",
        ordering: "-added",
      },
    },

    "co-op": {
      slug: "co-op",
      label: "Co-Operative",
      title: "Co-Operative Games",
      description:
        "Team up with friends and overcome challenges together.",
      query: {
        tags: "co-op",
        ordering: "-added",
      },
    },

    roguelike: {
      slug: "roguelike",
      label: "Rogue-Like",
      title: "Rogue-Like Games",
      description:
        "Take on replayable challenges, changing worlds and high-stakes runs.",
      query: {
        tags: "roguelike",
        ordering: "-added",
      },
    },

    action: {
      slug: "action",
      label: "Action",
      title: "Action Games",
      description:
        "Discover fast combat, spectacular set pieces and thrilling adventures.",
      query: {
        genres: "action",
        ordering: "-added",
      },
    },

    casual: {
      slug: "casual",
      label: "Casual",
      title: "Casual Games",
      description:
        "Enjoy accessible games designed for relaxing and entertaining play.",
      query: {
        genres: "casual",
        ordering: "-added",
      },
    },

    anime: {
      slug: "anime",
      label: "Anime",
      title: "Anime Games",
      description:
        "Explore colourful worlds inspired by anime storytelling and art.",
      query: {
        tags: "anime",
        ordering: "-added",
      },
    },

    vr: {
      slug: "vr",
      label: "VR Titles",
      title: "Virtual Reality Games",
      description:
        "Step inside immersive worlds created for virtual reality.",
      query: {
        tags: "vr",
        ordering: "-added",
      },
    },
  };

    const knownCategory =
    categories[slug as GameCategorySlug];

  if (knownCategory) {
    return knownCategory;
  }

  const safeTagSlug = slug.trim().toLowerCase();

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(safeTagSlug)
  ) {
    return null;
  }

  const label = safeTagSlug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

  return {
    slug: safeTagSlug,
    label,
    title: `${label} Games`,
    description: `Discover games associated with the ${label} tag.`,
    query: {
      tags: safeTagSlug,
      ordering: "-added",
    },
  };
}

export function getGameCategoryInfo(
  slug: string,
): GameCategoryInfo | null {
  const category = getGameCategoryConfig(slug);

  if (!category) return null;

  return {
    slug: category.slug,
    label: category.label,
    title: category.title,
    description: category.description,
  };
}

export async function getGameCategoryPage(
  slug: string,
  requestedPage = 1,
): Promise<GameCategoryPageData | null> {
  const category = getGameCategoryConfig(slug);

  if (!category) return null;

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [categoryGames, totalResults] =
  await Promise.all([
    getIgdbGames({
      ...category.query,
      page,
      page_size: GAME_CATEGORY_PAGE_SIZE,
    }),
    getIgdbGameCount(category.query),
  ]);

  const usedIds = new Set<number>();

  const games = categoryGames.filter((game) => {
    if (!game?.id || !game.name || usedIds.has(game.id)) {
      return false;
    }

    usedIds.add(game.id);
    return true;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalResults / GAME_CATEGORY_PAGE_SIZE),
  );

  return {
    slug: category.slug,
    label: category.label,
    title: category.title,
    description: category.description,
    games,
    page,
    pageSize: GAME_CATEGORY_PAGE_SIZE,
    totalPages,
    totalResults,
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
  trailer_video_id?: string | null;
};

export async function getGameDetails(
  id: string | number,
): Promise<GameDetails | null> {
  return getIgdbGameDetails(id);
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
  return getIgdbGameScreenshots(id); 
}

export async function getGameSeries(
  id: string | number,
): Promise<RawgGame[]> {
  return getIgdbSimilarGames(id);
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