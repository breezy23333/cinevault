import Link from "next/link";

const links = [
  { title: "Anime", href: "/anime" },
  { title: "Cartoons", href: "/cartoons" },
  { title: "Categories", href: "/categories" },
  { title: "Top Rated", href: "/top" },
  { title: "Search", href: "/search" },
  { title: "Trending", href: "/trending" },
  { title: "News", href: "/news" },
  { title: "Upcoming", href: "/upcoming" },
];

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Movies, TV Shows, Anime & Cartoons | CineVault",
  description:
    "Browse movies, TV shows, anime, cartoons, top-rated titles, and categories on CineVault.",
  keywords: [
    "browse movies",
    "browse tv shows",
    "anime",
    "cartoons",
    "top rated movies",
    "movie categories",
    "CineVault",
  ],
  alternates: {
    canonical: "/browse",
  },
  openGraph: {
    title: "Browse Movies, TV Shows, Anime & Cartoons | CineVault",
    description:
      "Explore movies, TV shows, anime, cartoons, categories, and top-rated content on CineVault.",
    url: "/browse",
    siteName: "CineVault",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Browse CineVault",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Movies, TV Shows, Anime & Cartoons | CineVault",
    description:
      "Discover movies, TV shows, anime, cartoons, and top-rated content.",
    images: ["/og-image.png"],
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Browse CineVault",
  description:
    "Browse movies, TV shows, anime, cartoons, categories, and top-rated content.",
  url: "https://cinevault-tau-drab.vercel.app/browse",
};

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-[#0e131f] px-6 md:px-12 py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />

      <h1 className="text-4xl md:text-6xl font-black mb-4">Browse CineVault</h1>
      <p className="text-white/60 mb-10 max-w-2xl">
        Explore movies, TV shows, anime, cartoons, categories, and top-rated titles.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl bg-[#0c111b] ring-1 ring-white/10 p-6 hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="text-yellow-400 mt-2">Open →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}