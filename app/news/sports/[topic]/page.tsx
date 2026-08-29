// app/news/sports/[topic]/page.tsx

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Radio,
} from "lucide-react";

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

const topicLinks = [
  { label: "Soccer", slug: "soccer" },
  { label: "American Football", slug: "football" },
  { label: "Racing", slug: "racing" },
  { label: "Cricket", slug: "cricket" },
  { label: "Rugby", slug: "rugby" },
  { label: "Tennis", slug: "tennis" },
  { label: "Basketball", slug: "basketball" },
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
      title: "Sports Topic Not Found",
      description:
        "The requested sports-news topic could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `${SITE_URL}/news/sports/${topic}`;

  return {
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
      images: ["/og-image.png"],
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

  const canonical = `${SITE_URL}/news/sports/${topic}`;

  const news = await getSportsTopicNews(topic).catch(() => []);

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
    <main className="min-h-screen overflow-hidden bg-[#040906] text-white">
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

      <header className="relative border-b border-emerald-400/10 px-5 pb-10 pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(52,211,153,0.14),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(34,197,94,0.1),transparent_25%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Link
            href="/news/sports"
            className="inline-flex items-center gap-2 text-sm font-black text-white/45 transition hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Sports News
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-emerald-300">
                <Radio className="h-4 w-4" />
                Live sports channel
              </p>

              <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                {config.title}
              </h1>
            </div>

            <div>
              <p className="leading-7 text-white/55">
                {config.description}
              </p>

              <p className="mt-4 text-sm font-bold text-emerald-300">
                {visibleNews.length} stories available
              </p>
            </div>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {topicLinks.map((item) => {
              const active = item.slug === topic;

              return (
                <Link
                  key={item.slug}
                  href={`/news/sports/${item.slug}`}
                  className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition ${
                    active
                      ? "border-emerald-300 bg-emerald-400 text-[#04110b]"
                      : "border-white/10 bg-white/[0.035] text-white/60 hover:border-emerald-300/60 hover:text-emerald-300"
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
            className="group relative block min-h-[500px] overflow-hidden rounded-[34px] border border-emerald-400/15 bg-[#0b1510] sm:min-h-[610px]"
          >
            {featuredStory.image ? (
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(52,211,153,0.3),transparent_30%),linear-gradient(135deg,#10251a,#050807)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 bg-black/25 px-5 py-4 backdrop-blur-md sm:px-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#04110b]">
                <Radio className="h-3.5 w-3.5" />
                Lead story
              </span>

              <span className="hidden text-xs font-black uppercase tracking-[0.2em] text-white/50 sm:block">
                CINRYVAN Sports
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
              {featuredStory.source && (
                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                  {featuredStory.source}
                </p>
              )}

              <h2 className="mt-4 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {featuredStory.title}
              </h2>

              <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-[#04110b] transition group-hover:bg-emerald-300">
                Read full story
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        )}

        {latestStories.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 border-b border-emerald-400/15 pb-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
                Latest updates
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                More {config.title}
              </h2>
            </div>

            <NewsCategoryGrid
              eyebrow="Sports Channel"
              title={`${config.title} Headlines`}
              items={latestStories}
              color="green"
            />
          </section>
        )}

        {visibleNews.length === 0 && (
          <section className="rounded-[30px] border border-emerald-400/15 bg-emerald-400/[0.035] p-10 text-center">
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
          <SportsSubCategories />
        </div>
      </div>
    </main>
  );
}