/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GameShelf from "@/components/GameShelf";
import GameTrailer from "@/components/GameTrailer";
import {
  getGameDetails,
  getGamePageData,
  RAWG_ATTRIBUTION_URL,
} from "@/lib/games";
import { getGameTrailer } from "@/lib/youtube";

export const revalidate = 86400;
export const dynamicParams = true;

const SITE_URL = "https://cinevault-tau-drab.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function cleanRequirement(value?: string) {
  if (!value) return "";

  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatReleaseDate(date?: string | null) {
  if (!date) return "Release date unavailable";

  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStoreSearchUrl(storeName: string, gameName: string) {
  const store = storeName.toLowerCase();
  const query = encodeURIComponent(gameName);

  if (store.includes("steam")) {
    return `https://store.steampowered.com/search/?term=${query}`;
  }

  if (store.includes("playstation")) {
    return `https://store.playstation.com/en-za/search/${query}`;
  }

  if (store.includes("xbox")) {
    return `https://www.xbox.com/en-ZA/search/results?q=${query}`;
  }

  if (store.includes("epic")) {
    return `https://store.epicgames.com/en-US/browse?q=${query}&sortBy=relevancy&sortDir=DESC&count=40`;
  }

  if (store.includes("gog")) {
    return `https://www.gog.com/en/games?query=${query}`;
  }

  if (store.includes("nintendo")) {
    return `https://www.nintendo.com/us/search/#q=${query}&p=1&cat=gme`;
  }

  if (store.includes("google play")) {
    return `https://play.google.com/store/search?q=${query}&c=apps`;
  }

  if (store.includes("apple")) {
    return `https://www.apple.com/za/search/${query}?src=globalnav`;
  }

  if (store.includes("itch")) {
    return `https://itch.io/search?q=${query}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(
    `${gameName} buy on ${storeName}`,
  )}`;
}


export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameDetails(id);

  if (!game) {
    return {
      title: "Game Not Found | CineVault",
      description: "The requested game could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const plainDescription = game.description_raw
    ?.replace(/\s+/g, " ")
    .trim();

  const description =
    plainDescription?.slice(0, 155) ||
    `Discover ${game.name}, trailers, screenshots, platforms, ratings and where to play on CineVault.`;

  const title =
    `${game.name} | Trailers, Ratings & Where to Play | CineVault`;

  const canonicalUrl = `${SITE_URL}/game/${game.id}`;

  const socialImage =
    game.background_image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,

    keywords: [
      game.name,
      `${game.name} game`,
      "video games",
      "game trailers",
      "game ratings",
      "game screenshots",
      "where to play games",
      ...(game.genres?.map(
        (genre) => `${genre.name} games`,
      ) || []),
      ...(game.platforms?.map(
        (item) => `${item.platform.name} games`,
      ) || []),
      "CineVault Gaming",
    ],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "CineVault",
      type: "website",
      images: [
        {
          url: socialImage,
          alt: `${game.name} game artwork`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GameDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const pageData = await getGamePageData(id);

  if (!pageData) {
    notFound();
  }

  const { game, screenshots, seriesGames, moreGames } = pageData;
  const trailer = await getGameTrailer(game.name);

  const platforms = game.platforms || [];
  const stores = game.stores || [];

  const pcPlatform = platforms.find(
    (item) => item.platform.slug === "pc",
  );

  const minimumRequirements = cleanRequirement(
    pcPlatform?.requirements?.minimum,
  );

  const recommendedRequirements = cleanRequirement(
    pcPlatform?.requirements?.recommended,
  );

  const seriesIds = new Set(seriesGames.map((item) => item.id));

  const relatedGames = moreGames.filter(
    (item) => !seriesIds.has(item.id),
  );

  const description =
    game.description_raw ||
    "A complete description is not currently available.";

  const pageUrl = `${SITE_URL}/game/${game.id}`;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.name,
    url: pageUrl,
    description: description.slice(0, 500),
    image: [
      game.background_image,
      game.background_image_additional,
      ...screenshots.slice(0, 4).map((item) => item.image),
    ].filter(Boolean),
    datePublished: game.released || undefined,
    genre: game.genres?.map((genre) => genre.name),
    gamePlatform: platforms.map((item) => item.platform.name),
    author: game.developers?.map((developer) => ({
      "@type": "Organization",
      name: developer.name,
    })),
    publisher: game.publishers?.map((publisher) => ({
      "@type": "Organization",
      name: publisher.name,
    })),
    aggregateRating:
      game.rating > 0 && game.ratings_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: game.rating,
            bestRating: game.rating_top || 5,
            ratingCount: game.ratings_count,
          }
        : undefined,
  };

  return (
    <main className="min-h-screen bg-[#05070d] pb-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative min-h-[720px] overflow-hidden pt-24">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={`${game.name} background`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#101722]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/80 to-[#05070d]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-[#05070d]/50" />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-end px-4 pb-16 md:px-6">
          <div className="max-w-5xl">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
            >
              ← Back to Gaming
            </Link>

            <div className="mt-7 flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white/75 backdrop-blur"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.05] md:text-6xl lg:text-7xl">
              {game.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span>{formatReleaseDate(game.released)}</span>

              <span className="font-black text-yellow-400">
                ★ {game.rating ? game.rating.toFixed(1) : "Not rated"}
              </span>

              {game.metacritic !== null &&
                game.metacritic !== undefined && (
                  <span className="rounded-md bg-green-500 px-2.5 py-1 font-black text-black">
                    Metacritic {game.metacritic}
                  </span>
                )}

              {game.esrb_rating?.name && (
                <span className="rounded-md border border-white/15 bg-black/40 px-2.5 py-1">
                  {game.esrb_rating.name}
                </span>
              )}

              {game.playtime > 0 && (
                <span>{game.playtime} hours average playtime</span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#trailer"
                className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                ▶ Watch trailer
              </a>

              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/15 bg-black/50 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  Official website ↗
                </a>
              )}

              <a
                href={`https://rawg.io/games/${game.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/15 bg-black/50 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Buying options ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="sticky top-[72px] z-40 overflow-x-auto rounded-2xl border border-white/10 bg-[#101722]/95 p-2 shadow-2xl backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-1">
            <a
              href="#trailer"
              className="rounded-xl px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"
            >
              Trailer
            </a>

            <a
              href="#about"
              className="rounded-xl px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"
            >
              About
            </a>

            {screenshots.length > 0 && (
              <a
                href="#screenshots"
                className="rounded-xl px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"
              >
                Screenshots
              </a>
            )}

            {(minimumRequirements || recommendedRequirements) && (
              <a
                href="#requirements"
                className="rounded-xl px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"
              >
                PC Requirements
              </a>
            )}

            {moreGames.length > 0 && (
              <a
                href="#more-games"
                className="rounded-xl px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"
              >
                More Games
              </a>
            )}
          </div>
        </nav>

        <GameTrailer gameTitle={game.name} trailer={trailer} />

        <div
          id="about"
          className="mt-16 scroll-mt-40 grid gap-8 lg:grid-cols-[1.6fr_0.7fr]"
        >
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                About the game
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                What is {game.name} about?
              </h2>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-white/70">
                {description}
              </p>
            </section>

            {game.background_image_additional && (
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                <img
                  src={game.background_image_additional}
                  alt={`${game.name} gameplay artwork`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover"
                />
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Where to play
              </p>

              <h2 className="mt-2 text-xl font-black">
                Available platforms
              </h2>

              <div className="mt-5 space-y-2">
                {platforms.length > 0 ? (
                  platforms.map((item) => (
                    <div
                      key={item.platform.id}
                      className="rounded-xl bg-black/30 px-4 py-3 text-sm font-semibold text-white/75 ring-1 ring-white/10"
                    >
                      {item.platform.name}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/50">
                    Platform information is unavailable.
                  </p>
                )}
              </div>
            </section>

            {stores.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                  Store availability
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Where to buy
                </h2>

                <div className="mt-5 space-y-2">
                  {stores.map((item) => (
                    <a
                      key={item.id}
                      href={getStoreSearchUrl(
                        item.store.name,
                        game.name,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold text-white/75 transition hover:border-yellow-400/60 hover:bg-white/10 hover:text-yellow-400"
                    >
                      <span>{item.store.name}</span>
                      <span>↗</span>
                    </a>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-5 text-white/40">
                  Store buttons open a search for this game. Availability
                  and pricing can differ by country.
                </p>
              </section>
            )}

            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Game information
              </p>

              <InfoRow
                label="Developer"
                value={
                  game.developers?.map((item) => item.name).join(", ") ||
                  "Unknown"
                }
              />

              <InfoRow
                label="Publisher"
                value={
                  game.publishers?.map((item) => item.name).join(", ") ||
                  "Unknown"
                }
              />

              <InfoRow
                label="Released"
                value={formatReleaseDate(game.released)}
              />

              <InfoRow
                label="Age rating"
                value={game.esrb_rating?.name || "Not rated"}
              />

              <InfoRow
                label="Genres"
                value={
                  game.genres?.map((genre) => genre.name).join(", ") ||
                  "Unknown"
                }
              />
            </section>

            {game.tags?.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
                <h2 className="text-xl font-black">Tags</h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {game.tags.slice(0, 16).map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-white/60"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        {screenshots.length > 0 && (
          <section
            id="screenshots"
            className="mt-16 scroll-mt-40"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              Inside the game
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              Screenshots
            </h2>

            <div className="mt-7 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
              <a
                href={screenshots[0].image}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-3xl bg-black ring-1 ring-white/10"
              >
                <img
                  src={screenshots[0].image}
                  alt={`${game.name} screenshot 1`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </a>

              <div className="grid grid-cols-2 gap-3">
                {screenshots.slice(1, 5).map((screenshot, index) => (
                  <a
                    key={screenshot.id}
                    href={screenshot.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
                  >
                    <img
                      src={screenshot.image}
                      alt={`${game.name} screenshot ${index + 2}`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {(minimumRequirements || recommendedRequirements) && (
          <section
            id="requirements"
            className="mt-16 scroll-mt-40 rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              PC specifications
            </p>

            <h2 className="mt-2 text-3xl font-black">
              System requirements
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {minimumRequirements && (
                <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10 md:p-6">
                  <h3 className="font-black text-white">Minimum</h3>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/60">
                    {minimumRequirements}
                  </p>
                </div>
              )}

              {recommendedRequirements && (
                <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10 md:p-6">
                  <h3 className="font-black text-white">
                    Recommended
                  </h3>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/60">
                    {recommendedRequirements}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {moreGames.length > 0 && (
          <section
            id="more-games"
            className="mt-20 scroll-mt-40"
          >
            {seriesGames.length > 0 && (
              <GameShelf
                title={`More from the ${game.name} series`}
                subtitle="Discover other games and editions from the same universe."
                games={seriesGames}
              />
            )}

            {relatedGames.length > 0 && (
              <GameShelf
                title="More games like this"
                subtitle={`More popular ${game.genres?.[0]?.name || "gaming"} experiences to explore.`}
                games={relatedGames}
              />
            )}
          </section>
        )}

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          Game information and images provided by{" "}
          <a
            href={RAWG_ATTRIBUTION_URL}
            target="_blank"
            rel="noopener noreferrer"
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

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-5 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-bold uppercase tracking-wider text-white/40">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 text-white/75">
        {value}
      </p>
    </div>
  );
}