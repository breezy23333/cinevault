// app/news/gaming/[topic]/page.tsx

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Gamepad2,
} from "lucide-react";

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

const topicLinks = [
  { label: "Console", slug: "console" },
  { label: "PC", slug: "pc" },
  { label: "Mobile", slug: "mobile" },
  { label: "Esports", slug: "esports" },
  { label: "PlayStation", slug: "playstation" },
  { label: "Xbox", slug: "xbox" },
  { label: "Nintendo", slug: "nintendo" },
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
      title: "Gaming Topic Not Found",
      description:
        "The requested gaming-news topic could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `${SITE_URL}/news/gaming/${topic}`;

  return {
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
      images: ["/og-image.png"],
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

  const canonical = `${SITE_URL}/news/gaming/${topic}`;

  const news = await getGamingTopicNews(topic).catch(() => []);

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
    <main className="min-h-screen overflow-hidden bg-[#03080c] text-white">
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

      <header className="relative border-b border-cyan-400/10 px-5 pb-10 pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.1),transparent_25%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Link
            href="/news/gaming"
            className="inline-flex items-center gap-2 text-sm font-black text-white/45 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Gaming News
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
                <Gamepad2 className="h-4 w-4" />
                Gaming channel
              </p>

              <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                {config.title}
              </h1>
            </div>

            <div>
              <p className="leading-7 text-white/55">
                {config.description}
              </p>

              <p className="mt-4 text-sm font-bold text-cyan-300">
                {visibleNews.length} updates available
              </p>
            </div>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {topicLinks.map((item) => {
              const active = item.slug === topic;

              return (
                <Link
                  key={item.slug}
                  href={`/news/gaming/${item.slug}`}
                  className={`shrink-0 rounded-xl border px-5 py-3 text-sm font-black transition ${
                    active
                      ? "border-cyan-300 bg-cyan-400 text-black"
                      : "border-white/10 bg-white/[0.035] text-white/60 hover:border-cyan-300/60 hover:text-cyan-300"
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
            className="group relative block min-h-[500px] overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[#071017] shadow-[0_0_80px_rgba(34,211,238,0.06)] sm:min-h-[610px]"
          >
            {featuredStory.image ? (
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.3),transparent_30%),linear-gradient(135deg,#071a24,#030609)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />

            <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
              <span className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md">
                <Gamepad2 className="h-4 w-4" />
                Featured update
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
              {featuredStory.source && (
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  {featuredStory.source}
                </p>
              )}

              <h2 className="mt-4 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {featuredStory.title}
              </h2>

              <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-[#031014] transition group-hover:bg-cyan-300">
                Open story
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        )}

        {latestStories.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 border-b border-cyan-400/15 pb-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                Latest updates
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                More {config.title}
              </h2>
            </div>

            <NewsCategoryGrid
              eyebrow="Gaming Channel"
              title={`${config.title} Headlines`}
              items={latestStories}
              color="cyan"
            />
          </section>
        )}

        {visibleNews.length === 0 && (
          <section className="rounded-[30px] border border-cyan-400/15 bg-cyan-400/[0.035] p-10 text-center">
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
          <GamingSubCategories />
        </div>
      </div>
    </main>
  );
}