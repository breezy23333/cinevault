
import Link from "next/link";
import { ArrowUpRight, Gamepad2, Newspaper, Trophy } from "lucide-react";
import {
  getEntertainmentNews,
  getGamingNews,
  getSportsNews,
} from "@/lib/news";
import type { NewsItem } from "@/components/NewsStrip";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";

const SITE_URL = "https://cinryvan.vercel.app";
const NEWS_URL = `${SITE_URL}/news`;

export const revalidate = 900;

export const metadata = {
  title: "Entertainment, Gaming & Sports News",
  description:
    "Read live entertainment, gaming, sports, movie, TV, celebrity, streaming, and industry news on CINRYVAN.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Entertainment, Gaming & Sports News | CINRYVAN",
    description:
      "Live entertainment, gaming, sports, movie, TV, celebrity, streaming, and industry news.",
    url: "/news",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Entertainment, Gaming & Sports News | CINRYVAN",
    description:
      "Live entertainment, gaming, sports, movie, TV, celebrity, streaming, and industry news.",
    images: ["/og-image.png"],
  },
};

const newsSubcategories = {
  Entertainment: [
    "Movies",
    "TV Shows",
    "Streaming",
    "Celebrities",
    "Awards",
    "Box Office",
  ],
  Gaming: [
    "Console",
    "PC",
    "Mobile",
    "Esports",
    "PlayStation",
    "Xbox",
    "Nintendo",
  ],
  Sports: [
    "Soccer",
    "Football",
    "Racing",
    "Cricket",
    "Rugby",
    "Tennis",
    "Basketball",
  ],
};

const categoryLinks = [
  {
    label: "Entertainment",
    href: "/news/entertainment",
    icon: Newspaper,
    color: "text-[#ffcc4d]",
  },
  {
    label: "Gaming",
    href: "/news/gaming",
    icon: Gamepad2,
    color: "text-cyan-300",
  },
  {
    label: "Sports",
    href: "/news/sports",
    icon: Trophy,
    color: "text-emerald-300",
  },
];

export default async function NewsPage() {
  const [entertainmentResult, sportsResult, gamingResult] =
    await Promise.allSettled([
      getEntertainmentNews(),
      getSportsNews(),
      getGamingNews(),
    ]);

  const entertainment: NewsItem[] =
    entertainmentResult.status === "fulfilled"
      ? entertainmentResult.value
      : [];
  const sports: NewsItem[] =
    sportsResult.status === "fulfilled" ? sportsResult.value : [];
  const gaming: NewsItem[] =
    gamingResult.status === "fulfilled" ? gamingResult.value : [];

  const hero = entertainment[0];
  const spotlights = entertainment.slice(1, 4);
  const latest = entertainment.slice(4, 10);
  const sportsMain = sports.slice(0, 6);
  const gamingMain = gaming.slice(0, 6);
  const totalStories = entertainment.length + sports.length + gaming.length;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News", item: NEWS_URL },
    ],
  };

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Entertainment, Gaming & Sports News",
    description:
      "Live entertainment, gaming, sports, movie, TV, celebrity, streaming, and industry news.",
    url: NEWS_URL,
    mainEntity: { "@id": `${NEWS_URL}#headlines` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const visibleStories = [
    ...entertainment.slice(0, 10),
    ...sportsMain,
    ...gamingMain,
  ].filter((item) => item?.title && item?.url);

  const headlinesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${NEWS_URL}#headlines`,
    name: "Latest entertainment, gaming and sports headlines",
    numberOfItems: visibleStories.length,
    itemListElement: visibleStories.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: item.url,
    })),
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#06080c] text-white">
      {[breadcrumbJsonLd, newsJsonLd, headlinesJsonLd].map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <section className="relative border-b border-white/10 px-5 pb-12 pt-28 lg:px-8 lg:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(250,190,48,0.13),transparent_30%),radial-gradient(circle_at_90%_35%,rgba(30,170,255,0.08),transparent_26%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.32em] text-[#ffcc4d]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffcc4d]" />
                Live newsroom
              </div>
              <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.065em] sm:text-7xl lg:text-[104px]">
                THE WORLD,
                <span className="block text-white/25">AS IT HAPPENS.</span>
              </h1>
            </div>

            <div className="max-w-md xl:pb-2">
              <p className="text-base leading-7 text-white/55">
                Movies, television, gaming and sport—curated into one fast,
                visual news desk.
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm font-bold">
                <span className="rounded-full bg-white px-4 py-2 text-black">
                  {totalStories} stories
                </span>
                <span className="text-white/40">Updated every 15 minutes</span>
              </div>
            </div>
          </div>

          <nav className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryLinks.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={label}
                href={href}
                className="group flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                {label}
                <ArrowUpRight className="h-4 w-4 text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8 lg:py-14">
        {hero && (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.65fr)]">
            <a
              href={hero.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative min-h-[560px] overflow-hidden rounded-[30px] border border-white/10 bg-[#12151b] sm:min-h-[650px]"
            >
              {hero.image ? (
                <img
                  src={hero.image}
                  alt={hero.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,204,77,0.3),transparent_32%),linear-gradient(135deg,#171b23,#08090d)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
                <div className="mb-5 flex items-center gap-3">
                  <span className="rounded-full bg-[#ffcc4d] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-black">
                    Lead story
                  </span>
                  {hero.source && (
                    <span className="text-sm font-bold text-white/65">
                      {hero.source}
                    </span>
                  )}
                </div>
                <h2 className="max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                  {hero.title}
                </h2>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#ffcc4d]">
                  Read full story
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              </div>
            </a>

            <aside className="rounded-[30px] border border-white/10 bg-[#0c0f14] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffcc4d]">
                    The wire
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                    Latest now
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-sm font-black text-white/45">
                  {latest.length}
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {latest.map((item, index) => (
                  <a
                    key={item.url + index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[36px_1fr] gap-3 py-5"
                  >
                    <span className="text-xl font-black text-white/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="line-clamp-3 text-base font-extrabold leading-snug transition group-hover:text-[#ffcc4d]">
                        {item.title}
                      </h3>
                      {item.source && (
                        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/35">
                          {item.source}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </aside>
          </section>
        )}

        {spotlights.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ffcc4d]">
                  Editor&apos;s spotlight
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                  Stories shaping the screen
                </h2>
              </div>
              <Link
                href="/news/entertainment"
                className="hidden items-center gap-2 text-sm font-black text-white/55 transition hover:text-white sm:flex"
              >
                All entertainment <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {spotlights.map((item, index) => (
                <a
                  key={item.url + index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative min-h-[390px] overflow-hidden rounded-[26px] border border-white/10 bg-[#12151b]"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#252a34] to-[#090b0f]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {item.source && (
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffcc4d]">
                        {item.source}
                      </p>
                    )}
                    <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.025em] sm:text-3xl">
                      {item.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 space-y-16">
          <NewsCategoryGrid
            eyebrow="The stadium"
            title="Sports Headlines"
            items={sportsMain}
            color="green"
          />

          <NewsCategoryGrid
            eyebrow="The next level"
            title="Gaming Headlines"
            items={gamingMain}
            color="cyan"
          />
        </div>

        <section className="relative mt-16 overflow-hidden rounded-[32px] border border-white/10 bg-[#0d1015] p-6 sm:p-9 lg:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#ffcc4d]/10 blur-[110px]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#ffcc4d]">
                Choose your signal
              </p>
              <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.05em] sm:text-6xl">
                Go deeper.
                <span className="block text-white/25">Find your beat.</span>
              </h2>
              <p className="mt-5 max-w-sm leading-7 text-white/50">
                Jump directly into the stories, leagues, platforms and worlds
                you follow most.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(newsSubcategories).map(([category, items]) => (
                <div
                  key={category}
                  className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5"
                >
                  <h3 className="border-b border-white/10 pb-4 text-xl font-black">
                    {category}
                  </h3>
                  <div className="mt-3">
                    {items.map((item) => (
                      <Link
                        key={item}
                        href={`/news/${category.toLowerCase()}/${item
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                        className="group flex items-center justify-between border-b border-white/[0.06] py-3 text-sm font-bold text-white/55 transition last:border-0 hover:text-white"
                      >
                        {item}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
