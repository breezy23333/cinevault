/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  ExternalLink,
  Monitor,
  Play,
  Star,
} from "lucide-react";
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

const SITE_URL = "https://cinryvan.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

type PageProps = { params: Promise<{ id: string }> };

function cleanRequirement(value?: string) {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
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

function cleanSeoText(value?: string | null) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateSeoText(value: string, maximumLength = 158) {
  if (value.length <= maximumLength) return value;

  const shortened = value
    .slice(0, maximumLength - 1)
    .replace(/\s+\S*$/, "")
    .replace(/[,:;.!?\s]+$/, "");

  return `${shortened}…`;
}

function getStoreSearchUrl(storeName: string, gameName: string) {
  const store = storeName.toLowerCase();
  const query = encodeURIComponent(gameName);
  if (store.includes("steam")) return `https://store.steampowered.com/search/?term=${query}`;
  if (store.includes("playstation")) return `https://store.playstation.com/en-za/search/${query}`;
  if (store.includes("xbox")) return `https://www.xbox.com/en-ZA/search/results?q=${query}`;
  if (store.includes("epic")) return `https://store.epicgames.com/en-US/browse?q=${query}&sortBy=relevancy&sortDir=DESC&count=40`;
  if (store.includes("gog")) return `https://www.gog.com/en/games?query=${query}`;
  if (store.includes("nintendo")) return `https://www.nintendo.com/us/search/#q=${query}&p=1&cat=gme`;
  if (store.includes("google play")) return `https://play.google.com/store/search?q=${query}&c=apps`;
  if (store.includes("apple")) return `https://www.apple.com/za/search/${query}?src=globalnav`;
  if (store.includes("itch")) return `https://itch.io/search?q=${query}`;
  return `https://www.google.com/search?q=${encodeURIComponent(`${gameName} buy on ${storeName}`)}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return {
      title: "Game Not Found",
      description: "The requested game could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const gameId = Number(id);

  if (!Number.isSafeInteger(gameId) || gameId < 1) {
    return {
      title: "Game Not Found",
      description: "The requested game could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${SITE_URL}/games/${gameId}`;

  try {
    const game = await getGameDetails(String(gameId));

    if (!game) {
      return {
        title: "Game Not Found",
        description: "The requested game could not be found on CINRYVAN.",
        alternates: {
          canonical: canonicalUrl,
        },
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const gameName = cleanSeoText(game.name || "Video Game");
    const year = game.released?.slice(0, 4) || "";

    const displayTitle = year
      ? `${gameName} (${year})`
      : gameName;

    /*
     * The root layout automatically adds:
     * | CINRYVAN
     */
    const pageTitle =
      `${displayTitle}: Platforms & Where to Play`;

    const gameDescription = cleanSeoText(
      game.description_raw,
    );

    const platformNames =
      game.platforms
        ?.map((item) => item.platform.name)
        .filter(Boolean)
        .slice(0, 4) || [];

    const platformText =
      platformNames.length > 0
        ? ` Available for ${platformNames.join(", ")}.`
        : "";

    const discoveryText =
      `See trailers, screenshots, ratings, release details and where to play ${displayTitle} on CINRYVAN.${platformText}`;

    const description = truncateSeoText(
      gameDescription
        ? `${gameDescription} ${discoveryText}`
        : discoveryText,
      158,
    );

    const socialImage =
      game.background_image ||
      game.background_image_additional ||
      DEFAULT_OG_IMAGE;

    return {
      title: pageTitle,
      description,

      category: "Video Games",

      alternates: {
        canonical: canonicalUrl,
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
        title: `${pageTitle} | CINRYVAN`,
        description,
        url: canonicalUrl,
        siteName: "CINRYVAN",
        type: "website",
        locale: "en_US",
        images: [
          {
            url: socialImage,
            alt: `${displayTitle} game artwork`,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | CINRYVAN`,
        description,
        images: [
          {
            url: socialImage,
            alt: `${displayTitle} game artwork`,
          },
        ],
      },
    };
  } catch {
    return {
      title: `Game ${gameId}: Platforms and Details`,
      description:
        "Discover game trailers, screenshots, platforms, ratings, release information and where to play on CINRYVAN.",
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default async function GameDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const pageData = await getGamePageData(id);
  if (!pageData) notFound();

  const { game, screenshots, seriesGames, moreGames } = pageData;
  const trailer = await getGameTrailer(game.name, game.trailer_video_id);
  const platforms = game.platforms || [];
  const stores = game.stores || [];
  const pcPlatform = platforms.find((item) => item.platform.slug === "pc");
  const minimumRequirements = cleanRequirement(pcPlatform?.requirements?.minimum);
  const recommendedRequirements = cleanRequirement(pcPlatform?.requirements?.recommended);
  const seriesIds = new Set(seriesGames.map((item) => item.id));
  const relatedGames = moreGames.filter((item) => !seriesIds.has(item.id));
  const description =
    game.description_raw || "A complete description is not currently available.";
  const pageUrl = `${SITE_URL}/games/${game.id}`;

  const gameImages = Array.from(
    new Set(
      [
        game.background_image,
        game.background_image_additional,
        ...screenshots.slice(0, 6).map((item) => item.image),
      ].filter(Boolean) as string[],
    ),
  );

  const developers = Array.isArray(game.developers) ? game.developers : [];
  const publishers = Array.isArray(game.publishers) ? game.publishers : [];

  const gameJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "@id": `${pageUrl}#game`,
    name: game.name,
    description:
      cleanSeoText(game.description_raw).slice(0, 500) ||
      `Discover ${game.name} on CINRYVAN.`,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    image: gameImages.length > 0 ? gameImages : [DEFAULT_OG_IMAGE],
    screenshot: screenshots
      .slice(0, 6)
      .map((item) => item.image)
      .filter(Boolean),
    datePublished: game.released || undefined,
    genre: game.genres?.map((genre) => genre.name),
    gamePlatform: platforms.map((item) => item.platform.name),
    operatingSystem: platforms.map((item) => item.platform.name),
    applicationCategory: "Game",
    contentRating: game.esrb_rating?.name || undefined,
    author: developers.map((developer) => ({
      "@type": "Organization",
      name: developer.name,
    })),
    publisher: publishers.map((publisher) => ({
      "@type": "Organization",
      name: publisher.name,
    })),
    sameAs: game.website || undefined,
    aggregateRating:
      game.rating > 0 && game.ratings_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: game.rating,
            bestRating: game.rating_top || 5,
            worstRating: 0,
            ratingCount: game.ratings_count,
          }
        : undefined,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
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
        name: "Games",
        item: `${SITE_URL}/games`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: game.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#080b12] pb-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gameJsonLd).replace(
            /</g,
            "\\u003c",
          ),
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

      <section className="relative min-h-[590px] overflow-hidden pt-24">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={`${game.name} background`}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-[#101722]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/78 to-[#080b12]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/10 to-black/45" />

        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-end px-4 pb-12 md:px-6 md:pb-16">
          <div className="grid w-full items-end gap-8 lg:grid-cols-[minmax(0,1.55fr)_380px]">
            <div className="max-w-4xl">
              <Link
                href="/games"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-yellow-400 transition hover:text-yellow-300"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Gaming
              </Link>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {game.genres?.slice(0, 5).map((genre) => (
                  <span
                    key={genre.id}
                    className="border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 max-w-5xl text-4xl font-black leading-[.95] tracking-tight md:text-6xl lg:text-7xl">
                {game.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold text-white/65">
                <span>{formatReleaseDate(game.released)}</span>
                {game.rating > 0 && (
                  <span className="inline-flex items-center gap-1 bg-yellow-400 px-2.5 py-1.5 font-black text-black">
                    <Star className="h-3.5 w-3.5" fill="currentColor" />
                    {game.rating.toFixed(1)}
                  </span>
                )}
                {typeof game.metacritic === "number" && (
                  <span className="border border-emerald-400/50 bg-[#173e2b]/90 px-2.5 py-1.5 font-black text-emerald-200">
                    {game.metacritic} Metascore
                  </span>
                )}
                {game.esrb_rating?.name && (
                  <span className="border border-white/15 bg-black/40 px-2.5 py-1.5">
                    {game.esrb_rating.name}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="#trailer"
                  className="inline-flex items-center gap-2 bg-yellow-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  <Play className="h-4 w-4" fill="currentColor" /> Watch trailer
                </a>
                {game.website && (
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/20 bg-black/45 px-5 py-2.5 text-sm font-black text-white transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    Official website <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <aside className="hidden border border-white/15 bg-[#0c121d]/90 p-5 shadow-[0_24px_70px_rgba(0,0,0,.5)] backdrop-blur-xl lg:block">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-400">
                Game overview
              </p>
              <div className="mt-4 space-y-3">
                <QuickFact label="Platforms" value={platforms.slice(0, 4).map((item) => item.platform.name).join(", ") || "Unavailable"} />
                <QuickFact label="Developer" value={game.developers?.map((item) => item.name).join(", ") || "Unknown"} />
                <QuickFact label="Publisher" value={game.publishers?.map((item) => item.name).join(", ") || "Unknown"} />
              </div>
              {game.playtime > 0 && (
                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-bold text-white/55">
                  <Clock3 className="h-4 w-4 text-yellow-400" />
                  {game.playtime} hours average playtime
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.55fr)_360px]">
          <div className="min-w-0">
            <GameTrailer gameTitle={game.name} trailer={trailer} />

            <section id="about" className="mt-12 scroll-mt-40 border-t border-white/10 pt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                About the game
              </p>
              <h2 className="mt-1 text-2xl font-black md:text-3xl">
                What is {game.name} about?
              </h2>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-8 text-white/65">
                {description}
              </p>
              {game.background_image_additional && (
                <img
                  src={game.background_image_additional}
                  alt={`${game.name} gameplay artwork`}
                  loading="lazy"
                  decoding="async"
                  className="mt-7 aspect-video w-full border border-white/10 object-cover"
                />
              )}
            </section>

            {screenshots.length > 0 && (
              <section id="screenshots" className="mt-12 scroll-mt-40 border-t border-white/10 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                  Inside the game
                </p>
                <h2 className="mt-1 text-2xl font-black md:text-3xl">Screenshots</h2>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {screenshots.slice(0, 6).map((screenshot, index) => (
                    <a
                      key={screenshot.id}
                      href={screenshot.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative overflow-hidden border border-white/10 bg-black ${
                        index === 0 ? "col-span-2" : ""
                      }`}
                    >
                      <img
                        src={screenshot.image}
                        alt={`${game.name} screenshot ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
                      />
                      <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center bg-black/65 text-white opacity-0 transition group-hover:bg-yellow-400 group-hover:text-black group-hover:opacity-100">
                        <ExternalLink className="h-4 w-4" />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {pcPlatform && (
              <section id="requirements" className="mt-12 scroll-mt-40 border-t border-white/10 pt-8">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Monitor className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">PC specifications</p>
                </div>
                <h2 className="mt-1 text-2xl font-black md:text-3xl">System Requirements</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <RequirementCard title="Minimum" value={minimumRequirements} />
                  <RequirementCard title="Recommended" value={recommendedRequirements} />
                </div>
                {(!minimumRequirements || !recommendedRequirements) && (
                  <div className="mt-3 border border-yellow-400/20 bg-yellow-400/[.05] p-4">
                    <p className="text-sm leading-6 text-white/55">
                      Complete verified requirements are unavailable. Check the official store listing before purchasing or installing.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={getStoreSearchUrl("Steam", game.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-yellow-400 px-4 py-2 text-xs font-black text-black hover:bg-yellow-300"
                      >
                        Check Steam requirements
                      </a>
                      {game.website && (
                        <a
                          href={game.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-white/15 px-4 py-2 text-xs font-black text-white hover:border-yellow-400 hover:text-yellow-400"
                        >
                          Official website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-4 pt-12 lg:sticky lg:top-36">
            <section className="border border-white/10 bg-[#101722] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Where to play</p>
              <h2 className="mt-1 text-xl font-black">Available Platforms</h2>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {platforms.length ? (
                  platforms.map((item) => (
                    <span key={item.platform.id} className="border border-white/10 bg-black/25 px-2.5 py-2 text-[11px] font-bold text-white/65">
                      {item.platform.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-white/45">Platform information is unavailable.</p>
                )}
              </div>
            </section>

            {stores.length > 0 && (
              <section className="border border-white/10 bg-[#101722] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Store availability</p>
                <h2 className="mt-1 text-xl font-black">Where to Buy</h2>
                <div className="mt-4 space-y-1.5">
                  {stores.map((item) => (
                    <a
                      key={item.id}
                      href={getStoreSearchUrl(item.store.name, game.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between border border-white/10 bg-black/25 px-3 py-2.5 text-xs font-bold text-white/65 transition hover:border-yellow-400/60 hover:text-yellow-400"
                    >
                      <span>{item.store.name}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
                <p className="mt-3 text-[10px] leading-4 text-white/30">
                  Buttons open a store search. Availability and prices differ by country.
                </p>
              </section>
            )}

            <section className="border border-white/10 bg-[#101722] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Game information</p>
              <InfoRow label="Developer" value={game.developers?.map((item) => item.name).join(", ") || "Unknown"} />
              <InfoRow label="Publisher" value={game.publishers?.map((item) => item.name).join(", ") || "Unknown"} />
              <InfoRow label="Released" value={formatReleaseDate(game.released)} />
              <InfoRow label="Age rating" value={game.esrb_rating?.name || "Not rated"} />
              <InfoRow label="Genres" value={game.genres?.map((genre) => genre.name).join(", ") || "Unknown"} />
            </section>

            {game.tags?.length > 0 && (
              <section className="border border-white/10 bg-[#101722] p-5">
                <h2 className="text-lg font-black">Popular Tags</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {game.tags.slice(0, 16).map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/games/category/${tag.slug}`}
                      prefetch={false}
                      rel="nofollow"
                      className="border border-white/10 bg-black/25 px-2 py-1.5 text-[10px] font-bold text-white/50 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        {moreGames.length > 0 && (
          <section id="more-games" className="mt-16 scroll-mt-40 border-t border-white/10 pt-4">
            {seriesGames.length > 0 && (
              <GameShelf
                title={`More from the ${game.name} series`}
                subtitle="Discover other games and editions from the same universe."
                games={seriesGames}
              />
            )}
            {relatedGames.length > 0 && (
              <GameShelf
                title="More Games Like This"
                subtitle={`More popular ${game.genres?.[0]?.name || "gaming"} experiences to explore.`}
                games={relatedGames}
              />
            )}
          </section>
        )}

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/35">
          Game information and images provided by{" "}
          <a href={RAWG_ATTRIBUTION_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-400 hover:text-yellow-300">
            RAWG
          </a>
          .
        </footer>
      </div>
    </main>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[86px_1fr] gap-3 border-t border-white/10 pt-3 first:border-0 first:pt-0">
      <span className="text-[10px] font-black uppercase tracking-wider text-white/30">{label}</span>
      <span className="text-xs font-semibold leading-5 text-white/65">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 border-t border-white/10 pt-3 first:border-0 first:pt-0">
      <p className="text-[10px] font-black uppercase tracking-wider text-white/30">{label}</p>
      <p className="mt-1 text-xs leading-5 text-white/65">{value}</p>
    </div>
  );
}

function RequirementCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-white/10 bg-[#101722] p-5">
      <h3 className="text-sm font-black uppercase tracking-wider text-white">{title}</h3>
      {value ? (
        <p className="mt-4 whitespace-pre-line text-xs leading-6 text-white/55">{value}</p>
      ) : (
        <p className="mt-4 text-xs leading-6 text-white/40">Specifications have not been provided.</p>
      )}
    </div>
  );
}