import "server-only";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w780";

export type Franchise = {
  name: string;
  image: string | null;
};

type MovieImage = {
  backdrop_path?: string | null;
  poster_path?: string | null;
};

const franchiseQueries: Record<string, string> = {
  Marvel: "Avengers Endgame",
  DC: "Justice League",
  "Star Wars": "Star Wars",
  "Fast and Furious": "Fast X",
  "Harry Potter": "Harry Potter",
  "Lord of the Rings": "The Lord of the Rings",
  "The Hobbit": "The Hobbit",
  "Jurassic Park": "Jurassic Park",
  "Jurassic World": "Jurassic World",
  Transformers: "Transformers Rise of the Beasts",
  "Mission Impossible": "Mission Impossible Dead Reckoning",
  "Pirates of the Caribbean": "Pirates of the Caribbean",
  "John Wick": "John Wick",
  "The Matrix": "The Matrix",
  Avatar: "Avatar The Way of Water",
  Batman: "The Batman",
  "Spider-Man": "Spider-Man No Way Home",
  Avengers: "Avengers Endgame",
  Deadpool: "Deadpool & Wolverine",
  Pokemon: "Detective Pikachu",
  Dune: "Dune Part Two",
  "X-Men": "X-Men Days of Future Past",
  "Black Panther": "Black Panther Wakanda Forever",
  Godzilla: "Godzilla x Kong",
  "King Kong": "Godzilla x Kong",
  Sonic: "Sonic the Hedgehog 3",
  "Super Mario Bros": "The Super Mario Bros Movie",
};

function authHeaders(): Record<string, string> | undefined {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  return bearer
    ? { Authorization: `Bearer ${bearer}` }
    : undefined;
}

function isMovieImage(value: unknown): value is MovieImage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.backdrop_path === "string" ||
    typeof item.poster_path === "string"
  );
}

export async function getFranchises(): Promise<Franchise[]> {
  return Promise.all(
    Object.entries(franchiseQueries).map(
      async ([name, query]): Promise<Franchise> => {
        const controller = new AbortController();
        const timeout = setTimeout(
          () => controller.abort(),
          8000,
        );

        try {
          const url = new URL(`${TMDB_BASE}/search/movie`);

          url.searchParams.set("query", query);
          url.searchParams.set("include_adult", "false");
          url.searchParams.set("language", "en-US");
          url.searchParams.set("page", "1");

          const headers = authHeaders();

          if (!headers) {
            const apiKey = process.env.TMDB_API_KEY;

            if (!apiKey) {
              throw new Error("TMDB credentials are missing");
            }

            url.searchParams.set("api_key", apiKey);
          }

          const response = await fetch(url.toString(), {
            headers,
            signal: controller.signal,
            next: { revalidate: 86400 },
          });

          if (!response.ok) {
            throw new Error(
              `TMDB returned HTTP ${response.status}`,
            );
          }

          const data = await response.json();

          if (!data || !Array.isArray(data.results)) {
            throw new Error("Invalid TMDB results");
          }

          const results: unknown[] = data.results;
          const movie = results.find(isMovieImage);
          const imagePath =
            movie?.backdrop_path || movie?.poster_path;

          return {
            name,
            image: imagePath
              ? `${IMG_BASE}${imagePath}`
              : null,
          };
        } catch (error) {
          console.error(
            `Unable to load franchise image for ${name}:`,
            error,
          );

          return {
            name,
            image: null,
          };
        } finally {
          clearTimeout(timeout);
        }
      },
    ),
  );
}