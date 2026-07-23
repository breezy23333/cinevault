import "server-only";

export type GameTrailer = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string | null;
};

type YouTubeSearchResponse = {
  items?: Array<{
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
  }>;
};

export async function getGameTrailer(
  gameName: string,
): Promise<GameTrailer | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || !gameName.trim()) {
    return null;
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");

  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("q", `${gameName} official game trailer`);
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
      console.error("YouTube trailer request failed:", response.status);
      return null;
    }

    const data = (await response.json()) as YouTubeSearchResponse;
    const result = data.items?.[0];
    const videoId = result?.id?.videoId;

    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return {
      videoId,
      title: result.snippet?.title || `${gameName} trailer`,
      channelTitle: result.snippet?.channelTitle || "YouTube",
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