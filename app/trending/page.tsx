import Image from "next/image";
import Link from "next/link";
import { discoverMovies } from "@/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending Movies & TV Shows | CineVault",
  description:
    "See what the world is watching right now. Discover trending movies, TV series, anime, and animated content on CineVault.",
  keywords: [
    "trending movies",
    "trending tv shows",
    "popular movies",
    "popular series",
    "trending anime",
    "what to watch",
    "cinevault trending",
  ],
  openGraph: {
    title: "Trending Movies & TV Shows | CineVault",
    description:
      "Explore the hottest entertainment trending worldwide.",
    type: "website",
  },
};

const img = (p?: string | null) =>
  p ? `https://image.tmdb.org/t/p/w342${p}` : null;

export default async function TrendingPage() {
  const data = await discoverMovies({ page: 1 }); // you can improve later
  const items = data?.results ?? [];

  const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://cinevault-tau-drab.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Trending",
      item: "https://cinevault-tau-drab.vercel.app/trending",
    },
  ],
};

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

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

        <section className="mt-12 px-4 md:px-8">
          <h2 className="text-2xl font-black mb-4">
            Continue Exploring
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Link
              href="/top"
              className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10"
            >
              Top Rated →
            </Link>

            <Link
              href="/anime"
              className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10"
            >
              Anime →
            </Link>

            <Link
              href="/cartoons"
              className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10"
            >
              Cartoons →
            </Link>

            <Link
              href="/news"
              className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10"
            >
              Entertainment News →
            </Link>

            <Link
              href="/upcoming"
              className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10"
            >
              Upcoming Releases →
            </Link>
          </div>
        </section>

    </main>
  );
}