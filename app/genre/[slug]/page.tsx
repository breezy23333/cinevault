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
    title: `${name} Movies & TV Shows | CineVault`,
    description: `Browse ${name} movies, TV shows, anime, cartoons, trending titles, and entertainment content on CineVault.`,
    alternates: {
      canonical: `/genre/${slug}`,
    },
    openGraph: {
      title: `${name} Movies & TV Shows | CineVault`,
      description: `Discover ${name} movies, shows, anime, cartoons, and entertainment content.`,
      url: `/genre/${slug}`,
      siteName: "CineVault",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Movies & TV Shows | CineVault`,
      description: `Explore ${name} movies, TV shows, anime, cartoons, and entertainment.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function GenrePage({ params }: PageProps) {
  const { slug } = await params;
  const genreName = formatGenre(slug);

  const genreJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genreName} Movies & TV Shows`,
    description: `Browse ${genreName} movies, TV shows, anime, cartoons, trending titles, and entertainment content on CineVault.`,
    url: `https://cinevault-tau-drab.vercel.app/genre/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "CineVault",
      url: "https://cinevault-tau-drab.vercel.app",
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
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          CineVault Genres
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">
          {genreName}
        </h1>

        <p className="mt-5 max-w-3xl text-lg text-white/65">
          Explore {genreName} movies, TV shows, anime, cartoons, trending
          titles, and entertainment recommendations on CineVault.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            href="/anime"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-pink-400/60"
          >
            Anime →
          </Link>

          <Link
            href="/cartoons"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-cyan-400/60"
          >
            Cartoons →
          </Link>
        </div>
      </section>
    </main>
  );
}