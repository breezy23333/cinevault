import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CineVault Community",
  description:
    "Join the CineVault community to discuss movies, TV shows, anime, cartoons, reviews, recommendations, and entertainment news.",
  keywords: [
    "movie community",
    "tv show community",
    "anime community",
    "cartoon community",
    "movie discussions",
    "movie reviews",
    "CineVault community",
  ],
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "CineVault Community",
    description:
      "Connect with movie fans, anime lovers, and entertainment enthusiasts on CineVault.",
    url: "/community",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineVault Community",
    description:
      "Discuss movies, TV shows, anime, cartoons, and entertainment.",
    images: ["/og-image.png"],
  },
};

export default function CommunityPage() {
  const communityJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CineVault Community",
    description:
      "Movie discussions, reviews, recommendations, anime, TV shows, cartoons, and entertainment conversations.",
    url: "https://cinevault-tau-drab.vercel.app/community",
  };

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(communityJsonLd),
        }}
      />

      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          CineVault Social Hub
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">
          Community
        </h1>

        <p className="mt-5 max-w-3xl text-lg text-white/65">
          Connect with fellow movie fans, TV enthusiasts, anime lovers,
          and animation fans. Share recommendations, reviews, ratings,
          and discover what the community is watching.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-black text-yellow-300">
              Reviews
            </h2>
            <p className="mt-3 text-white/60">
              Read and share movie and TV reviews.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-black text-yellow-300">
              Recommendations
            </h2>
            <p className="mt-3 text-white/60">
              Discover hidden gems from the community.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-black text-yellow-300">
              Discussions
            </h2>
            <p className="mt-3 text-white/60">
              Talk about movies, TV shows, anime, and entertainment.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
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