import { getTvByGenre } from "@/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 120;

const MAX_SHELF = 60;

export const metadata: Metadata = {
  title: "Best Anime Series & Movies | CineVault",
  description:
    "Discover trending anime series, classic anime films, top-rated adventures, fantasy worlds, action anime, and Japanese animation on CineVault.",
  keywords: [
    "anime",
    "best anime",
    "anime movies",
    "anime series",
    "trending anime",
    "Japanese animation",
    "action anime",
    "fantasy anime",
    "CineVault anime",
  ],
  alternates: {
    canonical: "/anime",
  },
  openGraph: {
    title: "Best Anime Series & Movies | CineVault",
    description:
      "Explore trending anime series, top-rated anime movies, fantasy worlds, action anime, and Japanese animation on CineVault.",
    url: "/anime",
    siteName: "CineVault",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CineVault Anime",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Anime Series & Movies | CineVault",
    description:
      "Discover trending anime series, anime movies, fantasy anime, and Japanese animation on CineVault.",
    images: ["/og-image.png"],
  },
};

const toShelfMedia = (x: any) => ({
  id: Number(x.id),
  title: x.title || x.name || "Untitled",
  poster: x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : null,
  year: String(x.release_date || x.first_air_date || "").slice(0, 4),
});

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page || 1);

  const data = await getTvByGenre(16, currentPage);

  const seen = new Set<number>();

  const animeShelf = (data.results || [])
    .filter((x: any) => x.original_language === "ja")
    .filter((x: any) => {
      if (seen.has(x.id)) return false;
      seen.add(x.id);
      return true;
    })
    .slice(0, MAX_SHELF)
    .map((x: any) => {
      const m = toShelfMedia(x);
      return { ...m, href: `/tv/${m.id}` };
    });

  const hero = animeShelf[0];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cinevault-tau-drab.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Anime",
        item: "https://cinevault-tau-drab.vercel.app/anime",
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best Anime Series & Movies",
    description:
      "Discover trending anime series, classic anime films, fantasy worlds, action anime, and Japanese animation on CineVault.",
    url: "https://cinevault-tau-drab.vercel.app/anime",
    isPartOf: {
      "@type": "WebSite",
      name: "CineVault",
      url: "https://cinevault-tau-drab.vercel.app",
    },
  };

  return (
    <main className="min-h-screen bg-[#0e131f] pb-12">
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(collectionJsonLd),
          }}
        />

        <section
        className="relative h-[62vh] flex items-end px-6 md:px-12 bg-cover bg-center"
        style={{
          backgroundImage: hero?.poster
            ? `url(${hero.poster.replace("/w342", "/w780")})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-black/70 to-black/20" />
        <div className="relative z-10 max-w-2xl pb-12">
          <p className="text-yellow-400 font-bold mb-2">CineVault Anime</p>
          <h1 className="text-5xl md:text-7xl font-black mb-4">Anime</h1>
          <p className="text-white/70 text-lg">
            Dive into Japanese animation, epic battles, emotional stories, and legendary characters.
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-2xl font-black mb-6">Trending Anime</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animeShelf.map((item: any) => (
            <a
              key={item.id}
              href={item.href}
              className="rounded-2xl overflow-hidden bg-[#0c111b] ring-1 ring-white/15 hover:scale-105 transition"
            >
              {item.poster && (
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              )}

              <div className="p-3">
                <h3 className="font-bold text-sm line-clamp-2">{item.title}</h3>
                <p className="text-xs text-white/50 mt-1">{item.year} • TV</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10">
          {/* Desktop / tablet pagination */}
          <div className="hidden justify-center gap-3 md:flex">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`/anime?page=${page}`}
                className={`px-4 py-2 rounded-full font-bold ring-1 ring-white/15 ${
                  currentPage === page
                    ? "bg-yellow-400 text-black"
                    : "bg-[#0c111b] text-white hover:bg-white/10"
                }`}
              >
                {page}
              </a>
            ))}
          </div>

          {/* Mobile pagination */}
          <div className="flex items-center justify-center gap-4 md:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-yellow-400 font-black text-black">
              {currentPage}
            </span>

            {currentPage < 20 && (
              <a
                href={`/anime?page=${currentPage + 1}`}
                className="flex-1 rounded-full border border-yellow-400 px-6 py-3 text-center font-black text-white"
              >
                Next →
              </a>
            )}
          </div>
        </div>
      </div>

        <section className="mt-12 px-4 md:px-8">
          <h2 className="text-2xl font-black mb-4">
            Continue Exploring
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/cartoons"
              className="rounded-2xl border border-white/10 bg-[#0c111b] p-4 hover:bg-white/10"
            >
              Cartoons →
            </a>

            <a
              href="/trending"
              className="rounded-2xl border border-white/10 bg-[#0c111b] p-4 hover:bg-white/10"
            >
              Trending →
            </a>

            <a
              href="/top"
              className="rounded-2xl border border-white/10 bg-[#0c111b] p-4 hover:bg-white/10"
            >
              Top Rated →
            </a>

            <a
              href="/news"
              className="rounded-2xl border border-white/10 bg-[#0c111b] p-4 hover:bg-white/10"
            >
              Anime News →
            </a>
          </div>
        </section>

    </main>
  );
}