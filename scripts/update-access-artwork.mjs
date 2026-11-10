import nextEnv from "@next/env";
import { mkdir, writeFile } from "node:fs/promises";

nextEnv.loadEnvConfig(process.cwd());

const token = process.env.TMDB_BEARER;
const apiKey = process.env.TMDB_API_KEY;

if (!token && !apiKey) {
  throw new Error("TMDB credentials are missing.");
}

const url = new URL(
  "https://api.themoviedb.org/3/movie/popular"
);

url.searchParams.set("language", "en-US");
url.searchParams.set("page", "1");

if (!token && apiKey) {
  url.searchParams.set("api_key", apiKey);
}

const response = await fetch(url, {
  headers: token
    ? { Authorization: `Bearer ${token}` }
    : undefined,
  signal: AbortSignal.timeout(15000),
});

if (!response.ok) {
  throw new Error(`Artwork request failed (${response.status}).`);
}

const data = await response.json();

const movies = (Array.isArray(data.results) ? data.results : [])
  .filter(
    (movie) =>
      movie.adult !== true &&
      typeof movie.poster_path === "string" &&
      typeof movie.backdrop_path === "string"
  )
  .slice(0, 8);

if (movies.length < 4) {
  throw new Error("Not enough movie artwork was returned.");
}

const artwork = {
  backdrop:
    `https://image.tmdb.org/t/p/w1280${movies[0].backdrop_path}`,
  posters: movies.map(
    (movie) =>
      `https://image.tmdb.org/t/p/w342${movie.poster_path}`
  ),
};

await mkdir("lib", { recursive: true });
await writeFile(
  "lib/accessArtwork.json",
  JSON.stringify(artwork, null, 2) + "\n",
  "utf8"
);

console.log("Created lib/accessArtwork.json with movie artwork.");