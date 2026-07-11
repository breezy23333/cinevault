import CineImage from "@/components/CineImage";
import Link from "next/link";
import { getTrendingTv } from "@/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending TV Shows | CineVault",
  description: "Discover trending TV shows people are watching right now.",
};

export default async function TrendingTvPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page || 1));

  const data = await getTrendingTv(page);
  const shows = data?.results || [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-28">
      <h1 className="mb-2 text-4xl font-bold text-white">
        Trending TV Shows
      </h1>

      <p className="mb-8 text-zinc-400">
        TV shows gaining attention across the world today.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {shows.map((show: any) => (
          <Link
            key={show.id}
            href={`/tv/${show.id}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="relative aspect-[2/3] bg-white/5">
              <CineImage
                src={
                  show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : null
                }
                alt={show.name || "TV Show"}
                fallback="No poster"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-3">
              <h2 className="line-clamp-1 font-semibold text-white">
                {show.name}
              </h2>

              <p className="text-sm text-zinc-400">
                ⭐ {show.vote_average?.toFixed(1) || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        {page > 1 && (
          <Link
            href={`/tv/trending?page=${page - 1}`}
            className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-yellow-400 hover:text-black"
          >
            ← Previous
          </Link>
        )}

        <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 text-sm font-black text-yellow-300">
          Page {page}
        </span>

        <Link
          href={`/tv/trending?page=${page + 1}`}
          className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-yellow-400 hover:text-black"
        >
          Next →
        </Link>
      </div>
    </main>
  );
}