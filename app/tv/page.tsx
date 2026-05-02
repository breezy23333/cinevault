import { getTvByGenre, getTrendingAll } from "@/lib/fetchers";
import dynamic from "next/dynamic";

export const runtime = "nodejs";
export const revalidate = 120;

const ShelfRow = dynamic(() => import("@/components/ShelfRow"), {
  ssr: true,
});

const MAX_SHELF = 18;

const toShelfMedia = (x: any) => ({
  id: Number(x.id),
  media: "tv" as const,
  title: x.name || x.title || "Untitled",
  poster: x.poster_path
    ? `https://image.tmdb.org/t/p/w342${x.poster_path}`
    : null,
  year: String(x.first_air_date || x.release_date || "").slice(0, 4),
  rating:
    typeof x.vote_average === "number"
      ? Math.round(x.vote_average * 10) / 10
      : undefined,
  href: `/tv/${x.id}`,
});

export default async function TVPage() {
  const trending = await getTrendingAll(1);
  const drama = await getTvByGenre(18);
  const fantasy = await getTvByGenre(10765);
  const crime = await getTvByGenre(80);

  const trendingTv = trending.results
    .filter((x: any) => x.media_type === "tv")
    .slice(0, MAX_SHELF)
    .map(toShelfMedia);

  const dramaShelf = drama.results.slice(0, MAX_SHELF).map(toShelfMedia);
  const fantasyShelf = fantasy.results.slice(0, MAX_SHELF).map(toShelfMedia);
  const crimeShelf = crime.results.slice(0, MAX_SHELF).map(toShelfMedia);

  return (
    <main className="min-h-screen bg-[#080b12] text-white pt-28 pb-10">
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#111827] via-[#172033] to-[#0b0f19] ring-1 ring-white/10 p-6 md:p-10">
          <p className="text-sm font-semibold text-yellow-400 mb-2">
            CineVault TV
          </p>

          <h1 className="text-3xl md:text-5xl font-black">
            Browse TV Shows
          </h1>

          <p className="mt-3 max-w-2xl text-white/70">
            Discover trending series, drama shows, fantasy worlds, crime stories,
            anime, and more.
          </p>
        </div>

        <Panel title="Trending TV Shows">
          <ShelfRow items={trendingTv} />
        </Panel>

        <Panel title="Drama TV Shows">
          <ShelfRow items={dramaShelf} />
        </Panel>

        <Panel title="Fantasy TV Shows">
          <ShelfRow items={fantasyShelf} />
        </Panel>

        <Panel title="Crime TV Shows">
          <ShelfRow items={crimeShelf} />
        </Panel>
      </section>
    </main>
  );
}

function Panel({ title, children }: any) {
  return (
    <section className="rounded-2xl bg-[#0c111b] ring-1 ring-white/10 overflow-hidden">
      <div className="px-4 md:px-6 py-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="px-2 md:px-4 pb-4">{children}</div>
    </section>
  );
}