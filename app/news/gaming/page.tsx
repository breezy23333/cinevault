// app/news/gaming/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

import { getGamingNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import GamingSubCategories from "@/components/GamingSubCategories";

export const revalidate = 900;

const SITE_URL = "https://cinryvan.vercel.app";
const PAGE_URL = `${SITE_URL}/news/gaming`;

const PAGE_TITLE =
  "Latest Gaming News, Releases & Esports Updates";

const PAGE_DESCRIPTION =
  "Read the latest gaming news, game announcements, release updates, esports stories, PlayStation, Xbox, Nintendo, PC and mobile headlines on CINRYVAN.";

export const metadata: Metadata = {
  /*
   * Root layout automatically adds:
   * | CINRYVAN
   */
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  category: "Gaming News",

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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gaming news and updates on CINRYVAN",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | CINRYVAN`,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        alt: "Gaming news and updates on CINRYVAN",
      },
    ],
  },
};

export default async function GamingNewsPage() {
  const gamingResult = await Promise.allSettled([
    getGamingNews(),
  ]);

  const news =
    gamingResult[0].status === "fulfilled"
      ? gamingResult[0].value
      : [];

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

    name: "Latest gaming headlines",
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
        <section className="mb-10 rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-cyan-400/10 p-8">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400">
            CINRYVAN News Room
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Gaming News
          </h1>

          <p className="mt-4 max-w-3xl text-white/65">
            Game announcements, release updates,
            esports stories and the latest headlines
            from PlayStation, Xbox, Nintendo, PC and
            mobile gaming.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/65">
            {[
              "Console",
              "PC",
              "Mobile",
              "Esports",
              "PlayStation",
              "Xbox",
              "Nintendo",
            ].map((topic) => (
              <Link
                key={topic}
                href={`/news/gaming/${topic
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
                className="border border-white/10 bg-black/20 px-3 py-2 transition hover:border-cyan-400/60 hover:text-cyan-300"
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>

        <NewsCategoryGrid
          eyebrow="Gaming Signal"
          title="Latest Gaming Headlines"
          items={visibleNews}
          color="cyan"
        />

        {visibleNews.length === 0 && (
          <section className="mt-8 border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="text-2xl font-black">
              Gaming headlines temporarily unavailable
            </h2>

            <p className="mt-3 text-white/50">
              New gaming stories will appear here when
              the news feed becomes available.
            </p>
          </section>
        )}

        <GamingSubCategories />

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
            href="/news/entertainment"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold transition hover:border-yellow-400/60 hover:text-yellow-300"
          >
            Entertainment News →
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