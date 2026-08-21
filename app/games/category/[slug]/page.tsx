import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Grid3X3,
  Star,
} from "lucide-react";

import GameCard from "@/components/GameCard";

import {
  getGameCategoryInfo,
  getGameCategoryPage,
  RAWG_ATTRIBUTION_URL,
  type RawgGame,
} from "@/lib/games";

export const runtime = "nodejs";
export const revalidate = 86400;
export const dynamicParams = true;

const SITE_URL = "https://cinryvan.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

type CategoryLayout =
  | "tactical"
  | "racing"
  | "horror"
  | "fantasy"
  | "competitive"
  | "neon"
  | "adventure"
  | "relaxed";

type CategoryTheme = {
  eyebrow: string;
  accent: string;
  secondary: string;
  glow: string;
  surface: string;
  layout: CategoryLayout;
};

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  "first-person": {
    eyebrow: "Lock. Load. Enter the fight.",
    accent: "#22c55e",
    secondary: "#14b8a6",
    glow: "rgba(34,197,94,.25)",
    surface: "#101d18",
    layout: "tactical",
  },

  "third-person": {
    eyebrow: "Cinematic combat",
    accent: "#f59e0b",
    secondary: "#ef4444",
    glow: "rgba(245,158,11,.24)",
    surface: "#211811",
    layout: "adventure",
  },

  racing: {
    eyebrow: "Built for maximum speed",
    accent: "#facc15",
    secondary: "#f97316",
    glow: "rgba(249,115,22,.30)",
    surface: "#21170d",
    layout: "racing",
  },

  horror: {
    eyebrow: "Something is waiting",
    accent: "#ef4444",
    secondary: "#991b1b",
    glow: "rgba(239,68,68,.26)",
    surface: "#1a0d11",
    layout: "horror",
  },

  survival: {
    eyebrow: "Stay alive at any cost",
    accent: "#84cc16",
    secondary: "#166534",
    glow: "rgba(132,204,22,.20)",
    surface: "#111a10",
    layout: "horror",
  },

  rpg: {
    eyebrow: "Choose your path",
    accent: "#a78bfa",
    secondary: "#7c3aed",
    glow: "rgba(139,92,246,.30)",
    surface: "#171126",
    layout: "fantasy",
  },

  esports: {
    eyebrow: "Compete at the highest level",
    accent: "#22d3ee",
    secondary: "#2563eb",
    glow: "rgba(34,211,238,.25)",
    surface: "#0d1825",
    layout: "competitive",
  },

  fighting: {
    eyebrow: "One arena. One champion.",
    accent: "#fb7185",
    secondary: "#dc2626",
    glow: "rgba(251,113,133,.27)",
    surface: "#211014",
    layout: "competitive",
  },

  "sci-fi-cyberpunk": {
    eyebrow: "The future is already here",
    accent: "#22d3ee",
    secondary: "#d946ef",
    glow: "rgba(217,70,239,.25)",
    surface: "#101326",
    layout: "neon",
  },

  strategy: {
    eyebrow: "Plan. Command. Conquer.",
    accent: "#38bdf8",
    secondary: "#1d4ed8",
    glow: "rgba(56,189,248,.22)",
    surface: "#101a25",
    layout: "tactical",
  },

  "open-world": {
    eyebrow: "Go anywhere",
    accent: "#34d399",
    secondary: "#0ea5e9",
    glow: "rgba(52,211,153,.22)",
    surface: "#0e1d1a",
    layout: "adventure",
  },

  adventure: {
    eyebrow: "Every world hides a story",
    accent: "#fbbf24",
    secondary: "#0ea5e9",
    glow: "rgba(251,191,36,.23)",
    surface: "#1d1910",
    layout: "adventure",
  },

  "story-rich": {
    eyebrow: "Stories worth remembering",
    accent: "#c084fc",
    secondary: "#ec4899",
    glow: "rgba(192,132,252,.22)",
    surface: "#1b1220",
    layout: "fantasy",
  },

  anime: {
    eyebrow: "Power beyond imagination",
    accent: "#f472b6",
    secondary: "#8b5cf6",
    glow: "rgba(244,114,182,.27)",
    surface: "#201126",
    layout: "neon",
  },

  simulation: {
    eyebrow: "Build your own reality",
    accent: "#2dd4bf",
    secondary: "#3b82f6",
    glow: "rgba(45,212,191,.22)",
    surface: "#0e1d20",
    layout: "relaxed",
  },

  casual: {
    eyebrow: "Play your way",
    accent: "#5eead4",
    secondary: "#38bdf8",
    glow: "rgba(94,234,212,.22)",
    surface: "#102022",
    layout: "relaxed",
  },

  puzzle: {
    eyebrow: "Think beyond the obvious",
    accent: "#fcd34d",
    secondary: "#8b5cf6",
    glow: "rgba(252,211,77,.20)",
    surface: "#1d1920",
    layout: "relaxed",
  },

  "visual-novel": {
    eyebrow: "Your choices shape the story",
    accent: "#f9a8d4",
    secondary: "#a78bfa",
    glow: "rgba(249,168,212,.22)",
    surface: "#20151f",
    layout: "fantasy",
  },

  "co-op": {
    eyebrow: "Better together",
    accent: "#4ade80",
    secondary: "#06b6d4",
    glow: "rgba(74,222,128,.22)",
    surface: "#102019",
    layout: "competitive",
  },

  roguelike: {
    eyebrow: "Die. Learn. Return stronger.",
    accent: "#fb923c",
    secondary: "#dc2626",
    glow: "rgba(251,146,60,.24)",
    surface: "#21130d",
    layout: "horror",
  },

  action: {
    eyebrow: "No time to slow down",
    accent: "#f97316",
    secondary: "#ef4444",
    glow: "rgba(249,115,22,.24)",
    surface: "#20130e",
    layout: "adventure",
  },

  vr: {
    eyebrow: "Step inside the game",
    accent: "#67e8f9",
    secondary: "#6366f1",
    glow: "rgba(103,232,249,.25)",
    surface: "#101827",
    layout: "neon",
  },
};

const DEFAULT_CATEGORY_THEME: CategoryTheme = {
  eyebrow: "Discover something different",
  accent: "#facc15",
  secondary: "#3b82f6",
  glow: "rgba(250,204,21,.20)",
  surface: "#111927",
  layout: "adventure",
};

function getCategoryTheme(slug: string) {
  return CATEGORY_THEMES[slug] ?? DEFAULT_CATEGORY_THEME;
}

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
      title: "Game Category Not Found | CINRYVAN",
      description: "The requested game category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const page = parsePage(query.page);

  const title =
    page > 1
      ? `${category.title} – Page ${page} | CINRYVAN`
      : `${category.title} | CINRYVAN`;

  const description =
    page > 1
      ? `${category.description} Browse page ${page} of this gaming collection on CINRYVAN.`
      : category.description;

  const canonicalPath = categoryPageHref(slug, page);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description,

    keywords: [
      category.label,
      `${category.label} games`,
      "video games",
      "game ratings",
      "gaming platforms",
      "where to play games",
      "CINRYVAN Gaming",
    ],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "CINRYVAN",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${category.title} on CINRYVAN`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },

    robots: {
      index: true,
      follow: true,
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

  function FeaturedCategoryGame({
  game,
  theme,
}: {
  game: RawgGame;
  theme: CategoryTheme;
}) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group relative block min-h-[300px] overflow-hidden bg-black lg:min-h-[420px]"
    >
      {game.background_image ? (
        <img
          src={game.background_image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.02]"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/15" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
        <div className="mb-3 flex flex-wrap gap-2">
          {game.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white/75 backdrop-blur-md"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <h2 className="max-w-3xl text-3xl font-black leading-none md:text-5xl">
          {game.name}
        </h2>

        <div className="mt-4 flex items-center gap-4 text-xs font-bold text-white/65">
          <span>{game.released?.slice(0, 4) ?? "TBA"}</span>

          {game.rating ? (
            <span
              className="inline-flex items-center gap-1"
              style={{ color: theme.accent }}
            >
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

function CategoryGameRow({
  game,
  theme,
  number,
}: {
  game: RawgGame;
  theme: CategoryTheme;
  number: number;
}) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group grid overflow-hidden border border-white/10 bg-black/20 transition hover:bg-white/[0.07] sm:grid-cols-[210px_1fr_auto]"
    >
      <div className="relative aspect-video overflow-hidden sm:aspect-auto">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col justify-center p-4">
        <p
          className="text-[10px] font-black uppercase tracking-[0.24em]"
          style={{ color: theme.accent }}
        >
          Selection {String(number).padStart(2, "0")}
        </p>

        <h3 className="mt-2 truncate text-xl font-black">
          {game.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {game.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="bg-white/[0.07] px-2 py-1 text-[10px] font-bold text-white/55"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden min-w-28 flex-col items-end justify-center border-l border-white/10 px-5 sm:flex">
        <span className="text-xs font-bold text-white/40">
          {game.released?.slice(0, 4) ?? "TBA"}
        </span>

        {game.rating ? (
          <span
            className="mt-2 inline-flex items-center gap-1 text-sm font-black"
            style={{ color: theme.accent }}
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            {game.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

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

const theme = getCategoryTheme(category.slug);

const themeStyle = {
  "--category-accent": theme.accent,
  "--category-secondary": theme.secondary,
  "--category-glow": theme.glow,
  "--category-surface": theme.surface,
} as CSSProperties;

const [featuredGame, ...remainingGames] = category.games;

const isFeatureGrid = [
  "racing",
  "fantasy",
  "adventure",
  "neon",
].includes(theme.layout);

  return (
  <main
    style={themeStyle}
    className="min-h-screen overflow-hidden bg-[#080f18] pb-24 pt-24 text-white"
  >
    {/* Category-specific background */}
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,var(--category-glow),transparent_30%)]" />

      <div
        className={`absolute inset-0 opacity-[0.035] ${
          theme.layout === "racing"
            ? "bg-[repeating-linear-gradient(120deg,transparent_0px,transparent_55px,#fff_56px,#fff_57px)]"
            : theme.layout === "horror"
              ? "bg-[repeating-linear-gradient(170deg,transparent_0px,transparent_90px,#fff_91px,#fff_92px)]"
              : theme.layout === "neon"
                ? "bg-[linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] bg-[size:80px_80px]"
                : "bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[size:34px_34px]"
        }`}
      />
    </div>

    {/* Gaming category navigation */}
    <div className="sticky top-20 z-30 border-y border-white/10 bg-[#101b28]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden">
        <Link
          href="/games"
          className="mr-3 inline-flex shrink-0 items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-black"
          style={{ backgroundColor: theme.accent }}
        >
          <Gamepad2 className="h-4 w-4" />
          Games
        </Link>

        <Link
          href="/games/category/action"
          className="shrink-0 px-3 py-2 text-xs font-bold text-white/55 hover:text-white"
        >
          Action
        </Link>

        <Link
          href="/games/category/rpg"
          className="shrink-0 px-3 py-2 text-xs font-bold text-white/55 hover:text-white"
        >
          RPG
        </Link>

        <Link
          href="/games/category/racing"
          className="shrink-0 px-3 py-2 text-xs font-bold text-white/55 hover:text-white"
        >
          Racing
        </Link>

        <Link
          href="/games/category/horror"
          className="shrink-0 px-3 py-2 text-xs font-bold text-white/55 hover:text-white"
        >
          Horror
        </Link>

        <Link
          href="/games/category/esports"
          className="shrink-0 px-3 py-2 text-xs font-bold text-white/55 hover:text-white"
        >
          Esports
        </Link>

        <Link
          href="/games/category/open-world"
          className="shrink-0 px-3 py-2 text-xs font-bold text-white/55 hover:text-white"
        >
          Open World
        </Link>
      </div>
    </div>

    {/* Unique category hero */}
    <section className="relative border-b border-white/10">
      {heroImage ? (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-r from-[#080f18] via-[#080f18]/90 to-[#080f18]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080f18] via-transparent to-black/30" />

      <div className="relative mx-auto flex min-h-[360px] max-w-[1500px] items-end px-4 pb-10 pt-16 md:px-6 md:pb-12">
        <div className="max-w-4xl">
          <Link
            href="/games"
            className="mb-8 inline-flex items-center gap-2 text-sm font-black text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Link>

          <p
            className="text-xs font-black uppercase tracking-[0.4em]"
            style={{ color: theme.accent }}
          >
            {theme.eyebrow}
          </p>

          <h1 className="mt-4 max-w-5xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {category.label}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            {category.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-black"
              style={{ backgroundColor: theme.accent }}
            >
              {category.totalResults.toLocaleString()} games
            </span>

            <span className="border border-white/15 bg-black/30 px-4 py-2 text-xs font-bold text-white/60 backdrop-blur-md">
              Page {category.page} of {category.totalPages}
            </span>
          </div>
        </div>
      </div>
    </section>

    <div className="relative mx-auto max-w-[1500px] px-4 md:px-6">
      {/* Feature presentation changes by category type */}
      {featuredGame && isFeatureGrid ? (
        <section className="py-14">
          <div className="mb-6 flex items-end justify-between gap-5">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.32em]"
                style={{ color: theme.accent }}
              >
                Featured in {category.label}
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Start with these worlds
              </h2>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.3fr_.7fr]">
            <FeaturedCategoryGame
              game={featuredGame}
              theme={theme}
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {remainingGames.slice(0, 3).map((game, index) => (
                <CategoryGameRow
                  key={game.id}
                  game={game}
                  theme={theme}
                  number={index + 2}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Tactical/list categories */}
      {featuredGame && !isFeatureGrid ? (
        <section className="py-10">
          <div className="grid gap-4 lg:grid-cols-[.72fr_1.28fr]">
            <div
              className="border border-white/10 p-6 md:p-8"
              style={{ backgroundColor: theme.surface }}
            >
              <p
                className="text-xs font-black uppercase tracking-[0.32em]"
                style={{ color: theme.accent }}
              >
                Category intelligence
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Recommended deployment
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/55">
                Begin with the category’s featured selection, then explore
                the complete collection below.
              </p>

              <div className="mt-8">
                <FeaturedCategoryGame
                  game={featuredGame}
                  theme={theme}
                />
              </div>
            </div>

            <div className="grid content-start gap-3">
              {remainingGames.slice(0, 5).map((game, index) => (
                <CategoryGameRow
                  key={game.id}
                  game={game}
                  theme={theme}
                  number={index + 2}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Complete collection */}
      <section className="border-t border-white/10 py-14">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Grid3X3
                className="h-5 w-5"
                style={{ color: theme.accent }}
              />

              <p
                className="text-xs font-black uppercase tracking-[0.3em]"
                style={{ color: theme.accent }}
              >
                Complete collection
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-black">
              More {category.label} Games
            </h2>
          </div>

          <p className="text-sm text-white/45">
            {category.totalResults > 0
              ? `Showing ${firstResult}–${lastResult} of ${category.totalResults.toLocaleString()} games`
              : "No games found"}
          </p>
        </div>

        {category.games.length > 0 ? (
          <div
            className={`grid gap-4 [&>*]:w-full [&>*]:min-w-0 [&_img]:h-auto [&_img]:w-full [&_img]:object-cover ${
              theme.layout === "competitive"
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
                : theme.layout === "horror"
                  ? "grid-cols-1 md:grid-cols-2 [&_img]:aspect-[16/10]"
                  : theme.layout === "racing"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&_img]:aspect-[2/1]"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&_img]:aspect-video"
            }`}
          >
            {category.games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <h2 className="text-2xl font-black">
              No games available
            </h2>

            <p className="mt-3 text-white/55">
              We could not find games for this page.
            </p>

            <Link
              href="/games"
              className="mt-6 inline-flex px-5 py-3 text-sm font-black text-black"
              style={{ backgroundColor: theme.accent }}
            >
              Return to Games
            </Link>
          </div>
        )}

        {category.games.length > 0 &&
        category.totalPages > 1 ? (
          <nav
            aria-label={`${category.title} pagination`}
            className="mt-14 flex flex-wrap items-center justify-center gap-2"
          >
            {category.page > 1 ? (
              <Link
                href={categoryPageHref(
                  category.slug,
                  category.page - 1,
                )}
                className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : null}

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
                className="grid h-10 min-w-10 place-items-center border border-white/10 px-3 text-sm font-black transition"
                style={
                  pageNumber === category.page
                    ? {
                        backgroundColor: theme.accent,
                        borderColor: theme.accent,
                        color: "#05070a",
                      }
                    : undefined
                }
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
                className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:bg-white/10"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <footer className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
        Game information and images provided by{" "}
        <a
          href={RAWG_ATTRIBUTION_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold"
          style={{ color: theme.accent }}
        >
          RAWG
        </a>
        .
      </footer>
    </div>
  </main>
);
}