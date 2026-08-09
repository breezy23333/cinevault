import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Library | CINRYVAN",
  description:
    "Explore your CINRYVAN library, saved movies, TV shows, anime, cartoons, watchlist, and entertainment collections.",
  alternates: {
    canonical: "/library",
  },
  openGraph: {
    title: "Library | CINRYVAN",
    description:
      "Manage and explore your personal entertainment library on CINRYVAN.",
    url: "/library",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Library | CINRYVAN",
    description: "Explore saved movies, TV shows, anime, and cartoons.",
    images: ["/og-image.png"],
  },
};

const collections = [
  {
    title: "Watchlist",
    text: "Continue building your saved collection of movies, TV shows, anime, and cartoons.",
    href: "/watchlist",
  },
  {
    title: "Trending Movies",
    text: "See what everyone is watching right now.",
    href: "/trending",
  },
  {
    title: "Top Rated",
    text: "Explore the highest rated movies and shows on CINRYVAN.",
    href: "/top",
  },
  {
    title: "Anime Collection",
    text: "Browse anime series, movies, and fan favorites.",
    href: "/anime",
  },
  {
    title: "Cartoon Collection",
    text: "Discover animated classics, family picks, and modern cartoons.",
    href: "/cartoons",
  },
  {
    title: "Search Library",
    text: "Search across movies, TV shows, anime, cartoons, and entertainment picks.",
    href: "/search",
  },
];

export default function LibraryPage() {
  const libraryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CINRYVAN Library",
    description:
      "Explore saved movies, TV shows, anime, cartoons, and entertainment collections.",
    url: "https://cinryvan.vercel.app/library",
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
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-yellow-400/[0.08] p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            CINRYVAN Collection
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black md:text-7xl">
            Your Entertainment Library
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
            Build your personal collection of movies, TV shows, anime,
            cartoons, trending titles, and entertainment discoveries. Save what
            you love, return to your watchlist, and keep exploring.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/watchlist"
              className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
            >
              Open Watchlist
            </Link>

            <Link
              href="/search"
              className="rounded-full border border-white/15 px-6 py-3 font-black text-white hover:border-yellow-400/70"
            >
              Search Titles
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {collections.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/[0.07]"
            >
              <h2 className="text-xl font-black text-yellow-300">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/60">
                {item.text}
              </p>

              <p className="mt-5 text-sm font-black text-white/80 group-hover:text-yellow-300">
                Open collection →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-2xl font-black">Library shortcuts</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Link
              href="/trending"
              className="rounded-2xl bg-black/25 p-5 font-black hover:text-yellow-300"
            >
              Trending →
            </Link>

            <Link
              href="/top"
              className="rounded-2xl bg-black/25 p-5 font-black hover:text-yellow-300"
            >
              Top Rated →
            </Link>

            <Link
              href="/upcoming"
              className="rounded-2xl bg-black/25 p-5 font-black hover:text-yellow-300"
            >
              Upcoming →
            </Link>

            <Link
              href="/news"
              className="rounded-2xl bg-black/25 p-5 font-black hover:text-yellow-300"
            >
              News →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}