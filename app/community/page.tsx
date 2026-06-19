import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community | CineVault",
  description:
    "Join the CineVault community to discuss movies, TV shows, anime, cartoons, reviews, recommendations, and entertainment news.",
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Community | CineVault",
    description:
      "Connect with movie fans, anime lovers, and entertainment enthusiasts on CineVault.",
    url: "/community",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community | CineVault",
    description: "Discuss movies, TV shows, anime, cartoons, and entertainment.",
    images: ["/og-image.png"],
  },
};

const hubs = [
  {
    title: "Movie Reviews",
    text: "Share your thoughts on new releases, classics, hidden gems, and trending films.",
    href: "/trending",
  },
  {
    title: "TV Discussions",
    text: "Talk about episodes, seasons, finales, theories, and binge-worthy shows.",
    href: "/search?type=tv",
  },
  {
    title: "Anime Corner",
    text: "Explore anime recommendations, story arcs, characters, and fan favorites.",
    href: "/anime",
  },
  {
    title: "Cartoon Vault",
    text: "Discover animated classics, modern cartoons, family picks, and nostalgic favorites.",
    href: "/cartoons",
  },
  {
    title: "Entertainment News",
    text: "Follow the latest movie, TV, celebrity, streaming, and anime news.",
    href: "/news",
  },
  {
    title: "Top Rated Picks",
    text: "See what audiences love most and find highly rated titles worth watching.",
    href: "/top",
  },
];

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
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-yellow-400/[0.08] p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            CineVault Social Hub
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black md:text-7xl">
            Join the CineVault Community
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
            Connect with movie fans, TV lovers, anime watchers, cartoon fans,
            and entertainment followers. Discover recommendations, reviews,
            trending conversations, and what the community is watching next.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/trending"
              className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
            >
              Explore Trending
            </Link>

            <Link
              href="/news"
              className="rounded-full border border-white/15 px-6 py-3 font-black text-white hover:border-yellow-400/70"
            >
              Read News
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {hubs.map((hub) => (
            <Link
              key={hub.title}
              href={hub.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/[0.07]"
            >
              <h2 className="text-xl font-black text-yellow-300">
                {hub.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/60">
                {hub.text}
              </p>

              <p className="mt-5 text-sm font-black text-white/80 group-hover:text-yellow-300">
                Open section →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-2xl font-black">What you can do here</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-black/25 p-5">
              <p className="font-black text-yellow-300">Review</p>
              <p className="mt-2 text-sm text-white/60">
                Share opinions on movies, shows, anime, and cartoons.
              </p>
            </div>

            <div className="rounded-2xl bg-black/25 p-5">
              <p className="font-black text-yellow-300">Recommend</p>
              <p className="mt-2 text-sm text-white/60">
                Help others discover what to watch next.
              </p>
            </div>

            <div className="rounded-2xl bg-black/25 p-5">
              <p className="font-black text-yellow-300">Discover</p>
              <p className="mt-2 text-sm text-white/60">
                Find trending picks, top rated titles, and fresh news.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}