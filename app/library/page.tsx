import type { Metadata } from "next";

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
    <main className="min-h-screen px-6 py-20">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(libraryJsonLd),
        }}
      />

      <h1 className="text-5xl font-black">Library</h1>

      <p className="mt-4 text-white/70 max-w-2xl">
        Build your personal collection of movies, TV shows, anime,
        cartoons, and entertainment discoveries.
      </p>
    </main>
  );
}