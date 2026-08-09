import CineImage from "@/components/CineImage";
import Link from "next/link";
import { discoverMovies } from "@/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending Movies & TV Shows | CINRYVAN",
  description:
    "See what the world is watching right now. Discover trending movies, popular TV series, anime, cartoons, and entertainment on CINRYVAN.",
  keywords: [
    "trending movies",
    "trending tv shows",
    "popular movies",
    "popular series",
    "trending anime",
    "what to watch",
    "popular entertainment",
    "CINRYVAN trending",
  ],
  alternates: {
    canonical: "/trending",
  },
  openGraph: {
    title: "Trending Movies & TV Shows | CINRYVAN",
    description:
      "Explore trending movies, TV shows, anime, cartoons, and popular entertainment worldwide.",
    url: "/trending",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Movies & TV Shows | CINRYVAN",
    description:
      "See trending movies, shows, anime, cartoons, and entertainment now.",
    images: ["/og-image.png"],
  },
};

const img = (p?: string | null) =>
  p ? `https://image.tmdb.org/t/p/w342${p}` : null;

export default async function TrendingPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page || 1));

  const data = await discoverMovies({ page });
  const items = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 1, 500);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cinryvan.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Trending",
        item: "https://cinryvan.vercel.app/trending",
      },
    ],
  };

  const trendingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Trending Movies & TV Shows",
    description:
      "Discover trending movies, popular TV series, anime, cartoons, and entertainment on CINRYVAN.",
    url: "https://cinryvan.vercel.app/trending",
    isPartOf: {
      "@type": "WebSite",
      name: "CINRYVAN",
      url: "https://cinryvan.vercel.app",
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trendingJsonLd),
        }}
      />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            CINRYVAN Trending
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            Trending Movies
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Page {page} of popular movie discoveries, updated regularly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item: any) => {
          const poster = img(item.poster_path);
          const year = (item.release_date || "").slice(0, 4);

          return (
            <Link
              key={item.id}
              href={`/movie/${item.id}`}
              className="group overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-yellow-400/50"
            >
              <div className="relative aspect-[2/3] bg-black/30">
                <CineImage
                  src={poster}
                  alt={item.title || "Movie"}
                  fallback="No poster"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
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

      <div className="mt-10 flex items-center justify-center gap-3">
        {page > 1 && (
          <Link
            href={`/trending?page=${page - 1}`}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-bold hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            ← Previous
          </Link>
        )}

        <span className="rounded-full border border-white/10 bg-black/30 px-5 py-3 text-sm text-white/70">
          Page {page}
        </span>

        {page < totalPages && (
          <Link
            href={`/trending?page=${page + 1}`}
            className="rounded-full border border-yellow-400 bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
          >
            Next →
          </Link>
        )}
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-black">Continue Exploring</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Link href="/top" className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10">
            Top Rated →
          </Link>

          <Link href="/anime" className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10">
            Anime →
          </Link>

          <Link href="/cartoons" className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10">
            Cartoons →
          </Link>

          <Link href="/news" className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10">
            Entertainment News →
          </Link>

          <Link href="/upcoming" className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10">
            Upcoming Releases →
          </Link>
        </div>
      </section>
    </main>
  );
}