import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Gamepad2, Trophy } from "lucide-react";

import { getEntertainmentNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import EntertainmentSubCategories from "@/components/EntertainmentSubCategories";
import EntertainmentNewsHero from "@/components/EntertainmentNewsHero";

export const revalidate = 900;

const SITE_URL = "https://cinryvan.vercel.app";
const PAGE_URL = `${SITE_URL}/news/entertainment`;

const PAGE_TITLE = "Latest Entertainment, Movie & TV News";

const PAGE_DESCRIPTION =
  "Read the latest entertainment news, movie and TV updates, celebrity stories, streaming headlines, awards, box-office results and industry developments on CINRYVAN.";

const entertainmentTopics = [
  { label: "Movies", slug: "movies" },
  { label: "TV Shows", slug: "tv-shows" },
  { label: "Streaming", slug: "streaming" },
  { label: "Celebrities", slug: "celebrities" },
  { label: "Awards", slug: "awards" },
  { label: "Box Office", slug: "box-office" },
  { label: "Anime", slug: "anime" },
];

export const metadata = {
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
    images: ["/og-image.png"],
  },
};

export default async function EntertainmentNewsPage() {
  const news = await getEntertainmentNews().catch(() => []);

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
    name: "Latest entertainment headlines",
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
        item: PAGE_URL,
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

      <header className="relative border-b border-white/10 px-5 pb-10 pt-28 lg:px-8 lg:pb-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(250,204,21,0.15),transparent_28%),radial-gradient(circle_at_85%_30%,rgba(249,115,22,0.08),transparent_25%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-black text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News Room
          </Link>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.32em] text-yellow-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                Entertainment desk
              </div>

              <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-[96px]">
                LIGHTS. CAMERA.
                <span className="block text-white/25">HEADLINES.</span>
              </h1>
            </div>

            <div className="max-w-md">
              <p className="leading-7 text-white/55">
                Movie announcements, television updates, celebrity stories,
                streaming headlines, awards and box-office results.
              </p>

              <p className="mt-4 text-sm font-bold text-yellow-400">
                {visibleNews.length} entertainment stories available
              </p>
            </div>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {entertainmentTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/news/entertainment/${topic.slug}`}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white/65 transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
              >
                {topic.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8 lg:py-14">
        <EntertainmentNewsHero items={heroStories} />

        {latestStories.length > 0 && (
          <section className="mt-16">
            <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                  Fresh from the wire
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
                  Latest Entertainment
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-6 text-white/45">
                Breaking stories and updates from across movies, television,
                streaming and celebrity culture.
              </p>
            </div>

            <NewsCategoryGrid
              eyebrow="Entertainment Radar"
              title="More Headlines"
              items={latestStories}
              color="yellow"
            />
          </section>
        )}

        {visibleNews.length === 0 && (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-3xl font-black">
              Entertainment headlines temporarily unavailable
            </h2>

            <p className="mt-3 text-white/50">
              New entertainment stories will appear when the news feed becomes
              available.
            </p>
          </section>
        )}

        <div className="mt-16">
          <EntertainmentSubCategories />
        </div>

        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              Across the newsroom
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
              Follow another story
            </h2>
          </div>

          <nav
            aria-label="News categories"
            className="grid gap-4 md:grid-cols-3"
          >
            <Link
              href="/news"
              className="group relative min-h-[190px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-yellow-400/15 to-white/[0.03] p-6 transition hover:border-yellow-400/50"
            >
              <span className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                Main desk
              </span>

              <h3 className="mt-3 text-3xl font-black">All News</h3>

              <ArrowUpRight className="absolute bottom-6 right-6 h-7 w-7 text-white/30 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-yellow-400" />
            </Link>

            <Link
              href="/news/gaming"
              className="group relative min-h-[190px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-cyan-400/15 to-white/[0.03] p-6 transition hover:border-cyan-400/50"
            >
              <Gamepad2 className="h-6 w-6 text-cyan-300" />

              <h3 className="mt-4 text-3xl font-black">Gaming News</h3>

              <ArrowUpRight className="absolute bottom-6 right-6 h-7 w-7 text-white/30 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300" />
            </Link>

            <Link
              href="/news/sports"
              className="group relative min-h-[190px] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-emerald-400/15 to-white/[0.03] p-6 transition hover:border-emerald-400/50"
            >
              <Trophy className="h-6 w-6 text-emerald-300" />

              <h3 className="mt-4 text-3xl font-black">Sports News</h3>

              <ArrowUpRight className="absolute bottom-6 right-6 h-7 w-7 text-white/30 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-300" />
            </Link>
          </nav>
        </section>
      </div>
    </main>
  );
}