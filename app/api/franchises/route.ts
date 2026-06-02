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

export async function GET() {
  const results = await Promise.all(
    franchises.map(async (name) => {
      const query = franchiseQueries[name] || name;

      const url = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;           

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