import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type TmdbVideo = {
  key?: string;
  site?: string;
  type?: string;
  official?: boolean;
  published_at?: string;
};

function getTmdbAuthentication() {
  const apiKey =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`;
  }

  return {
    apiKey,
    headers,
  };
}

function chooseTrailer(videos: TmdbVideo[]) {
  const youtubeVideos = videos
    .filter((video) => video.site === "YouTube" && video.key)
    .sort((a, b) => {
      const aDate = new Date(a.published_at || 0).getTime();
      const bDate = new Date(b.published_at || 0).getTime();

      return bDate - aDate;
    });

  return (
    youtubeVideos.find(
      (video) => video.type === "Trailer" && video.official,
    ) ||
    youtubeVideos.find((video) => video.type === "Trailer") ||
    youtubeVideos.find(
      (video) => video.type === "Teaser" && video.official,
    ) ||
    youtubeVideos.find((video) => video.type === "Teaser") ||
    youtubeVideos[0] ||
    null
  );
}

export async function GET(request: NextRequest) {
  const media = request.nextUrl.searchParams.get("media");
  const id = request.nextUrl.searchParams.get("id");

  if ((media !== "movie" && media !== "tv") || !id || !/^\d+$/.test(id)) {
    return NextResponse.json(
      { trailer: null, error: "Invalid media or ID." },
      { status: 400 },
    );
  }

  const { apiKey, headers } = getTmdbAuthentication();

  if (!apiKey && !headers.Authorization) {
    return NextResponse.json(
      { trailer: null, error: "TMDB authentication is missing." },
      { status: 500 },
    );
  }

  const url = new URL(
    `https://api.themoviedb.org/3/${media}/${id}/videos`,
  );

  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  try {
    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { trailer: null },
        {
          status: response.status,
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        },
      );
    }

    const data = (await response.json()) as {
      results?: TmdbVideo[];
    };

    const trailer = chooseTrailer(data.results || []);

    return NextResponse.json(
      {
        trailer: trailer?.key || null,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { trailer: null },
      { status: 500 },
    );
  }
}