/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Gamepad2 } from "lucide-react";
import GameHero from "@/components/GameHero";
import GameShelf from "@/components/GameShelf";
import {
  getGamingHomeData,
  RAWG_ATTRIBUTION_URL,
} from "@/lib/games";

type GamingData = Awaited<ReturnType<typeof getGamingHomeData>>;

export default function HomeGamingSection({
  gamingData,
}: {
  gamingData: GamingData;
}) {
  const categories = [
    {
      label: "Shooters",
      subtitle: "FPS and third-person action",
      href: "/games/category/first-person",
      image:
        gamingData.firstPersonShooters[0]?.background_image ??
        gamingData.thirdPersonShooters[0]?.background_image,
    },
    {
      label: "Competitive",
      subtitle: "Esports, teams and ranked play",
      href: "/games/category/esports",
      image: gamingData.esports[0]?.background_image,
    },
    {
      label: "Motorsport",
      subtitle: "Racing and driving worlds",
      href: "/games/category/racing",
      image: gamingData.racing[0]?.background_image,
    },
    {
      label: "Story & RPG",
      subtitle: "Characters, choices and adventure",
      href: "/games/category/rpg",
      image: gamingData.storyRpg[0]?.background_image,
    },
    {
      label: "Horror",
      subtitle: "Survival and terrifying worlds",
      href: "/games/category/horror",
      image: gamingData.horrorSurvival[0]?.background_image,
    },
  ];

  return (
    <section
        id="gaming-universe"
        className="relative py-8"
        >
        <div>
        <header className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-yellow-400">
              <Gamepad2 className="h-4 w-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.34em]">
                Gaming on Cinryvan
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black leading-none tracking-tight text-white md:text-5xl">
              Enter the Gaming Universe
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 md:text-base">
              Discover major releases, competitive worlds, racing experiences,
              story-driven adventures and games worth playing next.
            </p>
          </div>

          <Link
            href="/games"
            className="inline-flex items-center gap-2 bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
          >
            Explore all games
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <GameHero games={gamingData.featured} />

        <div className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                Choose your experience
              </p>
              <h3 className="mt-1 text-xl font-black text-white md:text-2xl">
                Browse Gaming Worlds
              </h3>
            </div>
            <Link
              href="/games#browse-categories"
              className="hidden text-xs font-black uppercase tracking-wider text-white/45 transition hover:text-yellow-400 sm:inline-flex"
            >
              All categories
            </Link>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                prefetch={false}
                className="group relative min-h-[150px] overflow-hidden border border-white/10 bg-[#121a27] transition hover:-translate-y-0.5 hover:border-yellow-400/70"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={`${category.label} games`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05] group-hover:brightness-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#25354c] to-[#0b1019]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/30 to-black/10" />
                <div className="relative flex h-full min-h-[150px] items-end justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h4 className="text-lg font-black text-white transition group-hover:text-yellow-300">
                      {category.label}
                    </h4>
                    <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-white/45">
                      {category.subtitle}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center bg-black/50 text-white opacity-0 transition group-hover:bg-yellow-400 group-hover:text-black group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <GameShelf
            title="First-Person Shooters"
            subtitle="Experience the action directly through the eyes of the hero."
            games={gamingData.firstPersonShooters}
            viewAllHref="/games/category/first-person"
          />
          <GameShelf
            title="Third-Person Shooters"
            subtitle="Cinematic action, exploration and combat."
            games={gamingData.thirdPersonShooters}
            viewAllHref="/games/category/third-person"
          />
          <GameShelf
            title="Esports & Competitive"
            subtitle="Skill, teamwork, rankings and competitive play."
            games={gamingData.esports}
            viewAllHref="/games/category/esports"
          />
          <GameShelf
            title="Racing & Motorsport"
            subtitle="Street racing, track battles and motorsport simulations."
            games={gamingData.racing}
            viewAllHref="/games/category/racing"
          />
          <GameShelf
            title="RPG & Story-Rich"
            subtitle="Deep worlds, memorable characters and powerful stories."
            games={gamingData.storyRpg}
            viewAllHref="/games/category/rpg"
          />
          <GameShelf
            title="Horror & Survival"
            subtitle="Survive terrifying worlds where every decision matters."
            games={gamingData.horrorSurvival}
            viewAllHref="/games/category/horror"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[10px] text-white/30">
          <p>
            Game information and images provided by{" "}
            <a
              href={RAWG_ATTRIBUTION_URL}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-yellow-400 hover:text-yellow-300"
            >
              RAWG
            </a>
            .
          </p>
          <Link
            href="/games"
            className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-white/45 hover:text-yellow-400"
          >
            Open gaming home <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}