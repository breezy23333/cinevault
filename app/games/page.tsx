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

export const metadata: Metadata = {
  title: "Games | New, Popular & Top-Rated Games | CineVault",
  description:
    "Browse popular games, new releases, upcoming titles, top-rated games, PC, PlayStation, Xbox, Nintendo, shooters, racing, RPGs and horror games.",
  alternates: {
    canonical: "/games",
  },
  openGraph: {
    title: "Games | CineVault",
    description:
      "Discover popular, new, upcoming and top-rated games across every major platform.",
    url: "/games",
    siteName: "CineVault",
    type: "website",
  },
};

const gamingCategories = [
  { label: "Featured", href: "#featured" },
  { label: "Popular", href: "#popular" },
  { label: "New Releases", href: "#new-releases" },
  { label: "Top Rated", href: "#top-rated" },
  { label: "Upcoming", href: "#upcoming" },
  { label: "PC", href: "#pc" },
  { label: "PlayStation", href: "#playstation" },
  { label: "Xbox", href: "#xbox" },
  { label: "Nintendo", href: "#nintendo" },
  { label: "FPS", href: "#first-person" },
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
      label: "Popular",
      href: "/games/category/popular",
      image: popular[0]?.background_image,
    },
    {
      label: "New Releases",
      href: "/games/category/new-releases",
      image: newReleases[0]?.background_image,
    },
    {
      label: "Top Rated",
      href: "/games/category/top-rated",
      image: topRated[0]?.background_image,
    },
    {
      label: "Upcoming",
      href: "/games/category/upcoming",
      image: upcoming[0]?.background_image,
    },
    {
      label: "PC",
      href: "/games/category/pc",
      image: pc[0]?.background_image,
    },
    {
      label: "PlayStation",
      href: "/games/category/playstation",
      image: playStation[0]?.background_image,
    },
    {
      label: "Xbox",
      href: "/games/category/xbox",
      image: xbox[0]?.background_image,
    },
    {
      label: "Nintendo",
      href: "/games/category/nintendo",
      image: nintendo[0]?.background_image,
    },
    {
      label: "First-Person",
      href: "/games/category/first-person",
      image: firstPersonShooters[0]?.background_image,
    },
    {
      label: "Third-Person",
      href: "/games/category/third-person",
      image: thirdPersonShooters[0]?.background_image,
    },
    {
      label: "Esports",
      href: "/games/category/esports",
      image: esports[0]?.background_image,
    },
    {
      label: "Racing",
      href: "/games/category/racing",
      image: racing[0]?.background_image,
    },
    {
      label: "RPG",
      href: "/games/category/rpg",
      image: storyRpg[0]?.background_image,
    },
    {
      label: "Horror",
      href: "/games/category/horror",
      image: horrorSurvival[0]?.background_image,
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

          <GameCategoryCarousel categories={browseCategories} />

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