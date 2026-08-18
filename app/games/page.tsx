import type { Metadata } from "next";
import Link from "next/link";
import GameShelf from "@/components/GameShelf";
import GameHero from "@/components/GameHero";
import GameDealsShelf from "@/components/GameDealsShelf";
import GameCategoryBanner from "@/components/GameCategoryBanner";
import GameCategoryCarousel, {
  type GameCategory,
} from "@/components/GameCategoryCarousel";
import { getGamingBrowseData, RAWG_ATTRIBUTION_URL } from "@/lib/games";
import { getGamesOnSale } from "@/lib/gameDeals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://cinryvan.vercel.app";
const gamesTitle = "Gaming | Games, Ratings & Where to Play | CINRYVAN";
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
  alternates: { canonical: `${SITE_URL}/games` },
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
  robots: { index: true, follow: true },
};

const storeLinks = [
  { label: "Featured", href: "#featured" },
  { label: "Special Offers", href: "#games-on-sale" },
  { label: "Categories", href: "#browse-categories" },
  { label: "New Releases", href: "#new-releases" },
  { label: "Top Rated", href: "#top-rated" },
  { label: "Upcoming", href: "#upcoming" },
];

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
        games.findIndex((item) => item.id === game.id) === index,
    )
    .slice(0, 8);

  const browseCategories: GameCategory[] = [
    { label: "Role-Playing", href: "/games/category/rpg", image: storyRpg[0]?.background_image },
    { label: "Puzzle", href: "/games/category/puzzle", image: topRated[2]?.background_image },
    { label: "Horror", href: "/games/category/horror", image: horrorSurvival[0]?.background_image },
    { label: "Survival", href: "/games/category/survival", image: horrorSurvival[2]?.background_image },
    { label: "Sci-Fi & Cyberpunk", href: "/games/category/sci-fi-cyberpunk", image: firstPersonShooters[2]?.background_image },
    { label: "City & Settlement", href: "/games/category/city-settlement", image: topRated[5]?.background_image },
    { label: "Racing", href: "/games/category/racing", image: racing[0]?.background_image },
    { label: "Open World", href: "/games/category/open-world", image: thirdPersonShooters[1]?.background_image },
    { label: "Strategy", href: "/games/category/strategy", image: esports[4]?.background_image },
    { label: "Adventure", href: "/games/category/adventure", image: topRated[1]?.background_image },
    { label: "Visual Novel", href: "/games/category/visual-novel", image: storyRpg[5]?.background_image },
    { label: "Story-Rich", href: "/games/category/story-rich", image: storyRpg[1]?.background_image },
    { label: "Simulation", href: "/games/category/simulation", image: racing[3]?.background_image },
    { label: "Fighting", href: "/games/category/fighting", image: esports[2]?.background_image },
    { label: "Co-Operative", href: "/games/category/co-op", image: esports[1]?.background_image },
    { label: "Rogue-Like", href: "/games/category/roguelike", image: popular[5]?.background_image },
    { label: "Action", href: "/games/category/action", image: thirdPersonShooters[0]?.background_image },
    { label: "Casual", href: "/games/category/casual", image: popular[3]?.background_image },
    { label: "Anime", href: "/games/category/anime", image: storyRpg[7]?.background_image },
    { label: "VR Titles", href: "/games/category/vr", image: firstPersonShooters[5]?.background_image },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Games",
    description: "Browse popular, new, upcoming and top-rated video games on CINRYVAN.",
    url: `${SITE_URL}/games`,
    isPartOf: { "@type": "WebSite", name: "CINRYVAN", url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-[#080b12] pb-24 pt-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="border-y border-white/10 bg-[#101722] shadow-[0_12px_35px_rgba(0,0,0,.35)]">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden">
          <Link
            href="/games"
            className="mr-3 shrink-0 bg-yellow-400 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-black"
          >
            Cinryvan Games
          </Link>
          {storeLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 px-3 py-2 text-xs font-bold text-white/60 transition hover:bg-white/5 hover:text-yellow-400"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section id="featured" className="scroll-mt-32 pt-8 md:pt-10">
          <GameHero games={heroGames} />
        </section>

        <div id="games-on-sale" className="scroll-mt-32">
          <GameDealsShelf deals={gamesOnSale} />
        </div>

        <div id="browse-categories" className="scroll-mt-32">
          <GameCategoryCarousel categories={browseCategories} />
        </div>
      </div>

      <div className="my-8">
        <GameCategoryBanner categories={browseCategories} />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div id="popular" className="scroll-mt-32">
          <GameShelf title="Popular Games" subtitle="The games players cannot stop talking about." games={popular} viewAllHref="/games/category/popular" />
        </div>
        <div id="new-releases" className="scroll-mt-32">
          <GameShelf title="New Releases" subtitle="Recently released games ready to discover." games={newReleases} viewAllHref="/games/category/new-releases" />
        </div>
        <div id="top-rated" className="scroll-mt-32">
          <GameShelf title="Top-Rated Games" subtitle="Critically acclaimed games with exceptional reviews." games={topRated} viewAllHref="/games/category/top-rated" />
        </div>
        <div id="upcoming" className="scroll-mt-32">
          <GameShelf title="Upcoming Games" subtitle="The most anticipated games arriving next." games={upcoming} viewAllHref="/games/category/upcoming" />
        </div>
        <div id="first-person" className="scroll-mt-32">
          <GameShelf title="First-Person Shooters" subtitle="Experience the action directly through the eyes of the hero." games={firstPersonShooters} viewAllHref="/games/category/first-person" />
        </div>
        <div id="third-person" className="scroll-mt-32">
          <GameShelf title="Third-Person Shooters" subtitle="Action, exploration and combat from a cinematic perspective." games={thirdPersonShooters} viewAllHref="/games/category/third-person" />
        </div>
        <div id="esports" className="scroll-mt-32">
          <GameShelf title="Esports & Competitive" subtitle="Competitive games built around skill, teamwork and rankings." games={esports} viewAllHref="/games/category/esports" />
        </div>
        <div id="racing" className="scroll-mt-32">
          <GameShelf title="Racing & Motorsport" subtitle="From street racing to professional motorsport simulations." games={racing} viewAllHref="/games/category/racing" />
        </div>
        <div id="rpg" className="scroll-mt-32">
          <GameShelf title="RPG Adventures" subtitle="Deep worlds, memorable characters and player-driven stories." games={storyRpg} viewAllHref="/games/category/rpg" />
        </div>
        <div id="horror" className="scroll-mt-32">
          <GameShelf title="Horror & Survival" subtitle="Enter terrifying worlds where every decision matters." games={horrorSurvival} viewAllHref="/games/category/horror" />
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/35">
          Game information and images provided by{" "}
          <a
            href={RAWG_ATTRIBUTION_URL}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-yellow-400 transition hover:text-yellow-300"
          >
            RAWG
          </a>
          .
        </footer>
      </div>
    </main>
  );
}