import { getTvByGenre } from "@/lib/fetchers";
import dynamic from "next/dynamic";

export const revalidate = 120;

const ShelfRow = dynamic(() => import("@/components/ShelfRow"), { ssr: true });

const MAX_SHELF = 24;

const toShelfMedia = (x: any) => ({
  id: Number(x.id),
  media: "tv" as const,
  title: x.title || x.name || "Untitled",
  poster: x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : null,
  year: String(x.release_date || x.first_air_date || "").slice(0, 4),
  rating: typeof x.vote_average === "number" ? Math.round(x.vote_average * 10) / 10 : undefined,
});

export default async function AnimePage() {
  const animationTv = await getTvByGenre(16);

  const animeShelf = animationTv.results
    .filter((x: any) => x.original_language === "ja")
    .slice(0, MAX_SHELF)
    .map((x: any) => {
      const m = toShelfMedia(x);
      return { ...m, href: `/tv/${m.id}` };
    });

  const hero = animeShelf[0];

  return (
    <main className="min-h-screen bg-[#0e131f] pb-12">
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
</div>
    </main>
  );
}