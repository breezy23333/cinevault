import { getEntertainmentTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import EntertainmentSubCategories from "@/components/EntertainmentSubCategories";
import type { Metadata } from "next";

export const revalidate = 300;

const topics: Record<string, string> = {
  movies: "Movie News",
  tv: "TV Show News",
  streaming: "Streaming News",
  celebrities: "Celebrity News",
  anime: "Anime News",
};

type PageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const title = topics[topic] || "Entertainment News";

  return {
    title: `${title} | CineVault`,
    description: `Read the latest ${title.toLowerCase()} including movies, TV, streaming, celebrities, anime, and entertainment updates on CineVault.`,
    alternates: {
      canonical: `/news/entertainment/${topic}`,
    },
    openGraph: {
      title: `${title} | CineVault`,
      description: `Latest ${title.toLowerCase()} and entertainment updates.`,
      url: `/news/entertainment/${topic}`,
      siteName: "CineVault",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CineVault`,
      description: `Read the latest ${title.toLowerCase()} on CineVault.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function EntertainmentTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  const title = topics[topic] || "Entertainment News";
  const news = await getEntertainmentTopicNews(topic);

  const topicJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description: `Latest ${title.toLowerCase()} and entertainment updates.`,
  url: `https://cinevault-tau-drab.vercel.app/news/entertainment/${topic}`,
};

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(topicJsonLd),
        }}
      />
      
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