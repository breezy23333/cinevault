// app/news/sports/[topic]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSportsTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import SportsSubCategories from "@/components/SportsSubCategories";

export const revalidate = 900;

const SITE_URL = "https://cinryvan.vercel.app";

type PageProps = {
  params: Promise<{
    topic: string;
  }>;
};

type TopicConfig = {
  title: string;
  pageTitle: string;
  description: string;
};

const topics: Record<string, TopicConfig> = {
  soccer: {
    title: "Soccer News",
    pageTitle: "Latest Soccer News, Transfers & Results",
    description:
      "Read the latest soccer news, transfers, match results, fixtures, Premier League, Champions League and international football updates on CINRYVAN.",
  },

  football: {
    title: "American Football News",
    pageTitle: "Latest NFL & American Football News",
    description:
      "Read the latest NFL and American football news, results, schedules, player updates, trades, teams and league stories on CINRYVAN.",
  },

  racing: {
    title: "Motorsport News",
    pageTitle: "Latest Motorsport, Formula 1 & Racing News",
    description:
      "Read the latest Formula 1, motorsport and racing news, race results, driver updates, team announcements and championship stories on CINRYVAN.",
  },

  cricket: {
    title: "Cricket News",
    pageTitle: "Latest Cricket News, Scores & Results",
    description:
      "Read the latest cricket news, match scores, results, fixtures, international tournaments, teams and player updates on CINRYVAN.",
  },

  rugby: {
    title: "Rugby News",
    pageTitle: "Latest Rugby News, Scores & Results",
    description:
      "Read the latest rugby news, scores, fixtures, results, international tournaments, club stories, teams and player updates on CINRYVAN.",
  },

  tennis: {
    title: "Tennis News",
    pageTitle: "Latest Tennis News, Results & Rankings",
    description:
      "Read the latest tennis news, ATP and WTA results, rankings, tournament schedules, Grand Slam stories and player updates on CINRYVAN.",
  },

  basketball: {
    title: "Basketball News",
    pageTitle: "Latest Basketball & NBA News",
    description:
      "Read the latest basketball and NBA news, scores, results, schedules, trades, teams, players and league updates on CINRYVAN.",
  },
};

function cleanTopic(value: string) {
  return value
    .trim()
    .toLowerCase();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic: rawTopic } = await params;

  const topic = cleanTopic(rawTopic);
  const config = topics[topic];

  if (!config) {
    return {
      title: "Sports Topic Not Found",
      description:
        "The requested sports-news topic could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical =
    `${SITE_URL}/news/sports/${topic}`;

  return {
    /*
     * Root layout automatically adds:
     * | CINRYVAN
     */
    title: config.pageTitle,
    description: config.description,

    category: "Sports News",

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title: `${config.pageTitle} | CINRYVAN`,
      description: config.description,
      url: canonical,
      siteName: "CINRYVAN",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${config.title} on CINRYVAN`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${config.pageTitle} | CINRYVAN`,
      description: config.description,
      images: [
        {
          url: "/og-image.png",
          alt: `${config.title} on CINRYVAN`,
        },
      ],
    },
  };
}

export default async function SportsTopicPage({
  params,
}: PageProps) {
  const { topic: rawTopic } = await params;

  const topic = cleanTopic(rawTopic);
  const config = topics[topic];

  if (!config) {
    notFound();
  }

  const canonical =
    `${SITE_URL}/news/sports/${topic}`;

  const news = await getSportsTopicNews(
    topic,
  ).catch(() => []);

  const visibleNews = Array.isArray(news)
    ? news.filter(
        (item) => item?.title && item?.url,
      )
    : [];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#collection`,

    name: config.pageTitle,
    description: config.description,
    url: canonical,

    mainEntity: {
      "@id": `${canonical}#headlines`,
    },

    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  const headlinesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonical}#headlines`,

    name: `${config.title} headlines`,
    numberOfItems: visibleNews.length,

    itemListElement: visibleNews
      .slice(0, 30)
      .map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: item.url,
      })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: `${SITE_URL}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Sports",
        item: `${SITE_URL}/news/sports`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: config.title,
        item: canonical,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            headlinesJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-[1500px]">
        <NewsCategoryGrid
          eyebrow="Sports Channel"
          title={config.title}
          items={visibleNews}
          color="green"
        />

        {visibleNews.length === 0 && (
          <section className="mt-8 border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="text-2xl font-black">
              Headlines temporarily unavailable
            </h2>

            <p className="mt-3 text-white/50">
              New {config.title.toLowerCase()} will
              appear here when the feed becomes available.
            </p>
          </section>
        )}

        <SportsSubCategories />
      </div>
    </main>
  );
}