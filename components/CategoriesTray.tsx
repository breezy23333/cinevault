// components/CategoriesTray.tsx
"use client";

import { useRef, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Compass,
  Crown,
  Film,
  Ghost,
  Heart,
  Music2,
  Play,
  Rocket,
  Search,
  Shield,
  Skull,
  Smile,
  Sparkles,
  Target,
  Tv,
  Users,
  Zap,
} from "lucide-react";

type Genre = {
  id: number;
  name: string;
};

type IconType = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

type CategoryStyle = {
  gradient: string;
  icon: IconType;
  description: string;
  number: string;
};

const CATEGORY_STYLES: Record<number, CategoryStyle> = {
  28: {
    gradient: "from-red-950 via-red-700 to-orange-500",
    icon: Zap,
    description: "Explosive battles and fearless heroes",
    number: "01",
  },
  12: {
    gradient: "from-emerald-950 via-emerald-700 to-lime-500",
    icon: Compass,
    description: "Travel beyond the edge of the known world",
    number: "02",
  },
  16: {
    gradient: "from-fuchsia-950 via-purple-700 to-pink-500",
    icon: Sparkles,
    description: "Imagination brought vividly to life",
    number: "03",
  },
  35: {
    gradient: "from-yellow-950 via-amber-600 to-yellow-300",
    icon: Smile,
    description: "Big laughs and unforgettable moments",
    number: "04",
  },
  80: {
    gradient: "from-slate-950 via-zinc-700 to-red-900",
    icon: Target,
    description: "Danger, secrets and criminal underworlds",
    number: "05",
  },
  99: {
    gradient: "from-cyan-950 via-cyan-700 to-sky-400",
    icon: Clapperboard,
    description: "True stories from across our world",
    number: "06",
  },
  18: {
    gradient: "from-blue-950 via-indigo-700 to-violet-500",
    icon: Film,
    description: "Powerful stories and human emotions",
    number: "07",
  },
  10751: {
    gradient: "from-green-950 via-teal-700 to-emerald-400",
    icon: Users,
    description: "Entertainment for the whole family",
    number: "08",
  },
  14: {
    gradient: "from-violet-950 via-purple-700 to-blue-500",
    icon: Crown,
    description: "Magic, legends and impossible worlds",
    number: "09",
  },
  36: {
    gradient: "from-stone-950 via-amber-800 to-orange-600",
    icon: Shield,
    description: "Epic moments that shaped history",
    number: "10",
  },
  27: {
    gradient: "from-black via-red-950 to-red-700",
    icon: Ghost,
    description: "Enter the darkness if you dare",
    number: "11",
  },
  10402: {
    gradient: "from-pink-950 via-fuchsia-700 to-cyan-500",
    icon: Music2,
    description: "Stories driven by rhythm and sound",
    number: "12",
  },
  9648: {
    gradient: "from-slate-950 via-blue-900 to-cyan-600",
    icon: Search,
    description: "Every clue brings you closer to the truth",
    number: "13",
  },
  10749: {
    gradient: "from-rose-950 via-pink-700 to-rose-400",
    icon: Heart,
    description: "Love stories worth remembering",
    number: "14",
  },
  878: {
    gradient: "from-blue-950 via-cyan-800 to-cyan-400",
    icon: Rocket,
    description: "The future, outer space and new realities",
    number: "15",
  },
  10770: {
    gradient: "from-indigo-950 via-blue-700 to-sky-500",
    icon: Tv,
    description: "Feature-length stories made for television",
    number: "16",
  },
  53: {
    gradient: "from-zinc-950 via-slate-700 to-yellow-700",
    icon: Skull,
    description: "Tension that keeps you on the edge",
    number: "17",
  },
  10752: {
    gradient: "from-green-950 via-olive-800 to-stone-500",
    icon: Shield,
    description: "Stories of courage, conflict and survival",
    number: "18",
  },
  37: {
    gradient: "from-amber-950 via-orange-800 to-yellow-600",
    icon: Target,
    description: "Outlaws, frontiers and untamed lands",
    number: "19",
  },
};

const FALLBACK_STYLES: CategoryStyle[] = [
  {
    gradient: "from-blue-950 via-indigo-700 to-purple-500",
    icon: Film,
    description: "Discover another world of cinema",
    number: "20",
  },
  {
    gradient: "from-emerald-950 via-teal-700 to-cyan-500",
    icon: Play,
    description: "Find your next unforgettable story",
    number: "21",
  },
  {
    gradient: "from-orange-950 via-red-700 to-pink-500",
    icon: Sparkles,
    description: "Explore something completely different",
    number: "22",
  },
];

export default function CategoriesTray({
  genres,
}: {
  genres: Genre[];
}) {
  const router = useRouter();
  const rowRef = useRef<HTMLDivElement>(null);

  const categories = Array.isArray(genres)
    ? genres.filter(
        (genre) =>
          genre &&
          typeof genre.id === "number" &&
          Boolean(genre.name),
      )
    : [];

  if (categories.length === 0) return null;

  function scroll(direction: "left" | "right") {
    rowRef.current?.scrollBy({
      left:
        direction === "left"
          ? -Math.max(320, window.innerWidth * 0.72)
          : Math.max(320, window.innerWidth * 0.72),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative min-w-0">
      <div className="mb-4 flex items-end justify-between gap-4">
        <p className="max-w-lg text-sm leading-6 text-white/45">
          Choose a world and discover movies made for your mood.
        </p>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous categories"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition duration-150 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next categories"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition duration-150 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4"
      >
        {categories.map((genre, index) => {
          const style =
            CATEGORY_STYLES[genre.id] ??
            FALLBACK_STYLES[index % FALLBACK_STYLES.length];

          const Icon = style.icon;

          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => router.push(`/search?genre=${genre.id}`)}
              className={`
                group relative h-[170px] w-[78vw] max-w-[310px]
                shrink-0 snap-start overflow-hidden rounded-[24px]
                border border-white/10 bg-gradient-to-br
                ${style.gradient}
                text-left shadow-[0_18px_50px_rgba(0,0,0,0.28)]
                transition duration-150
                hover:-translate-y-1 hover:border-yellow-300/70
                sm:h-[190px] sm:w-[300px]
                lg:w-[320px]
              `}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.3),transparent_28%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

              <Icon
                strokeWidth={1.15}
                className="absolute -right-6 top-2 h-32 w-32 rotate-[-8deg] text-white/15 transition duration-150 group-hover:scale-110 group-hover:rotate-0 sm:h-40 sm:w-40"
              />

              <div className="absolute left-5 top-5 text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                Category {style.number}
              </div>

              <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition duration-150 group-hover:bg-yellow-400 group-hover:text-black">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-3 h-px w-8 bg-yellow-300 transition-all duration-150 group-hover:w-16" />

                <h3 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                  {genre.name}
                </h3>

                <p className="mt-1.5 max-w-[230px] text-xs leading-5 text-white/65">
                  {style.description}
                </p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => router.push("/categories")}
          className="group relative flex h-[170px] w-[70vw] max-w-[270px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[24px] border border-yellow-400/35 bg-yellow-400 p-5 text-left text-black transition duration-150 hover:-translate-y-1 hover:bg-yellow-300 sm:h-[190px] sm:w-[260px]"
        >
          <GridIcon />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">
              Full directory
            </p>
            <h3 className="mt-2 text-2xl font-black">
              Browse all categories
            </h3>
          </div>
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-2 right-0 top-14 w-12 bg-gradient-to-l from-[#05070d] to-transparent sm:hidden" />
    </div>
  );
}

function GridIcon() {
  return (
    <div className="grid h-12 w-12 grid-cols-2 gap-1 rounded-2xl border border-black/15 p-3">
      <span className="rounded-sm bg-black" />
      <span className="rounded-sm bg-black/45" />
      <span className="rounded-sm bg-black/45" />
      <span className="rounded-sm bg-black" />
    </div>
  );
}