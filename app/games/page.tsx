import type { Metadata } from "next";
import GameShelf from "@/components/GameShelf";
import GameHero from "@/components/GameHero";
import GameCategoryCarousel, {
  type GameCategory,
} from "@/components/GameCategoryCarousel";
import {
  getGamingBrowseData,
  RAWG_ATTRIBUTION_URL,
} from "@/lib/games";

export const revalidate = 86400;

const SITE_URL = "https://cinevault-tau-drab.vercel.app";

const gamesTitle =
  "Gaming | Games, Ratings & Where to Play | CineVault";

const gamesDescription =
  "Discover popular games, new releases, top-rated titles, upcoming games, esports, racing, RPGs, horror games, platforms, ratings and where to play them on CineVault.";

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
    "CineVault Gaming",
  ],

  alternates: {
    canonical: `${SITE_URL}/games`,
  },

  openGraph: {
    title: gamesTitle,
    description: gamesDescription,
    url: `${SITE_URL}/games`,
    siteName: "CineVault",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Discover games on CineVault",
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

const gamingCategories = [
  { label: "Featured", href: "#featured" },
  { label: "Popular", href: "#popular" },
  { label: "Categories", href: "#browse-categories" },
  { label: "New Releases", href: "#new-releases" },
  { label: "Top Rated", href: "#top-rated" },
  { label: "Upcoming", href: "#upcoming" },
  { label: "First-Person", href: "#first-person" },
  { label: "Third-Person", href: "#third-person" },
  { label: "Esports", href: "#esports" },
  { label: "Racing", href: "#racing" },
  { label: "RPG", href: "#rpg" },
  { label: "Horror", href: "#horror" },
];

export default async function GamesPage() {
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
  } = await getGamingBrowseData();

  const heroGames = [...newReleases, ...topRated, ...popular]
    .filter(
      (game, index, games) =>
        games.findIndex((item) => item.id === game.id) === index,
    )
    .slice(0, 8);

      const browseCategories: GameCategory[] = [
    {
      label: "Role-Playing",
      href: "/games/category/rpg",
      image: storyRpg[0]?.background_image,
    },
    {
      label: "Puzzle",
      href: "/games/category/puzzle",
      image: nintendo[1]?.background_image,
    },
    {
      label: "Horror",
      href: "/games/category/horror",
      image: horrorSurvival[0]?.background_image,
    },
    {
      label: "Survival",
      href: "/games/category/survival",
      image: horrorSurvival[2]?.background_image,
    },
    {
      label: "Sci-Fi & Cyberpunk",
      href: "/games/category/sci-fi-cyberpunk",
      image: firstPersonShooters[2]?.background_image,
    },
    {
      label: "City & Settlement",
      href: "/games/category/city-settlement",
      image: topRated[5]?.background_image,
    },
    {
      label: "Racing",
      href: "/games/category/racing",
      image: racing[0]?.background_image,
    },
    {
      label: "Open World",
      href: "/games/category/open-world",
      image: thirdPersonShooters[1]?.background_image,
    },
    {
      label: "Strategy",
      href: "/games/category/strategy",
      image: esports[4]?.background_image,
    },
    {
      label: "Adventure",
      href: "/games/category/adventure",
      image: topRated[1]?.background_image,
    },
    {
      label: "Visual Novel",
      href: "/games/category/visual-novel",
      image: storyRpg[5]?.background_image,
    },
    {
      label: "Story-Rich",
      href: "/games/category/story-rich",
      image: storyRpg[1]?.background_image,
    },
    {
      label: "Simulation",
      href: "/games/category/simulation",
      image: racing[3]?.background_image,
    },
    {
      label: "Fighting",
      href: "/games/category/fighting",
      image: esports[2]?.background_image,
    },
    {
      label: "Co-Operative",
      href: "/games/category/co-op",
      image: esports[1]?.background_image,
    },
    {
      label: "Rogue-Like",
      href: "/games/category/roguelike",
      image: popular[5]?.background_image,
    },
    {
      label: "Action",
      href: "/games/category/action",
      image: thirdPersonShooters[0]?.background_image,
    },
    {
      label: "Casual",
      href: "/games/category/casual",
      image: nintendo[3]?.background_image,
    },
    {
      label: "Anime",
      href: "/games/category/anime",
      image: storyRpg[7]?.background_image,
    },
    {
      label: "VR Titles",
      href: "/games/category/vr",
      image: firstPersonShooters[5]?.background_image,
    },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Games",
    description:
      "Browse popular, new, upcoming and top-rated video games on CineVault.",
    url: "https://cinevault-tau-drab.vercel.app/games",
    isPartOf: {
      "@type": "WebSite",
      name: "CineVault",
      url: "https://cinevault-tau-drab.vercel.app",
    },
  };

  return (
    <main className="min-h-screen bg-[#080b12] pb-24 pt-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <header className="py-10 md:py-14">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
            CineVault Gaming
          </p>

          <h1 className="mt-5 text-5xl font-black leading-none md:text-7xl lg:text-8xl">
            Games
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 md:text-xl">
            Explore popular games, new releases, upcoming adventures,
            top-rated classics and the biggest titles across PC and console.
          </p>
        </header>

        <section id="featured" className="mb-12 scroll-mt-32">
          <GameHero games={heroGames} />
        </section>

        <nav className="mb-10 overflow-x-auto rounded-2xl border border-white/10 bg-[#111927] p-2 shadow-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1">
            <div className="mr-3 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-black text-black">
              Browse Games
            </div>

            {gamingCategories.map((category) => (
              <a
                key={category.href}
                href={category.href}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {category.label}
              </a>
            ))}
          </div>
        </nav>

        <div>
          <div id="popular" className="scroll-mt-32">
            <GameShelf
              title="Popular Games"
              subtitle="The games players cannot stop talking about."
              games={popular}
            />
          </div>

          <div id="browse-categories" className="scroll-mt-32">
            <GameCategoryCarousel categories={browseCategories} />
          </div>

          <div id="new-releases" className="scroll-mt-32">
            <GameShelf
              title="New Releases"
              subtitle="Recently released games ready to discover."
              games={newReleases}
              viewAllHref="/games/category/new-releases"
            />
          </div>

          <div id="top-rated" className="scroll-mt-32">
            <GameShelf
              title="Top-Rated Games"
              subtitle="Critically acclaimed games with exceptional reviews."
              games={topRated}
              viewAllHref="/games/category/top-rated"
            />
          </div>

          <div id="upcoming" className="scroll-mt-32">
            <GameShelf
              title="Upcoming Games"
              subtitle="The most anticipated games arriving next."
              games={upcoming}
              viewAllHref="/games/category/upcoming"
            />
          </div>

          <div id="pc" className="scroll-mt-32">
            <GameShelf
              title="PC Games"
              subtitle="Popular releases and essential experiences for PC players."
              games={pc}
              viewAllHref="/games/category/pc"
            />
          </div>

          <div id="playstation" className="scroll-mt-32">
            <GameShelf
              title="PlayStation"
              subtitle="Discover games available across the PlayStation family."
              games={playStation}
              viewAllHref="/games/category/playstation"
            />
          </div>

          <div id="xbox" className="scroll-mt-32">
            <GameShelf
              title="Xbox"
              subtitle="Explore popular Xbox adventures, shooters and racing games."
              games={xbox}
              viewAllHref="/games/category/xbox"
            />
          </div>

          <div id="nintendo" className="scroll-mt-32">
            <GameShelf
              title="Nintendo"
              subtitle="Family favourites and unforgettable Nintendo adventures."
              games={nintendo}
              viewAllHref="/games/category/nintendo"
            />
          </div>

          <div id="first-person" className="scroll-mt-32">
            <GameShelf
              title="First-Person Shooters"
              subtitle="Experience the action directly through the eyes of the hero."
              games={firstPersonShooters}
              viewAllHref="/games/category/first-person"
            />
          </div>

          <div id="third-person" className="scroll-mt-32">
            <GameShelf
              title="Third-Person Shooters"
              subtitle="Action, exploration and combat from a cinematic perspective."
              games={thirdPersonShooters}
              viewAllHref="/games/category/third-person"
            />
          </div>

          <div id="esports" className="scroll-mt-32">
            <GameShelf
              title="Esports & Competitive"
              subtitle="Competitive games built around skill, teamwork and rankings."
              games={esports}
              viewAllHref="/games/category/esports"
            />
          </div>

          <div id="racing" className="scroll-mt-32">
            <GameShelf
              title="Racing & Motorsport"
              subtitle="From street racing to professional motorsport simulations."
              games={racing}
              viewAllHref="/games/category/racing"
            />
          </div>

          <div id="rpg" className="scroll-mt-32">
            <GameShelf
              title="RPG Adventures"
              subtitle="Deep worlds, memorable characters and player-driven stories."
              games={storyRpg}
              viewAllHref="/games/category/rpg"
            />
          </div>

          <div id="horror" className="scroll-mt-32">
            <GameShelf
              title="Horror & Survival"
              subtitle="Enter terrifying worlds where every decision matters."
              games={horrorSurvival}
              viewAllHref="/games/category/horror"
            />
          </div>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-white/45">
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