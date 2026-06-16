import type { Metadata } from "next";

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

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-20">
      <h1 className="text-5xl font-black">CineVault Community</h1>

      <p className="mt-4 text-white/70 max-w-2xl">
        Connect with fellow movie fans, anime lovers, TV enthusiasts,
        and animation fans. Community features are coming soon.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <a href="/trending">Trending →</a>
        <a href="/top">Top Rated →</a>
        <a href="/anime">Anime →</a>
        <a href="/cartoons">Cartoons →</a>
      </div>
    </main>
  );
}
