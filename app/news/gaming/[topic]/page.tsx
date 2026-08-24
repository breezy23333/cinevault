// app/news/gaming/[topic]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGamingTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import GamingSubCategories from "@/components/GamingSubCategories";

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
  console: {
    title: "Console Gaming News",
    pageTitle: "Latest Console Gaming News & Releases",
    description:
      "Read the latest console gaming news, game announcements, release updates, hardware stories and PlayStation, Xbox and Nintendo headlines on CINRYVAN.",
  },

  pc: {
    title: "PC Gaming News",
    pageTitle: "Latest PC Gaming News, Releases & Updates",
    description:
      "Read the latest PC gaming news, Steam and Epic Games updates, hardware stories, game releases, patches and industry headlines on CINRYVAN.",
  },

  mobile: {
    title: "Mobile Gaming News",
    pageTitle: "Latest Mobile Gaming News & Releases",
    description:
      "Read the latest mobile gaming news, Android and iOS releases, updates, announcements and mobile-game industry stories on CINRYVAN.",
  },

  esports: {
    title: "Esports News",
    pageTitle: "Latest Esports News, Results & Tournaments",
    description:
      "Follow the latest esports news, competitive gaming tournaments, teams, players, results and major industry updates on CINRYVAN.",
  },

  playstation: {
    title: "PlayStation News",
    pageTitle: "Latest PlayStation News, PS5 Games & Updates",
    description:
      "Read the latest PlayStation news, PS5 game announcements, release dates, console updates, trailers and platform stories on CINRYVAN.",
  },

  xbox: {
    title: "Xbox News",
    pageTitle: "Latest Xbox News, Game Pass & Releases",
    description:
      "Read the latest Xbox news, Game Pass updates, game announcements, release dates, console stories and Microsoft gaming headlines on CINRYVAN.",
  },

  nintendo: {
    title: "Nintendo News",
    pageTitle: "Latest Nintendo News, Switch Games & Updates",
    description:
      "Read the latest Nintendo news, Switch game announcements, release dates, trailers, console updates and platform stories on CINRYVAN.",
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
      title: "Gaming Topic Not Found",
      description:
        "The requested gaming-news topic could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical =
    `${SITE_URL}/news/gaming/${topic}`;

  return {
    /*
     * Root layout automatically adds:
     * | CINRYVAN
     */
    title: config.pageTitle,
    description: config.description,

    category: "Gaming News",

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

export default async function GamingTopicPage({
  params,
}: PageProps) {
  const { topic: rawTopic } = await params;

  const topic = cleanTopic(rawTopic);
  const config = topics[topic];

  if (!config) {
    notFound();
  }

  const canonical =
    `${SITE_URL}/news/gaming/${topic}`;

  const news = await getGamingTopicNews(
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
        name: "Gaming",
        item: `${SITE_URL}/news/gaming`,
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
          eyebrow="Gaming Channel"
          title={config.title}
          items={visibleNews}
          color="cyan"
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

        <GamingSubCategories />
      </div>
    </main>
  );
}