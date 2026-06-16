import { getGamingTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import GamingSubCategories from "@/components/GamingSubCategories";
import type { Metadata } from "next";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const title = topics[topic] || "Gaming News";

  return {
    title: `${title} News | CineVault`,
    description: `Read the latest ${title.toLowerCase()} news, gaming updates, releases, console stories, PC gaming news, and mobile gaming headlines on CineVault.`,
    alternates: {
      canonical: `/news/gaming/${topic}`,
    },
    openGraph: {
      title: `${title} News | CineVault`,
      description: `Latest ${title.toLowerCase()} headlines and gaming updates.`,
      url: `/news/gaming/${topic}`,
      siteName: "CineVault",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} News | CineVault`,
      description: `Read the latest ${title.toLowerCase()} news on CineVault.`,
      images: ["/og-image.png"],
    },
  };
}

const topics: Record<string, string> = {
  console: "Console Gaming",
  pc: "PC Gaming",
  mobile: "Mobile Gaming",
};

export default async function GamingTopicPage({
  params,
}: PageProps) {
  const { topic } = await params;

  const title = topics[topic] || "Gaming News";
  const news = await getGamingTopicNews(topic);

  const gamingTopicJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${title} News`,
  description: `Latest ${title.toLowerCase()} headlines and gaming updates.`,
  url: `https://cinevault-tau-drab.vercel.app/news/gaming/${topic}`,
};

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gamingTopicJsonLd),
        }}
      />
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