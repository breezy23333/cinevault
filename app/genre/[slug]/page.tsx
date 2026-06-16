import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const name =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return {
    title: `${name} Movies & TV Shows | CineVault`,
    description: `Browse ${name} movies, TV shows, anime, and entertainment content on CineVault.`,
    alternates: {
      canonical: `/genre/${slug}`,
    },
    openGraph: {
      title: `${name} Movies & TV Shows | CineVault`,
      description: `Discover ${name} content on CineVault.`,
      url: `/genre/${slug}`,
      siteName: "CineVault",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Movies & TV Shows | CineVault`,
      description: `Explore ${name} content on CineVault.`,
      images: ["/og-image.png"],
    },
  };
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function GenrePage({ params }: PageProps) {
  const { slug } = await params;

  const genreName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  const genreJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genreName} Movies & TV Shows`,
    description: `Browse ${genreName} content on CineVault.`,
    url: `https://cinevault-tau-drab.vercel.app/genre/${slug}`,
  };

  return (
    <main className="min-h-screen px-6 py-20">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(genreJsonLd),
        }}
      />

      <h1 className="text-5xl font-black">{genreName}</h1>

      <p className="mt-4 text-white/70">
        Explore {genreName} movies, TV shows, anime, and entertainment content.
      </p>
    </main>
  );
}
