import { getSportsTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import SportsSubCategories from "@/components/SportsSubCategories";
import type { Metadata } from "next";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const title = topics[topic] || "Sports News";

  return {
    title: `${title} | CineVault`,
    description:
      `Read the latest ${title.toLowerCase()} headlines, results, analysis, transfers, schedules, and sports updates on CineVault.`,
    alternates: {
      canonical: `/news/sports/${topic}`,
    },
    openGraph: {
      title: `${title} | CineVault`,
      description:
        `Latest ${title.toLowerCase()} headlines and sports updates.`,
      url: `/news/sports/${topic}`,
      siteName: "CineVault",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CineVault`,
      description:
        `Read the latest ${title.toLowerCase()} news on CineVault.`,
      images: ["/og-image.png"],
    },
  };
}

const topics: Record<string, string> = {
  soccer: "Soccer News",
  football: "Football News",
  racing: "Racing News",
  basketball: "Basketball News",
  tennis: "Tennis News",
};

export default async function SportsTopicPage({
  params,
}: PageProps) {
  const { topic } = await params;

  const title = topics[topic] || "Sports News";
  const news = await getSportsTopicNews(topic);

  const sportsTopicJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description:
    `Latest ${title.toLowerCase()} headlines and sports updates.`,
  url: `https://cinevault-tau-drab.vercel.app/news/sports/${topic}`,
};

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sportsTopicJsonLd),
        }}
      />
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