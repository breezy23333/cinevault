import Link from "next/link";
import { getUpcomingTvSeries } from "@/lib/fetchers";

export const revalidate = 300;

const img = (path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : "/og-image.png";

export default async function UpcomingTvPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page || 1));
  const shows = await getUpcomingTvSeries(page);

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <section className="rounded-[34px] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.04] to-blue-500/10 p-8">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
            Series Radar
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Upcoming TV Shows
          </h1>
          <p className="mt-4 max-w-3xl text-white/65">
            Discover upcoming TV series before they arrive.
          </p>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {shows
            .filter((show: any) => show.poster_path)
            .map((show: any) => (
              <Link
                key={show.id}
                href={`/tv/${show.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
              >
                <img
                  src={img(show.poster_path)}
                  alt={show.name || "TV Show"}
                  className="h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <div className="p-4">
                  <h3 className="line-clamp-1 font-black text-yellow-300">
                    {show.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    {show.first_air_date?.slice(0, 4) || "Coming soon"}
                  </p>
                </div>
              </Link>
            ))}
        </div>

        <div className="flex justify-center gap-4">
          {page > 1 && (
            <Link href={`/upcoming/tv?page=${page - 1}`}>
              ← Previous
            </Link>
          )}

          <Link href={`/upcoming/tv?page=${page + 1}`}>
            Next →
          </Link>
        </div>
      </div>
    </main>
  );
}