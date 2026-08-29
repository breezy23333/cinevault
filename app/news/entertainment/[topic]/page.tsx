// app/news/entertainment/[topic]/page.tsx

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

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

const topicLinks = [
  { label: "Movies", slug: "movies" },
  { label: "TV Shows", slug: "tv-shows" },
  { label: "Streaming", slug: "streaming" },
  { label: "Celebrities", slug: "celebrities" },
  { label: "Awards", slug: "awards" },
  { label: "Box Office", slug: "box-office" },
  { label: "Anime", slug: "anime" },
];

function cleanTopic(value: string) {
  return value.trim().toLowerCase();
}

export async function generateMetadata({ params }: PageProps) {
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

  const canonical = `${SITE_URL}/news/entertainment/${topic}`;

  return {
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
      images: ["/og-image.png"],
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

  const canonical = `${SITE_URL}/news/entertainment/${topic}`;
  const feedTopic = topic === "tv-shows" ? "tv" : topic;

  const news = await getEntertainmentTopicNews(feedTopic).catch(() => []);

  const visibleNews = Array.isArray(news)
    ? news.filter((item) => item?.title && item?.url)
    : [];

  const featuredStory = visibleNews[0];
  const latestStories = visibleNews.slice(1);

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
    itemListElement: visibleNews.slice(0, 30).map((item, index) => ({
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
    <main className="min-h-screen overflow-hidden bg-[#06080c] text-white">
      {[collectionJsonLd, headlinesJsonLd, breadcrumbJsonLd].map(
        (data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
          />
        ),
      )}

      <header className="relative border-b border-yellow-400/10 px-5 pb-10 pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(250,204,21,0.14),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(249,115,22,0.08),transparent_25%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Link
            href="/news/entertainment"
            className="inline-flex items-center gap-2 text-sm font-black text-white/45 transition hover:text-yellow-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Entertainment News
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-yellow-400">
                Entertainment channel
              </p>

              <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                {config.title}
              </h1>
            </div>

            <div>
              <p className="leading-7 text-white/55">
                {config.description}
              </p>

              <p className="mt-4 text-sm font-bold text-yellow-400">
                {visibleNews.length} stories available
              </p>
            </div>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {topicLinks.map((item) => {
              const active =
                item.slug === topic ||
                (topic === "tv" && item.slug === "tv-shows");

              return (
                <Link
                  key={item.slug}
                  href={`/news/entertainment/${item.slug}`}
                  className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition ${
                    active
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-white/10 bg-white/[0.04] text-white/60 hover:border-yellow-400/60 hover:text-yellow-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8 lg:py-14">
        {featuredStory && (
          <a
            href={featuredStory.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block min-h-[500px] overflow-hidden rounded-[34px] border border-white/10 bg-[#12151b] sm:min-h-[600px]"
          >
            {featuredStory.image ? (
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(250,204,21,0.3),transparent_30%),linear-gradient(135deg,#221d0b,#07080b)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

            <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
              <span className="rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                Featured {config.title}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
              {featuredStory.source && (
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                  {featuredStory.source}
                </p>
              )}

              <h2 className="mt-4 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {featuredStory.title}
              </h2>

              <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-black transition group-hover:bg-yellow-400">
                Read full story
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        )}

        {latestStories.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 border-b border-white/10 pb-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Latest updates
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                More {config.title}
              </h2>
            </div>

            <NewsCategoryGrid
              eyebrow="Entertainment Channel"
              title={`${config.title} Headlines`}
              items={latestStories}
              color="yellow"
            />
          </section>
        )}

        {visibleNews.length === 0 && (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-3xl font-black">
              Headlines temporarily unavailable
            </h2>

            <p className="mt-3 text-white/50">
              New {config.title.toLowerCase()} will appear when the feed becomes
              available.
            </p>
          </section>
        )}

        <div className="mt-16">
          <EntertainmentSubCategories />
        </div>
      </div>
    </main>
  );
}