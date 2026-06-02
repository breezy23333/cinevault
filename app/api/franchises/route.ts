import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w780";

const franchises = [
  "Marvel",
  "DC",
  "Star Wars",
  "Fast and Furious",
  "Harry Potter",
  "Lord of the Rings",
  "The Hobbit",
  "Jurassic Park",
  "Jurassic World",
  "Transformers",
  "Mission Impossible",
  "Pirates of the Caribbean",
  "John Wick",
  "The Matrix",
  "Avatar",
  "Batman",
  "Spider-Man",
  "Avengers",
  "Deadpool",
  "Pokemon",
  "Dune",
  "X-Men",
  "Black Panther",
  "Godzilla",
  "King Kong",
  "Sonic",
  "Super Mario Bros",
];

function authHeaders() {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  return bearer ? { Authorization: `Bearer ${bearer}` } : undefined;
}

export async function GET() {
  const results = await Promise.all(
    franchises.map(async (name) => {
      const url = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(
        name
      )}&include_adult=false&language=en-US&page=1`;

      const res = await fetch(url, {
        headers: authHeaders(),
        next: { revalidate: 86400 },
      });

      const data = await res.json();

      const movie = data.results?.find(
        (item: any) => item.backdrop_path || item.poster_path
      );

      return {
        name,
        image: movie?.backdrop_path
          ? `${IMG_BASE}${movie.backdrop_path}`
          : movie?.poster_path
          ? `${IMG_BASE}${movie.poster_path}`
          : null,
      };
    })
  );

  return NextResponse.json(results);
}