/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Gamepad2,
} from "lucide-react";
import GameHero from "@/components/GameHero";
import GameShelf from "@/components/GameShelf";
import {
  getGamingHomeData,
  RAWG_ATTRIBUTION_URL,
} from "@/lib/games";

type GamingData = Awaited<
  ReturnType<typeof getGamingHomeData>
>;

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
      className="relative border-b border-white/[0.08] pb-6 sm:pb-8"
    >
      {/* Section heading */}
      <header className="mb-5 flex items-end justify-between gap-3 sm:mb-7">
        <div className="max-w-3xl border-l-2 border-yellow-400/70 pl-3 sm:pl-4">
          <div className="flex items-center gap-1.5 text-yellow-400">
            <Gamepad2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

            <p className="text-[9px] font-black uppercase tracking-[0.28em] sm:text-[10px] sm:tracking-[0.34em]">
              Gaming on Cinryvan
            </p>
          </div>

          <h2 className="mt-1 text-xl font-black leading-none tracking-tight text-white sm:text-3xl md:text-5xl">
            Enter the Gaming Universe
          </h2>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-white/50 sm:mt-3 sm:text-sm md:text-base">
            Discover competitive worlds, racing experiences,
            story-driven adventures and games worth playing next.
          </p>
        </div>

        <Link
          href="/games"
          className="
            inline-flex h-9 shrink-0 items-center gap-1.5
            bg-yellow-400 px-3
            text-[10px] font-black text-black
            transition hover:bg-yellow-300
            sm:h-11 sm:gap-2 sm:px-5 sm:text-sm
          "
        >
          <span className="hidden sm:inline">
            Explore all games
          </span>

          <span className="sm:hidden">All games</span>

          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </header>

      {/* Existing hero remains unchanged */}
      <GameHero games={gamingData.featured} />

      {/* Categories */}
      <div className="mt-6 sm:mt-9">
        <div className="mb-3 flex items-end justify-between border-b border-white/[0.08] pb-3 sm:mb-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-yellow-400 sm:text-[10px] sm:tracking-[0.3em]">
              Choose your experience
            </p>

            <h3 className="mt-1 text-lg font-black text-white sm:text-xl md:text-2xl">
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

        <div
          className="
            hide-scrollbar
            flex snap-x snap-proximity gap-2
            overflow-x-auto overscroll-x-contain pb-1
            lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0
          "
        >
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              prefetch={false}
              className="
                group relative h-[105px] w-[155px]
                shrink-0 snap-start overflow-hidden
                border border-white/10 bg-[#121a27]
                transition
                hover:-translate-y-0.5
                hover:border-yellow-400/70
                sm:h-[125px] sm:w-[210px]
                lg:h-auto lg:min-h-[150px] lg:w-auto
              "
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

              <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/35 to-black/10" />

              <div className="relative flex h-full items-end justify-between gap-2 p-3 sm:p-4">
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-white transition group-hover:text-yellow-300 sm:text-lg">
                    {category.label}
                  </h4>

                  <p className="mt-0.5 line-clamp-1 text-[9px] font-semibold text-white/45 sm:mt-1 sm:text-[10px]">
                    {category.subtitle}
                  </p>
                </div>

                <span className="hidden h-7 w-7 shrink-0 place-items-center bg-black/50 text-white transition group-hover:bg-yellow-400 group-hover:text-black sm:grid">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>

      {/* Gaming shelves */}
      <div className="mt-4 sm:mt-5">
        <GameShelf
          title="First-Person Shooters"
          subtitle="Experience action through the eyes of the hero."
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
          subtitle="Skill, teamwork and competitive play."
          games={gamingData.esports}
          viewAllHref="/games/category/esports"
        />

        <GameShelf
          title="Racing & Motorsport"
          subtitle="Street racing, track battles and simulations."
          games={gamingData.racing}
          viewAllHref="/games/category/racing"
        />

        <GameShelf
          title="RPG & Story-Rich"
          subtitle="Deep worlds, characters and powerful stories."
          games={gamingData.storyRpg}
          viewAllHref="/games/category/rpg"
        />

        <GameShelf
          title="Horror & Survival"
          subtitle="Survive terrifying worlds where decisions matter."
          games={gamingData.horrorSurvival}
          viewAllHref="/games/category/horror"
        />
      </div>

      {/* Attribution */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-4 text-[9px] text-white/30 sm:mt-5 sm:gap-3 sm:pt-5 sm:text-[10px]">
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
          Gaming home
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}