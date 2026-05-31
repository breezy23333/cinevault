import { getEntertainmentTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import EntertainmentSubCategories from "@/components/EntertainmentSubCategories";

export const revalidate = 300;

const topics: Record<string, string> = {
  movies: "Movie News",
  tv: "TV Show News",
  streaming: "Streaming News",
  celebrities: "Celebrity News",
  anime: "Anime News",
};

export default async function EntertainmentTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  const title = topics[topic] || "Entertainment News";
  const news = await getEntertainmentTopicNews(topic);

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <NewsCategoryGrid
          eyebrow="Entertainment Channel"
          title={title}
          items={news}
          color="yellow"
        />

        <EntertainmentSubCategories />
      </div>
    </main>
  );
}