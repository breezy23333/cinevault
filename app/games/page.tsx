import type { Metadata } from "next";
import GameHero from "@/components/GameHero";
import GameShelf from "@/components/GameShelf";
import {
  getGamingHomeData,
  RAWG_ATTRIBUTION_URL,
} from "@/lib/games";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Gaming | Games, Ratings & Where to Play | CineVault",
  description:
    "Discover featured games, shooters, esports, racing, RPGs, horror games, ratings, platforms and where to play them on CineVault.",
};

const gamingCategories = [
  { label: "Featured", href: "#featured" },
  { label: "FPS", href: "#first-person" },
  { label: "Third-Person", href: "#third-person" },
  { label: "Esports", href: "#esports" },
  { label: "Racing", href: "#racing" },
  { label: "RPG", href: "#rpg" },
  { label: "Horror", href: "#horror" },
];

export default async function GamesPage() {
  const {
    featured,
    firstPersonShooters,
    thirdPersonShooters,
    esports,
    racing,
    storyRpg,
    horrorSurvival,
  } = await getGamingHomeData();

  return (
    <main className="min-h-screen bg-[#080b12] pb-24 pt-28 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="mb-8 overflow-x-auto rounded-2xl bg-[#111927] p-2 ring-1 ring-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1">
            <div className="mr-3 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-black text-black">
              Gaming
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

        <div id="featured" className="scroll-mt-28">
          <GameHero games={featured} />
        </div>

        <div className="mt-12">
          <div id="first-person" className="scroll-mt-28">
            <GameShelf
              title="First-Person Shooters"
              subtitle="Experience the action directly through the eyes of the hero."
              games={firstPersonShooters}
            />
          </div>

          <div id="third-person" className="scroll-mt-28">
            <GameShelf
              title="Third-Person Shooters"
              subtitle="Action, exploration and combat from a cinematic perspective."
              games={thirdPersonShooters}
            />
          </div>

          <div id="esports" className="scroll-mt-28">
            <GameShelf
              title="Esports & Competitive"
              subtitle="Competitive games built around skill, teamwork and rankings."
              games={esports}
            />
          </div>

          <div id="racing" className="scroll-mt-28">
            <GameShelf
              title="Racing & Motorsport"
              subtitle="From street racing to professional motorsport simulations."
              games={racing}
            />
          </div>

          <div id="rpg" className="scroll-mt-28">
            <GameShelf
              title="RPG & Story-Rich"
              subtitle="Deep worlds, memorable characters and player-driven adventures."
              games={storyRpg}
            />
          </div>

          <div id="horror" className="scroll-mt-28">
            <GameShelf
              title="Horror & Survival"
              subtitle="Survive terrifying worlds where every decision matters."
              games={horrorSurvival}
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