import type { Metadata } from "next";
import Link from "next/link";
import CineImage from "@/components/CineImage";

export const metadata: Metadata = {
  title: "Movies | CineVault",
  description:
    "Browse popular movies, trending films, top rated cinema, upcoming releases, and movie recommendations on CineVault.",
  alternates: {
    canonical: "/movie",
  },
};

const TMDB_BASE = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
};

async function getMovies(page = 1) {
  const token =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  let res: Response;

  try {
    res = await fetch(
      `${TMDB_BASE}/movie/popular?language=en-US&page=${page}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        next: { revalidate: 300 },
      }
    );
  } catch {
    return { results: [], page: 1, total_pages: 1 };
  }

  if (!res.ok) return { results: [], page: 1, total_pages: 1 };

  return res.json();
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const data = await getMovies(page);
  const movies: Movie[] = data.results || [];

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          CineVault Movies
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">
          Movies
        </h1>

        <p className="mt-5 max-w-3xl text-lg text-white/65">
          Browse popular movies, trending films, top rated cinema,
          upcoming releases, and entertainment discoveries.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-yellow-400/60"
            >
              <div className="relative aspect-[2/3] bg-white/5">
                <CineImage
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null
                    }
                    alt={movie.title}
                    fallback="No image"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
              </div>

              <div className="p-4">
                <h2 className="line-clamp-1 font-black">
                  {movie.title}
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  {movie.release_date?.slice(0, 4) || "Unknown"} • ⭐{" "}
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/movie?page=${page - 1}`}
              className="rounded-full border border-white/10 px-6 py-3 font-black hover:border-yellow-400/60"
            >
              ← Previous
            </Link>
          )}

          <span className="rounded-full bg-white/[0.06] px-6 py-3 font-black">
            Page {page}
          </span>

          <Link
            href={`/movie?page=${page + 1}`}
            className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
          >
            Next →
          </Link>
        </div>
      </section>
    </main>
  );
}