import "server-only";

import { igdbRequest } from "@/lib/igdb";

type ExternalGame = {
  uid?: string;
  url?: string;
  external_game_source?: {
    name?: string;
  };
};

type SteamRequirements = {
  minimum?: string;
  recommended?: string;
};

type SteamAppResponse = Record<
  string,
  {
    success: boolean;
    data?: {
      pc_requirements?:
        | SteamRequirements
        | unknown[];
    };
  }
>;

export type GamePcRequirements = {
  minimum: string;
  recommended: string;
  storeUrl: string;
};

export async function getSteamRequirements(
  igdbGameId: number,
): Promise<GamePcRequirements | null> {
  try {
    const externalGames =
      await igdbRequest<ExternalGame[]>(
        "external_games",
        [
          "fields uid,url,external_game_source.name;",
          `where game = ${igdbGameId};`,
          "limit 50;",
        ].join(" "),
      );

    const steamGame = externalGames.find((item) => {
      const source =
        item.external_game_source?.name?.toLowerCase() || "";

      return (
        source.includes("steam") ||
        item.url?.includes("store.steampowered.com")
      );
    });

    const steamId =
      steamGame?.uid ||
      steamGame?.url?.match(/\/app\/(\d+)/)?.[1];

    if (!steamId || !/^\d+$/.test(steamId)) {
      return null;
    }

    const url = new URL(
      "https://store.steampowered.com/api/appdetails",
    );

    url.searchParams.set("appids", steamId);
    url.searchParams.set("cc", "za");
    url.searchParams.set("l", "english");

    const response = await fetch(url, {
      next: {
        revalidate: 86400,
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) return null;

    const result =
      (await response.json()) as SteamAppResponse;

    const requirements =
      result[steamId]?.data?.pc_requirements;

    if (
      !requirements ||
      Array.isArray(requirements)
    ) {
      return null;
    }

    return {
      minimum: requirements.minimum || "",
      recommended: requirements.recommended || "",
      storeUrl: `https://store.steampowered.com/app/${steamId}`,
    };
  } catch (error) {
    console.error(
      "Unable to load Steam requirements:",
      error,
    );

    return null;
  }
}