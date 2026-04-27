import Image from "next/image";
import Link from "next/link";
import { discoverMovies } from "@/lib/fetchers";

export const revalidate = 300;

const img = (p?: string | null) =>
  p ? `https://image.tmdb.org/t/p/w342${p}` : null;

export default async function TrendingPage() {
  const data = await discoverMovies({ page: 1 }); // you can improve later
  const items = data?.results ?? [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Trending</h1>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item: any) => {
          const poster = img(item.poster_path);
          const year = (item.release_date || "").slice(0, 4);

          return (
            <Link
              key={item.id}
              href={`/movie/${item.id}`}
              className="overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 hover:ring-yellow-400/50"
            >
              <div className="relative aspect-[2/3] bg-black/30">
                {poster ? (
                  <Image
                    src={poster}
                    alt={item.title || "Movie"}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-white/50">
                    No poster
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="line-clamp-1 font-semibold">
                  {item.title || "Untitled"}
                </p>
                <p className="text-sm text-white/60">
                  {year || "—"} · ★ {item.vote_average?.toFixed?.(1) ?? "N/A"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}