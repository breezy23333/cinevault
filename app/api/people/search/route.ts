import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TMDB_BASE = "https://api.themoviedb.org/3";

function withKey(url: string) {
  const key =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY;

  return key
    ? `${url}${url.includes("?") ? "&" : "?"}api_key=${key}`
    : url;
}

function authHeaders(): Record<string, string> {
  const token =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN;

  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams
    .get("q")
    ?.trim()
    .slice(0, 60);

  if (!query || query.length < 2) {
    return NextResponse.json({
      results: [],
    });
  }

  try {
    const params = new URLSearchParams({
      query,
      language: "en-US",
      include_adult: "false",
      page: "1",
    });

    const response = await fetch(
      withKey(
        `${TMDB_BASE}/search/person?${params.toString()}`,
      ),
      {
        headers: authHeaders(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { results: [] },
        { status: 200 },
      );
    }

    const data = await response.json();

    const results = (
      Array.isArray(data?.results)
        ? data.results
        : []
    )
      .filter(
        (person: any) =>
          person?.id &&
          person?.name &&
          person?.adult !== true,
      )
      .slice(0, 10)
      .map((person: any) => {
        const knownFor = Array.isArray(person.known_for)
          ? person.known_for
              .map(
                (credit: any) =>
                  credit?.title || credit?.name,
              )
              .filter(Boolean)
              .slice(0, 3)
          : [];

        return {
          id: person.id,
          name: person.name,
          profile:
            person.profile_path
              ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
              : null,
          department:
            person.known_for_department ||
            "Entertainment",
          knownFor,
        };
      });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [] },
      { status: 200 },
    );
  }
}