import "server-only";

export type GameTrailer = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string | null;
};

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };

  snippet?: {
    title?: string;
    channelTitle?: string;

    thumbnails?: {
      high?: {
        url?: string;
      };

      medium?: {
        url?: string;
      };
    };
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];
};

function isValidVideo(item: YouTubeSearchItem) {
  const videoId = item.id?.videoId;

  return Boolean(
    videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId),
  );
}

function scoreTrailer(
  item: YouTubeSearchItem,
  gameName: string,
) {
  const title = item.snippet?.title?.toLowerCase() || "";
  const normalizedGameName = gameName.toLowerCase();

  let score = 0;

  if (title.includes(normalizedGameName)) score += 10;
  if (title.includes("official")) score += 6;
  if (title.includes("trailer")) score += 5;
  if (title.includes("launch")) score += 2;

  if (title.includes("reaction")) score -= 10;
  if (title.includes("review")) score -= 8;
  if (title.includes("walkthrough")) score -= 6;
  if (title.includes("gameplay")) score -= 2;

  return score;
}

export async function getGameTrailer(
  gameName: string,
  igdbVideoId?: string | null,
): Promise<GameTrailer | null> {
  if (
    igdbVideoId &&
    /^[A-Za-z0-9_-]{11}$/.test(igdbVideoId)
  ) {
    return {
      videoId: igdbVideoId,
      title: `${gameName} official trailer`,
      channelTitle: "YouTube",
      thumbnail: `https://i.ytimg.com/vi/${igdbVideoId}/hqdefault.jpg`,
    };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!gameName.trim()) {
    return null;
  }

  if (!apiKey) {
    console.error("YOUTUBE_API_KEY is missing.");
    return null;
  }

  const url = new URL(
    "https://www.googleapis.com/youtube/v3/search",
  );

  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "5");
  url.searchParams.set(
    "q",
    `${gameName} official game trailer`,
  );
  url.searchParams.set("order", "relevance");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("videoSyndicated", "true");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("regionCode", "ZA");
  url.searchParams.set("relevanceLanguage", "en");
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 604800,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();

      console.error(
        "YouTube trailer request failed:",
        response.status,
        errorMessage,
      );

      return null;
    }

    const data =
      (await response.json()) as YouTubeSearchResponse;

    const result = (data.items || [])
      .filter(isValidVideo)
      .sort(
        (first, second) =>
          scoreTrailer(second, gameName) -
          scoreTrailer(first, gameName),
      )[0];

    const videoId = result?.id?.videoId;

    if (!videoId) {
      console.error(
        `No embeddable trailer found for ${gameName}.`,
      );

      return null;
    }

    return {
      videoId,
      title:
        result.snippet?.title ||
        `${gameName} official trailer`,
      channelTitle:
        result.snippet?.channelTitle || "YouTube",
      thumbnail:
        result.snippet?.thumbnails?.high?.url ||
        result.snippet?.thumbnails?.medium?.url ||
        null,
    };
  } catch (error) {
    console.error("Unable to load game trailer:", error);
    return null;
  }
}