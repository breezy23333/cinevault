// app/news/entertainment/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

import { getEntertainmentNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import EntertainmentSubCategories from "@/components/EntertainmentSubCategories";

export const revalidate = 900;

const SITE_URL = "https://cinryvan.vercel.app";
const PAGE_URL = `${SITE_URL}/news/entertainment`;

const PAGE_TITLE =
  "Latest Entertainment, Movie & TV News";

const PAGE_DESCRIPTION =
  "Read the latest entertainment news, movie and TV updates, celebrity stories, streaming headlines, awards, box-office results and industry developments on CINRYVAN.";

const entertainmentTopics = [
  {
    label: "Movies",
    slug: "movies",
  },
  {
    label: "TV Shows",
    slug: "tv-shows",
  },
  {
    label: "Streaming",
    slug: "streaming",
  },
  {
    label: "Celebrities",
    slug: "celebrities",
  },
  {
    label: "Awards",
    slug: "awards",
  },
  {
    label: "Box Office",
    slug: "box-office",
  },
  {
    label: "Anime",
    slug: "anime",
  },
];

export const metadata: Metadata = {
  /*
   * Root layout automatically adds:
   * | CINRYVAN
   */
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  category: "Entertainment News",

  alternates: {
    canonical: PAGE_URL,
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
    title: `${PAGE_TITLE} | CINRYVAN`,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "CINRYVAN",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Entertainment, movie and TV news on CINRYVAN",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | CINRYVAN`,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        alt: "Entertainment, movie and TV news on CINRYVAN",
      },
    ],
  },
};

export default async function EntertainmentNewsPage() {
  const news = await getEntertainmentNews().catch(
    () => [],
  );

  const visibleNews = Array.isArray(news)
    ? news.filter(
        (item) => item?.title && item?.url,
      )
    : [];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}#collection`,

    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,

    mainEntity: {
      "@id": `${PAGE_URL}#headlines`,
    },

    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  const headlinesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${PAGE_URL}#headlines`,

    name: "Latest entertainment headlines",
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
        item: PAGE_URL,
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
        <section className="mb-10 rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-yellow-400/10 p-8">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
            CINRYVAN News Room
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Entertainment News
          </h1>

          <p className="mt-4 max-w-3xl text-white/65">
            Movie announcements, television updates,
            celebrity stories, streaming headlines,
            awards, box-office results and entertainment
            industry developments.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/65">
            {entertainmentTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/news/entertainment/${topic.slug}`}
                className="border border-white/10 bg-black/20 px-3 py-2 transition hover:border-yellow-400/60 hover:text-yellow-300"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </section>

        <NewsCategoryGrid
          eyebrow="Entertainment Radar"
          title="Latest Entertainment Headlines"
          items={visibleNews}
          color="yellow"
        />

        {visibleNews.length === 0 && (
          <section className="mt-8 border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="text-2xl font-black">
              Entertainment headlines temporarily unavailable
            </h2>

            <p className="mt-3 text-white/50">
              New entertainment stories will appear here
              when the news feed becomes available.
            </p>
          </section>
        )}

        <EntertainmentSubCategories />

        <nav
          aria-label="News categories"
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          <Link
            href="/news"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold transition hover:border-yellow-400/60 hover:text-yellow-300"
          >
            All News →
          </Link>

          <Link
            href="/news/gaming"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold transition hover:border-cyan-400/60 hover:text-cyan-300"
          >
            Gaming News →
          </Link>

          <Link
            href="/news/sports"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold transition hover:border-green-400/60 hover:text-green-300"
          >
            Sports News →
          </Link>
        </nav>
      </div>
    </main>
  );
}