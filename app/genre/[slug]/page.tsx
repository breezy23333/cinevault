import type { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatGenre(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = formatGenre(slug);

  return {
    title: `${name} Movies & Shows | CINRYVAN`,
    description: `Browse ${name} movies, TV shows, anime, cartoons, trending titles, and entertainment picks on CINRYVAN.`,
    alternates: {
      canonical: `/genre/${slug}`,
    },
    openGraph: {
      title: `${name} Movies & Shows | CINRYVAN`,
      description: `Discover ${name} movies, shows, anime, cartoons, and entertainment content.`,
      url: `/genre/${slug}`,
      siteName: "CINRYVAN",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Movies & Shows | CINRYVAN`,
      description: `Explore ${name} movies, TV shows, anime, cartoons, and entertainment.`,
      images: ["/og-image.png"],
    },
  };
}

const links = [
  { label: "Search Titles", href: "/search" },
  { label: "Trending", href: "/trending" },
  { label: "Top Rated", href: "/top" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "Anime", href: "/anime" },
  { label: "Cartoons", href: "/cartoons" },
  { label: "News", href: "/news" },
  { label: "Community", href: "/community" },
];

export default async function GenrePage({ params }: PageProps) {
  const { slug } = await params;
  const genreName = formatGenre(slug);

  const genreJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genreName} Movies & Shows`,
    description: `Browse ${genreName} movies, TV shows, anime, cartoons, trending titles, and entertainment content on CINRYVAN.`,
    url: `https://cinryvan.vercel.app/genre/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "CINRYVAN",
      url: "https://cinryvan.vercel.app",
    },
  };

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(genreJsonLd),
        }}
      />

      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-yellow-400/[0.08] p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            CINRYVAN Genres
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black md:text-7xl">
            {genreName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
            Explore {genreName} movies, TV shows, anime, cartoons, trending
            titles, top rated picks, upcoming releases, and entertainment
            recommendations on CINRYVAN.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/search?genre=${slug}`}
              className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
            >
              Browse {genreName}
            </Link>

            <Link
              href="/trending"
              className="rounded-full border border-white/15 px-6 py-3 font-black text-white hover:border-yellow-400/70"
            >
              Trending Now
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-black transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/[0.07]"
            >
              {item.label} →
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}