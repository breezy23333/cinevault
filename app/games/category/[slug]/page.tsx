import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GameCard from "@/components/GameCard";
import {
  getGameCategoryInfo,
  getGameCategoryPage,
  RAWG_ATTRIBUTION_URL,
} from "@/lib/games";

export const runtime = "nodejs";
export const revalidate = 86400;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function parsePage(value?: string | string[]) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue || "1");

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function categoryPageHref(slug: string, page: number) {
  if (page <= 1) {
    return `/games/category/${slug}`;
  }

  return `/games/category/${slug}?page=${page}`;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const maximumVisiblePages = 5;

  let startPage = Math.max(
    1,
    currentPage - Math.floor(maximumVisiblePages / 2),
  );

  let endPage = Math.min(
    totalPages,
    startPage + maximumVisiblePages - 1,
  );

  startPage = Math.max(
    1,
    endPage - maximumVisiblePages + 1,
  );

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const category = getGameCategoryInfo(slug);

  if (!category) {
    return {
      title: "Game Category Not Found | CineVault",
      description: "The requested game category could not be found.",
    };
  }

  const page = parsePage(query.page);

  const title =
    page > 1
      ? `${category.title} – Page ${page} | CineVault`
      : `${category.title} | CineVault`;

  const canonical = categoryPageHref(slug, page);

  return {
    title,
    description: category.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: category.description,
      url: canonical,
      siteName: "CineVault",
      type: "website",
    },
  };
}

export default async function GameCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const requestedPage = parsePage(query.page);

  const category = await getGameCategoryPage(
    slug,
    requestedPage,
  );

  if (!category) {
    notFound();
  }

  if (
    category.totalResults > 0 &&
    requestedPage > category.totalPages
  ) {
    notFound();
  }

  const visiblePages = getVisiblePages(
    category.page,
    category.totalPages,
  );

  const firstResult =
    category.totalResults === 0
      ? 0
      : (category.page - 1) * category.pageSize + 1;

  const lastResult = Math.min(
    category.totalResults,
    firstResult + category.games.length - 1,
  );

  const heroImage =
    category.games.find((game) => game.background_image)
      ?.background_image || null;

  return (
    <main className="min-h-screen bg-[#080b12] pb-24 pt-28 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative min-h-[340px] overflow-hidden rounded-[32px] border border-white/10 bg-[#111927]">
          {heroImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${heroImage}")`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/85 to-[#080b12]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-black/20" />

          <div className="relative z-10 flex min-h-[340px] max-w-3xl flex-col justify-end p-7 md:p-12">
            <Link
              href="/games"
              className="mb-7 inline-flex w-fit items-center gap-2 text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
            >
              ← Back to Games
            </Link>

            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
              CineVault Gaming
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
              {category.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              {category.description}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mb-7 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Browse the collection
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {category.label} Games
              </h2>
            </div>

            <p className="text-sm text-white/50">
              {category.totalResults > 0
                ? `Showing ${firstResult}–${lastResult} of ${category.totalResults.toLocaleString()} games`
                : "No games found"}
            </p>
          </div>

          {category.games.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
              {category.games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16 text-center">
              <h2 className="text-2xl font-black">
                No games available
              </h2>

              <p className="mt-3 text-white/55">
                We could not find games for this page.
              </p>

              <Link
                href="/games"
                className="mt-6 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Return to Games
              </Link>
            </div>
          )}

          {category.games.length > 0 &&
            category.totalPages > 1 && (
              <nav
                aria-label={`${category.title} pagination`}
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
              >
                {category.page > 1 ? (
                  <Link
                    href={categoryPageHref(
                      category.slug,
                      category.page - 1,
                    )}
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm font-bold text-white/20">
                    ← Previous
                  </span>
                )}

                {visiblePages.map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={categoryPageHref(
                      category.slug,
                      pageNumber,
                    )}
                    aria-current={
                      pageNumber === category.page
                        ? "page"
                        : undefined
                    }
                    className={`grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-black transition ${
                      pageNumber === category.page
                        ? "bg-yellow-400 text-black"
                        : "border border-white/10 bg-white/[0.05] text-white hover:border-yellow-400 hover:text-yellow-400"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                ))}

                {category.page < category.totalPages ? (
                  <Link
                    href={categoryPageHref(
                      category.slug,
                      category.page + 1,
                    )}
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm font-bold text-white/20">
                    Next →
                  </span>
                )}

                <span className="ml-2 text-sm text-white/40">
                  Page {category.page.toLocaleString()} of{" "}
                  {category.totalPages.toLocaleString()}
                </span>
              </nav>
            )}
        </section>

        <footer className="border-t border-white/10 pt-8 text-center text-sm text-white/45">
          Game information and images provided by{" "}
          <a
            href={RAWG_ATTRIBUTION_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-yellow-400 transition hover:text-yellow-300"
          >
            RAWG
          </a>
          .
        </footer>
      </div>
    </main>
  );
}