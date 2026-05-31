import { getGamingTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import GamingSubCategories from "@/components/GamingSubCategories";

export const revalidate = 300;

const topics: Record<string, string> = {
  console: "Console Gaming",
  pc: "PC Gaming",
  mobile: "Mobile Gaming",
};

export default async function GamingTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  const title = topics[topic] || "Gaming News";
  const news = await getGamingTopicNews(topic);

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <div className="mx-auto max-w-[1500px]">

        <NewsCategoryGrid
          eyebrow="Gaming Channel"
          title={title}
          items={news}
          color="cyan"
        />

        <GamingSubCategories />

      </div>
    </main>
  );
}