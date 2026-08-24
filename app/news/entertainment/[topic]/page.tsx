// app/news/entertainment/[topic]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getEntertainmentTopicNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import EntertainmentSubCategories from "@/components/EntertainmentSubCategories";

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
  movies: {
    title: "Movie News",
    pageTitle: "Latest Movie News, Trailers & Updates",
    description:
      "Read the latest movie news, trailer announcements, casting updates, release dates, box-office stories and film industry developments on CINRYVAN.",
  },

  "tv-shows": {
    title: "TV Show News",
    pageTitle: "Latest TV Show News & Streaming Updates",
    description:
      "Read the latest TV show news, renewals, cancellations, casting announcements, episode updates and streaming stories on CINRYVAN.",
  },

  /*
   * Keep this alias working in case older links
   * or indexed URLs use /tv instead of /tv-shows.
   */
  tv: {
    title: "TV Show News",
    pageTitle: "Latest TV Show News & Streaming Updates",
    description:
      "Read the latest TV show news, renewals, cancellations, casting announcements, episode updates and streaming stories on CINRYVAN.",
  },

  streaming: {
    title: "Streaming News",
    pageTitle: "Latest Streaming News & Release Updates",
    description:
      "Follow the latest streaming news, platform updates, new releases, original movies, television premieres and industry developments on CINRYVAN.",
  },

  celebrities: {
    title: "Celebrity News",
    pageTitle: "Latest Celebrity News & Entertainment Updates",
    description:
      "Read the latest celebrity news, interviews, casting announcements, career updates and entertainment stories on CINRYVAN.",
  },

  awards: {
    title: "Awards News",
    pageTitle: "Latest Film & TV Awards News",
    description:
      "Follow the latest film and television awards news, nominations, winners, ceremonies and major entertainment-industry honours on CINRYVAN.",
  },

  "box-office": {
    title: "Box Office News",
    pageTitle: "Latest Box Office Results & Movie News",
    description:
      "Explore the latest box-office results, opening weekends, worldwide movie totals, cinema records and theatrical performance news on CINRYVAN.",
  },

  anime: {
    title: "Anime News",
    pageTitle: "Latest Anime News, Trailers & Release Updates",
    description:
      "Read the latest anime news, trailers, release dates, series announcements, casting updates and industry stories on CINRYVAN.",
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
      title: "Entertainment Topic Not Found",
      description:
        "The requested entertainment-news topic could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical =
    `${SITE_URL}/news/entertainment/${topic}`;

  return {
    /*
     * Root layout automatically adds:
     * | CINRYVAN
     */
    title: config.pageTitle,
    description: config.description,

    category: "Entertainment News",

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

export default async function EntertainmentTopicPage({
  params,
}: PageProps) {
  const { topic: rawTopic } = await params;

  const topic = cleanTopic(rawTopic);
  const config = topics[topic];

  if (!config) {
    notFound();
  }

  const canonical =
    `${SITE_URL}/news/entertainment/${topic}`;

  const feedTopic =
  topic === "tv-shows" ? "tv" : topic;

  const news = await getEntertainmentTopicNews(
    feedTopic,
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
        name: "Entertainment",
        item: `${SITE_URL}/news/entertainment`,
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
          eyebrow="Entertainment Channel"
          title={config.title}
          items={visibleNews}
          color="yellow"
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

        <EntertainmentSubCategories />
      </div>
    </main>
  );
}