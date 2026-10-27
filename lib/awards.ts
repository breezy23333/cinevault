export type OmdbRating = {
  Source: string;
  Value: string;
};

export type AwardsData = {
  awards: string | null;
  imdbRating: string | null;
  imdbVotes: string | null;
  metascore: string | null;
  rottenTomatoes: string | null;
  boxOffice: string | null;
};

type OmdbResponse = {
  Response?: "True" | "False";
  Awards?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Metascore?: string;
  BoxOffice?: string;
  Ratings?: OmdbRating[];
  Error?: string;
};

function validValue(value?: string): string | null {
  if (!value || value === "N/A") return null;
  return value;
}

export async function fetchAwardsByImdbId(
  imdbId?: string | null
): Promise<AwardsData | null> {
  if (!imdbId) return null;

  const apiKey = process.env.OMDB_API_KEY?.trim();

  if (!apiKey) {
    console.warn("OMDB_API_KEY is missing");
    return null;
  }

  try {
    const url = new URL("https://www.omdbapi.com/");

    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("i", imdbId);
    url.searchParams.set("plot", "short");

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(4000),
      next: {
        revalidate: 60 * 60 * 24 * 7,
      },
    });

    const data: OmdbResponse | null = await response
      .json()
      .catch(() => null);

    if (!response.ok || !data || data.Response === "False") {
      const message = data?.Error || "No readable OMDb error message";

      console.error("OMDb request failed:", {
        status: response.status,
        imdbId,
        error: message.replaceAll(apiKey, "[REDACTED]"),
      });

      return null;
    }

    const rottenTomatoes =
      data.Ratings?.find(
        (rating) => rating.Source === "Rotten Tomatoes"
      )?.Value || null;

    const result: AwardsData = {
      awards: validValue(data.Awards),
      imdbRating: validValue(data.imdbRating),
      imdbVotes: validValue(data.imdbVotes),
      metascore: validValue(data.Metascore),
      rottenTomatoes: validValue(rottenTomatoes || undefined),
      boxOffice: validValue(data.BoxOffice),
    };

    const hasUsefulData = Object.values(result).some(Boolean);

    return hasUsefulData ? result : null;
  } catch (error) {
    console.error("Failed to fetch OMDb data:", error);
    return null;
  }
}