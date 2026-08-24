import type { Metadata } from "next";
import Link from "next/link";
import { getUpcomingTvSeries } from "@/lib/fetchers";

export const revalidate = 300;

const SITE_URL = "https://cinryvan.vercel.app";
const PAGE_URL = `${SITE_URL}/upcoming/tv`;

type PageProps = {
  searchParams?: Promise<{ page?: string }>;
};

type UpcomingShow = {
  id: number;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
};

const img = (path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : "/og-image.png";

function normalizePage(value?: string) {
  const page = Number(value || 1);
  return Number.isFinite(page)
    ? Math.min(Math.max(Math.trunc(page), 1), 500)
    : 1;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = normalizePage(params?.page);
  const canonical = page === 1 ? PAGE_URL : `${PAGE_URL}?page=${page}`;
  const suffix = page > 1 ? ` — Page ${page}` : "";
  const title = `Upcoming TV Shows & New Series${suffix}`;
  const description =
    page === 1
      ? "Discover upcoming TV shows and new series, release dates, ratings, cast information, trailers and details about what is coming next."
      : `Browse page ${page} of upcoming TV shows, new series, release dates and programmes coming soon on CINRYVAN.`;

  return {
    title,
    description,
    category: "Upcoming TV Shows",
    alternates: { canonical },
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
      title: `${title} | CINRYVAN`,
      description,
      url: canonical,
      siteName: "CINRYVAN",
      locale: "en_US",
      images: [{
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Upcoming television shows on CINRYVAN",
      }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CINRYVAN`,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function UpcomingTvPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const page = normalizePage(params?.page);
  const result = await getUpcomingTvSeries(page);
  const shows: UpcomingShow[] = Array.isArray(result) ? result : [];
  const visibleShows = shows.filter(
    (show) => show.id && show.name && show.poster_path,
  );
  const pageUrl = page === 1 ? PAGE_URL : `${PAGE_URL}?page=${page}`;
  const pageOffset = (page - 1) * visibleShows.length;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
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
        name: "Upcoming",
        item: `${SITE_URL}/upcoming`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "TV Shows",
        item: pageUrl,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name: page === 1 ? "Upcoming TV Shows" : `Upcoming TV Shows — Page ${page}`,
    description: "Discover upcoming television shows and new series coming soon.",
    url: pageUrl,
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    mainEntity: { "@id": `${pageUrl}#shows` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const showsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#shows`,
    name: `Upcoming TV shows — page ${page}`,
    numberOfItems: visibleShows.length,
    itemListElement: visibleShows.map((show, index) => ({
      "@type": "ListItem",
      position: pageOffset + index + 1,
      item: {
        "@type": "TVSeries",
        name: show.name,
        description: show.overview || undefined,
        url: `${SITE_URL}/tv/${show.id}`,
        image: `https://image.tmdb.org/t/p/w780${show.poster_path}`,
        dateCreated: show.first_air_date || undefined,
        aggregateRating:
          typeof show.vote_average === "number" &&
          typeof show.vote_count === "number" &&
          show.vote_count > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: Math.round(show.vote_average * 10) / 10,
                ratingCount: show.vote_count,
                bestRating: 10,
                worstRating: 0,
              }
            : undefined,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(showsJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-[1500px] space-y-10">
        <section className="rounded-[34px] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.04] to-blue-500/10 p-8">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
            Series Radar
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Upcoming TV Shows
          </h1>
          <p className="mt-4 max-w-3xl text-white/65">
            Discover upcoming TV series before they arrive.
          </p>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {visibleShows.map((show) => (
            <Link
              key={show.id}
              href={`/tv/${show.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <img
                src={img(show.poster_path)}
                alt={show.name || "TV Show"}
                className="h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="p-4">
                <h3 className="line-clamp-1 font-black text-yellow-300">
                  {show.name}
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  {show.first_air_date?.slice(0, 4) || "Coming soon"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {visibleShows.length === 0 && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="text-2xl font-black">No upcoming shows found</h2>
            <p className="mt-3 text-white/50">
              New television releases will appear here when they become available.
            </p>
          </section>
        )}

        <nav
          aria-label="Upcoming television pages"
          className="flex justify-center gap-4"
        >
          {page > 1 && (
            <Link href={`/upcoming/tv?page=${page - 1}`}>← Previous</Link>
          )}

          <Link href={`/upcoming/tv?page=${page + 1}`}>Next →</Link>
        </nav>
      </div>
    </main>
  );
}