import Image from "next/image";
import Link from "next/link";
import { getTrendingTv } from "@/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending TV Shows | CineVault",
  description: "Discover trending TV shows people are watching right now.",
};

export default async function TrendingTvPage() {
  const data = await getTrendingTv();
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
            <Image
              src={
                show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                  : "/placeholder.png"
              }
              alt={show.name || "TV Show"}
              width={500}
              height={750}
              className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
            />

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
    </main>
  );
}