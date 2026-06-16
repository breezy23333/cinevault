import Link from "next/link";
import type { Metadata } from "next";

const CATS: { label: string; id: number; hue: string }[] = [
  { label: "Action", id: 28, hue: "from-red-300 to-orange-300" },
  { label: "Adventure", id: 12, hue: "from-amber-300 to-yellow-300" },
  { label: "Animation", id: 16, hue: "from-pink-300 to-fuchsia-300" },
  { label: "Comedy", id: 35, hue: "from-lime-300 to-green-300" },
  { label: "Crime", id: 80, hue: "from-slate-300 to-zinc-200" },
  { label: "Documentary", id: 99, hue: "from-emerald-300 to-teal-300" },
  { label: "Drama", id: 18, hue: "from-rose-300 to-amber-300" },
  { label: "Family", id: 10751, hue: "from-sky-300 to-cyan-300" },
  { label: "Fantasy", id: 14, hue: "from-indigo-300 to-violet-300" },
  { label: "Horror", id: 27, hue: "from-zinc-300 to-slate-300" },
  { label: "Mystery", id: 9648, hue: "from-violet-300 to-purple-300" },
  { label: "Romance", id: 10749, hue: "from-rose-300 to-pink-300" },
  { label: "Sci-Fi", id: 878, hue: "from-blue-300 to-sky-300" },
  { label: "Thriller", id: 53, hue: "from-orange-300 to-amber-300" },
];

<div className="mt-10 grid gap-4 md:grid-cols-4">
  <Link href="/trending">Trending Movies →</Link>
  <Link href="/top">Top Rated →</Link>
  <Link href="/anime">Anime →</Link>
  <Link href="/cartoons">Cartoons →</Link>
</div>

export const metadata: Metadata = {
  title: "Movie Categories & Genres | CineVault",
  description:
    "Browse movies and TV shows by genre including Action, Comedy, Drama, Horror, Sci-Fi, Romance, Fantasy, Thriller, and more.",
  keywords: [
    "movie genres",
    "movie categories",
    "action movies",
    "comedy movies",
    "drama movies",
    "horror movies",
    "science fiction movies",
    "fantasy movies",
    "thriller movies",
    "CineVault genres",
  ],
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "Movie Categories & Genres | CineVault",
    description:
      "Explore movies and TV shows by genre on CineVault.",
    url: "/categories",
    siteName: "CineVault",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CineVault Categories",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Categories & Genres | CineVault",
    description:
      "Browse Action, Comedy, Drama, Horror, Sci-Fi, Fantasy and more.",
    images: ["/og-image.png"],
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Movie Categories & Genres",
  description:
    "Browse movies and TV shows by genre including Action, Comedy, Drama, Horror, Sci-Fi, Romance, Fantasy, and Thriller.",
  url: "https://cinevault-tau-drab.vercel.app/categories",
};

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />

      <h1 className="text-2xl font-bold mb-4">Browse by category</h1>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATS.map((c) => (
          <li key={c.id}>
            <Link
              href={`/search?genre=${c.id}`}
              className={`block rounded-2xl border border-zinc-200 bg-gradient-to-br ${c.hue} p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <div className="text-lg font-semibold text-zinc-800 drop-shadow-sm">{c.label}</div>
              <div className="mt-1 text-xs text-zinc-700/80">Tap to explore</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
