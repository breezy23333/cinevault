/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Gamepad2,
  Search,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import GameHero from "@/components/GameHero";
import GameShelf from "@/components/GameShelf";
import GameDealsShelf from "@/components/GameDealsShelf";
import GameCategoryCarousel, {
  type GameCategory,
} from "@/components/GameCategoryCarousel";

import {
  getGamingBrowseData,
  RAWG_ATTRIBUTION_URL,
  type RawgGame,
} from "@/lib/games";

import { getGamesOnSale } from "@/lib/gameDeals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://cinryvan.vercel.app";

const gamesTitle =
  "Gaming | Games, Ratings & Where to Play | CINRYVAN";

const gamesDescription =
  "Discover popular games, new releases, top-rated titles, upcoming games, esports, racing, RPGs, horror games, platforms, ratings and where to play them on CINRYVAN.";

export const metadata: Metadata = {
  title: gamesTitle,
  description: gamesDescription,
  keywords: [
    "games",
    "gaming",
    "popular games",
    "new game releases",
    "upcoming games",
    "top-rated games",
    "PC games",
    "PlayStation games",
    "Xbox games",
    "racing games",
    "esports",
    "game ratings",
    "CINRYVAN Gaming",
  ],
  alternates: {
    canonical: `${SITE_URL}/games`,
  },
  openGraph: {
    title: gamesTitle,
    description: gamesDescription,
    url: `${SITE_URL}/games`,
    siteName: "CINRYVAN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Discover games on CINRYVAN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: gamesTitle,
    description: gamesDescription,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const storeLinks = [
  { label: "Featured", href: "#featured" },
  { label: "Deals", href: "#games-on-sale" },
  { label: "Categories", href: "#browse-categories" },
  { label: "New Releases", href: "#new-releases" },
  { label: "Competitive", href: "#competitive" },
  { label: "Racing", href: "#racing" },
  { label: "Horror", href: "#horror" },
  { label: "Upcoming", href: "#upcoming" },
];

function getYear(date?: string | null) {
  return date ? date.slice(0, 4) : "TBA";
}

function StoreGameCard({
  game,
  large = false,
}: {
  game: RawgGame;
  large?: boolean;
}) {
  const genres = game.genres?.slice(0, 3) ?? [];
  const image = game.background_image;

  return (
    <Link
      href={`/games/${game.id}`}
      className={`group relative block overflow-hidden border border-white/10 bg-[#17283b] shadow-[0_18px_45px_rgba(0,0,0,.3)] transition hover:border-cyan-400/50 ${
        large ? "min-h-[300px] lg:min-h-[420px]" : "min-h-[210px]"
      }`}
    >
      {image ? (
        <>
          {/* Blurred image fills the empty background. */}
          <div
            aria-hidden="true"
            style={{ backgroundImage: `url("${image}")` }}
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-50 blur-xl"
          />

          {/* Full image without severe cropping. */}
          <div
            role="img"
            aria-label={`${game.name} game artwork`}
            style={{ backgroundImage: `url("${image}")` }}
            className="absolute inset-0 bg-contain bg-center bg-no-repeat transition duration-700 group-hover:scale-[1.025] group-hover:brightness-110"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(34,211,238,.20),transparent_35%),linear-gradient(135deg,#263b51,#101b29_55%,#08111c)]" />
      )}

      {/* Lighter overlay. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a11]/95 via-transparent to-black/5" />

      <div
        className={`absolute inset-x-0 bottom-0 ${
          large ? "p-6 md:p-8" : "p-4"
        }`}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre.id}
              className="bg-[#23496d]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-100"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <h3
          className={`font-black leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.95)] ${
            large ? "text-2xl md:text-4xl" : "text-base md:text-lg"
          }`}
        >
          {game.name}
        </h3>

        <div className="mt-3 flex items-center gap-4 text-xs font-bold text-white/75">
          <span>{getYear(game.released)}</span>

          {game.rating ? (
            <span className="inline-flex items-center gap-1 text-yellow-300">
              <Star className="h-3.5 w-3.5 fill-current" />
              {game.rating.toFixed(1)}
            </span>
          ) : null}

          {game.metacritic ? (
            <span className="bg-emerald-500 px-2 py-1 text-[10px] font-black text-white">
              {game.metacritic}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function DiscoveryGrid({ games }: { games: RawgGame[] }) {
  const visibleGames = games
    .filter((game) => game.id && game.name && game.background_image)
    .slice(0, 5);

  if (!visibleGames.length) return null;

  const [featured, ...smallerGames] = visibleGames;

  return (
    <section className="py-14">
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-400">
            Trending across gaming
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Players are exploring
          </h2>
        </div>

        <Link
          href="/games/category/popular"
          className="hidden items-center gap-2 text-sm font-black text-white/55 transition hover:text-cyan-300 sm:flex"
        >
          View popular games
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.35fr_.65fr]">
        <StoreGameCard game={featured} large />

        <div className="grid gap-3 sm:grid-cols-2">
          {smallerGames.map((game) => (
            <StoreGameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GenreSpotlight({
  id,
  eyebrow,
  title,
  description,
  games,
  href,
  accent,
  reverse = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  games: RawgGame[];
  href: string;
  accent: "cyan" | "red" | "yellow" | "violet";
  reverse?: boolean;
}) {
  const visibleGames = games
    .filter((game) => game.id && game.name && game.background_image)
    .slice(0, 4);

  if (!visibleGames.length) return null;

  const [featured, ...sideGames] = visibleGames;

  const accentStyles = {
    cyan: {
      text: "text-cyan-300",
      button: "bg-cyan-400 text-[#07111d] hover:bg-cyan-300",
      glow: "bg-cyan-400/15",
    },
    red: {
      text: "text-red-400",
      button: "bg-red-500 text-white hover:bg-red-400",
      glow: "bg-red-500/15",
    },
    yellow: {
      text: "text-yellow-300",
      button: "bg-yellow-400 text-black hover:bg-yellow-300",
      glow: "bg-yellow-400/15",
    },
    violet: {
      text: "text-violet-300",
      button: "bg-violet-500 text-white hover:bg-violet-400",
      glow: "bg-violet-500/15",
    },
  };

  const colors = accentStyles[accent];

  return (
    <section
      id={id}
      className="relative my-10 scroll-mt-32 overflow-hidden border border-white/10 bg-[#101b29]"
    >
      <div
        className={`absolute -top-32 h-96 w-96 rounded-full blur-[110px] ${colors.glow} ${
          reverse ? "-left-24" : "-right-24"
        }`}
      />

      <div
        className={`relative grid min-h-[480px] ${
          reverse
            ? "lg:grid-cols-[.72fr_1.28fr]"
            : "lg:grid-cols-[1.28fr_.72fr]"
        }`}
      >
        <div className={reverse ? "lg:order-2" : ""}>
          <StoreGameCard game={featured} large />
        </div>

        <div
          className={`flex flex-col justify-between p-6 md:p-8 lg:p-10 ${
            reverse ? "lg:order-1" : ""
          }`}
        >
          <div>
            <p
              className={`text-xs font-black uppercase tracking-[0.35em] ${colors.text}`}
            >
              {eyebrow}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-none tracking-tight md:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 md:text-base">
              {description}
            </p>

            <Link
              href={href}
              className={`mt-7 inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest transition ${colors.button}`}
            >
              Explore collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-3">
            {sideGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group grid grid-cols-[120px_1fr] overflow-hidden bg-black/25 transition hover:bg-white/10 sm:grid-cols-[170px_1fr]"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={game.background_image ?? ""}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex min-w-0 flex-col justify-center px-4 py-3">
                  <h3 className="truncate text-sm font-black text-white sm:text-base">
                    {game.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-white/45">
                    <span>{getYear(game.released)}</span>

                    {game.rating ? (
                      <span className="inline-flex items-center gap-1 text-yellow-300">
                        <Star className="h-3 w-3 fill-current" />
                        {game.rating.toFixed(1)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function pickUniquePlatformGame(
  games: RawgGame[],
  usedIds: Set<number>,
) {
  const game = games.find(
    (item) =>
      item.id &&
      item.background_image &&
      !usedIds.has(item.id) &&
      !/grand theft auto/i.test(item.name),
  );

  if (game) {
    usedIds.add(game.id);
  }

  return game;
}

export default async function GamesPage() {
  const [browseData, gamesOnSale] = await Promise.all([
    getGamingBrowseData(),
    getGamesOnSale(20),
  ]);

  const {
    popular,
    newReleases,
    topRated,
    upcoming,
    pc,
    playStation,
    xbox,
    nintendo,
    firstPersonShooters,
    thirdPersonShooters,
    esports,
    racing,
    storyRpg,
    horrorSurvival,
  } = browseData;

  const heroGames = [...newReleases, ...topRated, ...popular]
    .filter(
      (game, index, games) =>
        Boolean(game.id && game.name && game.background_image) &&
        games.findIndex((item) => item.id === game.id) === index,
    )
    .slice(0, 8);

  const competitiveGames = [...esports, ...firstPersonShooters]
    .filter(
      (game, index, games) =>
        games.findIndex((item) => item.id === game.id) === index,
    )
    .slice(0, 16);

    const categoryGamePool = [
    ...storyRpg,
    ...horrorSurvival,
    ...firstPersonShooters,
    ...thirdPersonShooters,
    ...racing,
    ...esports,
    ...topRated,
    ...popular,
  ].filter(
    (game, index, games) =>
      Boolean(game.id && game.background_image) &&
      games.findIndex((item) => item.id === game.id) === index,
  );

  const usedCategoryGameIds = new Set<number>();

  function gameMatchesTerms(
    game: RawgGame,
    terms: string[],
  ) {
    const searchableText = [
      game.name,
      ...(game.genres ?? []).flatMap((genre) => [
        genre.name,
        genre.slug,
      ]),
      ...(game.tags ?? []).flatMap((tag) => [
        tag.name,
        tag.slug,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return terms.some((term) =>
      searchableText.includes(term.toLowerCase()),
    );
  }

  function pickCategoryImage(
    terms: string[],
    preferredGames: RawgGame[] = [],
  ) {
    const matchingGames = categoryGamePool.filter((game) =>
      gameMatchesTerms(game, terms),
    );

    const candidates = [
      ...matchingGames,
      ...preferredGames,
      ...categoryGamePool,
    ];

    const selectedGame = candidates.find(
      (game) =>
        game.id &&
        game.background_image &&
        !usedCategoryGameIds.has(game.id),
    );

    if (!selectedGame) return null;

    usedCategoryGameIds.add(selectedGame.id);
    return selectedGame.background_image;
  }

  const browseCategories: GameCategory[] = [
    {
      label: "Role-Playing",
      href: "/games/category/rpg",
      image: pickCategoryImage(
        ["role-playing", "role playing", "rpg"],
        storyRpg,
      ),
    },
    {
      label: "Horror",
      href: "/games/category/horror",
      image: pickCategoryImage(
        ["horror"],
        horrorSurvival,
      ),
    },
    {
      label: "Survival",
      href: "/games/category/survival",
      image: pickCategoryImage(
        ["survival"],
        horrorSurvival,
      ),
    },
    {
      label: "Sci-Fi & Cyberpunk",
      href: "/games/category/sci-fi-cyberpunk",
      image: pickCategoryImage(
        ["science fiction", "sci-fi", "cyberpunk"],
        firstPersonShooters,
      ),
    },
    {
      label: "Racing",
      href: "/games/category/racing",
      image: pickCategoryImage(
        ["racing", "driving", "motorsport"],
        racing,
      ),
    },
    {
      label: "Open World",
      href: "/games/category/open-world",
      image: pickCategoryImage(
        ["open world", "sandbox"],
        thirdPersonShooters,
      ),
    },
    {
      label: "Strategy",
      href: "/games/category/strategy",
      image: pickCategoryImage(
        ["strategy", "tactical"],
        esports,
      ),
    },
    {
      label: "Adventure",
      href: "/games/category/adventure",
      image: pickCategoryImage(
        ["adventure"],
        topRated,
      ),
    },
    {
      label: "Story-Rich",
      href: "/games/category/story-rich",
      image: pickCategoryImage(
        ["story rich", "narrative"],
        storyRpg,
      ),
    },
    {
      label: "Fighting",
      href: "/games/category/fighting",
      image: pickCategoryImage(
        ["fighting", "beat em up"],
        esports,
      ),
    },
    {
      label: "Co-Operative",
      href: "/games/category/co-op",
      image: pickCategoryImage(
        ["co-operative", "cooperative", "co-op"],
        esports,
      ),
    },
    {
      label: "Action",
      href: "/games/category/action",
      image: pickCategoryImage(
        ["action", "shooter"],
        thirdPersonShooters,
      ),
    },
  ];

  const usedPlatformGameIds = new Set<number>();

  const pcPlatformGame = pickUniquePlatformGame(  
      pc,
      usedPlatformGameIds,
    );

    const playStationPlatformGame = pickUniquePlatformGame(
      playStation,
      usedPlatformGameIds,
    );

    const xboxPlatformGame = pickUniquePlatformGame(
      xbox,
      usedPlatformGameIds,
    );

    const nintendoPlatformGame = pickUniquePlatformGame(
      nintendo,
      usedPlatformGameIds,
    );

    const platformCollections = [
      {
        label: "PC Gaming",
        description:
          "Discover strategy, simulation, shooters, indie games and expansive PC worlds.",
        href: "/games/category/pc",
        image: pcPlatformGame?.background_image,
        accent: "#22d3ee",
      },
      {
        label: "PlayStation",
        description:
          "Explore cinematic adventures, action games and PlayStation experiences.",
        href: "/games/category/playstation",
        image: playStationPlatformGame?.background_image,
        accent: "#3b82f6",
      },
      {
        label: "Xbox",
        description:
          "Enter competitive games, racing worlds and Xbox adventures.",
        href: "/games/category/xbox",
        image: xboxPlatformGame?.background_image,
        accent: "#22c55e",
      },
      {
        label: "Nintendo",
        description:
          "Discover colourful adventures, family games and Nintendo worlds.",
        href: "/games/category/nintendo",
        image: nintendoPlatformGame?.background_image,
        accent: "#ef4444",
      },
    ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Games",
    description:
      "Browse popular, new, upcoming and top-rated video games on CINRYVAN.",
    url: `${SITE_URL}/games`,
    isPartOf: {
      "@type": "WebSite",
      name: "CINRYVAN",
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen bg-[#08111c] pb-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />

      {/* Gaming storefront navigation */}
      <div className="relative z-20 border-y border-white/10 bg-[#162536] shadow-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-4 py-2 md:px-6">
          <Link
            href="/games"
            className="mr-2 inline-flex shrink-0 items-center gap-2 bg-cyan-400 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#07111d]"
          >
            <Gamepad2 className="h-4 w-4" />
            Games Store
          </Link>

          <div className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {storeLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 px-3 py-2 text-xs font-bold text-white/65 transition hover:bg-white/5 hover:text-cyan-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/games/search"
            aria-label="Search games"
            className="hidden h-9 w-10 shrink-0 items-center justify-center bg-white/10 text-white/70 transition hover:bg-cyan-400 hover:text-black sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Featured storefront */}
      <section
        id="featured"
        className="relative scroll-mt-36 border-b border-white/10 bg-[#0b1623] pb-10 pt-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,.10),transparent_28%),linear-gradient(180deg,transparent,#08111c)]" />

        <div className="relative mx-auto max-w-[1500px] px-4 md:px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-400">
                Featured & recommended
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
                Enter your next world
              </h1>
            </div>

            <div className="hidden items-center gap-2 text-xs font-bold text-white/40 md:flex">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Updated discoveries
            </div>
          </div>
          <GameHero games={heroGames} />
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        {/* Deals */}
        <section
          id="games-on-sale"
          className="scroll-mt-36 border-b border-white/10 py-8"
        >
          <div className="mb-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-rose-500 text-white">
              <Flame className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">
                Limited-time offers
              </p>
              <h2 className="text-xl font-black">Deals & events</h2>
            </div>
          </div>

          <GameDealsShelf deals={gamesOnSale} />
        </section>

        {/* Asymmetric popular section */}
        <DiscoveryGrid games={popular} />

        {/* Categories */}
        <section
          id="browse-categories"
          className="scroll-mt-36 border-y border-white/10 py-12"
        >
          <div className="mb-2 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-300">
                Find your style
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Browse by category
              </h2>
            </div>

            <Link
              href="/games/category/popular"
              className="hidden text-sm font-black text-white/50 transition hover:text-white sm:block"
            >
              Explore everything →
            </Link>
          </div>

          <GameCategoryCarousel categories={browseCategories} />
        </section>

        {/* New releases keeps one traditional shelf */}
        <div id="new-releases" className="scroll-mt-36">
          <GameShelf
            title="Fresh from the studios"
            subtitle="Recently released games ready to discover."
            games={newReleases}
            viewAllHref="/games/category/new-releases"
          />
        </div>

        {/* Racing feature */}
        <GenreSpotlight
          id="racing"
          eyebrow="Speed, precision and competition"
          title="Built for the finish line"
          description="From street racing and open-world driving to professional motorsport simulations. Explore machines designed to be pushed to their limits."
          games={racing}
          href="/games/category/racing"
          accent="yellow"
        />

        {/* Competitive */}
        <section
          id="competitive"
          className="scroll-mt-36 py-12"
        >
          <div className="mb-6 grid gap-5 border-b border-white/10 pb-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-cyan-300" />

                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                  Ranked and competitive
                </p>
              </div>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Games where every move matters
              </h2>
            </div>

            <Link
              href="/games/category/esports"
              className="inline-flex w-fit items-center gap-2 bg-cyan-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black"
            >
              Browse esports
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {competitiveGames.slice(0, 8).map((game) => (
              <StoreGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Horror gets opposite layout */}
        <GenreSpotlight
          id="horror"
          eyebrow="Dark worlds await"
          title="Survive the night"
          description="Step into unsettling stories, dangerous environments and experiences where every sound could mean something is hunting you."
          games={horrorSurvival}
          href="/games/category/horror"
          accent="red"
          reverse
        />

        {/* RPG feature */}
        <GenreSpotlight
          id="rpg"
          eyebrow="Characters, choices and worlds"
          title="Become part of the story"
          description="Discover expansive worlds, memorable companions and adventures shaped by the decisions you make."
          games={storyRpg}
          href="/games/category/rpg"
          accent="violet"
        />

        <div id="top-rated" className="scroll-mt-36">
          <GameShelf
            title="Critics and players agree"
            subtitle="Highly rated games that earned their reputation."
            games={topRated}
            viewAllHref="/games/category/top-rated"
          />
        </div>

        <div id="upcoming" className="scroll-mt-36">
          <GameShelf
            title="Coming next"
            subtitle="Upcoming worlds, stories and competitions worth watching."
            games={upcoming}
            viewAllHref="/games/category/upcoming"
          />
        </div>

        {/* Platform destinations */}
          <section className="border-t border-white/10 py-14">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-300">
                  Choose your platform
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                  More ways to play
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
                  Explore games built for your preferred console or gaming setup.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {platformCollections.map((platform, index) => (
                <Link
                  key={platform.label}
                  href={platform.href}
                  className={`group relative overflow-hidden border border-white/10 bg-[#101a27] ${
                    index === 0 ? "md:row-span-2" : ""
                  }`}
                >
                  <div
                    className={
                      index === 0
                        ? "relative h-[300px] md:h-full md:min-h-[500px]"
                        : "relative h-[240px]"
                    }
                  >
                    {platform.image ? (
                      <img
                        src={platform.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#142233]" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#07101a] via-[#07101a]/25 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <div
                        className="mb-4 h-1 w-12 transition-all duration-300 group-hover:w-24"
                        style={{ backgroundColor: platform.accent }}
                      />

                      <h3 className="text-2xl font-black md:text-3xl">
                        {platform.label}
                      </h3>

                      <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">
                        {platform.description}
                      </p>

                      <span
                        className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                        style={{ color: platform.accent }}
                      >
                        Explore games
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Full store directory */}
          <section className="border-y border-white/10 bg-[#0e1824] px-5 py-12 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.34em] text-yellow-400">
                  CINRYVAN Games
                </p>

                <h2 className="mt-3 text-3xl font-black md:text-4xl">
                  Keep exploring
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/50">
                  Move between genres, platforms and different styles of play without
                  returning to the beginning.
                </p>

                <Link
                  href="/games/category/popular"
                  className="mt-7 inline-flex items-center gap-2 bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-yellow-300"
                >
                  Browse all games
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["Action", "/games/category/action"],
                  ["RPG", "/games/category/rpg"],
                  ["Racing", "/games/category/racing"],
                  ["Horror", "/games/category/horror"],
                  ["Sci-Fi", "/games/category/sci-fi-cyberpunk"],
                  ["Strategy", "/games/category/strategy"],
                  ["Simulation", "/games/category/simulation"],
                  ["Fighting", "/games/category/fighting"],
                  ["Co-Operative", "/games/category/co-op"],
                  ["Open World", "/games/category/open-world"],
                  ["Puzzle", "/games/category/puzzle"],
                  ["Virtual Reality", "/games/category/vr"],
                ].map(([label, href], index) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex min-h-24 flex-col justify-between border border-white/10 bg-black/20 p-4 transition hover:border-cyan-400/50 hover:bg-white/[0.06]"
                  >
                    <span className="text-[10px] font-black text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="mt-4 text-sm font-black text-white/70 transition group-hover:text-cyan-300">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/35">
          Game information and images provided by{" "}
          <a
            href={RAWG_ATTRIBUTION_URL}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-cyan-300 transition hover:text-cyan-200"
          >
            RAWG
          </a>
          .
        </footer>
      </div>
    </main>
  );
}