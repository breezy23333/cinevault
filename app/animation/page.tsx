import Image from "next/image";
import Link from "next/link";
import { discoverMovies } from "@/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Animation Movies & Shows",
  description:
    "Discover anime, cartoons, animated movies, family adventures, fantasy worlds, and top animated entertainment on CINRYVAN.",
  alternates: {
    canonical: "/animation",
  },
};

export default async function AnimationPage() {
  const animation = await discoverMovies({
    genreId: 16,
  });

  const items = animation?.results?.slice(0, 18) || [];
  const hero = items[0];

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-12">
        {hero?.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
            alt={hero.title || "Animation"}
            fill
            priority
            className="object-cover opacity-25"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#05070d]/80 to-[#05070d]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            CINRYVAN Animation
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black md:text-7xl">
            Anime, cartoons, animated movies & fantasy worlds.
          </h1>

          <p className="mt-5 max-w-2xl text-base text-zinc-300 md:text-lg">
            Explore the best animated stories from emotional anime adventures to
            family cartoons, fantasy films, superhero animation, and legendary
            animated classics.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/anime"
              className="rounded-full bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300"
            >
              Explore Anime
            </Link>

            <Link
              href="/cartoons"
              className="rounded-full border border-yellow-400 px-6 py-3 font-bold text-yellow-300 hover:bg-yellow-400 hover:text-black"
            >
              Explore Cartoons
            </Link>

            <Link
              href="/search?genre=16"
              className="rounded-full border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              Browse All Animation
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/anime"
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-yellow-400/70"
          >
            <h2 className="text-2xl font-black text-yellow-300">Anime</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Action, fantasy, romance, dark stories, emotional journeys, and
              powerful animated worlds.
            </p>
          </Link>

          <Link
            href="/cartoons"
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-yellow-400/70"
          >
            <h2 className="text-2xl font-black text-yellow-300">Cartoons</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Fun, family-friendly, nostalgic, comedy-filled animated shows and
              movies.
            </p>
          </Link>

          <Link
            href="/upcoming/animation"
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-yellow-400/70"
          >
            <h2 className="text-2xl font-black text-yellow-300">
              Upcoming Animation
            </h2>
            <p className="mt-3 text-sm text-zinc-300">
              See new animated movies and shows coming soon.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
              Popular Now
            </p>
            <h2 className="mt-2 text-3xl font-black">Trending Animation</h2>
          </div>

          <Link
            href="/search?genre=16"
            className="text-sm font-bold text-yellow-300 hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item: any) => (
            <Link
              key={item.id}
              href={`/movie/${item.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || "Animation poster"}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-900 text-sm text-zinc-500">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-bold">
                  {item.title || item.name}
                </h3>

                <p className="mt-1 text-xs text-zinc-400">
                  ⭐ {item.vote_average?.toFixed?.(1) || "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}