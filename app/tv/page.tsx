import type { Metadata } from "next";
import Link from "next/link";
import CineImage from "@/components/CineImage";

export const metadata: Metadata = {
  title: "TV Shows | CINRYVAN",
  description:
    "Browse popular TV shows, trending series, top rated shows, drama, fantasy, crime, anime, and entertainment recommendations on CINRYVAN.",
  alternates: {
    canonical: "/tv",
  },
};

const TMDB_BASE = "https://api.themoviedb.org/3";

type Show = {
  id: number;
  name: string;
  overview?: string;
  poster_path?: string;
  first_air_date?: string;
  vote_average?: number;
};

async function getTvShows(page = 1) {
  const token =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  let res: Response;

  try {
    res = await fetch(
      `${TMDB_BASE}/tv/popular?language=en-US&page=${page}`,
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

export default async function TVPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const data = await getTvShows(page);
  const shows: Show[] = data.results || [];

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-24 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          CINRYVAN TV
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">
          TV Shows
        </h1>

        <p className="mt-5 max-w-3xl text-lg text-white/65">
          Browse popular TV shows, trending series, top rated shows, drama,
          fantasy, crime stories, anime, and entertainment discoveries.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {shows.map((show) => (
            <Link
              key={show.id}
              href={`/tv/${show.id}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-yellow-400/60"
            >
              <div className="relative aspect-[2/3] bg-white/5">
                <CineImage
                    src={
                      show.poster_path
                        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                        : null
                    }
                    alt={show.name}
                    fallback="No poster"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
              </div>

              <div className="p-4">
                <h2 className="line-clamp-1 font-black">
                  {show.name}
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  {show.first_air_date?.slice(0, 4) || "Unknown"} • ⭐{" "}
                  {show.vote_average?.toFixed(1) || "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/tv?page=${page - 1}`}
              className="rounded-full border border-white/10 px-6 py-3 font-black hover:border-yellow-400/60"
            >
              ← Previous
            </Link>
          )}

          <span className="rounded-full bg-white/[0.06] px-6 py-3 font-black">
            Page {page}
          </span>

          <Link
            href={`/tv?page=${page + 1}`}
            className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
          >
            Next →
          </Link>
        </div>
      </section>
    </main>
  );
}