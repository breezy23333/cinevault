import { getEntertainmentNews } from "@/lib/news";
import NewsStrip, { NewsItem } from "@/components/NewsStrip";

export const revalidate = 300;

export default async function NewsPage() {
  const newsItems: NewsItem[] = await getEntertainmentNews();

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-28 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Industry Radar
        </p>

        <h1 className="text-5xl font-black">Top News</h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Live entertainment headlines from around the world.
        </p>

        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <NewsStrip items={newsItems} />
        </div>
      </section>
    </main>
  );
}