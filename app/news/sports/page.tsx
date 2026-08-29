import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Film,
  Gamepad2,
} from "lucide-react";

import { getSportsNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import SportsSubCategories from "@/components/SportsSubCategories";
import SportsNewsHero from "@/components/SportsNewsHero";

export const revalidate = 900;

const SITE_URL = "https://cinryvan.vercel.app";
const PAGE_URL = `${SITE_URL}/news/sports`;

const PAGE_TITLE = "Latest Sports News, Results & Updates";

const PAGE_DESCRIPTION =
  "Read the latest sports news, soccer, NFL, Formula 1, motorsport, cricket, rugby, tennis and basketball results and updates on CINRYVAN.";

const sportsTopics = [
  { label: "Soccer", slug: "soccer" },
  { label: "American Football", slug: "football" },
  { label: "Racing", slug: "racing" },
  { label: "Cricket", slug: "cricket" },
  { label: "Rugby", slug: "rugby" },
  { label: "Tennis", slug: "tennis" },
  { label: "Basketball", slug: "basketball" },
];

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  category: "Sports News",

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
        alt: "Sports news and results on CINRYVAN",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | CINRYVAN`,
    description: PAGE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default async function SportsNewsPage() {
  const news = await getSportsNews().catch(() => []);

  const visibleNews = Array.isArray(news)
    ? news.filter((item) => item?.title && item?.url)
    : [];

  const heroStories = visibleNews.slice(0, 7);
  const latestStories = visibleNews.slice(7);

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
    name: "Latest sports headlines",
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
        item: PAGE_URL,
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

      <header className="relative border-b border-emerald-400/10 px-5 pb-10 pt-28 lg:px-8 lg:pb-14">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(52,211,153,0.12),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(34,197,94,0.1),transparent_25%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-black text-white/45 transition hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News Room
          </Link>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.32em] text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                Live sports desk
              </div>

              <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-[96px]">
                EVERY MATCH.
                <span className="block text-white/20">EVERY MOMENT.</span>
              </h1>
            </div>

            <div className="max-w-md">
              <p className="leading-7 text-white/55">
                Results, transfers and major stories from soccer, motorsport,
                cricket, rugby, tennis, basketball and American football.
              </p>

              <p className="mt-4 text-sm font-bold text-emerald-300">
                {visibleNews.length} sports stories available
              </p>
            </div>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sportsTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/news/sports/${topic.slug}`}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-black text-white/60 transition hover:border-emerald-300/60 hover:bg-emerald-400 hover:text-[#04110b]"
              >
                {topic.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8 lg:py-14">
        <SportsNewsHero items={heroStories} />

        {latestStories.length > 0 && (
          <section className="mt-16">
            <div className="mb-7 flex flex-col gap-4 border-b border-emerald-400/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
                  From the field
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
                  Latest Sports News
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-6 text-white/45">
                Results, transfers, breaking developments and stories from
                across the sporting world.
              </p>
            </div>

            <NewsCategoryGrid
              eyebrow="Live Sports"
              title="More Sports Headlines"
              items={latestStories}
              color="green"
            />
          </section>
        )}

        {visibleNews.length === 0 && (
          <section className="rounded-[30px] border border-emerald-400/15 bg-emerald-400/[0.035] p-10 text-center">
            <h2 className="text-3xl font-black">
              Sports headlines temporarily unavailable
            </h2>

            <p className="mt-3 text-white/50">
              New sports stories will appear when the news feed becomes
              available.
            </p>
          </section>
        )}

        <div className="mt-16">
          <SportsSubCategories />
        </div>

        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
              Beyond the field
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
              Explore the newsroom
            </h2>
          </div>

          <nav
            aria-label="News categories"
            className="grid gap-4 md:grid-cols-3"
          >
            <Link
              href="/news"
              className="group relative min-h-[190px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-emerald-400/15 to-white/[0.03] p-6 transition hover:border-emerald-400/50"
            >
              <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                Main desk
              </span>

              <h3 className="mt-3 text-3xl font-black">All News</h3>

              <ArrowUpRight className="absolute bottom-6 right-6 h-7 w-7 text-white/30 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-300" />
            </Link>

            <Link
              href="/news/entertainment"
              className="group relative min-h-[190px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-yellow-400/15 to-white/[0.03] p-6 transition hover:border-yellow-400/50"
            >
              <Film className="h-6 w-6 text-yellow-300" />

              <h3 className="mt-4 text-3xl font-black">
                Entertainment
              </h3>

              <ArrowUpRight className="absolute bottom-6 right-6 h-7 w-7 text-white/30 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-yellow-300" />
            </Link>

            <Link
              href="/news/gaming"
              className="group relative min-h-[190px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-cyan-400/15 to-white/[0.03] p-6 transition hover:border-cyan-400/50"
            >
              <Gamepad2 className="h-6 w-6 text-cyan-300" />

              <h3 className="mt-4 text-3xl font-black">Gaming News</h3>

              <ArrowUpRight className="absolute bottom-6 right-6 h-7 w-7 text-white/30 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300" />
            </Link>
          </nav>
        </section>
      </div>
    </main>
  );
}