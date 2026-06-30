import Link from "next/link";

const links = [
  { title: "Movies", href: "/search", desc: "Discover popular and new movies." },
  { title: "TV Shows", href: "/search?type=tv", desc: "Explore trending and top TV shows." },
  { title: "Anime", href: "/anime", desc: "Browse anime worlds and series." },
  { title: "Cartoons", href: "/cartoons", desc: "Find animated classics and cartoons." },
  { title: "Animation", href: "/animation", desc: "Anime, cartoons, and animated movies." },
  { title: "Categories", href: "/categories", desc: "Browse by genre and mood." },
  { title: "Action", href: "/search?genre=28", desc: "Fast fights, heroes, and chaos." },
  { title: "Horror", href: "/search?genre=27", desc: "Scary movies and dark stories." },
  { title: "Comedy", href: "/search?genre=35", desc: "Funny films and comfort watches." },
  { title: "Drama", href: "/search?genre=18", desc: "Emotional and powerful stories." },
  { title: "Sci-Fi", href: "/search?genre=878", desc: "Future worlds and big ideas." },
  { title: "Romance", href: "/search?genre=10749", desc: "Love stories and relationship drama." },
  { title: "Top Rated", href: "/top", desc: "The best-rated titles on CineVault." },
  { title: "Trending", href: "/trending", desc: "See what people are watching now." },
  { title: "Upcoming", href: "/upcoming", desc: "Movies and shows coming soon." },
  { title: "News", href: "/news", desc: "Entertainment, gaming, and sports news." },
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
            <p className="mt-2 text-sm text-white/60">{item.desc}</p>
            <p className="text-yellow-400 mt-4 font-bold">Open →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}