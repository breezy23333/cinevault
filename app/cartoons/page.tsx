import { getTvByGenre } from "@/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 120;

const MAX_SHELF = 60;

export const metadata: Metadata = {
  title: "Best Cartoons & Animated Shows | CINRYVAN",
  description:
    "Discover classic cartoons, animated adventures, family favorites, trending animated series, and cartoon worlds on CINRYVAN.",
  keywords: [
    "cartoons",
    "animated shows",
    "animation",
    "cartoon movies",
    "family animation",
    "trending cartoons",
    "classic cartoons",
    "animated series",
    "CINRYVAN cartoons",
  ],
  alternates: {
    canonical: "/cartoons",
  },
  openGraph: {
    title: "Best Cartoons & Animated Shows | CINRYVAN",
    description:
      "Explore classic cartoons, animated shows, family favorites, and trending animated entertainment on CINRYVAN.",
    url: "/cartoons",
    siteName: "CINRYVAN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CINRYVAN Cartoons",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Cartoons & Animated Shows | CINRYVAN",
    description:
      "Discover classic cartoons, animated shows, family favorites, and trending animation on CINRYVAN.",
    images: ["/og-image.png"],
  },
};

const toShelfMedia = (x: any) => ({
  id: Number(x.id),
  title: x.title || x.name || "Untitled",
  poster: x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : null,
  year: String(x.release_date || x.first_air_date || "").slice(0, 4),
});

export default async function CartoonsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page || 1);

  const data = await getTvByGenre(16, currentPage);

  const seen = new Set<number>();

  const cartoonShelf = (data.results || [])
    .filter((x: any) => x.original_language !== "ja")
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

  const hero = cartoonShelf[0];

  const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://cinryvan.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Cartoons",
      item: "https://cinryvan.vercel.app/cartoons",
    },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Best Cartoons & Animated Shows",
  description:
    "Discover classic cartoons, animated adventures, family favorites, trending animated series, and cartoon worlds on CINRYVAN.",
  url: "https://cinryvan.vercel.app/cartoons",
  isPartOf: {
    "@type": "WebSite",
    name: "CINRYVAN",
    url: "https://cinryvan.vercel.app",
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
          <p className="text-yellow-400 font-bold mb-2">CINRYVAN Animation</p>
          <h1 className="text-5xl md:text-7xl font-black mb-4">Cartoons</h1>
          <p className="text-white/70 text-lg">
            Discover animated comedy, family shows, classic cartoons, and modern animated worlds.
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-2xl font-black mb-6">Trending Cartoons</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {cartoonShelf.map((item: any) => (
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
                href={`/cartoons?page=${page}`}
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
                href={`/cartoons?page=${currentPage + 1}`}
                className="flex-1 rounded-full border border-yellow-400 px-6 py-3 text-center font-black text-white hover:bg-yellow-400 hover:text-black transition"
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
              href="/anime"
              className="rounded-2xl border border-white/10 bg-[#0c111b] p-4 hover:bg-white/10"
            >
              Anime →
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
              Animation News →
            </a>
          </div>
        </section>

    </main>
  );
}