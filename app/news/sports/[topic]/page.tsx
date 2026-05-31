import { getSportsTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import SportsSubCategories from "@/components/SportsSubCategories";

export const revalidate = 300;

const topics: Record<string, string> = {
  soccer: "Soccer News",
  football: "Football News",
  racing: "Racing News",
  basketball: "Basketball News",
  tennis: "Tennis News",
};

export default async function SportsTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  const title = topics[topic] || "Sports News";
  const news = await getSportsTopicNews(topic);

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <NewsCategoryGrid
          eyebrow="Sports Channel"
          title={title}
          items={news}
          color="green"
        />

        <SportsSubCategories />
      </div>
    </main>
  );
}