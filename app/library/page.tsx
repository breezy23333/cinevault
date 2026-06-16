import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CineVault Library",
  description:
    "Explore your CineVault library, saved movies, TV shows, anime, cartoons, and entertainment collections.",
  keywords: [
    "movie library",
    "watchlist",
    "saved movies",
    "saved tv shows",
    "anime library",
    "CineVault library",
  ],
  alternates: {
    canonical: "/library",
  },
  openGraph: {
    title: "CineVault Library",
    description:
      "Manage and explore your personal entertainment library on CineVault.",
    url: "/library",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineVault Library",
    description:
      "Explore saved movies, TV shows, anime, and cartoons.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  const libraryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CineVault Library",
    description:
      "Explore saved movies, TV shows, anime, cartoons, and entertainment collections.",
    url: "https://cinevault-tau-drab.vercel.app/library",
  };

  return (
  <main className="min-h-screen bg-[#05070d] px-6 py-24 text-white">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(libraryJsonLd),
      }}
    />

    <section className="mx-auto max-w-6xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
        CineVault Collection
      </p>

      <h1 className="mt-4 text-5xl font-black md:text-7xl">
        Library
      </h1>

      <p className="mt-5 max-w-3xl text-lg text-white/65">
        Build your personal collection of movies, TV shows, anime,
        cartoons, trending titles, and entertainment discoveries.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black text-yellow-300">Movies</h2>
          <p className="mt-3 text-white/60">
            Save films you want to watch later.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black text-yellow-300">TV Shows</h2>
          <p className="mt-3 text-white/60">
            Track your favorite series and episodes.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black text-yellow-300">Anime</h2>
          <p className="mt-3 text-white/60">
            Organize anime series and movies.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black text-yellow-300">Cartoons</h2>
          <p className="mt-3 text-white/60">
            Keep your animation collection together.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <Link
          href="/watchlist"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-yellow-400/60"
        >
          Watchlist →
        </Link>

        <Link
          href="/trending"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-yellow-400/60"
        >
          Trending →
        </Link>

        <Link
          href="/top"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-yellow-400/60"
        >
          Top Rated →
        </Link>

        <Link
          href="/search"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-yellow-400/60"
        >
          Search →
        </Link>
      </div>
    </section>
  </main>
);
}